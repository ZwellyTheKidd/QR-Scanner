// check if dom is ready
let myqr ;
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
        myqr.innerHTML = `<a href="${decodeText}">${decodeText}</a>`,
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

    setTimeout(function() {
        hideDivs()
        scanElment.classList.remove('hidden')
        scanResult.classList.remove('hidden')
        historyBtn.classList.remove('hidden')
        favoriteBtn.classList.remove('hidden')
    }, 1000); 
}


// show history
function showHistory() {

    setTimeout(function() {
        hideDivs()
        historyElement.classList.remove('hidden')
        scanButton.classList.remove('hidden')
        favoriteBtn.classList.remove('hidden')
    }, 1000); 
}

// show favorites 
function showFavorite() {

    setTimeout(function() {
        hideDivs()
        favoriteElement.classList.remove('hidden')
        scanButton.classList.remove('hidden')
        historyBtn.classList.remove('hidden')
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
const user= [];


// add qr link
function addLink() {

    globalID = globalID + 1

    user.push({
        id: globalID,
        web: "Web URL",
        date: new Date().toLocaleDateString(),
        link: myqr.innerHTML
      });

    saveToStorage()
}


function saveToStorage() {
    localStorage.setItem('history', JSON.stringify(user));
}

function readFromStorage() {
    if (localStorage.getItem('history')) {
        state.transactions = JSON.parse(localStorage.getItem('history'))
    }

}

