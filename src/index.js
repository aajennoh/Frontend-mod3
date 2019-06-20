//DECLARATIONS & ASSIGNMENTS
let map;
let locations = null
let currentUser = null;
let currentUsername = null;
let currentUseremail = null;
let currentLat = 0;
let currentLong = 0;
let currentLocation = null;
let pos = null;
const loginForm = document.querySelector("#not-logged-in")
const mapAndSubmit = document.querySelector("#logged-in")
const CLOUDINARY_URL = `${CLOUDINARYURL}`
const CLOUDINARY_UPLOAD_PRESET = `${PRESET}`
let fileUpload = document.querySelector('#file-upload')
let submitForm = document.querySelector('#submit-form')
let currentFile = null
const mapDiv = document.querySelector('#map')
const viewCard = document.querySelector('.w3-card-4')
const logoutButton = document.querySelector('#logout-button')
const captionInput = document.querySelector('#caption-input')
const locationInput = document.querySelector('#location-input')
const cardInnerHTML = document.querySelector('#card')

//ACCESS GEOCODE?



//CREATE HTML SECRET SCRIPT TAG
const googleApi = document.createElement('script')
googleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=findGeolocation`
document.body.appendChild(googleApi)

//MAP INIT
function initMap() {
    geolocateButton()
    let latitude = currentLat; 
    let longitude = currentLong; 
    let myLatLng = {lat: latitude, lng: longitude};
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 6,
        disableDoubleClickZoom: true 
    });

    let markers = locations.forEach(function(location){
        let newMark = new google.maps.Marker({
            position: location,
            map: map,
            title: location.lat + ', ' + location.lng
        })
    })

    let marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: latitude + ', ' + longitude 
    });
    
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

//HELPER METHODS
function findGeolocation(){
if(currentUser === null) {
    loginForm.style.display = "block"
    mapAndSubmit.style.display = "none"
}
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
        setTimeout(function(){
        addLocationToArray()
        }, 6000)
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
    if(pos !== null){
        let posLi = document.querySelector("#currentLocButton");
        posLi.innerHTML = ""
        let posButton = document.createElement("BUTTON")
        posButton.innerText = "Use Current Location?"
        posButton.className ="pos-button"
        posLi.appendChild(posButton)
    }
}

//EVENT LISTENERS
mapDiv.addEventListener('click', function(event) {
    if (event.target.tagName === 'AREA'){
        currentLocation = event.target
        findLocation()
    }
})

document.querySelector("#currentLocButton").addEventListener("click", function(e){
    if(e.target.tagName === "BUTTON"){
        console.log(pos)
        console.log(currentLat)
        console.log(currentLong)
        createLocation()
        addLocationToArray()
        $("#submit-form").slideDown();

    }
})

fileUpload.addEventListener('change', function(event){
    currentFile = event
})

submitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let file = currentFile.target.files[0];
    let formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    }).then(response => {
        updateLocation()
        sendPhotoData(response)
        submitForm.reset()
    })
})

cardInnerHTML.addEventListener('click', function(event) {
    if (event.target.id === 'closeCardButton')
    cardInnerHTML.innerHTML = ''
})

loginForm.addEventListener("submit", login)

logoutButton.addEventListener('click', logout)

//FETCHES
function addLocationToArray(){
    locations = []
    if(currentUser !== null) { 
        mapAndSubmit.style.display = "block"
        loginForm.style.display = "none"
        fetch("http://localhost:3000/api/v1/locations")
        .then(response => response.json())
        .then(data => data.map(location => {
            if (location.user.id === currentUser.id){
                locations.push({lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)})
            }
            initMap()
        }))
    } else {
        loginForm.style.display = "block"
        mapAndSubmit.style.display = "none"
    }
}


function sendPhotoData(response){
    let responseData = response.data.secure_url
    let data = {
        name: responseData,
        description: captionInput.value,
        user_id: currentUser.id,
        location_id: currentLocation.id
    };
    fetch("http://localhost:3000/api/v1/photos", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

function createLocation(){
    fetch("http://localhost:3000/api/v1/locations", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: locationInput,
            latitude: currentLat,
            longitude: currentLong,
            user_id: currentUser.id
        })
    }).then(response => response.json())
    .then(data => {
        currentLocation = data
    })
}

function updateLocation(){
    fetch(`http://localhost:3000/api/v1/locations/${currentLocation.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: locationInput.value,
            latitude: currentLat,
            longitude: currentLong,
            user_id: currentUser.id
        })
    }).then(response => response.json())
    .then(data => {
        currentLocation = data
        renderCard()
    })
}

function findLocation(){
    fetch("http://localhost:3000/api/v1/locations")
    .then(response => response.json())
    .then(data => data.find(location => location.latitude === currentLocation.title.split(', ')[0] && location.longitude === currentLocation.title.split(', ')[1]))
    .then(loc => {
        currentLocation = loc
        renderCard()
    })
}


function login(e){
    e.preventDefault();
    let username = document.querySelector("#username");
    let useremail = document.querySelector("#useremail");
    currentUsername = username.value;
    currentUseremail = useremail.value;

    fetch("http://localhost:3000/api/v1/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: currentUsername, 
            email: currentUseremail
        })
    })
    .then(res => res.json())
    .then(json => {
        currentUser = json;
        addLocationToArray()
    })
}

function logout(){
    alert("You are now logged out.")
    
    fetch(`http://localhost:3000/api/v1/users/${currentUser.id}`, {
        method: 'DELETE'
    })
    
    .then(function(){
        currentUser = null
        currentUsername = null
        currentUseremail = null
        addLocationToArray()
    })
}