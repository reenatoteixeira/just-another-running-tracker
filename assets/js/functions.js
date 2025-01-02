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