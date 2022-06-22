var platform = new H.service.Platform({
    'apikey': 'S4t-77_5bUP6gq5SUmOWlhKX76YoiZOZrMyHur2rUvI'
});


let getAddress = document.getElementById('address');
let getAddressCity = document.getElementById('addressCity');
let getAddressDistrict = document.getElementById('addressDistrict');
let getResultAddress;

if (getAddress || getAddressCity || getAddressDistrict) {
    getResultAddress = getAddress.value + ", " + getAddressDistrict.value + ", " + getAddressCity.value;
}


const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map, {
    center: { lat: 37.773972, lng: -122.431297 },
    zoom: 13,
    pixelRatio: window.devicePixelRatio || 1
});
window.addEventListener('resize', () => map.getViewPort().resize());

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);

var service = platform.getSearchService();

// Call the geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):

service.geocode({
    q: getResultAddress
}, (result) => {
    // Add a marker for each location found
    result.items.forEach((item) => {
        map.addObject(new H.map.Marker(item.position));
        map.setCenter(item.position);
        map.setZoom(15);
    });
}, alert);




