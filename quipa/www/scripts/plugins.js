

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'login') {
        page.querySelector('#push-button').onclick = function () {
            document.querySelector('#Navigator').pushPage('register.html', { data: { title: 'Register' } });

        };
        page.querySelector("#push-peopleMap").onclick = function () {
            console.log("In here");
            document.querySelector('#Navigator').pushPage('peopleMap.html', { date: { title: 'Upload a profile Picture' } });
        };
    } else if (page.id === 'register') {
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        getLocation();
        document.querySelector("#push-pic").onclick = function () {
            document.querySelector('#Navigator').pushPage('profilepic.html', { date: { title: 'Upload a profile Picture' } });
        };
        
    } else if (page.id === 'profilepic') {
        page.querySelector("#cameraPhoto").onclick = function (e) {
            e.preventDefault();
            //call getPhoto() to access native device's camera
            getPhoto(true);
        };
        page.querySelector("#galleryPhoto").onclick = function (e) {
            e.preventDefault();
            getPhoto(false);
        };

    } else if (page.id === 'peopleMap') {
        getSearcherLocation();

        page.querySelector("#dropButton").onclick = function () {
            toggleDrop();
            // Close the dropdown if the user clicks outside of it
            window.onclick = function (event) {
                if (!event.target.matches('.dropbtn')) {

                    var dropdowns = document.getElementsByClassName("dropdown-content");
                    var i;
                    for (i = 0; i < dropdowns.length; i++) {
                        var openDropdown = dropdowns[i];
                        if (openDropdown.classList.contains('show')) {
                            openDropdown.classList.remove('show');
                        }
                    }
                }
            }
        }

        


    }

    function toggleDrop() {
        console.log("Toggled list");
        document.getElementById("myDropdown").classList.toggle("show");
    }


    //LOCATION FUNCTIONS
    function onSuccess(location) {
        console.log("Inside location success call");
        //location recording time
        var locationTime = Date(location.timestamp);
        var lat = location.coords.latitude;
        var long = location.coords.longitude;
        //output result to #location div...
        var locationDiv = document.getElementById("location");
        locationDiv.innerHTML = "<p>You are at: " + lat + " latitude </p><p>and " + long + " longitude</p>";
        //build map with current latitude and longitude
        buildMap(lat, long);
    }

    function onFail(error) {
        document.getElementById("location").innerHTML = "location error code = " + error.code + " message = " + error.message;
    }

    function getLocation() {
        console.log("getLocation fired");
        navigator.geolocation.getCurrentPosition(onSuccess,
            onFail, {
                timeout: 15000,
                enableHighAccuracy: true
            });
    }

    function buildMap(lat, long) {
        //set combined position for user
        console.log("Inside of buildMap");
        var latlong = new google.maps.LatLng(lat, long);
        //set required options
        var mapOptions = {
            center: latlong,
            zoom: 12,
            zoomControl: false,
            gestureHandling: 'none',
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }; //zoom control and gesture handling to keep map from flopping about when user is scrolling
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        //add initial location marker
        var marker = new google.maps.Marker({ position: latlong, map: map });
        console.log("Marker has been added");
    }

    function onSuccessImage(imageData) {
        console.log("Inside on success");
        console.log("imageData is of type " + typeof imageData);
        var image = document.getElementById('imageView');
        image.src = imageData;
    }

    function onFailImage(message) {
        alert('Could not complete: ' + message);
    }

    function getPhoto(camera) {
        console.log("Inside of getPhoto");
        if (camera === true) {
            //Use from Camera
            navigator.camera.getPicture(onSuccessImage, onFailImage, {
                quality: 30,
                correctOrientation: true,
                sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.FILE_URI
            });
        }
        else {
            navigator.camera.getPicture(onSuccessImage, onFailImage, {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI
            });
        }
    }


    //PEOPLE MAP LOCATION FUNCTIONS
    function onSuccessPM(location) {
        console.log("Inside location success call");
        //location recording time
        var locationTime = Date(location.timestamp);
        var lat = location.coords.latitude;
        var long = location.coords.longitude;
        //output result to #location div...
        var locationDiv = document.getElementById("searchLocation");
        locationDiv.innerHTML = "<p>You are at: " + lat + " latitude </p><p>and " + long + " longitude</p>";
        //build map with current latitude and longitude

      //  geocodeLatLng(geocoder, map, infowindow);
       // getWorkers(lat, long);
        buildMapSearch(lat, long);
    }

    function onFailPM(error) {
        document.getElementById("searchLocation").innerHTML = "location error code = " + error.code + " message = " + error.message;
    }

    function getSearcherLocation() {
        console.log("getLocation fired");
        navigator.geolocation.getCurrentPosition(onSuccessPM,
            onFailPM, {
                timeout: 15000,
                enableHighAccuracy: true
            });
    }


    function buildMapSearch(lat, long) {
        //set combined position for user
        console.log("Inside of buildMapSearch");
        var latlong = new google.maps.LatLng(lat, long);
        //set required options
        var mapOptions = {
            center: latlong,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }; 
        var map = new google.maps.Map(document.getElementById("search_map"), mapOptions);
        //add initial location marker
        var marker = new google.maps.Marker({ position: latlong, map: map });
        console.log("Marker has been added");

        var geocoder = new google.maps.Geocoder;
        
        var dummylatlng = [[41.867510, -87.621478, "John Doe, $15/hr", 5, 'https://i.imgur.com/uqvXllH.png'], [41.862603, -87.614828, "Taro Tanaka, $17/hr", 6, 'https://i.imgur.com/KrIHCD2.png']];
        //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

        //lat, long, prospect info, userid, profilepic
        for (i = 0; i < dummylatlng.length; i++){
            for (k = 0; k < dummylatlng[i].length; k++){
                var infowindow = new google.maps.InfoWindow;
                var d_latlng = { lat: parseFloat(dummylatlng[i][0]), lng: parseFloat(dummylatlng[i][1]) };
                var prospect = dummylatlng[i][2];
                var userId = dummylatlng[i][3];
                var profilePic = dummylatlng[i][4];
                map.setZoom(13);
                var marker = new google.maps.Marker({
                    position: d_latlng,
                    icon: profilePic,
                    map: map
                });
                infowindow.setContent(prospect);
                infowindow.open(map, marker);
                marker.addListener('click', function () {
                console.log("Marker clicked!");
                document.querySelector('#Navigator').pushPage('fakeProfile.html', { date: { title: 'Fake Profile' } });
                });
            }
        }
        
        

    }
    


});