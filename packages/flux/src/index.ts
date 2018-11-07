/**
 * @description Создает store для хранения глобального состояния
 * @param reducer - Редюсер
 * @param initialState - Начальное состояние store
 * @returns Объект с тремя методами: getState(), dispatch(), subscribe()
 */
export function createStore<S, A>(reducer: (state: S, action: A) => S, initialState: S) {
  const currentReducer = reducer;
  let currentState = initialState;
  let listeners: Array<() => void> = [];
  return {
    getState(): S {
      return currentState;
    },
    dispatch(action: A): A {
      currentState = currentReducer(currentState, action);
      listeners.forEach((listener) => listener());
      return action;
    },
    subscribe(newListener: () => void) {
      listeners = [...listeners, newListener];
    },
    unsubscribe(oldListener: () => void) {
      listeners = listeners.filter((listener) => listener !== oldListener);
    },
  };
}
