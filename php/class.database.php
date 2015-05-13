<?php
require 'class.join.php';

class DataBase
{
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Variables.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    protected $p_strTable        = '';
    protected $p_arrColumns      = array();
    protected $p_arrJoins        = array();
    protected $p_arrRestrictions = array();
    protected $p_strGroupBy      = '';
    protected $p_strOrderBy      = '';
    protected $p_intLimit        = 0;
    
    private $s_strIP        = '50.62.209.12';            // IP Address to the MySQL database.
    private $s_strUserName  = 'sysadmin_test';           // User name for the test site.
    private $s_strPassword  = 'ysdM70?8';                // Password for the test site.
    private $s_strDBName    = 'biggest_winner_test';     // Database name for the live site.
    /*private $s_strUserName  = 'sysadmin';                // User name for the live site.
    private $s_strPassword  = 'Zikj3?67';                // Password for the live site.
    private $s_strDBName    = 'biggest_winner';          // Database name for the live site.*/
    
    protected $exceptions   = false;
    
    public function __construct( $exceptions = false )
    {
        this->exceptions = ($exceptions == true);
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Setup Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    
    public function setTable( $strTable )
    {
        $p_strTable = $strTable;
    }
    
    public function addColumn( $strColumn )
    {
         array_push($p_arrColumns, $strColumn);
    }
    
    public function addJoin( $arrTables, $arrValues )
    {
        $join = new Join();
        $join->addTables($arrTables);
        $join->addValues($arrValues);
        
        array_push($p_arrJoins, $join);
    }
}
?>