<?php

$command = escapeshellcmd('/home/arthur/IMT/Uvprojet/drone-payload/web/script.py');
$output = shell_exec($command);
echo $output;