const dataUrl = 'https://raw.githubusercontent.com/EVStarostin/yandex__shri/master/home_work_1/data/events.json';

async function generateContent() {
  const errors = [];
  const data = await fetch(dataUrl)
    .then(response => response.json())
    .then(json => json)
    .catch(err => console.error(err));

  if (!data) return null;

  const eventsNode = document.getElementById('events');
  const eventsTemplate = document.getElementById('events-template');
  const eventNode = eventsTemplate.content.querySelector('.event');

  data.events.forEach(event => {
    const clone = document.importNode(eventNode, true);
    clone.classList.add(`event_size_${event.size}`);
    event.type === 'critical' && clone.classList.add('event_critical');

    const eventInfo = clone.querySelector('.event__info');
    const eventHeading = eventInfo.querySelector('.event__heading');

    const eventIcon = eventHeading.querySelector('.event__icon');
    eventIcon.setAttribute('src', `img/${event.icon}${event.type === 'critical' ? '-white' : ''}.svg`);
    eventIcon.setAttribute('alt', event.source);

    const eventTitle = eventHeading.querySelector('.event__title');
    eventTitle.textContent = event.title;

    const eventSourceAndTime = eventInfo.querySelector('.event__source-and-time');

    const eventSource = eventSourceAndTime.querySelector('.event__source');
    eventSource.textContent = event.source;

    const eventTime = eventSourceAndTime.querySelector('.event__time');
    eventTime.textContent = event.time;

    let detailsHTML = '';
    if (event.description) {
      detailsHTML += `
        <p class="event__description">${event.description}</p>
      `;
    }

    if (event.data && event.data.type === 'graph') {
      detailsHTML += `
        <img class="event__graph" src="img/Richdata.svg" alt="график">
      `;
    }

    if (event.data && event.data.temperature) {
      detailsHTML += `
        <div class="event__temp-and-hum">
          <p class="event__temp">Температура: <b>${event.data.temperature} C</b></p>
          <p class="event__hum">Влажность: <b>${event.data.temperature}%</b></p>
        </div>
      `;
    }

    if (event.data && event.data.track) {
      detailsHTML += `
        <div class="event__track">
          <img class="event__track__cover" src="${event.data.albumcover}" alt="обложка">
          <p class="event__track__name">${event.data.artist} - ${event.data.track.name}</p>
          <input class="event__track__line" type="range" id="time" name="time" min="0" max="100" />
          <output class="event__track__time" for="time" name="time">${event.data.track.length}</output>
          <button class="event__track__btn-back">
            <img src="img/Prev.svg" alt="кнопка вперед">
          </button>
          <button class="event__track__btn-forward">
            <img src="img/Prev.svg" alt="кнопка назад">
          </button>
          <input class="event__track__vol-line" type="range" id="start" name="volume" min="0" max="100" />
          <output class="event__track__vol" for="time" name="time">${event.data.volume}</output>
        </div>
      `;
    }

    if (event.data && event.data.buttons) {
      detailsHTML += `
        <div class="event__btn-group">
          <button class="event__btn-confirm">
            ${event.data.buttons[0]}
          </button>
          <button class="event__btn-cancel">
            ${event.data.buttons[1]}
          </button>
        </div>
      `;
    }

    if (event.data && event.data.image) {
      detailsHTML += `
        <img class="event__pic" src="img/Bitmap.png" srcset="img/Bitmap.png 1x, img/Bitmap@2x.png 2x, img/Bitmap@3x.png 3x" alt="застрявший вылесос">
      `;
    }

    if (event.description || event.data) {
      const eventDetails = document.createElement('div');
      eventDetails.classList.add('event__details');
      eventDetails.insertAdjacentHTML('beforeEnd', detailsHTML);
      clone.appendChild(eventDetails);
    }

    eventsNode.appendChild(clone);
  });
}

if ('content' in document.createElement('template')) {
  generateContent();
} else {
  console.error('тег <template> не поддерживается браузером. Обновитесь на Yandex Browser');
}

function toggleMenu() {
  document.getElementById('nav-menu').classList.toggle('menu_visible');
}

function isTouchDevice() {
  return 'ontouchstart' in window;
}

document.getElementById('toggle-menu').addEventListener('click', toggleMenu);
if (isTouchDevice()) {
  document.body.classList.add('touch');
}
