import { createStore } from "flux";
import { Action, State } from "Models/Store";

import reducer from "./reducer";

export const store = createStore<State, Action>(reducer);
