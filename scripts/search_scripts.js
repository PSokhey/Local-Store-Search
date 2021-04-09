// add listener to search field in nav bar
function getSearchBar() {
    document.getElementById("searchSubmit").addEventListener('click', function () {
        var store = document.getElementById("storeSearch").value;
        //console.log(store);
        window.location.href = "showSearch.html?search=" + store;
    })
}
getSearchBar();


// look search words in url and find relevant results
function getResults() {
    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var searchID = (parsedUrl.searchParams.get("search")).toLowerCase();
    // split words from search
    var wordList = searchID.split(" ");
    // array of store ID's to save
    var storeArray = [];
    // how relevant the store is to the search
    var relevance = [];
    var relevanceIndex = 0;
    // flag value so relevant store id only stored once (when search result matches tag for first time)
    var isStored = false;
    db.collection("storesDatabase")
        .get()
        .then(function (store) { // get entire collection of stores

            // iterate through all stores
            store.forEach(function (doc) {

                isStored = false;

                // iterate through each word of search
                wordList.forEach(function (word) {

                    // iteration through store's tags
                    for (var i = 0; i < (doc.data().tags).length; i++) {
                        // see if store's tag words are relevant to search
                        if (doc.data().tags[i] == word) {
                            // if store is already saved, increase relevance rating. Else, add save to list and increment counter
                            if (isStored) {
                                relevance[relevanceIndex]++;
                            } else {
                                isStored = true;
                                storeArray.push(doc.id);
                                relevance.push(1); // use "1" as object being pushed into array (equiv to 0++)
                            }

                        }
                    }
                })

                // if value was stored, increment relevance index
                if (isStored) {
                    relevanceIndex++;
                }
                //console.log(doc.data().tags[1]);
            })

            /* before sort logging
            console.log("storeArray: " + storeArray);
            console.log("relevance: " + relevance);
            */

            // Sort stores according to relevance to search
            // 3 step sorting process modified from: 
            // https://stackoverflow.com/questions/11499268/sort-two-arrays-the-same-way
            //1) combine the arrays:
            var list = [];
            for (var j = 0; j < storeArray.length; j++)
                list.push({
                    'name': storeArray[j],
                    'rel': relevance[j]
                });
            //2) sort (descending order):
            list.sort(function (a, b) {
                return ((a.rel > b.rel) ? -1 : ((a.rel == b.rel) ? 0 : 1));
                //Sort could be modified to, for example, sort on the age 
                // if the name is the same.
            });
            //3) separate them back out:
            for (var k = 0; k < list.length; k++) {
                storeArray[k] = list[k].name;
                relevance[k] = list[k].rel;
            }

            displayResults(storeArray)

            ///* after sort logging
            console.log("storeArray: " + storeArray);
            console.log("relevance: " + relevance);
            console.log("r index: " + relevanceIndex);
            //*/
        })
}

// function that runs at on page start to display results of search 
function displayResults(storeList) {
    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var search = (parsedUrl.searchParams.get("search"));
    console.log(parsedUrl.searchParams.get("storeID"));

    // post search terms on screen. Handle case where nothing was searched (i.e. page visited manually/url tampered with)
    if (search == null) {
        $("#searchTermsFull").text("Oops! You haven't searched anything.");
        $("#errorMessage").text("Please enter some words describing the store you want to find in the search bar above.");
    } else {
        $("#searchTerms").text(search);
    }

    // put search terms back into search bar for user to have for reference (for future searches)
    document.getElementById("storeSearch").value = search;

    // display results on screen

    console.log(search);

    /*
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
            */
}

// helper function for posting 1 review. Receives review collection, posts specified information and updates number of comments
function displayOneResult(doc) {
    var nameS = doc.data().storeInformation.name;
    var ratingS = doc.data().cumulativeRating * 2;
    var imageS = doc.data().imageGallery.image1; // *** need to change to stored picture
    var addressS = doc.data().storeInformation.address;
    var phoneS = doc.data().externalLinks.phoneNumber;

    // handle potential error case
    if ((ratingS == null) || (ratingS == NaN)) {
        ratingsS = 0;
    }


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