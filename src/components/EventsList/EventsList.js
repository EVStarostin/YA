export async function generateContent() {
  const DATA_URL = 'http://194.87.239.193:8000/api/events';

  let data;
  try {
    const response = await fetch(DATA_URL);
    data = await response.json();
  } catch (error) {
    console.error(error);
  }

  if (!data) return null;

  const eventsNode = document.querySelector('#events');
  const eventsTemplate = document.querySelector('#events-template');

  if (!eventsNode || !eventsTemplate) return;
  const eventNode = eventsTemplate.content.querySelector('.event');

  data.events.forEach((event) => {
    const eventClone = document.importNode(eventNode, true);
    eventClone.classList.add(`event_size_${event.size}`);
    if (event.type === 'critical') eventClone.classList.add('event_critical');

    const eventIcon = eventClone.querySelector('.event__icon');
    eventIcon.setAttribute('src', `images/${event.icon}${event.type === 'critical' ? '-white' : ''}.svg`);
    eventIcon.setAttribute('alt', event.source);

    eventClone.querySelector('.event__title').textContent = event.title;
    eventClone.querySelector('.event__source').textContent = event.source;
    eventClone.querySelector('.event__time').textContent = event.time;

    const eventDetails = document.createElement('div');
    eventDetails.classList.add('event__details');
    if (event.description || event.data) {
      eventClone.appendChild(eventDetails);
    }

    if (event.description) {
      const descriptionNode = eventsTemplate.content.querySelector('.event__description');
      const descriptionClone = document.importNode(descriptionNode, true);
      descriptionClone.textContent = event.description;
      eventDetails.appendChild(descriptionClone);
    }

    if (event.data && event.data.type === 'graph') {
      const graphNode = eventsTemplate.content.querySelector('.graph');
      const graphClone = document.importNode(graphNode, true);
      eventDetails.appendChild(graphClone);
    }

    if (event.data && event.data.temperature) {
      const tempNode = eventsTemplate.content.querySelector('.weather');
      const tempClone = document.importNode(tempNode, true);
      tempClone.querySelector('#temp').textContent = event.data.temperature;
      tempClone.querySelector('#hum').textContent = event.data.humidity;
      eventDetails.appendChild(tempClone);
    }

    if (event.data && event.data.track) {
      const trackNode = eventsTemplate.content.querySelector('.track');
      const trackClone = document.importNode(trackNode, true);
      trackClone.querySelector('.track__cover').setAttribute('src', event.data.albumcover);
      trackClone.querySelector('.track__name').textContent = `${event.data.artist} - ${event.data.track.name}`;
      trackClone.querySelector('.track__time').textContent = event.data.track.length;
      trackClone.querySelector('.track__vol').textContent = event.data.volume;
      eventDetails.appendChild(trackClone);
    }

    if (event.data && event.data.buttons) {
      const btnGroupNode = eventsTemplate.content.querySelector('.btn-group');
      const btnGroupClone = document.importNode(btnGroupNode, true);
      btnGroupClone.querySelector('.btn-group__btn-confirm').textContent = event.data.buttons[0];
      btnGroupClone.querySelector('.btn-group__btn-cancel').textContent = event.data.buttons[1];
      eventDetails.appendChild(btnGroupClone);
    }

    if (event.data && event.data.image) {
      const imageNode = eventsTemplate.content.querySelector('.camera');
      const imageClone = document.importNode(imageNode, true);
      eventDetails.appendChild(imageClone);
    }

    eventsNode.appendChild(eventClone);
  });
}
