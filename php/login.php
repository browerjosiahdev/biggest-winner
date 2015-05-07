<?php
    $userName = $_POST['userName'];
    $password = $_POST['password'];

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo 'ERROR:', $mysqli->connect_error;
        
        exit();
    }
    
    if ($result = $mysqli->query('SELECT id,name FROM users WHERE login="' . $userName . '" AND password="' . $password . '"'))
    {
        $strData = '[';
        
         while ($row = $result->fetch_object())
            $strData .= '{"id":"' . $row->id . '","name":"' . $row->name . '"},';
        
        $strData = substr($strData, 0, -1);
        $strData .= ']';
        
        echo $strData;
        
        exit();
    }

    $mysqli->close();
?>