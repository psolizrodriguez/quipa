var idbSupported = false;
var usersDB;

document.addEventListener("DOMContentLoaded", function () {

    if ("indexedDB" in window) {

        idbSupported = true;
        console.log("IndexedDB is supported.");
    }

    if (idbSupported) {
        var openRequest = indexedDB.open("testDB", 1); //provide DB name and version
        openRequest.onupgradeneeded = function (e) {
            console.log("Upgrading...");
            var thisDB = e.target.result;
            //thisDB is a handler

            if (!thisDB.objectStoreNames.contains("firstObjStore")) {
                thisDB.createObjectStore("firstObjStore");
            }
        }
        openRequest.onsuccess = function (e) {
            console.log("Success!");
            usersDB = e.target.result;
        }
        openRequest.onerror = function (e) {
            console.log("Error");
            console.dir(e);
        }

        /**
        * upgradeneeded used when first opening and when version being changed
        blocked will generally only fire if previous connection never gets closed
        */
    }

}, false);






var openReq = window.indexedDB.open("sampleDatabase");
openReq.onupgradeneeded = function (event) {
    var db = event.target.result;
    sampleItem = {
        firstName: document.getElementById("#firstName").value,
        lastName: document.getElementById("#lastName").value,
        email: document.getElementById("#signUpEmail").value,
        age: document.getElementById("#age").value,
        added_on: new Date()
    };
    var objectStore = db.createObjectStore("User", { autoIncrement: true }); //basically make userID

    objectStore.createIndex("firstName", "firstName", { unique: false }); //same name is ok. lots of John Smiths out there
    objectStore.createIndex("lastName", "lastName", { unique: false })
    objectStore.createIndex("email", "email", { unique: true }) //no dupe accounts

    objectStore.transaction.oncomplete = function (event) {
        //store values in object store
        var userObjStore = db.transaction("User", "readwrite").objectstore("User");
        userObjStore.add(sampleItem);
        addReq.onsuccess = function (event) {
            console.log("Operation completed successfully");
        };
        addReq.onerror = function (event) {
            console.log("Operation failed");
        };
    }
};
openReq.onerror = function (event) {
    console.log("Operation failed");
}
