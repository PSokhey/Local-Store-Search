// the "my_functions.js" is written by Joseph and includes functions used for the customer review section of storeInformation.html
//     and other rating related values functionality of that page.

// Helper function for posting 1 review. Receives review collection, posts specified information and updates number of comments
// INPUT - doc: recieves customer review ID, used to extract information about that review
// OUTPUT: no return value, but creates customer review card and appends card to "comments-go-here" div in storeInformation.html
function displayOneReview(doc) {
    // get customer review information
    var userUID = doc.data().username;
    var usernameR = "";
    var ratingR = doc.data().rating * 2;
    var commentR = doc.data().comment;
    var dateR = doc.data().date;
    var imageR = "https://dummyimage.com/800x400/000/fff&text=Store+Image"; // *** need to change to stored picture...future feature, unique image for user not done.

    // convert UID into username and profile picture
    db.collection("users")
        .doc(userUID)
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
            // create customer review card and put in appropriate section on page
            var codeString = '<div class="card mb-3">' +
                '<div class="row g-0">' +
                '<div class="col-md-3" style="padding: 10px 10px 0 10px; text-align: center; max-width: 115px;">' +
                '<img src="' + imageR + '" alt="userIcon" style="width: 100px; height: 100px; display: block;">' +
                '<p style="display: inline-block" class="star1user fa">' + ratingString + '</p>' +
                '</div>' +
                '<div class="col-md-9" style="max-width: 70%;">' +
                '<div class="card-body">' +
                '<h5 class="card-title username">' + usernameR + '</h5>' +
                '<p class="card-text comment">' + commentR + '</p>' +
                '<p class="card-text"><small class="text-muted datePosted">' + dateR + '</small></p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $("#comments-go-here").append(codeString);
        })
}

// function that runs at on page start to load all comments for this store. Running this function again clears previous reviews.
// INPUT - none
// OUTPUT - no return value, but calls displayOneReview() to post reviews, updateStoreRating() to update * rating, and changes review counter on page 
function displayReviews() {
    // reset reviews that were posted and # reviews counter
    $("#numComment").text(0);
    $("#comments-go-here").text("");

    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var storeID = parsedUrl.searchParams.get("storeID");

    db.collection("storesDatabase")
        .doc(storeID)
        .collection("customerReviews") // store ID that we extracted
        .orderBy("timestamp", "desc")
        .limit(5)
        .get() // REAC async
        .then(function (snap) { // display details!
            snap.forEach(function (doc) {
                displayOneReview(doc)
            })
            // update the store's overall rating
            updateStoreRating();

            // display # of comments
            db.collection("storesDatabase")
                .doc(storeID)
                .collection("customerReviews")
                .get()
                .then(function (test) {
                    if (test.size != null) {
                        $("#numComment").text(test.size);
                    }
                })
        })


}

// function for handling when a new review is posted
// INPUT - no input parameter, listens for "postReview" button to be pressed and captures information from popup window.
// OUTPUT - no return value, but posts new review to DB and calls displayReviews() to update posted customer reviews section.
function createComment() {
    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var storeID = parsedUrl.searchParams.get("storeID");

    //var commentRef = db.collection("test_data_joseph"); // *** using test folder for now
    var commentRef = db.collection("storesDatabase").doc(storeID).collection("customerReviews");

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
// INPUT - inputRating: the value of the slider when it changes
// OUTPUT: no return value, but generates * bar string and posts to "revewRatingValue" element on add review popup
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

// function to post the store rating (the * bar at the top of the page for cumulative rating)
// INPUT: no input parameter, but reads * rating from all customer reviews from DB
// OUTPUT: no return value, but puts calculated * rating string into "storeRating" id element on page and updates DB.
function updateStoreRating() {
    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var storeID = parsedUrl.searchParams.get("storeID");
    var ratingR;
    var sum = 0;
    var divisor = 0;
    db.collection("storesDatabase")
        .doc(storeID)
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
            var ratingRef = db.collection("storesDatabase").doc(storeID);
            ratingRef.set({
                cumulativeRating: average / 2
            }, {
                merge: true
            });
        })
}

// function for adding more data to database; just for testing purposes only
// INPUT: none
// OUTPUT: no return, but writes "stores" to DB
function writeData() {
    var stores = [{
            "cumulativeRating": 0,
            "storeInformation": {
                "name": "Superstar Plumbing",

                "storeBio": "Your go to shop for local plumbing parts and services",
                "address": "7513 Victoria Drive",
                "postalCode": "75282",
                "hours": [
                    "8:00AM - 10:00PM",
                    "8:00AM - 10:00PM",
                    "8:00AM - 10:00PM",
                    "8:00AM - 10:00PM",
                    "8:00AM - 10:00PM",
                    "8:00AM - 9:00PM",
                    "8:00AM - 9:00PM"
                ]
            },
            "externalLinks": {
                "link1": "www.superstar.com",
                "phoneNumber": "604-428-6478",
                "email": "support@superstar.com"
            },
            "imageGallery": {
                "image1": "./images/furniture.jpg"
            } //,
            //"customerReviews": {}
        },
        {
            "cumulativeRating": 0,
            "storeInformation": {
                "name": "Walter's Groceries",
                "storeBio": "Bringing the best produce at a cheap price!",
                "address": "7412 Canada Way",
                "postalCode": "75262",
                "hours": [
                    "9:30AM - 9:00PM",
                    "9:30AM - 9:00PM",
                    "9:30AM - 9:00PM",
                    "9:30AM - 9:00PM",
                    "9:30AM - 9:00PM",
                    "9:30AM - 9:00PM",
                    "9:30AM - 9:00PM"
                ]
            },
            "externalLinks": {
                "link1": "No website",
                "phoneNumber": "604-987-1285 (ext 6)",
                "email": "cleaners@hotmail.com"
            },
            "imageGallery": {
                "image1": "./images/Clothing.jpg"
            } //,
            //"customerReviews": {}
        }
    ];

    stores.forEach(function (oneStore) { //cycle thru json objects in array
        console.log(oneStore); //just to check it out
        db.collection("storesDatabase").add(oneStore)
    })
}