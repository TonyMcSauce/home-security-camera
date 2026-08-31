```javascript
/* ==========================================
   SENTINEL SECURITY
   Camera Controller
========================================== */

const video = document.getElementById("cameraFeed");

const startButton = document.getElementById("startCamera");
const stopButton = document.getElementById("stopCamera");

const placeholder = document.getElementById("cameraPlaceholder");

const cameraStatus = document.getElementById("cameraStatus");
const statusDot = document.getElementById("statusDot");

const feedState = document.getElementById("feedState");

const cameraCardStatus = document.getElementById("cameraCardStatus");
const cameraIndicator = document.getElementById("cameraIndicator");

const recordIndicator = document.querySelector(".record-indicator");

let cameraStream = null;


/* ==========================================
   CLOCK
========================================== */

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    const date = now.toLocaleDateString([], {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    document.getElementById("currentTime").textContent = time;
    document.getElementById("currentDate").textContent = date;
}

updateClock();

setInterval(updateClock, 1000);


/* ==========================================
   START CAMERA
========================================== */

async function startCamera() {

    try {

        /*
         * Ask the browser for camera access.
         *
         * We deliberately request video only.
         * No microphone is required.
         */

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });


        /*
         * Attach the camera stream
         * directly to the video element.
         */

        video.srcObject = cameraStream;

        video.style.display = "block";

        placeholder.style.display = "none";


        /* Update interface */

        cameraStatus.textContent = "LIVE";

        statusDot.parentElement.classList.add("live");

        recordIndicator.classList.add("live");

        feedState.textContent = "LIVE";

        cameraCardStatus.textContent = "Online";

        cameraIndicator.style.background = "var(--accent)";


        /* Button states */

        startButton.disabled = true;
        stopButton.disabled = false;


    } catch (error) {

        console.error("Camera error:", error);


        /*
         * Handle common browser permission errors.
         */

        if (error.name === "NotAllowedError") {

            alert(
                "Camera access was denied.\n\n" +
                "Please allow camera access in your browser settings and try again."
            );

        } else if (error.name === "NotFoundError") {

            alert(
                "No camera was found on this device."
            );

        } else {

            alert(
                "Unable to access the camera.\n\n" +
                error.message
            );
        }
    }
}


/* ==========================================
   STOP CAMERA
========================================== */

function stopCamera() {

    if (cameraStream) {

        cameraStream.getTracks().forEach(track => {
            track.stop();
        });

        cameraStream = null;
    }


    video.srcObject = null;

    video.style.display = "none";

    placeholder.style.display = "flex";


    /* Update interface */

    cameraStatus.textContent = "STANDBY";

    statusDot.parentElement.classList.remove("live");

    recordIndicator.classList.remove("live");

    feedState.textContent = "OFFLINE";

    cameraCardStatus.textContent = "Offline";

    cameraIndicator.style.background = "#555b5e";


    /* Button states */

    startButton.disabled = false;
    stopButton.disabled = true;
}


/* ==========================================
   BUTTON EVENTS
========================================== */

startButton.addEventListener("click", startCamera);

stopButton.addEventListener("click", stopCamera);


/* ==========================================
   CLEANUP
========================================== */

window.addEventListener("beforeunload", () => {

    if (cameraStream) {

        cameraStream.getTracks().forEach(track => {
            track.stop();
        });

    }

});
```
