import { renderCamerasPage } from "Components/CamerasList";
import { renderEventsPage } from "Components/EventsList";
import { fetchInitialState } from "Store/actions";
import { store } from "Store/index";

if ("ontouchstart" in window) {
  document.body.classList.add("touch");
}

let currentPage = "";

function handleStateChange() {
  const state = store.getState();

  if (state.page && state.page !== currentPage) {
    currentPage = state.page;

    switch (currentPage) {
      case "events":
        renderEventsPage();
        break;

      case "cameras":
        renderCamerasPage();
        break;

      default:
        break;
    }
  }
}

store.subscribe(handleStateChange);

fetchInitialState();
