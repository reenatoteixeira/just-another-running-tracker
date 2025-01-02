const RIDE_DETAILS = document.getElementById('ride-details'),
  PARAMS = new URLSearchParams(window.location.search),
  RIDE_ID = PARAMS.get('id'),
  RIDE = getRideRecord(RIDE_ID);

document.addEventListener("DOMContentLoaded", async () => {
  const FIRST_POS = RIDE.data[0],
    FIRST_POS_DATA = await getLocationData(FIRST_POS.latitude, FIRST_POS.longitude);

  RIDE_DETAILS.innerHTML = `
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

  const RIDE_MAP = L.map('ride-map').setView([FIRST_POS.latitude, FIRST_POS.longitude], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(RIDE_MAP);

  const POSITIONS_LIST = RIDE.data.map((position => [position.latitude, position.longitude])),
    POLYLINE = L.polyline(POSITIONS_LIST, {color: '#F00'});

  POLYLINE.addTo(RIDE_MAP);

  RIDE_MAP.fitBounds(POLYLINE.getBounds());
});



