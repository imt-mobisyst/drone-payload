let timers = [null, null];
let seconds = [0, 0];
let currentValve;

function confirmAction(id) {
    let value = document.getElementById(id).checked
    currentValve = id

    if (value) {
        openModal()
    } else {
        openOrClose(open = false)
    }
}

function openOrClose(open) {
    fetch("", {
        method: "POST",

        body: JSON.stringify({
            open: open,
            valve_nb: currentValve
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(async (resp) => {
        if (resp.ok) {
            let data = await resp.json()
            let valve = document.getElementById('valve-' + String(currentValve))
            let numTimer = id == "v1" ? 0 : 1

            if (data[currentValve].is_open) {
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
        }
    });

    document.getElementById('confirmation-modal').style.display = 'none';
}

function openModal() {
    document.getElementById('confirmation-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
    let button = document.getElementById(currentValve)

    button.checked = false
}

function startTimer(numTimer) {
    if (!timers[numTimer]) {
        timers[numTimer] = setInterval(() => updateTimer(numTimer), 1000);
    }
}

function stopTimer(numTimer) {
    if (timers[numTimer]) {
        clearInterval(timers[numTimer]);
        timers[numTimer] = null;
    }
}

function resetTimer(numTimer) {
    seconds[numTimer] = 0;
    updateTimerDisplay(numTimer);
}

function updateTimer(numTimer) {
    seconds[numTimer]++;
    updateTimerDisplay(numTimer);
}

function updateTimerDisplay(numTimer) {
    let updateTimer = document.getElementById(numTimer == 0 ? 'timer1' : 'timer2')
    console.log(seconds);
    updateTimer.textContent = seconds[numTimer] > 9 ? seconds[numTimer] : "0" + seconds[numTimer];
}

