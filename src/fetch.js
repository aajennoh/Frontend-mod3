function addLocationToArray(){
    locations = []
    if(currentUser !== null) { 
        initMap()
        mapAndSubmit.style.display = "block"
        loginForm.style.display = "none"
        loginBrand.style.display = "none"
        p.style.display = "none"
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
        loginBrand.style.display = "block"
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
        renderCard(data)
    })
}

function findLocation(){
    fetch("http://localhost:3000/api/v1/locations")
    .then(response => response.json())
    .then(data => data.find(location => location.latitude === currentLocation.title.split(', ')[0] && location.longitude === currentLocation.title.split(', ')[1] && location.user.id === currentUser.id))
    .then(loc => {
        currentLocation = loc
        console.log(currentUser)
        renderCard(loc)
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
        loggedInUser = json;
        addLocationToArray()
    })
}

function axiosFetch(data){
    console.log("hey")
    return axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    }).then(response => {
        console.log(response)
        updateLocation()
        sendPhotoData(response)
        submitForm.reset()
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
        loggedInUser = null
        addLocationToArray()
    })
}

function fetchAllUsers(){
    fetch("http://localhost:3000/api/v1/users")
    .then(response => response.json())
    .then(data => {
        return data.filter(user => user.id !== loggedInUser.id)
    }).then(users => friendList(users))
}

function fetchSpecificUser(userId){
    fetch(`http://localhost:3000/api/v1/users/${parseInt(userId.target.value)}`)
    .then(response => response.json())
    .then(userResponse => {
        locations = []
        userResponse.locations.forEach(location => {
            locations.push({lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)})
        }) 
        currentUser = userResponse
        return locations
    }).then(initMap)
}