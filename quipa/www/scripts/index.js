
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
var lastProfileCreated;
function loadProfileCreated(){
    console.log('here');
    document.getElementById('profilePictureCreatedView').src=lastProfileCreated['profilePicture'];
}

function backToLogin(){
    document.querySelector('#Navigator').pushPage('login.html', { data: { title: 'Quipa' } });
}
function moveToProfilePicture(){
    document.querySelector('#Navigator').pushPage('profilepic.html', { data: { title: 'Profile Picture' } });
}
function moveToSkills(){
    document.querySelector('#Navigator').pushPage('skills.html', { data: { title: 'Skills' } });
}
function addToSkills(skillId){
    var skills = document.getElementById('skills').value;
    if(typeof skills === 'undefined'){
        skills = '';
    }
    if(document.getElementById("skill_"+skillId).className == "skillsSelected"){
        document.getElementById("skill_"+skillId).className = "skills";
        skills = skills.replace('[' + skillId + ']','');
    }else{
        document.getElementById("skill_"+skillId).className = "skillsSelected"
        skills = skills + '[' + skillId+']';
    }
    document.getElementById('skills').value = skills;
    console.log(skills);
}
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
function createProfile(){
    var base64 = getBase64Image(document.getElementById("imageView"));
    var profile = {
        "name": document.getElementById('name').value,
        "description": document.getElementById('description').value,
        "profilePicture": base64,
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value,
        "mobilePhoneNumber": document.getElementById('mobilePhoneNumber').value,
        "latitude": document.getElementById('latitude').value,
        "longitude": document.getElementById('longitude').value,
        "skills": document.getElementById('skills').value
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
                    document.getElementById('profilePictureCreated').value=data['profilePicture'];
                    lastProfileCreated=data;
                    console.log(lastProfileCreated);
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

/*Pinky*/
function profileToHire(){
    document.querySelector('#Navigator').pushPage('profileHire.html', { data: { title: 'Hiring a Profile' } });
}

function profileToSend() {
    document.querySelector('#Navigator').pushPage('profileSend.html', { data: { title: 'Hiring a Profile' } });
}

function confirmProfile() {
    
    var profileId = 39;
    
    var hours = document.getElementById('noOfHours').value;
    var date = document.getElementById('dateOfRequest').value;
    var prospectId = document.getElementById('prospectIdProfileHire').value;
    var priceHour = document.getElementById('priceHoursProfileHire').value;
    var skillId = "[2]";
    var request = {
        "date": date,
        "fromHour": document.getElementById('fromTime').value,
        "toHour": document.getElementById('toTime').value,
        "hours": hours,
        "priceHour": priceHour,
        "subTotal": priceHour * hours,
        "taxes": priceHour * hours * 0.1,
        "transportation": priceHour * hours * 0.05,
        "total": (priceHour * hours) + (priceHour * hours * 0.1) + (priceHour * hours * 0.05),
        "requiredSkill": skillId,
        "jobTitle": "",
        "description":"",
        "profileId": profileId,
        "prospectId": prospectId
    }
    console.log(request);
    const xhr = new XMLHttpRequest();
    
    xhr.open("POST", "http://18.220.231.8:8080/QuipaServer/services/requestservice/request/");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload = function() {
        try {
            if (this.status === 200) {
                var data = JSON.parse(this.response);
                console.log(data);
                document.querySelector('#Navigator').pushPage('tabbar.html', {data: {title: 'My Requests'}});
                
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
    xhr.send(JSON.stringify(request));
}
/*Pinky*/
