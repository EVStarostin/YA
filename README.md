# YANDEX SHRI 2018 (Старостин Евгений Валерьевич)
Сайт доступен по ссылке:
http://www.evstar.ru/

Сборка с использванием Webpack  
`npm run build` - собрать проект  
`npm run start` - запустить локальный сервер  

Для удобства тестирования залил сервер, отдающий видео-поток на vps хостинг, изменив заголовок, который отдается сервером "access-control-allow-origin" на "*", иначе в консоле на клиенте валились ошибки про cors. (адрес сервера: http://node.evstar.ru:3102/).  
Свой Node JS сервер также залил на этот же хостинг (http://node.evstar.ru:8000/api/events).  

В задании 3 "Мультимедиа" на странице **Видеонаблюдение** контент занимает всю площадь экрана и размеры видео напрямую зависят от ширины и высоты viewport'a. Это сделано для того, чтобы камеры всегда были в области видимости на 1 экране (для удобства слежения). Все 4 видео разных размеров, умышленно не стал жестко задавать пропорции и добавлять свойство object-fit: cover — тогда все смотрелось бы покрасивее, но обрезалась бы часть видео и пользователь мог бы не заметить чего-то очень важного на камере.   
Анимация разворачивания видео на весь экран реализована через анимирования свойства **transform: translate и scale**. Можно было анимировать с помощью left/top и width и height, но использования трансформаций со свойствами left/top/right/bottom не позволяют создавать плавную анимацию, потому что заставляют браузер пересобирать слои каждый раз, а это действует на все дочерние элементы.  
Для трансформации через **transform: translate(...) scale(...)** я высчитываю расстояние, на которое нужно переместить видео, чтобы оно располагалось по центру и максимальный размер, чтобы видео было во весь экран. Под видео располагаю полупрозрачный блок для затемнения контента и навешиваю на body css-свойсво overflow: hidden ля того, чтобы не было скролла. Плюс при изменении размера окна пересчитываю свойство transform еще раз.  
При открытии видео на весь экран устанавливаю свойство muted: false, чтобы пользователь не только видел, что происходит, но и слышал.  
Ползунки яркость и контраст добавляют видео css-свойства filter: brightness и cotrast, которые комбинируются. **Эти эффекты** сделал именно **через css**, т.к. как уже было сказано на лекции, если хватает контролируемости — используйте css.  
Столбчатую диаграмму реализовал не ввиде 1 столбца, а в виде ряда нескольких. Про то, что нужно сделать один столбец, обсуждалось уже позже в техническом чате. Переделывать не стал. А вот что выдает Яндекс по запросу "столбчатая диаграмма".  
https://yandex.ru/images/search?text=%D1%81%D1%82%D0%BE%D0%BB%D0%B1%D1%87%D0%B0%D1%82%D0%B0%D1%8F%20%D0%B4%D0%B8%D0%B0%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0  
Для проверки столбчатой диаграммы лучше запускать видео с кошкой — там есть звук в отличии от других (в остальных либо его нет, либо он очень тихий).  
Уровень освещенности определяется с помощью Canvas. Этот canvas я не присоединяю в body через appendChild, а просто создаю через createElement. В качестве источника отрисовки указываю свое видео и потом прохожусь по всем пикселям (можно сделать не по всем, но даже так на производительности и плавности сильно не сказывается) и высчитваю усредненный цвет пикселей и перевожу в проценты.  
При закрытии видео обнуляю все таймеры requestAnimationFrame и сбрасываю значения ползунков и фильтров видео.  
*html* для 3 задания написан в файле `./public/video.html`  
*css* и *js* — `./src/components/CamerasList` и `./src/components/Camera`.  
Выполненные пункты отмечены внизу в тексте задания галочками.  
Тестировал на IPhone.  

### 3. ДЗ - «Мультимедиа»
## Пункты, которые нужно реализовать

1. **Страница-вкладка в интерфейсе умного дома "Видеонаблюдение"**:

    - [x] На странице должна находиться сетка из 4-ёх видео-превью.
    Клик по превью разворачивает соответствующее видео на всю страницу.
    
    - [x] Анимацию разворачивания видео можно сделать по аналогии с маковским приложением 
    Photo Booth (или посмотреть видео по [ссылке](https://yadi.sk/i/shdHcVlkd_BO1w]).
    
    - [x] Когда видео раскрыто на всю страницу, в интерфейсе нужно предусмотреть кнопку
    "Все камеры", которая позволяет вернуться назад.
    
    Анимация переключения видео должна работать без тормозов (без просадки FPS на странице)
    
2. **Фильтры для видео**:

    - [x] Видео-поток с камеры может быть плохого качества (размытый, засвеченный или затемненный) - добавьте на экран просмотра видео
    возможность регулировать его яркость и контрастность.
    
    Для контролов настройки яркости/контрастности можете реиспользовать слайдеры из вашего
    вступительного задания, либо просто используйте `input` (реализация контрола не будет оцениваться дополнительно).
    
3. **Анализатор звука**:

    - [x] Реализуйте анализатор громкости звука в потоке из открытой камеры (в виде столбчатой диаграммы).

## Бонусные задания

- [x] 1. Добавьте информацию об уровне освещенности в комнате, в которой стоит камера.
- [ ] 2. Реализуйте детектор движения в видео-потоке (нарисуйте поверх видео прямоугольник, ограничивающий область, в которой происходит движение).

Работа анализаторов не должна давать серьезных просадок FPS.
