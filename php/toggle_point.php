<?php
    $userID      = $_POST['userID'];
    $pointID     = $_POST['pointID'];
    $add         = $_POST['add'];
    $dateCreated = $_POST['dateCreated'];

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo 'ERROR:', $mysqli->connect_error;
        
        exit();
    }
    
    if ($result = $mysqli->query("SELECT id FROM users_points WHERE user_id=" . $userID . " AND point_id=" . $pointID . " AND date_created='" . $dateCreated . "';"))
    {
        if ($result->num_rows > 0)
        {
            if ($add != 'true')
            {
                if ($mysqli->query("DELETE FROM users_points WHERE user_id=" . $userID . " AND point_id=" . $pointID . " AND date_created='" . $dateCreated . "');"))
                    echo 'success';
                else
                    echo 'ERROR';
            }
            else
                echo 'ERROR: Point already exists.';
        }
        else
        {
            if ($add == 'true')
            {
                if ($mysqli->query("INSERT INTO users_points (user_id, point_id, date_created) VALUES (" . $userID . "," . $pointID . ",'" . $dateCreated . "');"))
                    echo 'success';
                else
                    echo 'ERROR';                
            }
            else
                echo 'ERROR: Point doesn\'t exist.';
        }
        
        exit();
    }

    $mysqli->close();
?>