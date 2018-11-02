import { IEvent } from "./Event";

export interface IAction {
  type: string,
  payload?: any;
};

export interface IState {
  events?: IEvent[];
  isFetching?: boolean;
  errors?: object[];
}

export const actionTypes = {
  FETCH_EVENTS_BEGIN: "FETCH_EVENTS_BEGIN",
  FETCH_EVENTS_SUCCESS: "FETCH_EVENTS_SUCCESS",
  FETCH_EVENTS_FAIL: "FETCH_EVENTS_FAIL",
};
