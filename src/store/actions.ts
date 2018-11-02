import { store } from "./index";

const BASE_URL = "http://node.evstar.ru:8000";

const FETCH_EVENTS_BEGIN = "FETCH_EVENTS_BEGIN";
const FETCH_EVENTS_SUCCESS = "FETCH_EVENTS_SUCCESS";
const FETCH_EVENTS_FAIL = "FETCH_EVENTS_FAIL";

export function fetchEvents() {
  store.dispatch({ type: FETCH_EVENTS_BEGIN });

  fetch(`${BASE_URL}/api/events`)
    .then((response) => response.json())
    .then((data) => store.dispatch({ type: FETCH_EVENTS_SUCCESS, payload: data.events }))
    .catch((error) => store.dispatch({ type: FETCH_EVENTS_FAIL, payload: error }));
}
