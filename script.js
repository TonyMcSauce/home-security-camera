```javascript
/* ==========================================
   SENTINEL // HOME SECURITY
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

    document.getElementById("currentTime").textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });

    document.getElementById("currentDate").textContent =
        now.toLocaleDateString([], {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}

updateClock();

setInterval(updateClock, 1000);


/* ==========================================
   UI STATE
========================================== */

function setCameraOnline() {

    cameraStatus.textContent = "LIVE";

    statusDot.parentElement.classList.add("live");

    recordIndicator.classList.add("live");

    feedState.textContent = "LIVE";

    cameraCardStatus.textContent = "Online";

    cameraIndicator.style.background = "var(--accent)";

    startButton.disabled = true;

    stopButton.disabled = false;
}


function setCameraOffline() {

    cameraStatus.textContent = "STANDBY";

    statusDot.parentElement.classList.remove("live");

    recordIndicator.classList.remove("live");

    feedState.textContent = "OFFLINE";

    cameraCardStatus.textContent = "Offline";

    cameraIndicator.style.background = "#555b5e";

    startButton.disabled = false;

    stopButton.disabled = true;
}


/* ==========================================
   START CAMERA
========================================== */

async function startCamera() {

    console.log("SENTINEL: Camera start requested");


    /* Browser compatibility check */

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        alert(
            "Camera access is not supported by this browser."
        );

        return;
    }


    /* Prevent multiple streams */

    if (cameraStream) {

        console.log("SENTINEL: Camera already running");

        return;
    }


    try {

        console.log("SENTINEL: Requesting camera permission");


        /*
         * Request access to the device camera.
         *
         * No microphone access is requested.
         */

        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: true,

                audio: false

            });


        console.log(
            "SENTINEL: Camera permission granted"
        );


        /*
         * Send the camera stream
         * into the video element.
         */

        video.srcObject = cameraStream;

        video.style.display = "block";

        placeholder.style.display = "none";


        /*
         * Start playback.
         */

        try {

            await video.play();

        } catch (playError) {

            console.warn(
                "Video autoplay warning:",
                playError
            );

        }


        setCameraOnline();


    } catch (error) {

        console.error(
            "SENTINEL: Camera error",
            error
        );


        /*
         * Reset stream reference.
         */

        cameraStream = null;


        /*
         * Show a useful error to the user.
         */

        if (error.name === "NotAllowedError") {

            alert(
                "Camera access was blocked.\n\n" +
                "Please click the camera icon in Edge's " +
                "address bar and allow camera access for Sentinel."
            );

        }

        else if (error.name === "NotFoundError") {

            alert(
                "No camera was detected on this device."
            );

        }

        else if (error.name === "NotReadableError") {

            alert(
                "The camera is already being used by another application."
            );

        }

        else {

            alert(
                "Unable to access the camera.\n\n" +
                "Error: " +
                error.name
            );
        }

    }

}


/* ==========================================
   STOP CAMERA
========================================== */

function stopCamera() {

    console.log("SENTINEL: Stopping camera");


    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

    }


    cameraStream = null;

    video.srcObject = null;

    video.style.display = "none";

    placeholder.style.display = "flex";


    setCameraOffline();

}


/* ==========================================
   BUTTON EVENTS
========================================== */

startButton.addEventListener(
    "click",
    startCamera
);

stopButton.addEventListener(
    "click",
    stopCamera
);


/* ==========================================
   PAGE CLEANUP
========================================== */

window.addEventListener(
    "beforeunload",
    () => {

        if (cameraStream) {

            cameraStream
                .getTracks()
                .forEach(track => track.stop());

        }

    }
);
```
