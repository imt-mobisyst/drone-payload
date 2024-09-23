let timer;
let seconds = 0;
let loadingMessage = document.getElementById('loading-message');
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
    }).then( async (resp) => {
        if(resp.ok){
            let data = await resp.json()
            let valve = document.getElementById('valve-' + String(currentValve))

            if(data[currentValve].is_open){
                valve.style.backgroundColor = "#6bd653"
                valve.style.boxShadow = "8px 8px #479238"
                valve.children[1].children[1].textContent = "Opened"
            } else {
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

function startTimer() {
    if (!timer) {
        timer = setInterval(updateTimer, 1000);
        //fetch('./dist/ouvrir.php');
        //loadingMessage.style.display = 'flex';
    }
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        //fetch('./dist/fermer.php');
        //loadingMessage.style.display = 'none';
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

