<?php
    $smtp       = $_POST['smtp'];
    $mailClient = $_POST['mailClient'];
    $mailTo     = $_POST['mailTo'];
    $subject    = $_POST['subject'];
    $message    = $_POST['message'];
    $headers    = 'From: ' . $mailClient;

    ini_set("SMTP", $smtp);
    ini_set("sendmail_from", $mailClient);

    mail($mailTo, $subject, $message, $headers);

    echo 'success';
?>