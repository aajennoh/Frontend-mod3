async function findGeolocation(){
    console.log("Hi")
    if (navigator.geolocation) {
        console.log("When???")
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                };
                currentLat = pos.lat
                currentLong = pos.lng
            })

        await setTimeout(function(){
            console.log(currentLat, currentLong)
         addMarker()
      }, 7000)
    }

}

function renderCard(){
    cardInnerHTML.innerHTML = ''
    cardInnerHTML.innerHTML = 
        `<div class="w3-card-4">
            <div class="top-border">
                <p class="location-name"style="display: inline;">${currentLocation.name}</p>
                <button id="closeCardButton" type="button">x</button>
            </div>
            <img class="photo" src="${currentLocation.photos[0].name}" alt="Alps">
            <div class="w3-container w3-center">
                <p class="loc-description">${currentLocation.photos[0].description}</p>
            </div>
        </div>`
}

async function addMarker(){
    console.log("Hello")
    let marker = new google.maps.Marker({
            position: {lat: currentLat, lng: currentLong}, 
            map: map, 
            title: currentLat +', '+ currentLong
    });
}