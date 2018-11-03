Библиотека написана на *TypeScript* (папка ./src).  
Скомпилирована в ES6 (index.js), покрыта тестами (index.test.js), сгенерирован файл index.d.ts.  

## API
```javascript
import { createStore } from "flux";

// Создание Store, хранящего состояние приложения
// Его API { subscribe, dispatch, getState }.
const store = createStore(reducer, initialState);
store.subscribe(() => console.log(store.getState()))
store.dispatch({ type: 'INCREMENT' })

// Reducer - чистая функция, которая описывает, как Action превращает текущее состояние в новое.
// State изменять нельзя, Reducer должен возвращать новое состояние
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    default:
      return state
  }
}
```
