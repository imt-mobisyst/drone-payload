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
    reqCurrentValve = htmlId2jsonId(currentValve)

    fetch("", {
        method: "POST",

        body: JSON.stringify({
            open: open,
            valve_nb: reqCurrentValve
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(async (resp) => {
        console.log("Réponse reçue :");
        console.log(resp);

        if (resp.ok) {
            let data = await resp.json()
            let valve = document.getElementById('valve-' + String(currentValve))
            let numValve = currentValve.slice(-1)

            if (data[numValve]["is_open"]) {
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
    let idTimer = "timer" + String(numTimer)
    let updateTimer = document.getElementById(idTimer)
    updateTimer.textContent = seconds[numTimer] > 9 ? seconds[numTimer] : "0" + seconds[numTimer];
}

function htmlId2jsonId(htmlId) {
    // les identifiants de valve commencent à 0 dans le template html
    // les identifiants de valve commencent à 1 dans les requêtes json
    currentNum = Number(htmlId.slice(-1))
    beforeNum = htmlId.slice(0, -1)
    return beforeNum + String(currentNum + 1)
}