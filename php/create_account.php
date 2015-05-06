<?php
    $strName        = $_POST['name'];
    $strEmail       = $_POST['email'];
    $strLogin       = $_POST['login'];
    $strPassword    = $_POST['password'];

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo 'Connection failed:', $mysqli->connect_error;
        
        exit();
    }

    if ($result = $mysqli->query("SELECT id FROM users WHERE email='" . $strEmail . "' OR login='" . $strLogin . "'"))
    {
        if ($result->num_rows > 0)
        {
            echo 'Sorry, there appears to already be a user with the given email address, or login.';
            
            exit();
        }
    }
    
    if ($mysqli->query("INSERT INTO users (name, email, login, password) VALUES ('" . $strName . "', '" . $strEmail . "', '" . $strLogin . "', '" . $strPassword . "')"))
    {
        if ($result = $mysqli->query("SELECT id FROM users WHERE email='" . $strEmail . "' OR login='" . $strLogin . "'"))
        {
            echo $result->fetch_row()[0];
        
            exit();      
        }
    }

    $mysqli->close();
?>