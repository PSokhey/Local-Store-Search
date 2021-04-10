const parsedUrl = new URL(window.location.href);
        var userID = parsedUrl.searchParams.get("id");
        console.log("Retrieved ID " + userID);

                document.getElementById("profileGo")
                .addEventListener("click", function() {
                    window.location.href="account.html?id=" + userID;
                });


                document.getElementById("helpGo")
                .addEventListener("click", function() {
                    window.location.href="help.html?id=" + userID;
                });