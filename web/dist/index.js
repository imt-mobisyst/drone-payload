let timer;
let seconds = 0;
let confirmActionType = "";
let loadingMessage = document.getElementById('loading-message');

function confirmStartTimer() {
    confirmActionType = "start";
    openModal("dist/images/not_started.svg", "Do you want to start the pump ?"); let minutes = 0;
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
    document.getElementById('confirmation-modal').style.display = 'flex';
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
    updateTimerDisplay();
}

function updateTimer() {
    seconds++;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = seconds > 9 ? seconds : "0" + seconds;
}

