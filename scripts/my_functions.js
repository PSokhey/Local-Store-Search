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

    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var id = parsedUrl.searchParams.get("id");

    db.collection("storesDatabase")
        .doc(id)
        .collection("customerReviews") // store ID that we extracted
        .get() // REAC async
        .then(function (snap) { // display details!
            snap.forEach(function (doc) {
                displayOneReview(doc)
            })
            // update the store's overall rating
            updateStoreRating();
        })
}
displayReviews();


// function for handling when a new review is posted
function createComment() {

    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var id = parsedUrl.searchParams.get("id");

    //var commentRef = db.collection("test_data_joseph"); // *** using test folder for now
    var commentRef = db.collection("storesDatabase").doc(id).collection("customerReviews");

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

// function to post the store rating 
function updateStoreRating() {
    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var id = parsedUrl.searchParams.get("id");

    var ratingR;
    var sum = 0;
    var divisor = 0;
    db.collection("storesDatabase")
        .doc(id)
        .collection("customerReviews")
        .get() // REAC async
        .then(function (snap) { // display details!
            // add together all ratings
            snap.forEach(function (doc) {
                sum += doc.data().rating * 2;
                divisor++;
            })

            // if there is at least 1 customer review, calculate the average rating
            if (divisor != 0) {
                var average = sum / divisor;
            }

            // create string for star rating and put into appropriate tag on page
            var halfStar = 0;
            var rating = "";
            for (var i = 0; i < 5; i++) {
                if (i < Math.floor(average / 2)) {
                    //console.log("star");
                    rating = rating + "&#xf005;";
                } else if ((average % 2 == 1) && !halfStar) {
                    //console.log("halfstar");
                    halfStar = 1;
                    rating = rating + "&#xf123;";
                } else {
                    //console.log("empty");
                    rating = rating + "&#xf006;";
                }
            }

            // append number of reviews to star rating, making "review" plural/singular where appropriate
            rating += " " + divisor + " Review" + ((divisor == 1) ? "" : "s");
            document.getElementById("storeRating").innerHTML = rating;

            // write/update cumulative rating to database
            var ratingRef = db.collection("storesDatabase").doc(id);
            ratingRef.set({
                cumulativeRating: average / 2
            }, { merge: true });
        })
}


function writeData() {
    //this is an array of JSON objects copied from open source data
    var stores = [{
            "storeInformation": {
                "name": "Digikey",
                "rating": "4.5",
                "storeBio": "This is an online store that sells over 100,000 different electronic componenets to customers around the world! One-deay shipping if orders are placed before 15:00 EST for locations in North America.",
                "address": "889 East 57th Avenue",
                "postalCode": "V1R 7G8",
                "hours": [
                    "8:00AM - 15:00PM",
                    "8:00AM - 15:00PM",
                    "8:00AM - 15:00PM",
                    "8:00AM - 15:00PM",
                    "8:00AM - 15:00PM",
                    "9:00AM - 17:00PM",
                    "9:00AM - 17:00PM"
                ]
            },
            "externalLinks": {
                "link1": "www.digikey.com",
                "phoneNumber": "1-800-344-4539",
                "email": "sales@digikey.com"
            },
            "imageGallery": {
                "image1": "./images/01Grocery5.jpg"
            } //,
            //"customerReviews": {}
        },
        {
            "storeInformation": {
                "name": "Newark",
                "rating": "4.8",
                "storeBio": "Choose from a vast selection of industrial, commercial, and consumer grade electronic products. No shipping charges will be applied for orders over $150CAD! Worldwide shipping is available.",
                "address": "1600 Pennsylvania Avenue NW",
                "postalCode": "37188",
                "hours": [
                    "8:00AM - 20:00PM",
                    "8:00AM - 20:00PM",
                    "8:00AM - 17:30PM",
                    "8:00AM - 20:00PM",
                    "8:00AM - 20:00PM",
                    "10:00AM - 21:00PM",
                    "11:30AM - 21:00PM"
                ]
            },
            "externalLinks": {
                "link1": "www.canada.newark.com",
                "phoneNumber": "1-800-639-2758",
                "email": "order@newark.com"
            },
            "imageGallery": {
                "image1": "./images/furniture.jpg"
            } //,
            //"customerReviews": {}
        }
    ];

    stores.forEach(function (oneStore) { //cycle thru json objects in array
        console.log(oneStore); //just to check it out
        db.collection("storesDatabase").add(oneStore)
    })
}