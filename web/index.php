<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="dist/style.css" type="text/css">
    <title>Parasite</title>
</head>

<body>

    <div class="wrapper">

        <div class="logo-container">
            <img src="dist/images/parasite.png" class="logo" alt="Parasite Logo" class="logo">
        </div>

        <div class="timer-container">
            <div class="time-label">
                <p>Timer (s):</p>
                <span id="timer">00</span>
            </div>
            <a class="bouton reset" href="#" onclick="resetTimer(); return false;">
                <img src="dist/images/refresh.svg" style="width:60px;:red;" />
            </a>
        </div>

        <div id="loading-message" style="display: none;">
            <div class="spinner"></div>
            <p>Pumping...</p>
        </div>

        <div class="button-list">
            <a class="bouton ouvrir" href="#" onclick="confirmStartTimer(); return false;">
                <img src="dist/images/open_in_browser.svg" style="width:100px;" />
            </a>
            <a class="bouton fermer" href="#" onclick="confirmStopTimer(); return false;">
                <img src="dist/images/block.svg" style="width:100px;color:white;" />
            </a>
        </div>
    </div>

    <div id="confirmation-modal" class="modal">
        <div class="modal-content">
            <img id="modal-title" src="dist/images/not_started.svg" style="width:60px;color:white;" />
            <p id="modal-message" class="modal-message"></p>
            <div class="modal-buttons">
                <a href="#" class="bouton ouvrir" onclick="confirmAction(); return false;">Yes</a>
                <a href="#" class="bouton fermer" onclick="closeModal(); return false;">No</a>
            </div>
        </div>
    </div>

    <script src="dist/index.js"></script>
</body>

</html>