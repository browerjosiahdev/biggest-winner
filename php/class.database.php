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
        $this->_strTable = $strTable;
    }
    
    public function addColumn( $strColumn )
    {
        $this->_arrColumns[] = $strColumn;
    }
    
    public function addJoin( $arrTables, $arrValues )
    {
        if ($this->_joins == null)
            $this->_joins = new Join();
        
        $this->_joins->addTables($arrTables);
        $this->_joins->addValues($arrValues);
    }
    
    public function addRestriction( $strRestrictions )
    {
        if ($this->_restrictions == null)
            $this->_restrictions = new Restriction();
        
        $this->_restrictions->addRestrictions($strRestrictions);
    }
    
    public function setGroupBy( $strGroupBy )
    {
        $this->_strGroupBy = $strGroupBy;   
    }
    
    public function setOrderBy( $strOrderBy )
    {
        $this->_strOrderBy = $strOrderBy;   
    }
    
    public function setLimit( $intLimit )
    {
        $this->_intLimit = $intLimit;      
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Query Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
    
    private function connect()
    {      
        $this->_mysqli = new mysqli($this->_strIP, $this->_strUserName, $this->_strPassword, $this->_strDBName);                   
        
        if ($this->_mysqli->connect_errno)
            return false;   
        
        return true;
    }
    
    public function select()
    {       
        if ($this->connect() == true)
        {   
            $strColumns = implode(',', $this->_arrColumns);
                        
            $strQuery  = 'SELECT ';
            $strQuery .= '(' . $strColumns . ') ';
            $strQuery .= 'FROM ' . $this->_strTable;            
            
            if ($this->_joins != null)
                $strQuery .= ' JOIN ' . $this->_joins->getString();
            
            if ($this->_restrictions != null)
                $strQuery .= ' WHERE ' . $this->_restrictions->getString();
            
            if (strlen($this->_strGroupBy) > 0)
                $strQuery .= ' GROUP BY ' . $this->_strGroupBy;
            
            if (strlen($this->_strOrderBy) > 0)
                $strQuery .= ' ORDER BY ' . $this->_strOrderBy;
            
            if ($this->_intLimit > 0)
                $strQuery .= ' LIMIT ' . $this->_intLimit;
            
return '{"success":false,"message":"' . $strQuery . '"}';            
            
            if ($result = $this->_mysqli->query($strQuery))
            {
                $strData = '[';

                while ($row = $result->fetch_array())
                {
                    $strData .= '{';

                    for ($inColumn = 0; $inColumn < count($this->_arrColumns); $inColumn++)
                    {
                        $strColumnID = $this->_arrColumns[$inColumn];
                        $strColumnID = explode('.', $strColumnID);
                        $strColumnID = implode('_', $strColumnID);

                        $strData .= '"' . $strColumnID . '":"' . $row[$inColumn] . '",';
                    }
                    
                    if (count($this->_arrColumns) > 0)
                        $strData = substr($strData, 0, -1);
                    
                    $strData .= '},';
                }

                if (strlen($strData) > 1)
                    $strData = substr($strData, 0, -1);

                $strData .= ']';
                
                $this->_mysqli->close();
                
                return '{"success":true,"message":"success: query was successfull","data":' . $strData . '}';
            }
        }
        else
            return '{"success":false,"message":"error: unable to process query due to database connection issue"}';
        
        $this->_mysqli->close();
        
        return '{"success":false,"message":"error: unable to process query due to query error"}';
    }
}
                        
?>