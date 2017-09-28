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
