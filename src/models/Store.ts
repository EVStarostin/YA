import { Event } from "./Event";

export interface Action {
  type: string;
  payload?: any;
}

export interface State {
  events?: Event[];
  isFetching?: boolean;
  errors?: Error[];
}

export const actionTypes = {
  FETCH_EVENTS_BEGIN: "FETCH_EVENTS_BEGIN",
  FETCH_EVENTS_SUCCESS: "FETCH_EVENTS_SUCCESS",
  FETCH_EVENTS_FAIL: "FETCH_EVENTS_FAIL",
};
