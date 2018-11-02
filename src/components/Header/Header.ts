const toggleMenu = document.querySelector<HTMLButtonElement>("#toggle-menu");
if (toggleMenu) {
  toggleMenu.addEventListener("click", () => {
    const menu = document.querySelector<HTMLUListElement>("#menu");
    if (menu) { menu.classList.toggle("menu_visible"); }
  });
}
