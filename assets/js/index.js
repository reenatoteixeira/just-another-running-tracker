const RIDE_LIST = document.getElementById('ride-list'),
  ALL_RIDES = getAllRides();

ALL_RIDES.forEach(async ([id, value]) => {
  const ITEM_ELEMENT = document.createElement('li'),
    RIDE = JSON.parse(value),
    FIRST_POS = RIDE.data[0];

  RIDE.id = id;
  ITEM_ELEMENT.id = RIDE.id;
  ITEM_ELEMENT.className = 'd-flex p-1 align-items-center gap-3 shadow-sm'
  ITEM_ELEMENT.style.cursor = 'pointer';
  RIDE_LIST.appendChild(ITEM_ELEMENT);

  ITEM_ELEMENT.addEventListener("click", () => {
    window.location.href = `./detail/?id=${RIDE.id}`;
  })

  const FIRST_POS_DATA = await getLocationData(FIRST_POS.latitude, FIRST_POS.longitude),
    RIDE_MAP_ID = `map${RIDE.id}`;

  ITEM_ELEMENT.innerHTML = `
  <div id="${RIDE_MAP_ID}" class="ride-map bg-secondary rounded-4"></div>
  
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

  const RIDE_MAP = L.map(RIDE_MAP_ID, {
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false,
    attributionControl: false
  }).setView([FIRST_POS.latitude, FIRST_POS.longitude], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(RIDE_MAP);
  L.marker([FIRST_POS.latitude, FIRST_POS.longitude]).addTo(RIDE_MAP);
})
