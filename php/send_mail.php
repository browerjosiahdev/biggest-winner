<?php
    $smtp       = $_POST['smtp'];
    $mailClient = $_POST['mailClient'];
    $subject    = $_POST['subject'];
    $message    = $_POST['message'];
    $headers    = 'From: ' . $mailClient;

    ini_set("SMTP", $smtp);
    ini_set("sendmail_from", $mailClient);

    mail($mailClient, $subject, $message, $headers);

    echo 1;
?>