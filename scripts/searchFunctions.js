// the "searchFunctions.js" is written by Joseph and includes functions used for the showSearch.html page
//     and other search related functionality of pages (i.e. the search bar on each page).


// add listener to search field in nav bar
// INPUT: no input parameter, but get search bar id
// OUTPUT: none
function getSearchBar() {
    document.getElementById("searchSubmit").addEventListener('click', function () {
        var store = document.getElementById("storeSearch").value;
        //console.log(store);
        window.location.href = "showSearch.html?search=" + store;
    })
}

// function to put text back into search bar. Relies on being able to extract that information from URL
// INPUT: no input parameter, but grabs search terms from URL
// OUTPUT: no return value, but outputs search term text into search bar
function refillSearchBar() {
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var search = (parsedUrl.searchParams.get("search"));

    //console.log(parsedUrl.searchParams.get("storeID"));

    // put search terms back into search bar for user to have for reference (for future searches)
    document.getElementById("storeSearch").value = search;
}

// function for taking search terms from url, and seeing how relevant they are to DB stores.
//     This is done by: 
//      0) separating search term string into list of search term words
//      1) iterating through all stores in DB
//      2) for each store, iterate through each word in the list of search terms, comparing them to a list of tags for that store
//          a) if there's a match b/w search term and store tag, increment a "relevence" counter (each term is weighted the same)
//      3) in this manner compile a list of stores and their relevence to the search (stores of 0 relevence not included on list)
//      4) sort list according to relevence (highest relevance to be displayed first, so in index 0)
//      5) pass list to displayResults() to post results to showSearch.html
// INPUT: no input parameter, but grabs search term information from URL
// OUTPUT: no return value, but calls displayResults() to output search results to showSearch.html
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
            })

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
            });
            //3) separate them back out:
            for (var k = 0; k < list.length; k++) {
                storeArray[k] = list[k].name;
                relevance[k] = list[k].rel;
            }
            displayResults(storeArray);
        })
}

// function that handles displaying information on page (what search terms are used and cards for relevant results).
//     Attach a listener to each card so allow user to click on card and be brought to that page.
// INPUT - storeList: list of store ID's (in correct order of being displayed) to put onto page
// OUTPUT: no return value, but generates store card and appends "resultsBody" id in showSearch
function displayResults(storeList) {
    // grab url
    const parsedUrl = new URL(window.location.href);
    // extract id from url, assign to variable
    var search = (parsedUrl.searchParams.get("search"));
    //console.log(parsedUrl.searchParams.get("storeID"));

    // post search terms on screen. Handle case where nothing was searched (i.e. page visited manually/url tampered with)
    if (search == null) {
        $("#searchTermsFull").text("Oops! You haven't searched anything.");
        $("#errorMessage").text("Please enter some words describing the store you want to find in the search bar above.");
    } else {
        $("#searchTerms").text(search);
    }

    // post relevant stores from search on screen. Handle case where no relevant results were found
    if ((storeList == null) || (storeList.length == 0)) {
        $("#searchTermsSubtitle").text("No relevant stores were found for this search!");
        $("#errorMessage").text("Please check that there are no spelling errors, and consider broadening the search terms used.");
    } else {
        // display results on screen
        for (var j = 0; j < storeList.length; j++) {
            db.collection("storesDatabase")
                .doc(storeList[j]) // get specific store document
                .get() // read
                .then(function (doc) { // display details!
                    var nameS = doc.data().storeInformation.name;
                    var ratingS = doc.data().cumulativeRating * 2;
                    var imageS = doc.data().imageGallery.image1;
                    var addressS = doc.data().storeInformation.address;
                    var phoneS = doc.data().externalLinks.phoneNumber;

                    // handle potential error case
                    if ((ratingS == null) || (ratingS == NaN)) {
                        ratingsS = 0;
                    }

                    var ratingString = "";
                    var halfStar = 0;
                    for (var i = 0; i < 5; i++) {
                        if (i < Math.floor(ratingS / 2)) {
                            ratingString = ratingString + "&#xf005;";
                        } else if ((ratingS % 2 == 1) && !halfStar) {
                            halfStar = 1;
                            ratingString = ratingString + "&#xf123;";
                        } else {
                            ratingString = ratingString + "&#xf006;";
                        }
                    }
                    var codeString = '<div class="card mb-3" id="' + doc.id + '">' +
                        '<div class="row g-0">' +
                        '<div class="col-md-3" style="padding: 10px 10px 0 10px; text-align: center; max-width: 115px;">' +
                        '<img src="' + imageS + '" alt="userIcon" style="width: 100px; height: 100px; display: block;">' +
                        '<p style="display: inline-block" class="star1user fa">' + ratingString + '</p>' +
                        '</div>' +
                        '<div class="col-md-4" style="max-width: 250px">' +
                        '<div class="card-body" style="display: inline-block">' +
                        '<h5 class="card-title username">' + nameS + '</h5>' +
                        '<p class="card-text comment">' + phoneS + '</p>' +
                        '<p class="card-text"><small class="text-muted datePosted">' + addressS + '</small></p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $("#resultsBody").append(codeString);
                    addStoreListener(doc.id);
                })
        }
    }
}

// function for adding listener to results posting on page. Directs user to storeInformation.html with the store ID and search terms
//     in the URL. Change background color of card/cursor displayed when user hovers over card.
// INPUT - id: store ID to put into URL
// OUTPUT: no return value, but redirects user to different page when card is clicked
function addStoreListener(id) {
    document.getElementById(id)
        .addEventListener("click", function () {

            const parsedUrl = new URL(window.location.href);
            var searchID = (parsedUrl.searchParams.get("search"));
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    window.location.href = "storeInformation.html?search=" + searchID + "&" + "storeID=" + id + "&id=" + user.uid;
                } else {

                    window.location.href = "storeInformation.html?search=" + searchID + "&" + "storeID=" + id;
                }
            });
        });

    var div = document.getElementById(id);

    $("#" + id).css("cursor", "pointer");
    $("#" + id).css("background-color", "#f2f2f2");
    $("#" + id).hover(function () {
        $(this).css("background-color", "#d9d9d9");
    }, function () {
        $(this).css("background-color", "#f2f2f2");
    });

}