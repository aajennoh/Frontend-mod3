function initMap() {
    let latitude = currentLat; 
    let longitude = currentLong; 
    let myLatLng = {lat: latitude, lng: longitude};
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 2,
        disableDoubleClickZoom: true 
    });

    let markers = locations.forEach(function(location){
        let newMark = new google.maps.Marker({
            position: location,
            map: map,
            title: location.lat + ', ' + location.lng
        })
    })
    
    google.maps.event.addListener(map,'dblclick',function(event) {
        currentLat = event.latLng.lat();
        currentLong = event.latLng.lng();
        var marker = new google.maps.Marker({
            position: event.latLng, 
            map: map, 
            title: event.latLng.lat()+', '+event.latLng.lng()
        }); 
        $("#submit-form").slideDown();
        locations.push({lat: marker.position.lat(), lng: marker.position.lng()});
        createLocation();
        });
}