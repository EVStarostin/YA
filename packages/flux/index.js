/**
 * @description Создает store для хранения глобального состояния
 * @param {function} reducer - Редюсер
 * @param {*} initialState - Начальное состояние store
 * @returns {Object} Объект с тремя методами: getState(), dispatch(), subscribe()
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
      listeners.forEach(listener => listener());
      return action;
    },
    subscribe(newListener) {
      listeners = [...listeners, newListener];
    },
    unsubscribe(oldListener) {
      listeners = listeners.filter(listener => listener !== oldListener);
    },
  };
}

module.exports = { createStore };
