export function handleToggleMenu(): void {
  const toggleMenu: HTMLButtonElement | null = document.querySelector('#toggle-menu');
  toggleMenu && toggleMenu.addEventListener('click', () => {
    const menu: HTMLUListElement | null = document.querySelector('#menu');
    menu && menu.classList.toggle('menu_visible');
  });
}
