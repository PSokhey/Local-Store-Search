
// helper function for posting 1 review. Receives review collection, posts specified information and updates number of comments
function displayOneReview(doc) {
    var username = doc.data().username;
    var rating = doc.data().rating;
    var comment = doc.data().comment;

    var newReview = "<p> " + username + " " + rating + " " + comment + "</p>";
    $("#comments-go-here").append(newReview);
    
    var numberComment = +document.getElementById("numComment").innerHTML;
    $("#numComment").text(numberComment+1);
}

// function that runs at on page start to load all comments for this store 
function displayReviews() {
    // reset reviews that were posted and # reviews counter
    $("#numComment").text(0);
    $("#comments-go-here").text("");

    db.collection("test_data_joseph") // *** using test folder for now
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
        // get user information
        firebase.auth().onAuthStateChanged(function (loggedIn) {
            if (loggedIn) {
                db.collection("users")
                    .doc(loggedIn.uid)
                    .get() // read
                    .then(function (doc) { // wait for get() to finish
                        console.log(doc.data().name);
                        reviewUsername = doc.data().name; // grab "name" document information of the user

                        // post review to database
                        commentRef.add({
                            username: reviewUsername,
                            rating: reviewRating,
                            comment: reviewComment,
                            date: reviewDate,
                            //picture: "yvr.jpg"
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