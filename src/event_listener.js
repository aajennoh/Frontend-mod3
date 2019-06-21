mapDiv.addEventListener('click', function(event) {
    if (event.target.tagName === 'AREA'){
        currentLocation = event.target
        findLocation()
    }
})

document.querySelector("#currentLocButton").addEventListener("click", getCurrentLocationFromClick)

fileUpload.addEventListener('change', function(event){
    currentFile = event
})

submitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = uploadFile();
    axiosFetch(formData);
})

cardInnerHTML.addEventListener('click', function(event) {
    if (event.target.id === 'closeCardButton')
    cardInnerHTML.innerHTML = ''
})

loginForm.addEventListener("submit", login)

logoutButton.addEventListener('click', logout)

friendsList.addEventListener("change", fetchSpecificUser)

myMap.addEventListener("click", backToMyMap)