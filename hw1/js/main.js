const data = {
  "events": [
    {
      "type": "info",
      "title": "Еженедельный отчет по расходам ресурсов",
      "source": "Сенсоры потребления",
      "time": "19:00, Сегодня",
      "description": "Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.",
      "icon": "stats",
      "data": {
        "type": "graph",
        "values": [
          {
            "electricity": [
              ["1536883200", 115],
              ["1536969600", 117],
              ["1537056000", 117.2],
              ["1537142400", 118],
              ["1537228800", 120],
              ["1537315200", 123],
              ["1537401600", 129]
            ]
          },
          {
            "water": [
              ["1536883200", 40],
              ["1536969600", 40.2],
              ["1537056000", 40.5],
              ["1537142400", 41],
              ["1537228800", 41.4],
              ["1537315200", 41.9],
              ["1537401600", 42.6]
            ]
          },
          {
            "gas": [
              ["1536883200", 13],
              ["1536969600", 13.2],
              ["1537056000", 13.5],
              ["1537142400", 13.7],
              ["1537228800", 14],
              ["1537315200", 14.2],
              ["1537401600", 14.5]
            ]
          }
        ]
      },
      "size": "l"
    },
    {
      "type": "info",
      "title": "Дверь открыта",
      "source": "Сенсор входной двери",
      "time": "18:50, Сегодня",
      "description": null,
      "icon": "key",
      "size": "s"
    },
    {
      "type": "info",
      "title": "Уборка закончена",
      "source": "Пылесос",
      "time": "18:45, Сегодня",
      "description": null,
      "icon": "robot-cleaner",
      "size": "s"
    },
    {
      "type": "info",
      "title": "Новый пользователь",
      "source": "Роутер",
      "time": "18:45, Сегодня",
      "description": null,
      "icon": "router",
      "size": "s"
    },
    {
      "type": "info",
      "title": "Изменен климатический режим",
      "source": "Сенсор микроклимата",
      "time": "18:30, Сегодня",
      "description": "Установлен климатический режим «Фиджи»",
      "icon": "thermal",
      "size": "m",
      "data": {
        "temperature": 24,
        "humidity": 80
      }
    },
    {
      "type": "critical",
      "title": "Невозможно включить кондиционер",
      "source": "Кондиционер",
      "time": "18:21, Сегодня",
      "description": "В комнате открыто окно, закройте его и повторите попытку",
      "icon": "ac",
      "size": "m"
    },
    {
      "type": "info",
      "title": "Музыка включена",
      "source": "Яндекс.Станция",
      "time": "18:16, Сегодня",
      "description": "Сейчас проигрывается:",
      "icon": "music",
      "size": "m",
      "data": {
        "albumcover": "https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000",
        "artist": "Florence & The Machine",
        "track": {
          "name": "Big God",
          "length": "4:31"
        },
        "volume": 80
      }
    },
    {
      "type": "info",
      "title": "Заканчивается молоко",
      "source": "Холодильник",
      "time": "17:23, Сегодня",
      "description": "Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?",
      "icon": "fridge",
      "size": "m",
      "data": {
        "buttons": ["Да", "Нет"]
      }
    },
    {
      "type": "info",
      "title": "Зарядка завершена",
      "source": "Оконный сенсор",
      "time": "16:22, Сегодня",
      "description": "Ура! Устройство «Оконный сенсор» снова в строю!",
      "icon": "battery",
      "size": "s"
    },
    {
      "type": "critical",
      "title": "Пылесос застрял",
      "source": "Сенсор движения",
      "time": "16:17, Сегодня",
      "description": "Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.",
      "icon": "cam",
      "data": {
        "image": "get_it_from_mocks_:3.jpg"
      },
      "size": "l"
    },
    {
      "type": "info",
      "title": "Вода вскипела",
      "source": "Чайник",
      "time": "16:20, Сегодня",
      "description": null,
      "icon": "kettle",
      "size": "s"
    }
  ]
}

if ('content' in document.createElement('template')) {

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
    eventHeading.appendChild(eventIcon);

    const eventTitle = eventHeading.querySelector('.event__title');
    eventTitle.textContent = event.title;
    eventHeading.appendChild(eventTitle);

    eventInfo.appendChild(eventHeading);

    const eventSourceAndTime = eventInfo.querySelector('.event__source-and-time');

    const eventSource = eventSourceAndTime.querySelector('.event__source');
    eventSource.textContent = event.source;
    eventSourceAndTime.appendChild(eventSource);

    const eventTime = eventSourceAndTime.querySelector('.event__time');
    eventTime.textContent = event.time;
    eventSourceAndTime.appendChild(eventTime);

    eventInfo.appendChild(eventSourceAndTime);

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
} else {
  console.error('тег <template> не поддерживается браузером. Обновитесь на Yandex Browser');
}

function toggleMenu() {
  document.getElementById('nav-menu').classList.toggle('menu_visible');
}

document.getElementById('toggle-menu').addEventListener('click', toggleMenu);

function isTouchDevice() {
  return 'ontouchstart' in window;
}

if (isTouchDevice()) {
  document.body.classList.add('touch');
}
