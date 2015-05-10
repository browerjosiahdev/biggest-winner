<?php
    $strTable           = $_POST['table'];
    $strColumns         = $_POST['columns'];
    $strRestrictions    = $_POST['restrictions'];
    $strOrder           = $_POST['order'];

    $strRestrictions = explode('[eq]', $strRestrictions);
    $strRestrictions = implode('=', $strRestrictions);

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo '{"success":false,"message":"error: ' . rawurlencode($mysqli->connect_error) . '"}';
        
        exit();
    }
    
    $query = 'SELECT ' . $strColumns . ' FROM ' . $strTable;

    if (strlen($strRestrictions) > 0)
        $query .= ' WHERE ' . $strRestrictions;

    if (strlen($strOrder) > 0)
        $query .= ' ORDER BY ' . $strOrder;

    if ($result = $mysqli->query($query))
    {
        $arrColumns = explode(', ', $strColumns);
        $strData    = '[';
        
        while ($row = $result->fetch_object())
        {
            $strData .= '{';
            
            for ($inColumn = 0; $inColumn < count($arrColumns); $inColumn++)
            {
                $strData .= '"' . $arrColumns[$inColumn] . '":"' . $row->$arrColumns[$inColumn] . '"';
                
                if (($inColumn + 1) < count($arrColumns))
                    $strData .= ',';
            }
            
            $strData .= '},';
        }
        
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