/* This file helps in the audio library

Audio() referenced from MDN. https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio
*/

function buttonSound() {
  const audio = document.querySelector('#audioMusic');
  audio.play();
  audio.volume = 0.1;
}
function buttonM() {
  const audio = document.querySelector('#buttonMusic');
  audio.play();
  audio.volume = 0.1;
}

function unMuteMusic() {
  const audio = document.querySelector('#backgroundMusic');
  audio.play();
  audio.volume = 0.05;
}
function muteMusic() {
  const muteAudio = document.querySelector('#backgroundMusic');
  muteAudio.pause();
}

export function plays() {
  /* addEventListener() sets up a function that will be called whenever the specified event is delivered to the target
  */
  document.querySelector('#play').addEventListener('click', buttonM);
  document.querySelector('#rules').addEventListener('click', buttonM);
  document.querySelector('#play').addEventListener('click', unMuteMusic);
  document.querySelector('#rules').addEventListener('click', unMuteMusic);
  document.querySelector('#unMute').addEventListener('click', unMuteMusic);
  document.querySelector('#mute').addEventListener('click', muteMusic);
  buttonSound();
}
