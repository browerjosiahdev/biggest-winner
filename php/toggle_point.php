<?php
    $userID      = $_POST['userID'];
    $pointID     = $_POST['pointID'];
    $add         = $_POST['add'];
    $dateCreated = $_POST['dateCreated'];

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo '{"success":false,"message":"error: ' . $mysqli->connect_error . '"}';
        
        exit();
    }
    
    if ($result = $mysqli->query('SELECT id FROM users_points WHERE user_id=' . $userID . ' AND point_id=' . $pointID . ' AND date_created=\'' . $dateCreated . '\''))
    {
        if ($result->num_rows > 0)
        {
            if ($add != 'true')
            {
                $row = $result->fetch_object();
                
                if ($mysqli->query('DELETE FROM users_points WHERE id=' . $row->id))
                    echo '{"success":true,"message":"success: ' . $pointID . ' point was removed from user ' . $userID . ' for ' . $dateCreated . '"}';
                else
                    echo '{"success":false,"message":"error: unable to remove point ' . $pointID . ' from user ' . $userID . ' for ' . $dateCreated . '. Point id ' . $result[0]->id . '"}';
            }
            else
                echo '{"success":false,"message":"error: point already exists"}';
        }
        else
        {
            if ($add == 'true')
            {
                if ($mysqli->query('INSERT INTO users_points (user_id, point_id, date_created) VALUES (' . $userID . ', ' . $pointID . ', \'' . $dateCreated . '\')'))
                    echo '{"success":true,"message":"success: ' . $pointID . ' point was added to user ' . $userID . ' for ' . $dateCreated . '"}';
                else
                    echo '{"success":false,"message":"error: unable to add point ' . $pointID . ' to user ' . $userID . ' for ' . $dateCreated . '"}';  
            }
            else
                echo '{"success":false,"message":"error: point doesn\'t exist"}';
        }
        
        exit();
    }

    $mysqli->close();
?>