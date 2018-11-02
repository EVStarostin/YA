import { createStore } from "flux";
import { IAction, IState } from "Models/Store";

import reducer from "./reducer";

export const store = createStore<IState, IAction>(reducer);
