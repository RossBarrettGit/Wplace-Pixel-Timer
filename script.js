const pixelsPlacedInput = document.getElementById("pixelsPlaced");
const totalPixelsInput = document.getElementById("totalPixels");
const timeDisplay = document.getElementById("timeDisplay");
const progressBar = document.getElementById("progressBar");

// Add a new element for finish time
let finishTimeDisplay = document.getElementById("finishTimeDisplay");
if (!finishTimeDisplay) {
    finishTimeDisplay = document.createElement("p");
    finishTimeDisplay.id = "finishTimeDisplay";
    timeDisplay.parentNode.appendChild(finishTimeDisplay);
}

let countdownInterval;

function calculateTimeRemaining(pixelsPlaced, totalPixels) {
    const remainingPixels = totalPixels - pixelsPlaced;
    const totalSeconds = remainingPixels * 30;
    return totalSeconds > 0 ? totalSeconds : 0;
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
}

function formatFinishTime(secondsFromNow) {
    if (secondsFromNow <= 0) return "";
    const finishDate = new Date(Date.now() + secondsFromNow * 1000);
    return `Ready at: ${finishDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`;
}

function updateProgressBar(pixelsPlaced, totalPixels) {
    const percentage = totalPixels > 0 ? (pixelsPlaced / totalPixels) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
}

function notifyTimerFinished() {
    const message = "All pixels are ready!";
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Wplace Pixel Timer", {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
        });
    } else {
        alert(message);
    }
}

function startCountdown() {
    clearInterval(countdownInterval);

    let pixelsPlaced = parseInt(pixelsPlacedInput.value) || 0;
    const totalPixels = parseInt(totalPixelsInput.value) || 0;

    if (pixelsPlaced < 0) pixelsPlaced = 0;
    if (pixelsPlaced > totalPixels) pixelsPlaced = totalPixels;

    let remainingSeconds = calculateTimeRemaining(pixelsPlaced, totalPixels);
    updateProgressBar(pixelsPlaced, totalPixels);
    timeDisplay.textContent = remainingSeconds > 0 ? formatTime(remainingSeconds) : "0h 0m 0s";
    finishTimeDisplay.textContent = formatFinishTime(remainingSeconds);

    if (totalPixels === 0) {
        finishTimeDisplay.textContent = "";
        return; // Don't start countdown if total pixels is 0
    }

    countdownInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            // Add a pixel every 30 seconds
            if ((remainingSeconds % 30 === 0) && (pixelsPlaced < totalPixels)) {
                pixelsPlaced++;
            }
            timeDisplay.textContent = formatTime(remainingSeconds);
            finishTimeDisplay.textContent = formatFinishTime(remainingSeconds);
            updateProgressBar(pixelsPlaced, totalPixels);
        } else {
            clearInterval(countdownInterval);
            finishTimeDisplay.textContent = "";
            notifyTimerFinished();
        }
    }, 1000);
}

// Update countdown when user types
pixelsPlacedInput.addEventListener("input", startCountdown);
totalPixelsInput.addEventListener("input", startCountdown);

// Initialize on page load and request notification permission
window.addEventListener("load", () => {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    startCountdown();
});