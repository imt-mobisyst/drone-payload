<?php

$command = escapeshellcmd('../python/fermer.py');
$output = shell_exec($command);
echo $output;