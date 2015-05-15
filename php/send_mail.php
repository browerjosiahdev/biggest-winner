<?php
    include_once('class.phpmailer.php');

    $mailTo     = isset($_POST['mailTo'])? $_POST['mailTo'] : '';
    $subject    = isset($_POST['subject'])? $_POST['subject'] : '';
    $message    = isset($_POST['message'])? $_POST['message'] : '';

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->isHTML(true);
    $mail->Host             = 'smtpout.secureserver.net';
    $mail->WordWrap         = 50;
    $mail->SMTPAuth         = true;
    $mail->SMTPSecure       = 'ssl';
    $mail->Port             = 465;
    $mail->Username         = 'admin@biggestwinnertracker.com';
    $mail->Password         = 'password';
    $mail->SMTPDebug        = 1;
    $mail->SetFrom          = 'admin@biggestwinnertracker.com';
    $mail->FromName         = 'Biggest Winner';

    $arrMailTo = explode(', ', $mailTo);

    for ($inMailTo = 0; $inMailTo < count($arrMailTo); $inMailTo++)
        $mail->AddAddress($arrMailTo[$inMailTo]);
        
    $mail->Subject = $subject;
    $mail->Body    = $message;

    if (!$mail->send())
    {
        /*$errorInfo = explode('"', $mail->errorInfo);
        $errorInfo = implode('\"', $errorInfo);*/
        
        ob_end_clean();
        
        echo '{"success":false,"message":"error: unable to send emails"}';
        exit();
    }

    ob_end_clean();

    echo '{"success":true,"message":"success: emails have been sent"}';
    exit();
?>