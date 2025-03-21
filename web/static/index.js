let timers;
let seconds;
let currentValve;
let nbValves = 0;
let config;

window.onload = async function () {
    try {
        console.log('loading json')
        const response = await fetch('/config'); 
        if (!response.ok) {
            throw new Error('Failed to load config.json');
        }
        config = await response.json();
        console.log(config)

        timers = config.timers;
        initializeTimers(); 
    } catch (error) {
        console.error(error);
        timerDuration = 15000; 
    }
};

function initializeTimers() {
    for (let i = 1; i <= nbValves; i++) {
        const timerElement = document.getElementById(`timer${i}`);
        if (timerElement) {
            const timerValue = timers[`valve_v${i}`];
            const value = timerValue !== undefined ? parseInt(timerValue, 10) : 0;
            timerElement.textContent = value > 9 ? value : `0${value}`;
            seconds[i - 1] = value; // Sync seconds array
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    nbValves = globalNbValves;
    seconds = new Array(nbValves).fill(0)
    timers = new Array(nbValves).fill(null)
});
let checkbox;
function confirmAction(id) {
    
    checkbox = document.getElementById(id)
    let open = checkbox.checked // checked = open
    currentValve = id

    if (open) {
        openModal()
        checkbox.disabled = true

        
    }


}

async function toggleStatus() {
    const valveElement = document.getElementById(`valve-${currentValve}`);
    const newStatus = checkbox.checked ? 'open' : 'close';

    // Send request to Python backend
    const response = await fetch('/valve_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            valve: currentValve,
            status: newStatus
        })
    });

    const result = await response.json();

    // Update UI based on Python response
    if (result.confirmed) {
        if (checkbox.checked) {
            valveElement.style.backgroundColor = 'var(--green-color)';
            valveElement.querySelector('p:nth-child(2)').textContent = 'Opened';
        } else {
            valveElement.style.backgroundColor = '';
            valveElement.querySelector('p:nth-child(2)').textContent = 'Closed';
        }
    }
}
async function sendConfigFile() {

    const response = await fetch("/send_config")
}

function openOrClose(open) {
    console.log('runing open or close')
    const timerDuration = 16000;

    let valve_duration_id = "valve_"+currentValve
    let valve_duration_sec = timers[valve_duration_id] 
    let valve_timer = (valve_duration_sec+2) * 1000 
    // toggleStatus()
    fetch("/toggle_valve", {
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
            setTimeout(() => {
                toggleStatus();
            }, 500);
            setTimeout(() => {
                checkbox.checked = false;
                checkbox.disabled = false;
                toggleStatus()
                // Optionally update visuals when timer expires
                stopTimer(numValve);
                valve.style.backgroundColor = "#f0f0f0";
                valve.children[1].children[1].textContent = "Closed";
            }, valve_timer);
            let data = await resp.json()
            let valve = document.getElementById('valve-' + String(currentValve))
            let numValve = currentValve.slice(-1)

            // if (data[numValve - 1].is_open) {
            //     startTimer(numValve);
            //     valve.style.backgroundColor = "#6bd653"
            //     valve.children[1].children[1].textContent = "Opened"
            // } else {
            //     stopTimer(numValve);
            //     valve.style.backgroundColor = "#f0f0f0"
            //     valve.children[1].children[1].textContent = "Closed"
            // }
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
    checkbox.disabled = false
    toggleStatus()
    
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
async function submitTimer(numTimer) {
    const timerSpan = document.getElementById(`timer${numTimer}`);
    let value = timerSpan ? parseInt(timerSpan.textContent, 10) || 0 : 0;
    console.log(value)
    timers['valve_v'+numTimer] = value;
    config.timers = timers;
    console.log(config)
    try {
        const response = await fetch('/save-config', {
            method: 'POST',
            body: JSON.stringify(config),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to save config');
        }
        console.log('Config saved successfully');
    } catch (error) {
        console.error('Error saving config:', error);
    }
    
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
// setInterval(updateConnectionStatus, 3000); 


document.addEventListener('DOMContentLoaded', function () {
    nbValves = globalNbValves;
    seconds = new Array(nbValves).fill(0);
    timers = new Array(nbValves).fill(null);

    for (let i = 1; i <= nbValves; i++) {
        const timerSpan = document.getElementById(`timer${i}`);
        if (timerSpan) {
            timerSpan.addEventListener('dblclick', function () {
                makeTimerEditable(i);
            });
        }
    }
});

function makeTimerEditable(timerIndex) {
    const timerSpan = document.getElementById(`timer${timerIndex}`);
    const currentValue = parseInt(timerSpan.textContent, 10) || 0;

    stopTimer(timerIndex);

    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.style.width = '50px';
    input.style.fontSize = 'inherit';
    input.style.textAlign = 'center';
    input.min = '1'; 

    timerSpan.replaceWith(input);
    input.focus();

    function saveTimerValue() {
        const newValue = parseInt(input.value, 10) || 0;
        seconds[timerIndex - 1] = newValue; 
        const newSpan = document.createElement('span');
        newSpan.className = 'timer';
        newSpan.id = `timer${timerIndex}`;
        newSpan.textContent = newValue > 9 ? newValue : `0${newValue}`; // Pad with zero if < 10
        input.replaceWith(newSpan);

        newSpan.addEventListener('dblclick', function () {
            makeTimerEditable(timerIndex);
        });
    }

    input.addEventListener('blur', saveTimerValue);
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            saveTimerValue();
        }
    });
}
