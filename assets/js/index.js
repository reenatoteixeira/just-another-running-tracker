const RIDE_LIST = document.getElementById('ride-list'),
  ALL_RIDES = getAllRides();

ALL_RIDES.forEach(async ([id, value]) => {
  const ITEM_ELEMENT = document.createElement('li'),
    RIDE = JSON.parse(value),
    FIRST_POS = RIDE.data[0],
    FIRST_POS_DATA = await getLocationData(FIRST_POS.latitude, FIRST_POS.longitude);

  RIDE.id = id;
  ITEM_ELEMENT.id = RIDE.id;
  ITEM_ELEMENT.innerHTML = `
  <div>
    ${FIRST_POS_DATA.city} - ${FIRST_POS_DATA.countryCode}
  </div>
  
  <div>
    Max speed: ${getMaxSpeed(RIDE.data)}Km/h
  </div>
  
  <div>
    Distance: ${getDistance(RIDE.data)}Km
  </div>
  `;

  RIDE_LIST.appendChild(ITEM_ELEMENT);
})

async function getLocationData(latitude, longitude) {
  const URL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localitylanguade=en`,
    RESPONSE = await fetch(URL);

  return await RESPONSE.json();
}

function getMaxSpeed(positions) {
  let maxSpeed = 0

  positions.forEach(position => {
    if (position.speed && position.speed > maxSpeed) {
      maxSpeed = position.speed;
    }
  })

  return (maxSpeed * 3.6).toFixed(1);
}

function getDistance(positions) {
  const EARTH_RADIUS = 6371;
  let totalDistance = 0;

  for (let i = 0; i < positions.length - 1; i++) {
    const POS1 = {
        latitude: positions[i].latitude,
        longitude: positions[i].longitude
      },
      POS2 = {
        latitude: positions[i + 1].latitude,
        longitude: positions[i + 1].longitude
      },
      LAT_DELTA = toRad(POS2.latitude - POS1.latitude),
      LONG_DELTA = toRad(POS2.longitude - POS1.longitude);

    const A = Math.sin(LAT_DELTA / 2) *
      Math.sin(LAT_DELTA / 2) +
      Math.sin(LONG_DELTA / 2) *
      Math.sin(LONG_DELTA / 2) *
      Math.cos(toRad(POS1.latitude)) *
      Math.cos(toRad(POS2.latitude));

    const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));

    const DISTANCE = EARTH_RADIUS * C;

    totalDistance += DISTANCE;
  }

  function toRad(degrees) {
    return degrees * Math.PI / 180
  }

  return totalDistance.toFixed(1);
}
