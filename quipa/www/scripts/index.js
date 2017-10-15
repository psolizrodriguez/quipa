
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);
    }

};

function backToLogin(){
    document.querySelector('#Navigator').pushPage('login.html', { data: { title: 'Quipa' } });
}


function createProfile(){
    var profile = {
        "name": document.getElementById('name').value,
        "description": document.getElementById('description').value,
        "profilePicture": "",
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value,
        "mobilePhoneNumber": document.getElementById('mobilePhoneNumber').value,
        "latitude": document.getElementById('latitude').value,
        "longitude": document.getElementById('longitude').value,
        "skills": ""
    }
    console.log(profile);
    const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profile");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            try {
                if (this.status === 200) {
                    var data = JSON.parse(this.response);
                    document.querySelector('#Navigator').pushPage('profilecreated.html', { data: { title: 'Profile Created' } });
                    console.log(data);
                } else {
                    console.log(this.status + " " + this.statusText);
                }
            } catch (e) {
                console.log(e.message);
            }
        };

        xhr.onerror = function() {
            console.log(this.status + " " + this.statusText);
        };
        xhr.send(JSON.stringify(profile));
}

app.initialize();