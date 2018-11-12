import { createStore } from "flux";
import { Action, State } from "Models/Store";

import reducer from "./reducer";

const initialState = { page: "events", errors: [] };
export const store = createStore<State, Action>(reducer, initialState);
