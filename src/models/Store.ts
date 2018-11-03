import { Event } from "./Event";

export interface Action {
  type: string;
  payload?: any;
}

export interface State {
  events?: Event[];
  errors?: Error[];
  page?: string;
}
