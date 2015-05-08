<?php
    $strName        = $_POST['name'];
    $strEmail       = $_POST['email'];
    $strLogin       = $_POST['login'];
    $strPassword    = $_POST['password'];
    $recieveEmails  = 1;

    if ($_POST['recieveEmails'] != 'true')
        $recieveEmails = 0;
        

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo '{"success":false,"message":"error: ' . rawurlencode($mysqli->connect_error) . '"}';
        
        exit();
    }

    if ($result = $mysqli->query("SELECT id FROM users WHERE email='" . $strEmail . "' OR login='" . $strLogin . "'"))
    {
        if ($result->num_rows > 0)
        {
            echo '{"success":false,"message":"error: there is already a user with the given email address and/or login"}';
            
            exit();
        }
    }
    
    if ($mysqli->query('INSERT INTO users (name, email, login, password, recieve_emails) VALUES (\'' . $strName . '\', \'' . $strEmail . '\', \'' . $strLogin . '\', \'' . $strPassword . '\', ' . $recieveEmails . ')'))
    {
        if ($result = $mysqli->query("SELECT id,name FROM users WHERE email='" . $strEmail . "' OR login='" . $strLogin . "'"))
        {
            $strData = '[';
        
             while ($row = $result->fetch_object())
                $strData .= '{"id":"' . $row->id . '","name":"' . $row->name . '"},';

            if (strlen($strData) > 1)
                $strData = substr($strData, 0, -1);
            
            $strData .= ']';

            echo '{"success":true,"message":"success: user was added, and data was retrieved","data":' . $strData . '}';
        
            exit();      
        }
    }

    $mysqli->close();
?>