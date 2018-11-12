"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description Создает store для хранения глобального состояния
 * @param reducer - Редюсер
 * @param initialState - Начальное состояние store
 * @returns Объект с тремя методами: getState(), dispatch(), subscribe()
 */
function createStore(reducer, initialState) {
    const currentReducer = reducer;
    let currentState = initialState;
    let listeners = [];
    return {
        getState() {
            return currentState;
        },
        dispatch(action) {
            currentState = currentReducer(currentState, action);
            listeners.forEach((listener) => listener());
            return action;
        },
        subscribe(newListener) {
            listeners = [...listeners, newListener];
        },
        unsubscribe(oldListener) {
            listeners = listeners.filter((listener) => listener !== oldListener);
        },
    };
}
exports.createStore = createStore;
