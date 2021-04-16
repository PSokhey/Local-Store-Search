## My Web Application (Title)

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
A school project where this browser based web application lets users search for a local store they want to find (due to time constraints, the stores included in the database are assumed to be all the small local businesses found in the app users neighborhood). The app has a profile, favorites, search, store information, and help page. Profile is for setting some user information. The search page shows results of any saerch made through the search bar. When a store is selected, users land on the store information page to see the store's information. The favorites page is for "bookmarking" chosen stores, and the help page is to explain FAQ and provide a means of user feedback.
	
## Technologies
Technologies used for this project:
* HTML, CSS
* JavaScript
* Bootstrap 
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── account.html             # profile page for seeing/changing user information and favorites stores (partial list)
├── favorites.html           # dedicated page for viewing user favorited stores (full list)
├── help.html                # documentation for users and provide feedback form
├── login.html               # landing page for letting users make a profile, or sign into their existing profile
├── mainpage.html            # where users land after logging in; prompts user to use search
├── showSearch.html          # page for showing search results
├── storeInformation.html    # page for viewing store information and seeing/adding customer reviews
└── README.md

It has the following subfolders and files:
├── .git                          # Folder for git repo
├── futureFeatures                # Folder for code that may be used in future development
    /deals.html                   # Page for product discounts
    /searchResult.html            # Development of search/sort by distance from user
├── images                        # Folder for images
    /profileImage                 # Folder for handling profile picture
        /upload.php               # File for handling profile picture upload for users (work in progress)
    /01Grocery5.jpg               # Photo by Raysonho:
                                  #    https://upload.wikimedia.org/wikipedia/commons/d/d3/EmpressWalkLoblaws-Vivid.jpg 
    /blah.jpg                     # default image   
    /stationary.jpg               # Photo by Bidgee (Creative Commons Attribution 3.0 Unported license)
                                  #    https://upload.wikimedia.org/wikipedia/commons/f/fc/Dick_Smith_Electronics.jpg 
    /furniture.jpg                # Photo by Creative Home Furnishings:
                                  #    https://www.creativehome.ca/wp-content/uploads/Vancouver-furniture-store-outside-1.jpg
    /Clothing.jpg                 # Photo by Poh Wei Cheun: 
                                  #    https://unsplash.com/s/photos/storefront?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
  
├── scripts                       # Folder for scripts
    /firebase-api-storesearch.js  # Firebase API
    /prabhFunctions.js            # Development scripts before merging with main js file
    /linkFunctions.js             # Scripts for linking buttons to correct app pages
    /customer_review_functions.js # Scripts for handling customer review of store information page
    /searchFunctions.js           # Scripts for handling search bar and search related tasks, sorting algorithm code modified from: 
                                  #   https://stackoverflow.com/questions/11499268/sort-two-arrays-the-same-way used
    /functions.js                 # Scripts for search/sort by distance from user
├── styles                        # Folder for styles
    /blah.css                     # default css file

Firebase hosting files: 
├── .firebaserc...


```

Other credits:
Image for customer reviews/user profile linked from: https://dummyimage.com


Tips for file naming files and folders:
* use lowercase with no spaces
* use dashes (not underscore) for word separation

/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
Joseph Dobrzanski - I worked on a page to add view store information: storeInformation.html

/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
Madhav Ramdev - I worked on a the main page of the website: mainpage.html

/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
Prabhjeet Sokhey - I worked on a page to show search results: SearchResult.html


