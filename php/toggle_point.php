<?php
    $userID     = $_POST['userID'];
    $pointID    = $_POST['pointID'];
    $add        = $_POST['add'];

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo 'ERROR:', $mysqli->connect_error;
        
        exit();
    }
    
    if ($result = $mysqli->query('SELECT id FROM users_points WHERE user_id=' . $userID . ' AND point_id=' . $pointID . ' AND DATE(date_created)=CURDATE()'))
    {
        if ($result->num_rows > 0)
        {
            if ($add != 'true')
                $mysqli->query('DELETE FROM users_points WHERE user_id=' . $userID . ' AND point_id=' . $pointID . ' AND DATE(date_created)=CURDATE()');
        }
        else
        {
            if ($add == 'true')
                $mysqli->query('INSERT INTO users_points (user_id, point_id) VALUES (' . $userID . ', ' . $pointID . ')');
        }
        
        echo 'success';
        
        exit();
    }

    $mysqli->close();
?>