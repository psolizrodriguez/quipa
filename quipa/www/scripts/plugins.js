﻿(function () {
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


            //GEOLOCATION
            $("#getLocation").on("tap", function (e) {
                e.preventDefault();
                getLocation();
            })
            function getLocation() {
                navigator.geolocation.getCurrentPosition(onSuccess,
                    onFail, {
                        timeout: 15000,
                        enableHighAccuracy: true
                    });
                function onSuccess(location) {
                    var myLatitude = location.coords.latitude;
                    var myLongitude = location.coords.longitude;
                    $("#gps_test").append("<p>my latitude = " + myLatitude + "</p><p>my longitude = " + myLongitude + "</p>");
                }                function onFail(error) {
                    $("#gps_test").append("location error code = " + error.code + " message = " + error.message);
                }
            }            

        }

        //as deviceready returns load onDeviceReady()
        $(document).on("deviceready", onDeviceReady);
    });

})();