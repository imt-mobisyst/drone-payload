<?php

$command = escapeshellcmd('../python/ouvrir.py');
$output = shell_exec($command);
echo $output;