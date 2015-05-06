<?php
    $userName = $_POST['userName'];
    $password = $_POST['password'];

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo 'Connection failed:', $mysqli->connect_error;
        
        exit();
    }
    
    if ($result = $mysqli->query('SELECT id FROM users WHERE login="' . $userName . '" AND password="' . $password . '"'))
    {
        echo $result->fetch_row()[0];
        
        exit();
    }

    $mysqli->close();
?>