<?php

class Join
{   
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Variables.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    protected $_arrTables = array();
    protected $_arrValues = array();
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Setup Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public function addTables( $arrTables )
    {
        for ($inTable = 0; $inTable < count($arrTables); $inTable++)
            $this->_arrTables[] = $arrTables[$inTable];   
    }
    
    public function addValues( $arrValues )
    {
        for ($inValue = 0; $inValue < count($arrValues); $inValue++)
        {
            $strValue = $arrValues[$inValue];
            $strValue = explode('=', $strValue);
            
            $strCompare = $strValue[1];
            $strValue   = $strValue[0];
            
            $objValue = (object)array('value'   => $strValue,
                                      'compare' => $strCompare);

            $this->_arrValues[] = $objValue;   
        }
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Format Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    
    public function getString()
    {
        $strTables = '(';
        $strValues = '(';
        
        for ($inTable = 0; $inTable < count($this->_arrTables); $inTable++)
        {
            $strTables .= $this->_arrTables[$inTable] . ',';
        }
        
        if (strlen($strTables) > 1)
            $strTables = substr($strTables, 0, -1);
        
        $strTables .= ')';
        
        for ($inValue = 0; $inValue < count($this->_arrValues); $inValue++)
        {
            $objValue = $this->_arrValues[$inValue];
            
            $strValues .= $objValue->value . '=' . $objValue->compare . ',';
        }
        
        if (strlen($strValues) > 1)
            $strValues = substr($strValues, 0, -1);
        
        $strValues .= ')';
        
        return $strTables . ' ON ' . $strValues;
    }
}

?>