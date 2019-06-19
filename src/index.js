//DECLARATIONS & ASSIGNMENTS
var map;
var locations = [
    {lat: 1, lng: 1},
    {lat: -43.99972, lng: 170.463352}
]
let currentUser = null;
let currentUsername = null;
let currentUseremail = null;
let currentLat = null;
let currentLong = null;
let currentLocation = null;
const loginForm = document.querySelector("#login-form")
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

//CREATE HTML SECRET SCRIPT TAG
const googleApi = document.createElement('script')
googleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`
document.body.appendChild(googleApi)

//MAP INIT
function initMap() {
    if(currentUser !== null) { 
        mapAndSubmit.style.display = "block"
        loginForm.style.display = "none"
        var latitude = 0; 
        var longitude = 0; 
        var myLatLng = {lat: latitude, lng: longitude};
        
        map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 2,
            disableDoubleClickZoom: true 
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
    } else {
        loginForm.style.display = "block"
        mapAndSubmit.style.display = "none"
        console.log("no current user")
    }
}


//HELPER METHODS
function renderCard(){
    let cardInnerHTML = document.querySelector('#card')
    cardInnerHTML.innerHTML = ''
    cardInnerHTML.innerHTML = 
        `<div class="w3-card-4">
            <div class="top-border">
                <p style="display: inline;">Latlng</p>
                <button type="button" style="float: right;">x</button>
            </div>
            <img class="photo" src="https://cdn.eso.org/images/screen/eso1436a.jpg" alt="Alps">
            <div class="w3-container w3-center">
                <p>Hello</p>
            </div>
        </div>`
}


//EVENT LISTENERS
mapDiv.addEventListener('click', function(event) {
    if (event.target.tagName === 'AREA'){
        renderCard()
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
    }).then(sendPhotoData)
})

loginForm.addEventListener("submit", login)

logoutButton.addEventListener('click', logout)

//FETCHES
function sendPhotoData(response){
    let responseData = response.data.secure_url
    let data = {'name': responseData,
    'description': captionInput.value
    //need to put user_id and location_id    
    };
    fetch("http://localhost:3000/api/v1/photos", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function(response){
        console.log(response)
    }).catch(function(error) {
        console.error(error)
    })
}

function createLocation(){
    fetch("http://localhost:3000/api/v1/locations", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true, 
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: locationInput,
            latitude: currentLat,
            longitude: currentLong,
            user_id: currentUser.id
        })
    }).then(response => response.json())
    .then(console.log)
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
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true, 
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
        initMap()
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
        initMap()
    })
}
    


