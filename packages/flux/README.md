## API

```javascript
const { createStore } = require('flux');

// Reducer - чистая функция, которая описывает, как Action превращает текущее состояние в новое.
// State изменять нельзя, Reducer должен возвращать новое состояние
function reducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    default:
      return state
  }
}

// Создание Store, хранящего состояние приложения
// Его API { subscribe, dispatch, getState }.
const store = createStore(reducer);
store.subscribe(() => console.log(store.getState()))
store.dispatch({ type: 'INCREMENT' })
```
