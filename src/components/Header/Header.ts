export function handleToggleMenu(): void {
  const toggleMenu: HTMLButtonElement | null = document.querySelector("#toggle-menu");
  if (toggleMenu) {
    toggleMenu.addEventListener("click", () => {
      const menu: HTMLUListElement | null = document.querySelector("#menu");
      if (menu) { menu.classList.toggle("menu_visible"); }
    });
  }
}
