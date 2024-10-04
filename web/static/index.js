let timers;
let seconds;
let currentValve;
let nbValves = 0;

document.addEventListener('DOMContentLoaded', function () {
    nbValves = globalNbValves;
    seconds = new Array(nbValves).fill(0)
    timers = new Array(nbValves).fill(null)
});

function confirmAction(id) {
    let open = document.getElementById(id).checked // checked = open
    currentValve = id

    if (open) {
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
            let numValve = currentValve.slice(-1)

            if (data[numValve - 1].is_open) {
                startTimer(numValve);
                valve.style.backgroundColor = "#6bd653"
                valve.children[1].children[1].textContent = "Opened"
            } else {
                stopTimer(numValve);
                valve.style.backgroundColor = "#f0f0f0"
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


/******************
 *                *
 * Timers control *
 *                *
 ******************/

function startTimer(numTimer) {
    if (!timers[numTimer - 1]) {
        timers[numTimer - 1] = setInterval(() => updateTimer(numTimer), 1000);
    }
}

function stopTimer(numTimer) {
    if (timers[numTimer - 1]) {
        clearInterval(timers[numTimer - 1]);
        timers[numTimer - 1] = null;
    }
}

function resetTimer(numTimer) {
    seconds[numTimer - 1] = 0;
    updateTimerDisplay(numTimer);
}

function updateTimer(numTimer) {
    seconds[numTimer - 1]++;
    updateTimerDisplay(numTimer);
}

function updateTimerDisplay(numTimer) {
    let idTimer = "timer" + String(numTimer)
    let updateTimer = document.getElementById(idTimer)
    updateTimer.textContent = seconds[numTimer - 1] > 9 ? seconds[numTimer - 1] : "0" + seconds[numTimer - 1];
}


/*******************
 *                 *
 * Connection test *
 *                 *
 *******************/

function toggleDeviceToRpi(isDeviceConnectedToRpi) {
    const deviceToRpiImgOk = document.getElementById('device-to-rpi-ok');
    const deviceToRpiImgNok = document.getElementById('device-to-rpi-nok');

    if (isDeviceConnectedToRpi) {
        deviceToRpiImgNok.hidden = true;
        deviceToRpiImgOk.hidden = false;
    } else {
        deviceToRpiImgNok.hidden = false;
        deviceToRpiImgOk.hidden = true;
    }
}

function toggleRpiToDrone(isRpiConnectedToDrone) {
    const rpiToDroneImgOk = document.getElementById('rpi-to-drone-ok');
    const rpiToDroneImgNok = document.getElementById('rpi-to-drone-nok');

    if (isRpiConnectedToDrone) {
        rpiToDroneImgNok.hidden = true;
        rpiToDroneImgOk.hidden = false;
    } else {
        rpiToDroneImgOk.hidden = true;
        rpiToDroneImgNok.hidden = false;
    }
}

async function updateConnectionStatus() {
    const id = setTimeout(() => { toggleRpiToDrone(false); toggleDeviceToRpi(false); } , 6000)

    await fetch("/check_wifi")
        .then(response => response.json())
        .then(data => {
            // Backend response
            const isDeviceConnectedToRpi = data.deviceToRpi;
            const isRpiConnectedToDrone = data.rpiToDrone;

            toggleDeviceToRpi(isDeviceConnectedToRpi)
            toggleRpiToDrone(isRpiConnectedToDrone)

        })
        .catch(() => { toggleRpiToDrone(false); toggleDeviceToRpi(false); });

    clearTimeout(id)
}

updateConnectionStatus()
setInterval(updateConnectionStatus, 3000); 
