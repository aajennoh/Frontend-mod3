mapDiv.addEventListener('click', function(event) {
    if (event.target.tagName === 'AREA'){
        currentLocation = event.target
        findLocation()
    }
})

document.querySelector("#currentLocButton").addEventListener("click", function(e){
    if(e.target.tagName === "BUTTON"){
        e.preventDefault()
        findGeolocation()
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