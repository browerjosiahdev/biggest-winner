<?php
    $userID    = $_POST['userID'];
    $userName  = $_POST['userName'];
    $reference = $_POST['reference'];
    $comment   = $_POST['comment'];

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo 'ERROR:', $mysqli->connect_error;
        
        exit();
    }
    
    if ($mysqli->query('INSERT INTO scriptures (user_id, user_name, post_reference, post_comment) VALUES (' . $userID . ', \'' . $userName . '\', \'' . $reference . '\', \'' . $comment . '\')'))
    {
        echo 'success';
    }
    else
        echo 'ERROR';

    $mysqli->close();
?>