<?php

include_once('class.join.php');
include_once('class.restriction.php');

class DataBase
{
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Variables.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    protected $_strTable        = '';
    protected $_arrColumns      = array();
    protected $_joins           = null;
    protected $_restrictions    = null;
    protected $_strGroupBy      = '';
    protected $_strOrderBy      = '';
    protected $_intLimit        = 0;
    
    private $_strIP        = '50.62.209.12';            // IP Address to the MySQL database.
    private $_strUserName  = 'sysadmin_test';           // User name for the test site.
    private $_strPassword  = 'ysdM70?8';                // Password for the test site.
    private $_strDBName    = 'biggest_winner_test';     // Database name for the live site.
    /*private $_strUserName  = 'sysadmin';                // User name for the live site.
    private $_strPassword  = 'Zikj3?67';                // Password for the live site.
    private $_strDBName    = 'biggest_winner';          // Database name for the live site.*/
    private $_mysqli       = null;
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Setup Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    
    public function setTable( $strTable )
    {
        $_strTable = $strTable;
    }
    
    public function addColumn( $strColumn )
    {
        $_arrColumns[] = $strColumn;
    }
    
    public function addJoin( $arrTables, $arrValues )
    {
        if ($_joins == null)
            $_joins = new Join();
        
        $_joins->addTables($arrTables);
        $_joins->addValues($arrValues);
    }
    
    public function addRestriction( $strRestrictions )
    {
        if ($_restrictions == null)
            $_restrictions = new Restriction();
        
        $_restrictions->addRestrictions($strRestrictions);
    }
    
    public function setGroupBy( $strGroupBy )
    {
        $_strGroupBy = $strGroupBy;   
    }
    
    public function setOrderBy( $strOrderBy )
    {
        $_strOrderBy = $strOrderBy;   
    }
    
    public function setLimit( $intLimit )
    {
        $_intLimit = $intLimit;      
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Query Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
    
    private function connect()
    {
        
return true;        
        
        $_mysqli = new mysqli($_strIP, $_strUserName, $_strPassword, $_strDBName);   
        
        if ($_mysqli->connect_errno)
            return false;   
        
        return true;
    }
    
    public function select()
    {        
        if ($this->connect() == true)
        {   
            
return '{"success":false,"message":"' . count($_arrColumns) . '"}';            
            
            $strColumns = implode(',', $_arrColumns);
                        
            $strQuery  = 'SELECT ';
            $strQuery .= '(' . $strColumns . ') ';
            
return '{"success":false,"message":"' . $strQuery . '"}';            
            
            $strQuery .= 'FROM ' . $_strTable;            
            
return '{"success":false,"message":"' . $strQuery . '"}';            
            
            if ($_joins != null)
                $strQuery .= ' JOIN ' . $_joins->getString();
            
            if ($_restrictions != null)
                $strQuery .= ' WHERE ' . $_restrictions->getString();
            
            if (strlen($_strGroupBy) > 0)
                $strQuery .= ' GROUP BY ' . $_strGroupBy;
            
            if (strlen($_strOrderBy) > 0)
                $strQuery .= ' ORDER BY ' . $_strOrderBy;
            
            if ($_intLimit > 0)
                $strQuery .= ' LIMIT ' . $_intLimit;
            
return '{"success":false,"message":"' . $strQuery . '"}';            
            
            if ($result = $_mysqli->query($strQuery))
            {
                $strData = '[';

                while ($row = $result->fetch_array())
                {
                    $strData .= '{';

                    for ($inColumn = 0; $inColumn < count($_arrColumns); $inColumn++)
                    {
                        $strColumnID = $_arrColumns[$inColumn];
                        $strColumnID = explode('.', $strColumnID);
                        $strColumnID = implode('_', $strColumnID);

                        $strData .= '"' . $strColumnID . '":"' . $row[$inColumn] . '",';
                    }
                    
                    if (count($_arrColumns) > 0)
                        $strData = substr($strData, 0, -1);
                    
                    $strData .= '},';
                }

                if (strlen($strData) > 1)
                    $strData = substr($strData, 0, -1);

                $strData .= ']';
                
                $_mysqli->close();
                
                return '{"success":true,"message":"success: query was successfull","data":' . $strData . '}';
            }
        }
        else
            return '{"success":false,"message":"error: unable to process query due to database connection issue"}';
        
        $_mysqli->close();
        
        return '{"success":false,"message":"error: unable to process query due to query error"}';
    }
}
                        
?>