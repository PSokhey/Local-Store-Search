// function readQuote() {
//     db.collection("dummy").doc("readTest")
//         .onSnapshot(function (snap) {
//             console.log(snap.data());
//            // document.getElementById("quote-goes-here").innerHTML = snap.data().message;
//         })
// }
//readQuote();


function writeStores() {
    var storesRef = db.collection("Stores");
    storesRef.add({

        name: "Larry's Shop",
        Rating: "4.5",
        distance: 5
    });
    storesRef.add({

        name: "Bob's Shop",
        Rating: "5.0",
        distance: 7
    });
    storesRef.add({

        name: "Max's Shop",
        Rating: "3.8",
        distance: 8
    });
    storesRef.add({

        name: "Tyler's Shop",
        Rating: "4.2",
        distance: 3
    });
    storesRef.add({

        name: "Hendry's Shop",
        Rating: "4.0",
        distance: 4
    });
    storesRef.add({

        name: "Smith's Shop",
        Rating: "3.5",
        distance: 10
    });

}
//writeStores();


// function storesQuery() {
//     db.collection("Stores")
//         // .where("distance", ">", 5)
//         //.where("hemisphere", "==", "south")
//         //.limit(2)
//         //.orderBy("population")
//         // .orderBy("distance", "desc")
//         .get()
//         .then(function (snap) {
//             snap.forEach(function (abc) {
//                 var n = abc.data().name;
//                 var rate = abc.data().Rating;
//                 var dist = abc.data().distance;
//                 console.log(n);
//                 console.log(dist);
//                 var newdom = "<p> " + n + " " + rate + " " + dist + "</p>";


//                 // let table = `<table class='table table-striped table-hover'><thead><thead><tr><th scope='col'>` + n + `</th>
//                 // <th scope='col'>` + dist + `</th>></thead><tbody>`;

//                 // table = table + "</tbody></table>";
//                 $("#stores-goes-here").append(newdom);
//                 // document.getElementById("stores-goes-here").innerHTML = newdom;

//             })
//         })
// }
// storesQuery();

function writeDeals() {
    var storesRef = db.collection("Deals");
    storesRef.add({

        name: "Larry's Shop",
        deal: "50% off"
    });
    storesRef.add({

        name: "Bob's Shop",
        deal: "20% off"
    });
    storesRef.add({

        name: "Max's Shop",
        deal: "30% off"
    });

}

function dealsQuery() {
    db.collection("Deals")
        //.where("population", ">", 1000000)
        //.where("hemisphere", "==", "south")
        //.limit(2)
        //.orderBy("population")
        //.orderBy("population", "desc")
        .get()
        .then(function (abc) {
            abc.forEach(function (doc) {
                var n = doc.data().name;
                var dl = doc.data().deal;
                console.log(n);
                var neww = "<p> " + n + " " + dl + "</p>";
                $("#deals-goes-here").append(neww);
                //document.getElementById("cities-go-here").innerHTML = newdom;
            })
        })
}
// dealsQuery();


function ShowStoresCollection() {
    db.collection("Stores")
        .orderBy("distance", "asc")
        .get() //get whole collection
        .then(function (snap) {

            snap.forEach(function (doc) { //cycle thru each doc 
                // do something with each document
                var nm = doc.data().name;
                var rate = doc.data().Rating;
                var dist = doc.data().distance;

                // construct the string for card
                var codestring = `
           
            
              <tr class ="row-link">
                <td>` + nm + `</td>
                <td>` + dist + `</td>
                <td>` + rate + `</td>
              </tr>
              `;
                $("#stores-goes-here").append(codestring);
                // append with jquery to DOM

                $(".row-link").click(function() {
                    window.location = "storeInformation.html";
                });

            })


        })
}
// showStoresCollection();

