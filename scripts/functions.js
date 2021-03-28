


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
        distance: "5 km"
    });
    storesRef.add({
        
        name: "Bob's Shop",             
        distance: "7 km"
    });
    storesRef.add({
        
        name: "Max's Shop",             
        distance: "8 km"
    });

}
//writeStores();