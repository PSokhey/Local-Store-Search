// my experimental functions here bere combining with main javascript folder


// function will keep track of user's UID on any page they are in. 
function sayHello() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            console.log(user.uid);
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;
                    console.log(n);
                    //$("#username").text(n);
                   // document.getElementById("username").innerText = n;
                })

                document.getElementById("profileGo")
                .addEventListener("click", function() {
                    window.location.href="account.html?id=" + user.uid;
                });

        } else {
            // No user is signed in.
        }
    });
}
sayHello();