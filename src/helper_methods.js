function findGeolocation(){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };
            currentLat = pos.lat
            currentLong = pos.lng
        })
        console.log(pos)
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

function geolocateButton(){
        let posLi = document.querySelector("#currentLocButton");
        posLi.innerHTML = ""
        let posButton = document.createElement("BUTTON")
        posButton.innerText = "Use Current Location?"
        posButton.className ="pos-button"
        posLi.appendChild(posButton)
}