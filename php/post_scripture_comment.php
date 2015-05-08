<?php
    $userID    = $_POST['userID'];
    $userName  = $_POST['userName'];
    $comment   = $_POST['comment'];
    $postID    = $_POST['postID'];

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo '{"success":false,"message":"error: ' . $mysqli->connect_error . '"}';
        
        exit();
    }
    
    if ($mysqli->query('INSERT INTO scriptures_comments (user_id, user_name, post_comment, post_id) VALUES (' . $userID . ', \'' . $userName . '\', \'' . $comment . '\', ' . $postID . ')'))
    {
        echo '{"success":true,"message":"success: scripture comment was added to post ' . $postID . '","postID":' . $postID . '}';
    }
    else
        echo '{"success":false,"message":"error: unable to add scripture comment"}';

    $mysqli->close();
?>