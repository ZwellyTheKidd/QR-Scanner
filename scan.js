
        // check if dom is ready
        function domReady(fn){
            if (document.readyState=="complete" || document.readyState == "interactive") {
                setTimeout(fn,1)
                
            }else{
                document.addEventListener("DOMContentLoaded",fn)
            }
        }
        domReady(function() {
            var myqr=document.getElementById('qr-result')
            var lastResult,countResult=0;

            //if qr code found

            function onScanSuccess(decodeText,decodeResult) {
                if (decodeText !== lastResult) {

                    ++countResult;
                    lastResult=decodeText;

                    alert("Your QR is :" + decodeText,decodeResult)

                    myqr.innerHTML=`you scan ${countResult} : ${decodeText}`
                    
                }
                
            }

            //render your camera
            var htmlscanner = new Html5QrcodeScanner("qr-reader",{fps:10,qrbox:250})

            htmlscanner.render(onScanSuccess)
            
        })
   