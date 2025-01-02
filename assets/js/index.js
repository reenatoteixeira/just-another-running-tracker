const RIDE_LIST = document.getElementById('ride-list'),
  ALL_RIDES = getAllRides();

ALL_RIDES.forEach(([id, value]) => {
  const ITEM_ELEMENT = document.createElement('li'),
    RIDE = JSON.parse(value);

  RIDE.id = id;
  ITEM_ELEMENT.id = RIDE.id;
  ITEM_ELEMENT.innerText = RIDE.id;
  RIDE_LIST.appendChild(ITEM_ELEMENT);
})