<?php
    $strTable = $_POST['table'];
    $strValue = $_POST['values'];

    $strValue = explode('[eq]', $strValue);
    $strValue = implode('=', $strValue);

        // Connect to the MySQL database.
    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo '{"success":false,"message":"error: ' . rawurlencode($mysqli->connect_error) . '"}';
        
        exit();
    }
    
        // Write out the SELECT query.
    $query       = 'INSERT IGNORE INTO ' . $strTable . ' (';
    $queryValues = '';

    $arrValues = explode(', ', $strValue);
        
    $strData = '{';

    for ($inValue = 0; $inValue < count($arrValues); $inValue++)
    {
        $value = $arrValues[$inValue];   

        $strProp    = explode('=', $value)[0];
        $strPropVal = explode('=', $value)[1];
        
        $query       .= $strProp . ',';
        $queryValues .= $strPropVal . ',';
        
        $strPropVal = explode('\'', $strPropVal);
        $strPropVal = implode('', $strPropVal);
        
        $strData .= '"'. $strProp . '":"' . $strPropVal . '",';
    }

    if (strlen($strData) > 1)
        $strData = substr($strData, 0, -1);

    $strData .= '}';

    $query       = substr($query, 0, -1);
    $queryValues = substr($queryValues, 0, -1);
    $query      .= ') VALUES (' . $queryValues . ')';

//echo '{"success":false,"message":"' . $query . '"}';
//exit();

        // Perform the query.
    if ($mysqli->query($query))
    {
        echo '{"success":true,"message":"success: update to ' . $strTable . ' was successful","data":' . $strData . '}';
    }
    else
        echo '{"success":false,"message":"error: unable to update ' . $strTable . '"}';

    $mysqli->close();

    exit();
?>