const RIDE_DETAILS = document.getElementById('ride-details'),
  PARAMS = new URLSearchParams(window.location.search),
  RIDE_ID = PARAMS.get('id'),
  RIDE = getRideRecord(RIDE_ID);

document.addEventListener("DOMContentLoaded", async () => {
  const FIRST_POS = RIDE.data[0],
    FIRST_POS_DATA = await getLocationData(FIRST_POS.latitude, FIRST_POS.longitude);

  RIDE_DETAILS.innerHTML = `
  <div style="height: 300px;" class="bg-secondary rounded-4">
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
})



