import { IAction, IState } from "Models/Store";

const initialState: IState = {};

export default function reducer(state: IState = initialState, action: IAction) {
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
