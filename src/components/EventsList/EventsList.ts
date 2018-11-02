import { Event } from "Models/Event";
import { fetchEvents } from "Store/actions";
import { store } from "Store/index";

function renderEventsList(events: Event[], eventsNode: HTMLUListElement) {
  const eventsTemplate = document.querySelector<HTMLTemplateElement>("#events-template");

  if (!eventsTemplate) { return; }
  const eventNode = eventsTemplate.content.querySelector<HTMLLIElement>(".event");

  events.forEach((event: Event) => {
    let eventClone: HTMLLIElement | null = null;
    if (eventNode) {
      eventClone = document.importNode(eventNode, true);
      eventClone.classList.add(`event_size_${event.size}`);
      if (event.type === "critical") { eventClone.classList.add("event_critical"); }
    }

    if (eventClone === null) { return; }

    const eventIcon = eventClone.querySelector<HTMLImageElement>(".event__icon");

    if (eventIcon) {
      eventIcon.setAttribute("src", `images/${event.icon}${event.type === "critical" ? "-white" : ""}.svg`);
      eventIcon.setAttribute("alt", event.source);
    }

    const title = eventClone.querySelector<HTMLHeadingElement>(".event__title");
    if (title) { title.textContent = event.title; }
    const source = eventClone.querySelector<HTMLHeadingElement>(".event__source");
    if (source) { source.textContent = event.source; }
    const time = eventClone.querySelector<HTMLHeadingElement>(".event__time");
    if (time) { time.textContent = event.time; }

    const eventDetails = document.createElement("div");
    eventDetails.classList.add("event__details");
    if (event.description || event.data) {
      eventClone.appendChild(eventDetails);
    }

    if (event.description) {
      const descriptionNode = eventsTemplate.content.querySelector<HTMLParagraphElement>(".event__description");
      if (descriptionNode) {
        const descriptionClone = document.importNode(descriptionNode, true);
        descriptionClone.textContent = event.description;
        eventDetails.appendChild(descriptionClone);
      }
    }

    if (event.data && event.data.type === "graph") {
      const graphNode = eventsTemplate.content.querySelector<HTMLImageElement>(".graph");
      if (graphNode) {
        const graphClone = document.importNode(graphNode, true);
        eventDetails.appendChild(graphClone);
      }
    }

    if (event.data && event.data.temperature) {
      const tempNode = eventsTemplate.content.querySelector<HTMLDivElement>(".weather");
      if (tempNode) {
        const tempClone = document.importNode(tempNode, true);
        const temp = tempClone.querySelector<HTMLParagraphElement>("#temp");
        if (temp) { temp.textContent = String(event.data.temperature); }
        const hum = tempClone.querySelector<HTMLParagraphElement>("#hum");
        if (hum) { hum.textContent = String(event.data.humidity); }
        eventDetails.appendChild(tempClone);
      }
    }

    if (event.data && event.data.track) {
      const trackNode = eventsTemplate.content.querySelector<HTMLDivElement>(".track");
      if (trackNode) {
        const trackClone = document.importNode(trackNode, true);
        const trackCover = trackClone.querySelector<HTMLImageElement>(".track__cover");
        if (trackCover && event.data.albumcover) { trackCover.setAttribute("src", event.data.albumcover); }
        const trackName = trackClone.querySelector<HTMLParagraphElement>(".track__name");
        if (trackName) { trackName.textContent = `${event.data.artist} - ${event.data.track.name}`; }
        const trackTime = trackClone.querySelector<HTMLOutputElement>(".track__time");
        if (trackTime) { trackTime.textContent = event.data.track.length; }
        const trackVolume = trackClone.querySelector<HTMLOutputElement>(".track__vol");
        if (trackVolume) { trackVolume.textContent = String(event.data.volume); }
        eventDetails.appendChild(trackClone);
      }
    }

    if (event.data && event.data.buttons) {
      const btnGroupNode = eventsTemplate.content.querySelector<HTMLDivElement>(".btn-group");
      if (btnGroupNode) {
        const btnGroupClone = document.importNode(btnGroupNode, true);
        const confirm = btnGroupClone.querySelector<HTMLButtonElement>(".btn-group__btn-confirm");
        if (confirm) { confirm.textContent = event.data.buttons[0]; }
        const cancel = btnGroupClone.querySelector<HTMLButtonElement>(".btn-group__btn-cancel");
        if (cancel) { cancel.textContent = event.data.buttons[1]; }
        eventDetails.appendChild(btnGroupClone);
      }
    }

    if (event.data && event.data.image) {
      const imageNode = eventsTemplate.content.querySelector<HTMLDivElement>(".camera");
      if (imageNode) {
        const imageClone = document.importNode(imageNode, true);
        eventDetails.appendChild(imageClone);
      }
    }

    eventsNode.appendChild(eventClone);
  });
}

function handleStateChange() {
  const eventsNode: HTMLUListElement | null = document.querySelector("#events");
  if (!eventsNode) { return; }
  eventsNode.innerHTML = "";

  const state = store.getState();

  if (state.isFetching) {
    eventsNode.innerText = "content is loading ...";
    return;
  }

  if (state.errors && state.errors.length) {
    eventsNode.innerText = state.errors.join("\n");
    return;
  }

  if (state.events) {
    renderEventsList(state.events, eventsNode);
  }
}

store.subscribe(handleStateChange);
fetchEvents();
