import { IData, IEvent } from "../../models";

export async function generateContent(): Promise<void> {
  const DATA_URL: string = "http://194.87.239.193:8000/api/events";

  let data: IData | null = null;
  try {
    const response: Response = await fetch(DATA_URL);
    data = await response.json();
  } catch (error) {
    console.error(error);
  }

  if (!data) { return; }

  const eventsNode: HTMLUListElement | null = document.querySelector("#events");
  const eventsTemplate: HTMLTemplateElement | null = document.querySelector("#events-template");

  if (!eventsNode || !eventsTemplate) { return; }
  const eventNode: HTMLLIElement | null = eventsTemplate.content.querySelector(".event");

  data.events.forEach((event: IEvent) => {
    let eventClone: HTMLLIElement | null = null;
    if (eventNode) {
      eventClone = document.importNode(eventNode, true);
      eventClone.classList.add(`event_size_${event.size}`);
      if (event.type === "critical") { eventClone.classList.add("event_critical"); }
    }

    if (eventClone === null) { return; }

    const eventIcon: HTMLImageElement | null = eventClone.querySelector(".event__icon");

    if (eventIcon) {
      eventIcon.setAttribute("src", `images/${event.icon}${event.type === "critical" ? "-white" : ""}.svg`);
      eventIcon.setAttribute("alt", event.source);
    }

    const title: HTMLHeadingElement | null = eventClone.querySelector(".event__title");
    if (title) { title.textContent = event.title; }
    const source: HTMLHeadingElement | null = eventClone.querySelector(".event__source");
    if (source) { source.textContent = event.source; }
    const time: HTMLHeadingElement | null = eventClone.querySelector(".event__time");
    if (time) { time.textContent = event.time; }

    const eventDetails: HTMLDivElement = document.createElement("div");
    eventDetails.classList.add("event__details");
    if (event.description || event.data) {
      eventClone.appendChild(eventDetails);
    }

    if (event.description) {
      const descriptionNode: HTMLParagraphElement | null = eventsTemplate.content.querySelector(".event__description");
      if (descriptionNode) {
        const descriptionClone: HTMLParagraphElement = document.importNode(descriptionNode, true);
        descriptionClone.textContent = event.description;
        eventDetails.appendChild(descriptionClone);
      }
    }

    if (event.data && event.data.type === "graph") {
      const graphNode: HTMLImageElement | null = eventsTemplate.content.querySelector(".graph");
      if (graphNode) {
        const graphClone: HTMLImageElement = document.importNode(graphNode, true);
        eventDetails.appendChild(graphClone);
      }
    }

    if (event.data && event.data.temperature) {
      const tempNode: HTMLDivElement | null = eventsTemplate.content.querySelector(".weather");
      if (tempNode) {
        const tempClone: HTMLDivElement = document.importNode(tempNode, true);
        const temp: HTMLParagraphElement | null = tempClone.querySelector("#temp");
        if (temp) { temp.textContent = String(event.data.temperature); }
        const hum: HTMLParagraphElement | null = tempClone.querySelector("#hum");
        if (hum) { hum.textContent = String(event.data.humidity); }
        eventDetails.appendChild(tempClone);
      }
    }

    if (event.data && event.data.track) {
      const trackNode: HTMLDivElement | null = eventsTemplate.content.querySelector(".track");
      if (trackNode) {
        const trackClone: HTMLDivElement = document.importNode(trackNode, true);
        const trackCover: HTMLImageElement | null = trackClone.querySelector(".track__cover");
        if (trackCover) { trackCover.setAttribute("src", event.data.albumcover); }
        const trackName: HTMLParagraphElement | null = trackClone.querySelector(".track__name");
        if (trackName) { trackName.textContent = `${event.data.artist} - ${event.data.track.name}`; }
        const trackTime: HTMLOutputElement | null = trackClone.querySelector(".track__time");
        if (trackTime) { trackTime.textContent = event.data.track.length; }
        const trackVolume: HTMLOutputElement | null = trackClone.querySelector(".track__vol");
        if (trackVolume) { trackVolume.textContent = String(event.data.volume); }
        eventDetails.appendChild(trackClone);
      }
    }

    if (event.data && event.data.buttons) {
      const btnGroupNode: HTMLDivElement | null = eventsTemplate.content.querySelector(".btn-group");
      if (btnGroupNode) {
        const btnGroupClone: HTMLDivElement = document.importNode(btnGroupNode, true);
        const confirm: HTMLButtonElement | null = btnGroupClone.querySelector(".btn-group__btn-confirm");
        if (confirm) { confirm.textContent = event.data.buttons[0]; }
        const cancel: HTMLButtonElement | null = btnGroupClone.querySelector(".btn-group__btn-cancel");
        if (cancel) { cancel.textContent = event.data.buttons[1]; }
        eventDetails.appendChild(btnGroupClone);
      }
    }

    if (event.data && event.data.image) {
      const imageNode: HTMLDivElement | null = eventsTemplate.content.querySelector(".camera");
      if (imageNode) {
        const imageClone: HTMLDivElement = document.importNode(imageNode, true);
        eventDetails.appendChild(imageClone);
      }
    }

    eventsNode.appendChild(eventClone);
  });
}
