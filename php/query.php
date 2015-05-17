<?php
    include_once('class.database.php');

    $strTable        = isset($_POST['table'])? $_POST['table'] : '';
    $strColumns      = isset($_POST['columns'])? $_POST['columns'] : '';
    $strJoin         = isset($_POST['join'])? $_POST['join'] : '';
    $strRestrictions = isset($_POST['restrictions'])? $_POST['restrictions'] : '';
    $strOrder        = isset($_POST['order'])? $_POST['order'] : '';
    $strGroupBy      = isset($_POST['group'])? $_POST['group'] : '';
    $strLimit        = isset($_POST['limit'])? $_POST['limit'] : '';
    $strValues       = isset($_POST['values'])? $_POST['values'] : '';
    $strQuery        = isset($_POST['query'])? $_POST['query'] : '';

    /*$patterns    = array();
    $patterns[0] = "/'(.*?)'/";
    $replace     = array();
    $replace[0]  = 'TOKEN';

    preg_replace($patterns, $replace, $strValues);*/

//echo '{"success":false,"message":"' . $strValues . '"}';
//exit();

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
        case 'DELETE':
            echo $dataBase->delete();
            break;
        case 'UPDATE':
            echo $dataBase->update();
            break;
    }

    exit();
?>