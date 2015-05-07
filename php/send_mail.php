<?php
    $smtp       = $_POST['smtp'];
    $mailClient = $_POST['mailClient'];
    $mailTo     = $_POST['mailTo'];
    $subject    = $_POST['subject'];
    $message    = $_POST['message'];

        // Mail smtp without validation (for gmail smtp)
    /*$headers = 'From: ' . $mailClient;

    ini_set("SMTP", $smtp);
    ini_set("sendmail_from", $mailClient);

    mail($mailTo, $subject, $message, $headers);

    echo 'success';*/
    
        // PHPMailer smtp with validation (for godaddy smtp)
    require 'class.phpmailer.php';

        // PHPMailer smtp.
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->isHTML(true);
    $mail->Host             = $smtp;
    $mail->WordWrap         = 50;
    $mail->SMTPAuth         = true;
    $mail->SMTPSecure       = 'ssl';
    $mail->Port             = 465;
    $mail->Username         = 'admin@biggestwinnertracker.com';
    $mail->Password         = 'password';
    $mail->SMTPDebug        = 1;
    $mail->SetFrom          = 'Biggest Winner';
    $mail->FromName         = 'Biggest Winner';

    $mail->AddAddress('browerjosiah@gmail.com');

    $mail->Subject = $subject;
    $mail->Body    = $message;

    if (!$mail->send())
        echo 'ERROR: ' . $mail->errorInfo;   
    else
        echo 'success';

    exit();
?>