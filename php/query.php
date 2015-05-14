<?php
    include_once('class.database.php');

    $strTable           = $_POST['table'];
    $arrColumns         = explode(', ', $_POST['columns']);
    $arrJoin            = explode(', ', $_POST['join']);
    $arrRestrictions    = explode(', ', $_POST['restrictions']);
    $strOrder           = $_POST['order'];
    $strGroupBy         = $_POST['group'];
    $strLimit           = $_POST['limit'];

    $dataBase = new DataBase();
    $dataBase->setTable($strTable);



    for ($inColumns = 0; $inColumns < count($arrColumns); $inColumns++)
        $dataBase->addColumn($arrColumns[$inColumns]);

    if (count($arrJoin) > 0)
        $dataBase->addJoin($arrJoin[0], $arrJoin[1]);      

    for ($inRestrictions = 0; $inRestrictions < count($arrRestrictions); $inRestrictions++)
    {
        $strRestriction = $arrRestrictions[$inRestrictions];
        $strRestriction = explode('[eq]', $strRestriction);
        $strRestriction = implode('=', $strRestriction);                 
        
        $dataBase->addRestriction($strRestriction);        
    }

    if (strlen($strOrder) > 0)
        $dataBase->setOrderBy($strOrder);

    if (strlen($strGroupBy) > 0)
        $dataBase->setGroupBy($strGroupBy);

    if (strlen($strLimit) > 0)
        $dataBase->setGroupBy($strLimit);

//echo '{"success":false,"message":"' . $strTable . '"}';
//exit(); 

    echo $dataBase->select();

    exit();

    /*$strTable           = $_POST['table'];
    $strColumns         = $_POST['columns'];
    $strRestrictions    = $_POST['restrictions'];
    $strOrder           = $_POST['order'];
    $strGroupBy         = $_POST['group'];
    $strJoin            = $_POST['join'];
        
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

    exit();*/
?>