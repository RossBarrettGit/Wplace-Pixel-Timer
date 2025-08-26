const pixelsPlacedInput = document.getElementById("pixelsPlaced");
const totalPixelsInput = document.getElementById("totalPixels");
const timeDisplay = document.getElementById("timeDisplay");
const progressBar = document.getElementById("progressBar");

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

function updateProgressBar(pixelsPlaced, totalPixels) {
    const percentage = totalPixels > 0 ? (pixelsPlaced / totalPixels) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
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

    if (totalPixels === 0) return; // Don't start countdown if total pixels is 0

    countdownInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            // Add a pixel every 30 seconds
            if ((remainingSeconds % 30 === 0) && (pixelsPlaced < totalPixels)) {
                pixelsPlaced++;
            }
            timeDisplay.textContent = formatTime(remainingSeconds);
            updateProgressBar(pixelsPlaced, totalPixels);
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

// Update countdown when user types
pixelsPlacedInput.addEventListener("input", startCountdown);
totalPixelsInput.addEventListener("input", startCountdown);

// Initialize on page load
window.addEventListener("load", startCountdown);
