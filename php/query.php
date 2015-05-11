<?php
    $strTable           = $_POST['table'];
    $strColumns         = $_POST['columns'];
    $strRestrictions    = $_POST['restrictions'];
    $strOrder           = $_POST['order'];
    $strGroupBy         = $_POST['group'];
    $strJoin            = $_POST['join'];

        // Replace the [eq] tokens with the = symbol.
    $strRestrictions = explode('[eq]', $strRestrictions);
    $strRestrictions = implode('=', $strRestrictions);

        // Connect to the MySQL database.
    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo '{"success":false,"message":"error: ' . rawurlencode($mysqli->connect_error) . '"}';
        
        exit();
    }
    
        // Write out the SELECT query.
    $query = 'SELECT ' . $strColumns . ' FROM ' . $strTable;

    if (strlen($strJoin) > 0)
        $query .= ' JOIN ' . $strJoin;

    if (strlen($strRestrictions) > 0)
        $query .= ' WHERE ' . $strRestrictions;
    
    if (strlen($strGroupBy) > 0)
        $query .= ' GROUP BY ' . $strGroupBy;

    if (strlen($strOrder) > 0)
        $query .= ' ORDER BY ' . $strOrder;

//echo '{"success":false,"message":"' . $query . '"}';
//exit();

        // Perform the query.
    if ($result = $mysqli->query($query))
    {
            // Gather the queried data into a JSON formatted string.
        $arrColumns = explode(', ', $strColumns);
        $strData    = '[';
        
        while ($row = $result->fetch_array())
        {
            $strData .= '{';
         
            for ($inColumn = 0; $inColumn < count($arrColumns); $inColumn++)
            {
                $strColumnID = $arrColumns[$inColumn];
                $strColumnID = explode(' AS', $strColumnID)[0];
                
                if ($strColumnID == 'COUNT(*)')
                    $strColumnID = 'count';
                
                $strColumnID = explode('.', $strColumnID);
                $strColumnID = implode('_', $strColumnID);
                
                $strData .= '"' . $strColumnID . '":"' . $row[$inColumn] . '"';
                
                if (($inColumn + 1) < count($arrColumns))
                    $strData .= ',';
            }
            
            $strData .= '},';
        }
        
            // Remove the last comma from the array of json data.
        if (strlen($strData) > 1)
            $strData = substr($strData, 0, -1);
        
        $strData .= ']';
        
        echo '{"success":true,"message":"success: query was successfull","data":' . $strData . '}';
    }
    else
        echo '{"success":false,"message":"error: unable to process query"}';

    $mysqli->close();

    exit();
?>