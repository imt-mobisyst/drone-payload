<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="dist/style.css" type="text/css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <title>Station Parasite</title>
</head>

<body>
    <div class="wrapper">
        <img src="dist/parasite.png" alt="Parasite Logo" class="logo">
        <h1>Station Parasite</h1>
        <div class="timer-container">
            <div id="timer">00:00:00</div>
            <a class="bouton reset" href="#" onclick="resetTimer(); return false;">
                <i class="material-icons" style="font-size:60px;color:white;">refresh</i>
            </a>
        </div>
        <div id="loading-message" style="display: none;">
            <div class="spinner"></div>
            <p>Pump is pumping...</p>
        </div>
        <div class="buttons">
            <a class="bouton ouvrir" href="#" onclick="confirmStartTimer(); return false;">
                <i class="material-icons" style="font-size:100px;color:white;">open_in_browser</i>
            </a>
            <a class="bouton fermer" href="#" onclick="confirmStopTimer(); return false;">
                <i class="material-icons" style="font-size:100px;color:white;">block</i>
            </a>
        </div>
    </div>

    <div id="confirmation-modal" class="modal">
        <div class="modal-content">
            <h2 id="modal-title" class="modalMessage"></h2>
            <p id="modal-message" class="modalMessage"></p>
            <div class="modal-buttons">
                <a href="#" class="bouton" id="confirm-yes" onclick="confirmAction(); return false;">Yes</a>
                <a href="#" class="bouton" id="confirm-no" onclick="closeModal(); return false;">No</a>
            </div>
        </div>
    </div>

    <script>
        let timer;
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        let confirmActionType = "";
        let loadingMessage = document.getElementById('loading-message');

        function confirmStartTimer() {
            confirmActionType = "start";
            openModal("Start Timer", "Do you want to start the pump ?");
        }

        function confirmStopTimer() {
            confirmActionType = "stop";
            openModal("Stop Timer", "Do you want to stop the pump?");
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
            document.getElementById('modal-title').textContent = title;
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
            stopTimer();
            seconds = 0;
            minutes = 0;
            hours = 0;
            updateTimerDisplay();
            loadingMessage.style.display = 'none';
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
    </script>
</body>

</html>