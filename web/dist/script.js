let timer;
let seconds = 0;
let minutes = 0;
let hours = 0;
let confirmActionType = "";
let loadingMessage = document.getElementById('loading-message');

function confirmStartTimer() {
    confirmActionType = "start";
    openModal("dist/images/not_started.svg", "Do you want to start the pump ?");
}

function confirmStopTimer() {
    confirmActionType = "stop";
    openModal("dist/images/stop_circle.svg", "Do you want to stop the pump?");
}

function confirmAction() {
    if (confirmActionType === "start") {
        startTimer();
    } else if (confirmActionType === "stop") {
        stopTimer();
    }
    closeModal();
}

function openModal(title, message) {
    document.getElementById('modal-title').src = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('confirmation-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
}

function startTimer() {
    if (!timer) {
        timer = setInterval(updateTimer, 1000);
        fetch('./dist/ouvrir.php');
        loadingMessage.style.display = 'flex';
    }
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        fetch('./dist/fermer.php');
        loadingMessage.style.display = 'none';
    }
}

function resetTimer() {
    seconds = 0;
    minutes = 0;
    hours = 0;
    updateTimerDisplay();
}

function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    updateTimerDisplay();
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent =
        (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" +
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
        (seconds > 9 ? seconds : "0" + seconds);
}

