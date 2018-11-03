/**
 * @description Создает store для хранения глобального состояния
 * @param reducer - Редюсер
 * @param initialState - Начальное состояние store
 * @returns Объект с тремя методами: getState(), dispatch(), subscribe()
 */
export declare function createStore<S, A>(reducer: (state: S, action: A) => S, initialState: S): {
    getState(): S;
    dispatch(action: A): A;
    subscribe(newListener: () => void): void;
    unsubscribe(oldListener: () => void): void;
};
