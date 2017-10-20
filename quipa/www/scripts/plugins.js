

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

    }

    //SKILL TOGGLE FOR SEARCH PAGE
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
        document.getElementById("latitude").value=lat;
        document.getElementById("longitude").value=long;
        //build map with current latitude and longitude
        buildMap(lat, long);
    }

    function onFail(error) {
        console.log("location error code = " + error.code + " message = " + error.message);
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
        //build map with current latitude and longitude
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
        var prospects = [];
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profile");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = function () {
            try {
                if (this.status === 200) {
                    var data = JSON.parse(this.response);

                    for (var i = 0; i < data.length; i++) {
                        var record = data[i];
                        if (record['profileId'] === 30 || record['profileId'] === 7 || record['profileId'] === 23) {
                            var newContent = [];
                            newContent.push(record['latitude']); //0
                            newContent.push(record['longitude']); //1
                            newContent.push(record['name']); //2
                            newContent.push(record['description']); //3
                            newContent.push(record['priceHour']); //4
                            newContent.push(record['profileId']); //5
                            newContent.push('https://i.imgur.com/KrIHCD2.png'); //6
                            prospects.push(newContent);
                            console.log("Pulling matching content from DB");
                        }

                    }

                    console.log(prospects);

                    //lat, long, prospect info, userid, profilepic
                    for (i = 0; i < prospects.length; i++) {
                            var infowindow = new google.maps.InfoWindow;
                            var d_latlng = { lat: parseFloat(prospects[i][0]), lng: parseFloat(prospects[i][1]) };
                            console.log(d_latlng);
                            var prospect = prospects[i][2] + " is a  " + prospects[i][3] + " changing $" + prospects[i][4] + " per hour";
                            console.log(prospect);
                            var userId = prospects[i][5];
                            var profilePic = prospects[i][6];
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
                } else {
                    console.log(this.status + " " + this.statusText);
                }
            } catch (e) {
                console.log(e.message);
            }
        };

        xhr.onerror = function () {
            console.log(this.status + " " + this.statusText);
        };

        xhr.send();



        //var dummylatlng = [[41.867510, -87.621478, "John Doe, $15/hr", 5, 'https://i.imgur.com/uqvXllH.png'], [41.862603, -87.614828, "Taro Tanaka, $17/hr", 6, 'https://i.imgur.com/KrIHCD2.png']];
        //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';





    }



});
