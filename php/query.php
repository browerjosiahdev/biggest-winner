<?php
    include_once('class.database.php');

    $strTable        = $_POST['table'];
    $strColumns      = $_POST['columns'];
    $strJoin         = $_POST['join'];
    $strRestrictions = $_POST['restrictions'];
    $strOrder        = $_POST['order'];
    $strGroupBy      = $_POST['group'];
    $strLimit        = $_POST['limit'];
    $strValues       = $_POST['values'];
    $strQuery        = $_POST['query'];

    $dataBase        = new DataBase();
    $objParseTable   = $dataBase->parseTable($strTable);
    $objParseColumns = $dataBase->parseColumns($strColumns);

    if ($objParseTable->success == false)
    {
        ob_end_clean();
        
        echo '{"success":false,"message":"error: no columns given to query"}';
        exit();
    }

    if ($objParseColumns->success == false)
    {
        ob_end_clean();
        
        echo '{"success":false,"message":"error: no columns given to query"}';
        exit();
    }

    $dataBase->parseJoin($strJoin);
    $dataBase->parseRestrictions($strRestrictions);
    $dataBase->parseOrderBy($strOrder);
    $dataBase->parseGroupBy($strGroupBy);
    $dataBase->parseLimit($strLimit);
    $dataBase->parseValues($strValues);

    ob_end_clean();
 
    switch ($strQuery)
    {
        case 'SELECT':
            echo $dataBase->select();
            break;
        case 'INSERT':
            echo $dataBase->insert();
            break;
    }

    exit();
?>