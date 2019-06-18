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
        $("#submit-form").slideDown();
        locations.push({lat: marker.position.lat(), lng: marker.position.lng()});
    });
}

const googleApi = document.createElement('script')
googleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`
document.body.appendChild(googleApi)

// event listener for marker click
const mapDiv = document.querySelector('#map')
const viewCard = document.querySelector('.w3-card-4')
mapDiv.addEventListener('click', function(event) {
    if (event.target.tagName === 'AREA'){
        renderCard()
    }
})

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

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/aajennoh/upload'
const CLOUDINARY_UPLOAD_PRESET = 'd02xpqpf'
let fileUpload = document.querySelector('#file-upload')
let submitForm = document.querySelector('#submit-form')
let currentFile = null
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


function sendPhotoData(response){
    let responseData = response.data.secure_url
    let data = {'name': responseData};
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