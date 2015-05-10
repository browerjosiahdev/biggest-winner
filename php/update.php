<?php
    $strTable           = $_POST['table'];
    $strUpdate          = $_POST['updates'];
    $strRestrictions    = $_POST['restrictions'];

    $strRestrictions = explode('[eq]', $strRestrictions);
    $strRestrictions = implode('=', $strRestrictions);

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo '{"success":false,"message":"error: ' . rawurlencode($mysqli->connect_error) . '"}';
        
        exit();
    }
    
    $query = 'UPDATE ' . $strTable . ' SET ' . $strUpdate;

    if (strlen($strRestrictions) > 0)
        $query .= ' WHERE ' . $strRestrictions;

    if ($mysqli->query($query))   
        echo '{"success":true,"message":"success: update was successfull"}';
    else
        echo '{"success":false,"message":"error: unable to update table"}';

    $mysqli->close();

    exit();
?>