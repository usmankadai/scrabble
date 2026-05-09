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

// Touch support — mirrors drag behaviour using touch events
let touchDragging = null;
let touchClone = null;

function touchStartHandler(e) {
  touchDragging = e.currentTarget;
  const rect = touchDragging.getBoundingClientRect();
  const touch = e.touches[0];

  // Create a visual clone that follows the finger
  touchClone = touchDragging.cloneNode(true);
  touchClone.style.position = 'fixed';
  touchClone.style.width = rect.width + 'px';
  touchClone.style.height = rect.height + 'px';
  touchClone.style.left = touch.clientX - rect.width / 2 + 'px';
  touchClone.style.top = touch.clientY - rect.height / 2 + 'px';
  touchClone.style.opacity = '0.7';
  touchClone.style.pointerEvents = 'none';
  touchClone.style.zIndex = '1000';
  document.body.appendChild(touchClone);
  touchDragging.style.opacity = '0.3';
}

function touchMoveHandler(e) {
  e.preventDefault();
  if (!touchClone) return;
  const touch = e.touches[0];
  const rect = touchClone.getBoundingClientRect();
  touchClone.style.left = touch.clientX - rect.width / 2 + 'px';
  touchClone.style.top = touch.clientY - rect.height / 2 + 'px';
}

function touchEndHandler(e) {
  if (!touchDragging) return;
  const touch = e.changedTouches[0];

  // Hide the clone so elementFromPoint can find the element underneath
  touchClone.style.display = 'none';
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  touchClone.style.display = '';

  const dropzone = target && target.closest('.dropzone, .letterbox');
  if (dropzone) {
    dropzone.append(touchDragging);
  }

  touchDragging.style.opacity = '';
  touchClone.remove();
  touchDragging = null;
  touchClone = null;
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
    div.addEventListener('touchstart', touchStartHandler, { passive: false });
    div.addEventListener('touchmove', touchMoveHandler, { passive: false });
    div.addEventListener('touchend', touchEndHandler);
  }
}
