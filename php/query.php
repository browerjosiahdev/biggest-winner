<?php
    $strTable           = $_POST['queryTable'];
    $strColumns         = $_POST['queryColumns'];
    $strRequirements    = $_POST['queryRequirements'];

    $strRequirements = explode('[eq]', $strRequirements);
    $strRequirements = implode('=', $strRequirements);

    $mysqli = new mysqli($_POST['dbIP'], $_POST['dbUserName'], $_POST['dbPassword'], $_POST['dbName']);

    if ($mysqli->connect_errno) 
    {
        echo '{"success":false,"message":"error: ' . $mysqli->connect_error . '"}';
        
        exit();
    }
    
    $query = 'SELECT ' . $strColumns . ' FROM ' . $strTable;

    if (strlen($strRequirements) > 0)
        $query .= ' WHERE ' . $strRequirements;

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
        
        exit();
    }

    $mysqli->close();
?>