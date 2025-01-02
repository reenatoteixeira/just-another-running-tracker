const RIDE_LIST = document.getElementById('ride-list'),
  ALL_RIDES = getAllRides();

ALL_RIDES.forEach(async ([id, value]) => {
  const ITEM_ELEMENT = document.createElement('li'),
    RIDE = JSON.parse(value),
    FIRST_POS = RIDE.data[0],
    FIRST_POS_DATA = await getLocationData(FIRST_POS.latitude, FIRST_POS.longitude);

  RIDE.id = id;
  ITEM_ELEMENT.id = RIDE.id;
  ITEM_ELEMENT.className = 'd-flex p-1 align-items-center gap-3 shadow-sm'
  ITEM_ELEMENT.innerHTML = `
  <div style="height: 100px; width: 100px" class="bg-secondary rounded-4">
    map-here
  </div>
  
  <div class="flex-fill d-flex flex-column">
    <div class="text-primary mb-2">
      ${FIRST_POS_DATA.city} - ${FIRST_POS_DATA.countryCode}
    </div>
    
    <div class="h5">
      Distance: ${getDistance(RIDE.data)}Km
    </div>
    
    <div>
      Duration: ${getDuration(RIDE)}
    </div>
    
    <div>
      Max speed: ${getMaxSpeed(RIDE.data)}Km/h
    </div>
    
    <div class="text-secondary mt-2">
      ${getStartDate(RIDE)}
    </div>
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

  return totalDistance.toFixed(1);
}

function getDuration(ride) {
  const INTERVAL = (ride.stopTime - ride.startTime) / 1000,
    MINUTES = INTERVAL / 60,
    SECONDS = INTERVAL % 60;


  return `${formatNumber(MINUTES, 2)}m${formatNumber(SECONDS, 2)}s`;
}

function getStartDate(ride) {
  const DATE = new Date(ride.startTime),
    DAY = DATE.toLocaleString("en-US", {day: 'numeric'}),
    MONTH = DATE.toLocaleString("en-US", {month: 'long'}),
    YEAR = DATE.toLocaleString("en-US", {year: 'numeric'}),
    HOUR = DATE.toLocaleString("en-US", {hour: '2-digit', hour12: false}),
    MINUTE = DATE.toLocaleString("en-US", {minute: '2-digit'});

  return `${HOUR}:${MINUTE} - ${MONTH}, ${DAY}, ${YEAR}`;
}

function toRad(degrees) {
  return degrees * Math.PI / 180
}

function formatNumber(number, digits) {
  return String(number.toFixed(0)).padStart(2, '0');
}
