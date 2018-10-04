const dataUrl = 'https://raw.githubusercontent.com/EVStarostin/yandex__shri/master/home_work_1/data/events.json';

window.onload = function () {
  if ('content' in document.createElement('template')) {
    generateContent();
  } else {
    console.error('тег <template> не поддерживается браузером. Обновитесь на Yandex Browser');
  }

  if (isTouchDevice()) {
    document.body.classList.add('touch');
  }

  window.onresize = function() {
    setMaxHeightForTruncate();
  }

  document.querySelector('#toggle-menu').addEventListener('click', toggleMenu);
}

async function generateContent() {
  const data = await fetch(dataUrl)
    .then(response => response.json())
    .then(json => json)
    .catch(err => console.error(err));

  if (!data) return null;

  const eventsNode = document.querySelector('#events');
  const eventsTemplate = document.querySelector('#events-template');
  const eventNode = eventsTemplate.content.querySelector('.event');

  data.events.forEach(event => {
    const eventClone = document.importNode(eventNode, true);
    eventClone.classList.add(`event_size_${event.size}`);
    if (event.type === 'critical') eventClone.classList.add('event_critical');

    const eventIcon = eventClone.querySelector('.event__icon');
    eventIcon.setAttribute('src', `img/${event.icon}${event.type === 'critical' ? '-white' : ''}.svg`);
    eventIcon.setAttribute('alt', event.source);

    eventClone.querySelector('.event__title').textContent = event.title;
    eventClone.querySelector('.event__source').textContent = event.source;
    eventClone.querySelector('.event__time').textContent = event.time;

    if (event.description || event.data) {
      var eventDetails = document.createElement('div');
      eventDetails.classList.add('event__details');
      eventClone.appendChild(eventDetails);
    }

    if (event.description) {
      const descriptionNode = eventsTemplate.content.querySelector('.event__description');
      const descriptionClone = document.importNode(descriptionNode, true);
      descriptionClone.textContent = event.description;
      eventDetails.appendChild(descriptionClone);
    }

    if (event.data && event.data.type === 'graph') {
      const graphNode = eventsTemplate.content.querySelector('.event__graph');
      const graphClone = document.importNode(graphNode, true);
      eventDetails.appendChild(graphClone);
    }

    if (event.data && event.data.temperature) {
      const tempNode = eventsTemplate.content.querySelector('.event__temp-and-hum');
      const tempClone = document.importNode(tempNode, true);
      tempClone.querySelector('#temp').textContent = event.data.temperature;
      tempClone.querySelector('#hum').textContent = event.data.humidity;
      eventDetails.appendChild(tempClone);
    }

    if (event.data && event.data.track) {
      const trackNode = eventsTemplate.content.querySelector('.event__track');
      const trackClone = document.importNode(trackNode, true);
      trackClone.querySelector('.event__track__cover').setAttribute('src', event.data.albumcover);
      trackClone.querySelector('.event__track__name').textContent = `${event.data.artist} - ${event.data.track.name}`;
      trackClone.querySelector('.event__track__time').textContent = event.data.track.length;
      trackClone.querySelector('.event__track__vol').textContent = event.data.volume;
      eventDetails.appendChild(trackClone);
    }

    if (event.data && event.data.buttons) {
      const btnGroupNode = eventsTemplate.content.querySelector('.event__btn-group');
      const btnGroupClone = document.importNode(btnGroupNode, true);
      btnGroupClone.querySelector('.event__btn-confirm').textContent = event.data.buttons[0];
      btnGroupClone.querySelector('.event__btn-cancel').textContent = event.data.buttons[1];
      eventDetails.appendChild(btnGroupClone);
    }

    if (event.data && event.data.image) {
      const imageNode = eventsTemplate.content.querySelector('.event__pic');
      const imageClone = document.importNode(imageNode, true);
      eventDetails.appendChild(imageClone);
    }

    eventsNode.appendChild(eventClone);
    setMaxHeightForTruncate();
  });
}

function toggleMenu() {
  document.querySelector('#nav-menu').classList.toggle('menu_visible');
}

function isTouchDevice() {
  return 'ontouchstart' in window;
}

function setMaxHeightForTruncate() {
  setTimeout(() => {
    const truncatedStrings = document.querySelectorAll('.event__title');
    truncatedStrings.forEach(item => {
      const maxHeight = parseFloat(getComputedStyle(item).lineHeight) * 2;
      if (item.scrollHeight - maxHeight > 1) item.classList.add('event__title_truncated');
      document.querySelector('.event__source').innerText = item.scrollHeight - maxHeight;
      item.style.maxHeight = `${maxHeight}px`;
    });
  }, 100);
}
