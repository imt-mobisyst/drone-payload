<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="dist/style.css" type="text/css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <title>Parasite</title>
</head>

<body>
    <div class="timer-wrapper">
        <img src="dist/parasite.png" class="logo" alt="Parasite Logo" class="logo">
        <div class="timer-container">
            <div id="timer">00:00:00</div>
            <a class="bouton reset" href="#" onclick="resetTimer(); return false;">
                <i class="material-icons" style="font-size:60px;color:white;">refresh</i>
            </a>
        </div>
        <div id="loading-message" style="display: none;">
            <div class="spinner"></div>
            <p>Pumping...</p>
        </div>
        <div style="display: flex; justify-content: center; gap: 30px;">
            <a class="bouton ouvrir" href="#" onclick="confirmStartTimer(); return false;">
                <i class="material-icons" style="font-size:100px;color:white;">open_in_browser</i>
                <i></i>
            </a>
            <a class="bouton fermer" href="#" onclick="confirmStopTimer(); return false;">
                <i class="material-icons" style="font-size:100px;color:white;">block</i>
            </a>
        </div>
    </div>

    <div id="confirmation-modal" class="modal">
        <div class="modal-content">
            <i id="modal-title" class="material-icons" style="font-size:60px;color:white;">not_started</i>
            <p id="modal-message" class="modal-message"></p>
            <div class="modal-buttons">
                <a href="#" class="bouton ouvrir" onclick="confirmAction(); return false;">Yes</a>
                <a href="#" class="bouton fermer" onclick="closeModal(); return false;">No</a>
            </div>
        </div>
    </div>

    <script src="dist/script.js"></script>
</body>

</html>