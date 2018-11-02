export function createStore<S, A>(
  reducer: (state: S, action: A) => S,
  initialState?: S
): {
    getState: () => S;
    dispatch: (action: A) => A;
    subscribe: (newListener: Function) => void;
    unsubscribe: (oldListener: Function) => void;
  };
