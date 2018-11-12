import { store } from "./index";

const BASE_URL = "http://vds.evstar.ru:8000";

export const actionTypes = {
  FETCH_EVENTS_SUCCESS: "FETCH_EVENTS_SUCCESS",
  FETCH_EVENTS_FAIL: "FETCH_EVENTS_FAIL",

  FETCH_STATE_SUCCESS: "FETCH_STATE_SUCCESS",
  FETCH_STATE_FAIL: "FETCH_STATE_FAIL",

  CHANGE_PAGE: "CHANGE_PAGE",
};

export function fetchEvents() {
  fetch(`${BASE_URL}/api/events`)
    .then((response) => response.json())
    .then((data) => store.dispatch({ type: actionTypes.FETCH_EVENTS_SUCCESS, payload: data.events }))
    .catch((error) => store.dispatch({ type: actionTypes.FETCH_EVENTS_FAIL, payload: error }));
}

export function fetchInitialState() {
  fetch(`${BASE_URL}/api/state`)
    .then((response) => response.json())
    .then((state) => store.dispatch({ type: actionTypes.FETCH_STATE_SUCCESS, payload: state }))
    .catch((error) => store.dispatch({ type: actionTypes.FETCH_STATE_FAIL, payload: error }));
}

export function changePage(page: string) {
  store.dispatch({ type: actionTypes.CHANGE_PAGE, payload: page });
  fetch(`${BASE_URL}/api/state`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page }),
  });
}
