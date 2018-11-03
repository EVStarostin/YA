import { Action, State } from "Models/Store";
import { actionTypes } from "./actions";

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case actionTypes.FETCH_STATE_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case actionTypes.FETCH_STATE_FAIL:
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };

    case actionTypes.FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.payload,
      };

    case actionTypes.FETCH_EVENTS_FAIL:
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };

    case actionTypes.CHANGE_PAGE:
      return {
        ...state,
        page: action.payload,
      };

    default:
      return state;
  }
}
