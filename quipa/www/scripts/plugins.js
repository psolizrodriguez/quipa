

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'login') {
        page.querySelector('#push-button').onclick = function () {
            getLocation();
            document.querySelector('#Navigator').pushPage('register.html', { data: { title: 'Register' } });

        };
        page.querySelector("#push-peopleMap").onclick = function () {
            console.log("In here");
            document.querySelector('#Navigator').pushPage('peopleMap.html', { date: { title: 'Upload a profile Picture' } });
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
                if (!event.target.matches('.dropbtn')){

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
    /*Pinky*/
    else if (page.id === 'profileHire') {
         
      var modal = document.querySelector('ons-modal');
      modal.show();
        
    }
    else if (page.id === 'profileSend') {

        var date = new Date();

        var currentHours = date.getHours();
        currentHours = ("0" + currentHours).slice(-2);

        var currentMinutes = date.getMinutes();
        currentMinutes = ("0" + currentMinutes).slice(-2);

        $('#fromTime').val(currentHours + ':' + currentMinutes);
        $('#toTime').val(currentHours + ':' + currentMinutes);

    }else if (page.id == "requestHired") {
    
          var modal = document.querySelector('ons-modal');
          modal.show();
                          
     }
      
    /*Pinky*/

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

document.addEventListener('show', function(event) {
  var page = event.target;
  
  if (page.id == "requestHired") {
      
      var modal = document.querySelector('ons-modal');
      modal.show();
                          
      var profileId = 1;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/requestservice/request?profileId="+profileId);
      xhr.setRequestHeader("Accept", "application/json");
      
      xhr.onload = function() {
                          
          modal.hide();
          try {
              if (this.status === 200) {
                  
                  var data = JSON.parse(this.response);
                  console.log(JSON.stringify(data));
                          
                          
                  var element = document.getElementById("myrequestContent");
                  element.innerHTML = '';
                          
                  for(var i=0; i< data.length; i++) {
                          
                      var currentItem = data[i];
                      var statusColor = "green";
                      if(currentItem['status'].toLowerCase() === 'pending') {
                          statusColor = "orange";
                      }
                          
                      element.appendChild(ons.createElement(
                                                            '<ons-list-item>' +
                                                            '<div class="center">' +
                                                            '<div style="width:100%;">' +
                                                            '<span style="float:left;line-height: 50px;font-size:18px;font-weight:bold;">Kelly Blackwell</span>' +
                                                            '</div>' +
                                                            '<div style="width:100%;">' +
                                                            '<img src="http://placekitten.com/g/30/30" style="float:left;">' +
                                                            '<span style="float:left;margin-left:20px;line-height: 30px;font-size:18px;font-weight:bold;">for '+ currentItem['hours'] +' hours</span>' +
                                                            '</div>' +
                                                            '<div  style="width:100%;height:40px;">' +
                                                            '<span style="float:left;font-size:20px;line-height: 40px;">on </span>' +
                                                            '<span style="float:right;padding-right:20px;font-size:18px;line-height: 40px;font-weight:bold;">10-19-2017</span>' +
                                                            '</div><br/><br/>' +
                                                            '<div  style="width:100%;height:30px;">' +
                                                            '<span style="float:left;font-size:20px;line-height: 30px;">from</span>' +
                                                            '<span style="float:right;font-weight:bold;font-size:18px;padding-right:20px;">'+ currentItem['fromHour'] +'</span>' +
                                                            '</div><br/><br/>' +
                                                            '<div  style="width:100%;height:30px;">' +
                                                            '<span style="float:left;font-size:20px;line-height: 30px;">to</span>' +
                                                            '<span style="float:right;font-weight:bold;font-size:18px;padding-right:20px;">'+ currentItem['toHour'] +'</span>' +
                                                            '</div><br/><br/>' +
                                                            '<div  style="width:100%;height:30px;">' +
                                                            '<span style="float:left;font-size:20px;line-height: 30px;">Total</span>' +
                                                            '<span style="float:right;font-weight:bold;font-size:18px;padding-right:20px;">$'+ currentItem['total'] +'</span>' +
                                                            '</div>' +
                                                            '</div>' +
                                                            '<div class="right">' +
                                                            '<div style="float:left;width:120px;">' +
                                                            '<img src="http://placekitten.com/g/120/120" />' +
                                                            '<br clear="all"/><br clear="all"/>' +
                                                            '<div style="float:left;width:100%;">' +
                                                            '<ons-button onclick="" modifier="large" style="background:' + statusColor +';">'+ currentItem['status'] +'</ons-button>' +
                                                            '</div>' +
                                                            '</div>' +
                                                            '</div>' +
                                                            '</ons-list-item>'
                                                            ));
                          
                  }
              }
          } catch (e) {
              console.log(e.message);
          }
      };
      xhr.onerror = function() {
          modal.hide();
          console.log(this.status + " " + this.statusText);
      };
      xhr.send();
                          
  }else if (page.id === 'profileHire') {
                      
      var modal = document.querySelector('ons-modal');
      modal.show();
                          
      var profileId = 37;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profile/"+profileId);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
                          
          modal.hide();
          try {
              if (this.status === 200) {
                  $('#star').raty({ 'score': 4, 'readonly': true });
                          
                  numReviews = 20;
                  var data = JSON.parse(this.response);
                  document.getElementById('numReviews').innerHTML = numReviews + " Reviews";
                  document.getElementById('profileName').innerHTML = data.name;
                  document.getElementById('profileDescription').innerHTML = data.description;
                  var profileImage = document.getElementById('profileImage');
                  profileImage.setAttribute('src', data.profilePicture);
                  var parentDiv = document.getElementById('thumbs');
                  
                  var hourlyRate = document.getElementById('hourlyRate');
                  hourlyRate.innerHTML =  "$" + data.priceHour;
                  hourlyRate.setAttribute('style', 'text-align:left;font-size:5;font-weight:bold');
      
                  var obj = {
                              1: "images/computer.png",
                              2: "images/cooker.png",
                              3: "images/hair_stylist.png",
                              4: "images/handyman.png",
                              5: "images/mechanic.png",
                              6: "images/painter.png",
                              7: "images/telephonist.png",
                              8: "images/tutor.png",
                              9: "images/waitress.png"
      
                              };
                  var skillnum = data.skills.length/3;
                  if (skillnum !=0){
                      var num = 1;
                      for(i=1; i<=skillnum; i++){
                          var ahref = document.createElement("a");
                          ahref.setAttribute('href', '#');
                          var img = document.createElement("img");
                          img.setAttribute('src', obj[data.skills[num]]);
                          img.setAttribute('style', 'margin-left:10px;');
                          num = num+3;
                          ahref.appendChild(img);
                          parentDiv.appendChild(ahref);
                      }
                  }
              }
      
          } catch (e) {
              console.log(e.message);
          }
      };
      xhr.onerror = function() {
          modal.hide();
          console.log(this.status + " " + this.statusText);
      };
      xhr.send();
  }
});

