function createNewRide() {
  const RIDE_ID = Date.now(),
    RIDE_RECORD = {
      data: [],
      startTime: RIDE_ID,
      stopTime: null
    };

  saveRideRecord(RIDE_ID, RIDE_RECORD)
  return RIDE_ID;
}

function getAllRides() {
  return Object.entries(localStorage);
}

function getRideRecord(rideId) {
  return JSON.parse(localStorage.getItem(rideId));
}

function saveRideRecord(rideId, rideRecord) {
  return localStorage.setItem(rideId, JSON.stringify(rideRecord));
}

function addPosition(rideId, position) {
  const RIDE_RECORD = getRideRecord(rideId),
    NEW_DATA = {
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };

  RIDE_RECORD.data.push(NEW_DATA);
  saveRideRecord(rideId, RIDE_RECORD);
}

function updateStopTime(rideId) {
  const RIDE_RECORD = getRideRecord(rideId);
  RIDE_RECORD.stopTime = Date.now();
  saveRideRecord(rideId, RIDE_RECORD);
}