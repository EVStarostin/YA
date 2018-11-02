import { Action, State } from "Models/Store";

const initialState: State = {};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case "FETCH_EVENTS_BEGIN":
      return {
        ...state,
        errors: [],
        isFetching: true,
      };
    case "FETCH_EVENTS_SUCCESS":
      return {
        ...state,
        events: action.payload,
        isFetching: false,
      };
    case "FETCH_EVENTS_FAIL":
      return {
        ...state,
        errors: [...state.errors, action.payload],
        isFetching: false,
      };
    default:
      return state;
  }
}
