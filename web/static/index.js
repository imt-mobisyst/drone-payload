let timers = [null, null];
let seconds = [0, 0];

function confirmAction(id) {
    let value = document.getElementById(id)
    fetch("", {
        method: "POST",
        body: JSON.stringify({
            open: value.checked,
            valve_nb: id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(async (resp) => {
        if (resp.ok) {
            let data = await resp.json()
            let valve = document.getElementById('valve-' + String(id))
            let numTimer = id == "v1" ? 0 : 1
            if (data[id].is_open) {
                startTimer(numTimer);
                valve.style.backgroundColor = "#6bd653"
                valve.style.boxShadow = "8px 8px #479238"
                valve.children[1].children[1].textContent = "Opened"
            } else {
                stopTimer(numTimer);
                valve.style.backgroundColor = "#f0f0f0"
                valve.style.boxShadow = "8px 8px #d0d0d0"
                valve.children[1].children[1].textContent = "Closed"
            }
            console.log(data)
            console.log(`Timer ${numTimer} : ${value}`)
        }
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

function startTimer(numTimer) {
    if (!timer[numTimer]) {
        timer[numTimer] = setInterval(() => updateTimer(numTimer), 1000);
    }
}

function stopTimer(numTimer) {
    if (timer[numTimer]) {
        clearInterval(timer[numTimer]);
        timer[numTimer] = null;
    }
}

function resetTimer(numTimer) {
    seconds[numTimer] = 0;
    updateTimerDisplay(numTimer);
}

function updateTimer(numTimer) {
    seconds++;
    updateTimerDisplay(numTimer);
}

function updateTimerDisplay(numTimer) {
    let updateTimer = document.getElementById(numTimer == 0 ? 'timer1' : 'timer2')
    updateTimer.textContent = seconds[numTimer] > 9 ? seconds[numTimer] : "0" + seconds[numTimer];
}

