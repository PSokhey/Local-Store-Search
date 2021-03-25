/*
function sayHello() {
    firebase.auth().onAuthStateChanged(function(somebody_tag_thing) {
        if (somebody_tag_thing) {
            console.log(somebody_tag_thing.uid); // display uid info of user on console

            db.collection("users")
            .doc(somebody_tag_thing.uid)
            .get()                          // read
            .then(function(doc) {           // wait for get() to finish
                console.log(doc.data().name);
                var n = doc.data().name;    // grab "name" document information of the user. If multiple items, need a for each loop
                $("#name-goes-here").text(n);// using JQ, stick information of "n" variable into the <span> of id "name-goes-here"


                // get other things and do other things for this user
            })                           
        }
    })

}
//sayHello(); // run when the page loads
*/
function citiesQuery() {
    db.collection("cities")
        .where("population", ">", 1000000) // filter
        //.where("hemisphere", "==", "south")
        //.limit(1)                                   // restrict how many results appear (top "n")
        //.orderBy("population")
        .orderBy("population", "desc") // put in descending order
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) { // looping through a collection (when you don't specify a doc, you get a collection instead)
                var n = doc.data().name;
                var pop = doc.data().population;
                console.log(n);
                var newdom = "<p> " + n + " " + pop + "</p>";
                $("#cities-go-here").append(newdom);
                //document.getElementById("cities-go-here").innerHTML = newdom;
            })
        })
}
//citiesQuery();

function displayReviews() {
    var numComment = 0;

    db.collection("test_data_joseph")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var username = doc.data().username;
                var rating = doc.data().rating;
                var comment = doc.data().comment;

                var newReview = "<p> " + username + " " + rating + " " + comment + "</p>";
                $("#comments-go-here").append(newReview);

                var test = "";

                numComment++;

                /*
                console.log(username);
                console.log(rating);
                console.log(comment);
                */
            })
            $("#numComment").text(numComment);
        })
}
displayReviews();

function createComment() {
    var commentRef = db.collection("test_data_joseph");


    // when a new reivew is posted, capture information about the review
    document.getElementById("postReview").addEventListener('click', function () {
        var d = new Date();
        var postedDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var rating = document.getElementById("reviewRating").value / 2;
        var comment = document.getElementById("comment").value;
        var username = "";

        firebase.auth().onAuthStateChanged(function (loggedIn) {
            if (loggedIn) {
                console.log(loggedIn.uid); // display uid info of user on console

                db.collection("users")
                    .doc(loggedIn.uid)
                    .get() // read
                    .then(function (doc) { // wait for get() to finish
                        console.log(doc.data().name);
                        username = doc.data().name; // grab "name" document information of the user
                        //$("#name-goes-here").text(n); // using JQ, stick information of "n" variable into the <span> of id "name-goes-here"
                    })
            }
        })
    })





    /*
        commentRef.add({
            username: "new user ID",
            rating: 5.0,
            comment: "Best experience I ever had",
            date: "2021-03-24",
            //picture: "yvr.jpg"
        });
        */
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