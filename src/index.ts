import type { Store, StoreValue } from 'nanostores';
import { createStore, reconcile, unwrap } from 'solid-js/store';
import type { Accessor, Signal } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';

/**
 * Subscribes to store changes and gets store’s value.
 *
 * @param store Store instance.
 * @returns Store value.
 */
export function useStore<
  SomeStore extends Store,
  Value extends StoreValue<SomeStore>,
>(store: SomeStore): Accessor<Value> {
  const [state, setState] = createDeepSignal(initialValue);
  let unsubscribe: () => void;
  
  onMount(() => {
    setState(store.get() as any);
    
    unsubscribe = store.subscribe((state) => {
      setValue(state as any);
    });
  });

  onCleanup(() => unsubscribe());

  return state;
}

function createDeepSignal<T>(value: T): Signal<T> {
  const [store, setStore] = createStore({
    value,
  });
  return [
    () => store.value,
    (v: T) => {
      const unwrapped = unwrap(store.value);
      typeof v === 'function' && (v = v(unwrapped));
      setStore('value', reconcile(v));
      return store.value;
    },
  ] as Signal<T>;
}
