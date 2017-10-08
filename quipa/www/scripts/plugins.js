(function () {
    //check for page initialisation and #page1 - page init for jQuery mobile
    $(document).on("pageinit", "#page1", function (e) {
        //prevent any bound defaults
        e.preventDefault();
        //loader function after deviceready event returns
        function onDeviceReady() {

            //CAMERA
            function onSuccess(imageData) {
                var image = document.getElementById('imageView');
                image.src = imageData;
            }

            function onFail(message) {
                alert('Could not complete: ' + message);
            }

            function getPhoto(camera) {
                if (camera === true) {
                    //Use from Camera
                    navigator.camera.getPicture(onSuccess, onFail, {
                        quality: 50,
                        correctOrientation: true,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        destinationType: Camera.DestinationType.FILE_URI
                    });
                }
                else {
                    navigator.camera.getPicture(onSuccess, onFail, {
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        destinationType: Camera.DestinationType.FILE_URI
                    });
                }
            }

            $("#takePhoto").on("tap", function (e) {
                e.preventDefault();
                //show popup options for camera
                $("#photoSelector").popup("open");
            })

            $("#cameraPhoto").on("tap", function (e) {
                e.preventDefault();
                //hide popup options for camera
                $("#photoSelector").popup("close");
                //call getPhoto() to access native device's camera
                getPhoto(true);
            })

            $("#galleryPhoto").on("tap", function (e) {
                e.preventDefault();
                //hide popup options for camera
                $("#photoSelector").popup("close");
                getPhoto(false);
            })
            var address = undefined;
            function updateMap(address) {

                var OnSuccess = function (location) {
                    var mapDiv = document.getElementById("map_canvas");
                    //set size
                    mapDiv.width = window.innerWidth - 30;
                    mapDiv.height = window.innerHeight - 20;
                    //connect plugin to canvas div
                    var map = plugin.google.maps.Map.getMap(mapDiv);
                    alert("line 67 -- type of map " + typeof map);
                    map.setDiv(mapDiv);
                    alert("line 68");
                    //add event listener
                    map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady, onError);
                    alert("line 72");
                    function onMapReady() {
                        //get current lat/long
                        var userLocation = new plugin.google.maps.LatLng(location.coords.latitude, location.coords.longitude);
                        alert("Inside onMapReady");
                        //Set map options
                        map.setOptions({
                            'backgroundColor': 'white',
                            'mapType': plugin.google.maps.MapTypeId.HYBRID,
                            'controls': {
                                'compass': true,
                                'myLocationButton': true,
                                'indoorPicker': true,
                                'zoom': true // Only for Android
                            },
                            'gestures': {
                                'scroll': true,
                                'tilt': true,
                                'rotate': true,
                                'zoom': true
                            },
                            'camera': {
                                'latLng': userLocation,
                                'tilt': 30,
                                'zoom': 15,
                                'bearing': 50
                            },
                            'preferences': {
                                'zoom': {
                                    'minZoom': 15,
                                    'maxZoom': 18
                                },
                                'building': false
                            }
                        });
                        alert("Set options didn't break anything");
                        //add marker for userLocation
                        map.addMarker({
                            'position': userLocation,
                            'title': "You are here."
                        },
                            function (marker) {
                                marker.showInfoWindow();
                            });
                        alert("Reached end of onMapReady");
                    }
                };

                var onError = function (error) {
                    alert("Something has gone wrong. Error: " + error.code + " " + error.message);
                };
                navigator.geolocation.getCurrentPosition(OnSuccess, onError, { enableHighAccuracy: true})
            }


            //map failed to load
            var onError = function (error) {
                alert("Something has gone wrong. Error: " + error.code + " " + error.message);
            };

            var locationButton = document.getElementById("mapButton");
            mapButton.addEventListener("click", onMapping, false);

            function onMapping() {
                alert("Button works!");
                updateMap();
            }

        }

        //as deviceready returns load onDeviceReady()
        $(document).on("deviceready", onDeviceReady);
    });

})();