import { changePage } from "Store/actions";
import { store } from "Store/index";

const toggleMenu = document.querySelector<HTMLButtonElement>("#toggle-menu");
if (toggleMenu) {
  toggleMenu.addEventListener("click", () => {
    const menu = document.querySelector<HTMLUListElement>("#menu");
    if (menu) { menu.classList.toggle("menu_visible"); }
  });
}

const pages = [
  { href: "events", title: "События" },
  { href: "#", title: "Сводка" },
  { href: "#", title: "Устройства" },
  { href: "#", title: "Сценарии" },
  { href: "cameras", title: "Видеонаблюдение" },
];
const nav = document.querySelector(".header__nav");

function linkClickHandler(e: Event) {
  e.preventDefault();
  if (e.target) {
    const href = (e.target as HTMLLinkElement).dataset.href;
    if (!href || href === "#") { return; }
    changePage(href);
  }
}

function renderMenu() {
  if (!nav) { return; }
  nav.innerHTML = "";

  const state = store.getState();

  const menu = document.createElement("ul");
  menu.id = "menu";
  menu.classList.add("menu");
  nav.appendChild(menu);

  pages.forEach((page) => {
    const listItem = document.createElement("li");
    listItem.classList.add("menu__item");
    const link = document.createElement("a");
    link.classList.add("menu__link");
    if (page.href === state.page) {
      link.classList.add("menu__link_active");
    }
    link.innerText = page.title;
    link.dataset.href = page.href;
    link.addEventListener("click", linkClickHandler);
    listItem.appendChild(link);
    menu.appendChild(listItem);
  });
}

function handleStateChange() {
  renderMenu();
}

store.subscribe(handleStateChange);
