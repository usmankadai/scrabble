/* This file helps for the drag and drop events on the game.
Boakes, R. (2021, January). Drag and drop[Recorded lecture]. University of Portsmouth. https://github.com/portsoc/ws_drag
*/

function dragStartHandler(e) {
  const data = e.target.id;
  e.dataTransfer.setData('text/plain', data);
}

function dragOverHandler(e) {
  e.preventDefault();
}

function dropHandler(e) {
  const data = e.dataTransfer.getData('text/plain');
  const draggable = document.getElementById(data);
  e.currentTarget.append(draggable);
}

export function initialiseDropZone() {
  const dropzones = document.querySelectorAll('.dropzone, .letterbox');
  for (const dropzone of dropzones) {
    dropzone.addEventListener('dragover', dragOverHandler);
    dropzone.addEventListener('drop', dropHandler);
  }
}

export function initialiseDragging() {
  const divs = document.querySelectorAll('.letters');
  for (const div of divs) {
    div.addEventListener('dragstart', dragStartHandler);
  }
}
