export function handleToggleMenu() {
  document.getElementById('toggle-menu').addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('menu_visible');
  });
}
