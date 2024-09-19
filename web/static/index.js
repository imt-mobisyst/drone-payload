let timer;
let seconds = 0;
let confirmActionType = "";
let loadingMessage = document.getElementById('loading-message');

function confirmStartTimer() {
    confirmActionType = "start";
    openModal("static/images/not_started.svg", "Do you want to start the pump ?");
}

function confirmStopTimer() {
    confirmActionType = "stop";
    openModal("static/images/stop_circle.svg", "Do you want to stop the pump?");
}

function confirmAction() {
    if (confirmActionType === "start") {
        startTimer();
        action = 0
    } else if (confirmActionType === "stop") {
        stopTimer();
        action = 1
    }
    fetch("", {
        method: "POST",
        body: JSON.stringify({
          action: action,
          valve_nb: "v1"
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    }).then( async (resp) => {
      let data = await resp.json()
      let valves_buttons = document.getElementById('button-list')

      console.log(data)
      data.foreach((valve) => console.log(valve))
    });
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
        //fetch('./dist/ouvrir.php');
        loadingMessage.style.display = 'flex';
    }
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        //fetch('./dist/fermer.php');
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

