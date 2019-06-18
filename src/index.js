var map;
var locations = [
    {lat: 1, lng: 1},
    {lat: -43.99972, lng: 170.463352}
]
let currentLat = null
let currentLong = null

function initMap() {                            
    var latitude = 0; // YOUR LATITUDE VALUE
    var longitude = 0; // YOUR LONGITUDE VALUE
    var myLatLng = {lat: latitude, lng: longitude};
    
    map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 2,
    disableDoubleClickZoom: true // disable the default map zoom on double click
    });
    
    
    var markers = locations.forEach(function(location){
        var newMark = new google.maps.Marker({
            position: location,
            map: map,
            title: location.lat + ', ' + location.lng
        })
    })

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        // setting latitude & longitude as title of the marker
        // title is shown when you hover over the marker
        title: latitude + ', ' + longitude 
    });
    
    // Create new marker on double click event on the map
    google.maps.event.addListener(map,'dblclick',function(event) {
        currentLat = event.latLng.lat();
        currentLong = event.latLng.lng();
        // console.log(currentLat, currentLong)
        var marker = new google.maps.Marker({
            position: event.latLng, 
            map: map, 
            title: event.latLng.lat()+', '+event.latLng.lng()
        }); 
        $("#submitForm").slideDown();
        locations.push({lat: marker.position.lat(), lng: marker.position.lng()});
    });
}

//
const googleApi = document.createElement('script')
googleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`
document.body.appendChild(googleApi)

