// check if dom is ready
let myqr;
function domReady(fn) {
    if (document.readyState == "complete" || document.readyState == "interactive") {
        setTimeout(fn, 1)

    } else {
        document.addEventListener("DOMContentLoaded", fn)
    }
}
domReady(function () {
    myqr = document.getElementById('qr-result')
    //if qr code found
    function onScanSuccess(decodeText) {
        myqr.innerHTML = `<a href="${decodeText}" target="_blank">${decodeText}</a>`;
        addLink();
    }
    //render your camera
    var htmlscanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 })
    htmlscanner.render(onScanSuccess)
})



// =====================================================================================================

// init DOM elements
const scanElment = document.getElementById('scan');
const historyElement = document.getElementById('ht-list');
const favoriteElement = document.getElementById('fv-list');
const scanResult = document.getElementById('qr-result');
const scanButton = document.getElementById('scan-btn');
const historyBtn = document.getElementById('btn-history');
const favoriteBtn = document.getElementById('btn-favorite');







// hide all
function hideDivs() {
    historyElement.classList.add('hidden')
    scanElment.classList.add('hidden')
    favoriteElement.classList.add('hidden')
    scanResult.classList.add('hidden')
    scanButton.classList.add('hidden')
    historyBtn.classList.add('hidden')
    favoriteBtn.classList.add('hidden')
}

// show scan
function showScan() {

    setTimeout(function () {
        hideDivs()
        scanElment.classList.remove('hidden')
        scanResult.classList.remove('hidden')
        historyBtn.classList.remove('hidden')
        favoriteBtn.classList.remove('hidden')
    }, 1000);
}


// show history
function showHistory() {

    setTimeout(function () {

        hideDivs()
        historyElement.classList.remove('hidden')
        scanButton.classList.remove('hidden')
        favoriteBtn.classList.remove('hidden')
        
        readFromFavorite();
        readFromStorage();
        displayHistory();

    }, 1000);
}

// show favorites 
function showFavorite() {

    setTimeout(function () {
        hideDivs()
        favoriteElement.classList.remove('hidden')
        scanButton.classList.remove('hidden')
        historyBtn.classList.remove('hidden')

        readFromFavorite()
        displayFav();

    }, 1000);

}


// run this only oce
document.addEventListener('DOMContentLoaded', function () {
    // show the scan
    hideDivs()
    scanElment.classList.remove('hidden')
    scanResult.classList.remove('hidden')
    historyBtn.classList.remove('hidden')
    favoriteBtn.classList.remove('hidden')

}, false);


// =====================================================================================================


let globalID = 0;
let user = [];
let favorite = [];



// add qr link to history
function addLink() {

    globalID = globalID + 1


    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    });

    // Check if the link already exists in the user array
    const existingLinkIndex = user.findIndex(entry => entry.link === myqr.innerHTML);

    if (existingLinkIndex !== -1) {
        // If the link exists, update the existing entry
        user[existingLinkIndex].date = formattedDate;
    } else {
        // If the link doesn't exist, add a new entry
        globalID = globalID + 1;
        user.push({
            id: globalID,
            web: "Web URL",
            date: formattedDate,
            link: myqr.innerHTML
        });
    }

    saveToStorage()
}
// add link to favourite
function addFavorite(id) {
    const favoriteLink = user.find(link => link.id === id);

    if (favoriteLink) {
        const indexInFavorite = favorite.findIndex(link => link.id === id);

        if (indexInFavorite === -1) {
            // Link is not in favorites, add it
            favorite.push({
                id: favoriteLink.id,
                web: favoriteLink.web,
                date: favoriteLink.date,
                link: favoriteLink.link
            });

            // Update the icon background color to yellow
            const starIcon = document.getElementById(`starIcon-${id}`);
            if (starIcon) {
                starIcon.classList.add('favorited');
            }
        } else {
            // Link is already in favorites, remove it
            favorite.splice(indexInFavorite, 1);

            // Update the icon background color to default (white)
            const starIcon = document.getElementById(`starIcon-${id}`);
            if (starIcon) {
                starIcon.classList.remove('favorited');
            }
        }

        // Save changes to favorites
        saveToFavorite();
    }
}

// delete a link in history
function removeLink(id) {
    user = user.filter(link => link.id !== id)
    user.reverse();
    saveToStorage()
    showHistory()
}

// delete a link in favorite
function removeFavorite(id) {
    favorite = favorite.filter(link => link.id !== id)
    favorite.reverse();
    saveToFavorite()
    showFavorite()
}

// Function to edit the web link in favorite
function editLink(id) {
    // Find the index of the link with the given ID
    const linkIndex = favorite.findIndex(link => link.id === id);

    // Check if the link with the given ID exists
    if (linkIndex !== -1) {
        // Prompt the user to enter a new name
        const newWeb = prompt('Enter Website title :');

        // Check if the user entered a new name
        if (newWeb !== null) {
            // Update the web property with the new value
            favorite[linkIndex].web = newWeb;

            // Save the updated data to storage and display the updated list
            favorite.reverse();
            saveToFavorite();
            showFavorite();
        }
    }
}

// display history values to the ui
function displayHistory() {

    const linkHistory = document.getElementById('ht-list')


    linkHistory.innerHTML = ''

    linkHistory.innerHTML += `
    
    <div class="hearder-txt">
    <h1>History</h1>
    <h6>-by ZWELLY SITHOLE</h6>
    </div>
`
   // Reverse the user array before displaying
   const reversedUser = [...user].reverse();

    for (let i = 0; i < reversedUser.length; i++) {

        const isInFavorite = favorite.some(link => link.id === reversedUser[i].id);

        linkHistory.innerHTML += `
        <div class="link-box">
            <div class="link-name" id="link-name">
                <svg style="width: 1.5em;height:1.5em" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                    <path
                        d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                    <path
                        d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                </svg>

                <div>
                ${isInFavorite ? (favorite.find(link => link.id === reversedUser[i].id)?.web || reversedUser[i].web) : reversedUser[i].web}
            </div>

            </div>
            <div class="date" id="date">
            ${reversedUser[i].date}
            </div>
            <div class="link" id="link">
            ${reversedUser[i].link}
               
                <div class="opt-icon">
                
                    <svg onclick="addFavorite(${reversedUser[i].id})" id="starIcon-${reversedUser[i].id}"  style="width: 1.5em;height:1.5em;cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" class="bi bi-star ${isInFavorite ? 'favorited' : ''}" viewBox="0 0 16 16">
                        <path
                            d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                    </svg>

                    <svg onclick="removeLink(${reversedUser[i].id})" style="width: 1.5em;height:1.5em;cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" >
                        <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                        <path
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                    </svg>
                </div>
            </div>
        </div>
    
    `
    }

}

// display favorite values to the ui
function displayFav() {

    const linkFavorite = document.getElementById('fv-list')


    linkFavorite.innerHTML = '';


    linkFavorite.innerHTML += `
    <div class="hearder-txt">
    <h1>Favorite</h1>
    <h6>-by ZWELLY SITHOLE</h6>
</div>
`

const reversedUser = [...favorite].reverse();

    for (let i = 0; i < reversedUser.length; i++) {

        linkFavorite.innerHTML += `
        <div class="link-box">
        <div class="link-name" id="link-name">
            <svg style="width: 1.5em;height:1.5em" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                <path
                    d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                <path
                    d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
            </svg>

            <div>${reversedUser[i].web}</div>
        </div>
        <div class="date" id="date">
        ${reversedUser[i].date}
        </div>
        <div class="link" id="link">
        ${reversedUser[i].link}
            <div class="opt-icon">
                <svg onclick="editLink(${reversedUser[i].id})" style="width: 1.5em;height:1.5em;cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                </svg>

                <svg onclick="removeFavorite(${reversedUser[i].id})" style="width: 1.5em;height:1.5em;cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                    <path
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                </svg>
            </div>
        </div>
    </div>
    
    `
    }

}



// save to history  file
function saveToStorage() {
    user.reverse();
    localStorage.setItem('history', JSON.stringify(user));
}
// save to favorite  file
function saveToFavorite() {
    favorite.reverse();
    localStorage.setItem('favorite', JSON.stringify(favorite));
}

// read the history  file
function readFromStorage() {
    if (localStorage.getItem('history')) {
        user = JSON.parse(localStorage.getItem('history'))
    }
}

// read the favorite  file
function readFromFavorite() {
    if (localStorage.getItem('favorite')) {
        favorite = JSON.parse(localStorage.getItem('favorite'))
    }
}

// =====================================================================================================

