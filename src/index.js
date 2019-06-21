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
let currentFile = null
let loggedInUser = null

const submitForm = document.querySelector('#submit-form')
const loginForm = document.querySelector("#not-logged-in")
const mapAndSubmit = document.querySelector("#logged-in")
const CLOUDINARY_URL = `${CLOUDINARYURL}`
const CLOUDINARY_UPLOAD_PRESET = `${PRESET}`
const mapDiv = document.querySelector('#map')
const viewCard = document.querySelector('.w3-card-4')
const fileUpload = document.querySelector('#file-upload')
const logoutButton = document.querySelector('#logout-button')
const captionInput = document.querySelector('#caption-input')
const locationInput = document.querySelector('#location-input')
const cardInnerHTML = document.querySelector('#card')
const friendsList = document.querySelector("#select-friend")
const myMap = document.querySelector(".my-button")

//CREATE HTML SECRET SCRIPT TAG
const googleApi = document.createElement('script')
googleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=addLocationToArray`
document.body.appendChild(googleApi)