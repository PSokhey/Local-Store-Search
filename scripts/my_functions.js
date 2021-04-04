// helper function for posting 1 review. Receives review collection, posts specified information and updates number of comments
function displayOneReview(doc) {


    var userUID = doc.data().username;
    var usernameR = "";
    var ratingR = doc.data().rating * 2;
    var commentR = doc.data().comment;
    var dateR = doc.data().date;
    var imageR = "https://dummyimage.com/800x400/000/fff&text=Store+Image"; // *** need to change to stored picture

    // convert UID into username and profile picture
    db.collection("users").doc(userUID)
        .get()
        .then(function (snap) {
            usernameR = snap.data().name;
            // GET IMAGE URL HERE
            var ratingString = "";
            var halfStar = 0;
            for (var i = 0; i < 5; i++) {
                if (i < Math.floor(ratingR / 2)) {
                    ratingString = ratingString + "&#xf005;";
                } else if ((ratingR % 2 == 1) && !halfStar) {
                    halfStar = 1;
                    ratingString = ratingString + "&#xf123;";
                } else {
                    ratingString = ratingString + "&#xf006;";
                }
            }
            var codeString = '<div class="card mb-3">' +
                '<div class="row g-0">' +
                '<div class="col-md-3" style="padding: 10px 10px 0 10px; text-align: center; max-width: 115px;">' +
                '<img src="' + imageR + '" alt="userIcon" style="width: 100px; height: 100px; display: block;">' +
                '<p style="display: inline-block" class="star1user fa">' + ratingString + '</p>' +
                '</div>' +
                '<div class="col-md-9">' +
                '<div class="card-body">' +
                '<h5 class="card-title username">' + usernameR + '</h5>' +
                '<p class="card-text comment">' + commentR + '</p>' +
                '<p class="card-text"><small class="text-muted datePosted">' + dateR + '</small></p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $("#comments-go-here").append(codeString);

            var numberComment = +document.getElementById("numComment").innerHTML;
            $("#numComment").text(numberComment + 1);
        })


}

// function that runs at on page start to load all comments for this store 
function displayReviews() {
    // reset reviews that were posted and # reviews counter
    $("#numComment").text(0);
    $("#comments-go-here").text("");

    db.collection("test_data_joseph") // *** using test folder for now
        .orderBy("timestamp", "desc").limit(5)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                displayOneReview(doc)
            })
        })
}
displayReviews();

// function for handling when a new review is posted
function createComment() {
    var commentRef = db.collection("test_data_joseph"); // *** using test folder for now

    // when a new reivew is posted, capture information about the review
    document.getElementById("postReview").addEventListener('click', function () {
        var d = new Date();
        var reviewDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var reviewRating = document.getElementById("reviewRating").value / 2;
        var reviewComment = document.getElementById("comment").value;
        var reviewUsername = "";
        var reviewTimeStamp = d.valueOf();
        // get user information
        firebase.auth().onAuthStateChanged(function (loggedIn) {
            if (loggedIn) {
                db.collection("users")
                    .doc(loggedIn.uid)
                    .get() // read
                    .then(function (doc) { // wait for get() to finish
                        console.log(doc.data().name);
                        reviewUsername = loggedIn.uid; // grab "name" document information of the user

                        // post review to database
                        commentRef.add({
                            username: reviewUsername,
                            rating: reviewRating,
                            comment: reviewComment,
                            date: reviewDate,
                            timestamp: reviewTimeStamp
                        });
                        // update reviews
                        displayReviews()
                    })
            }
        })
    })
}
createComment();

// function for updating rating value of slider when adding new reviews
function updateRating(inputRating) {
    var halfStar = 0;
    var rating = "";
    for (var i = 0; i < 5; i++) {
        if (i < Math.floor(inputRating / 2)) {
            //console.log("star");
            rating = rating + "&#xf005;";
        } else if ((inputRating % 2 == 1) && !halfStar) {
            //console.log("halfstar");
            halfStar = 1;
            rating = rating + "&#xf123;";
        } else {
            //console.log("empty");
            rating = rating + "&#xf006;";
        }
    }
    document.getElementById("reviewRatingValue").innerHTML = rating;
}




function writeData() {
    //this is an array of JSON objects copied from open source data
    var stores = [{
            "datasetid": "web-cam-url-links",
            "recordid": "01d6f80e6ee6e7f801d2b88ad7517bd05223e790",
            "fields": {
                "url": "http://images.drivebc.ca/bchighwaycam/pub/html/www/17.html",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.136736007805,
                        49.2972589838826
                    ]
                },
                "mapid": "TCM015",
                "name": "Stanley Park Causeway"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "d95ead494c2afbb5f47efdc26bf3ea8c6b8b2e22",
            "fields": {
                "url": "http://images.drivebc.ca/bchighwaycam/pub/html/www/20.html",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.129968,
                        49.324891
                    ]
                },
                "mapid": "TCM017",
                "name": "North End 2"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "8651b55b799cac55f9b74d654a88f3500b6acd64",
            "fields": {
                "url": "https://trafficcams.vancouver.ca/cambie49.htm",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.116492357278,
                        49.2261139995231
                    ]
                },
                "mapid": "TCM024",
                "name": "Cambie St and W 49th Av",
                "geo_local_area": "Oakridge"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "f66fa2c58d19e3f28cf8b842bfa1db073e32e71b",
            "fields": {
                "url": "https://trafficcams.vancouver.ca/cambie41.htm",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.116192190431,
                        49.2335434721856
                    ]
                },
                "mapid": "TCM025",
                "name": "Cambie St and W 41st Av",
                "geo_local_area": "South Cambie"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "7c3afe1d3fe4c80f24260a4946abea3fb15b7017",
            "fields": {
                "url": "https://trafficcams.vancouver.ca/cambie25.htm",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.115406053889,
                        49.248990875309
                    ]
                },
                "mapid": "TCM026",
                "name": "Cambie St and W King Edward Av",
                "geo_local_area": "South Cambie"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "7fea7df524a205c0c0eb8efcc273345356cbe8d1",
            "fields": {
                "url": "https://trafficcams.vancouver.ca/mainTerminal.htm",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.100028035364,
                        49.2727762979223
                    ]
                },
                "mapid": "TCM028",
                "name": "Main St and Terminal Av",
                "geo_local_area": "Downtown"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        }
    ];

    stores.forEach(function (oneStore) { //cycle thru json objects in array
        console.log(oneStore); //just to check it out
        db.collection("webcams").add(oneStore) //add this new document
            .then(function (oneStore) { //success 
                console.log("wrote to webcams collection " + doc.id);
            })
    })
}