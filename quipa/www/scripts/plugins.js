

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'login') {
        page.querySelector('#push-button').onclick = function () {
            document.querySelector('#Navigator').pushPage('register.html', { data: { title: 'Register' } });
        };
    } else if (page.id === 'register') {
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        var page = event.target.id;
        getLocation();
    }

    function onSuccess(location) {
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
        navigator.geolocation.getCurrentPosition(onSuccess,
            onFail, {
                timeout: 15000,
                enableHighAccuracy: true
            });
    }

    function buildMap(lat, long) {
        //set combined position for user
        var latlong = new google.maps.LatLng(lat, long);
        //set required options
        var mapOptions = {
            center: latlong,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //build map in map div...
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        //add initial location marker
        var marker = new google.maps.Marker({ position: latlong, map: map });
    }
    });