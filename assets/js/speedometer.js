const SPEED_ELEMENT = document.getElementById('speed'),
  START_BTN = document.getElementById('start-btn'),
  STOP_BTN = document.getElementById('stop-btn');

let watchId = null;

START_BTN.addEventListener('click', () => {
  if (watchId) return

  function handleSuccess(position) {
    SPEED_ELEMENT.innerHTML = position.coords.speed ?
      (position.coords.speed * 3.6).toFixed(1) : 0;
  }

  function handleError(error) {
    console.log(error.msg);
  }

  const OPTIONS = {
    enableHighAccuracy: true,
  }

  watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, OPTIONS);

  START_BTN.classList.add('d-none');
  STOP_BTN.classList.remove('d-none');
});

STOP_BTN.addEventListener('click', () => {
  if (!watchId) return

  navigator.geolocation.clearWatch(watchId);
  watchId = null;

  STOP_BTN.classList.add('d-none');
  START_BTN.classList.remove('d-none');
});