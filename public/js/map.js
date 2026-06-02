function initializeMap() {
  if (!coordinates || coordinates.length !== 2) {
    console.error("Map Error: Valid coordinates are not available for this listing.");
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
      mapDiv.innerHTML = "<div class='flex items-center justify-center h-full text-gray-500 font-medium bg-gray-50'>Map data unavailable for this location.</div>";
    }
    return;
  }

  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: coordinates,
    zoom: 12
  });

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h3>Stayzio Listing</h3>
          <small>📍 ${listingDataforMap.location}, ${listingDataforMap.country}</small>
          <p>This place is available for booking. Click to know more!</p>
        `)
    )
    .addTo(map);
}