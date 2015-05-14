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
            $_arrTables[] = $arrTables[$inTable];   
    }
    
    public function addValues( $arrValues )
    {
        for ($inValue = 0; $inValue < count($arrValues); $inValue++)
        {
            $strValue = $arrValues[$inValue];
            $strValue = explode('=', $strValue);
            
            $strCompare = $strValue[1];
            $strValue   = $strValue[0];
            
            $objValue = array('value'   => $strValue,
                              'compare' => $strCompare);

            $_arrValues[] = $arrValue;   
        }
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Format Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    
    public function getString()
    {
        $strTables = '(';
        $strValues = '(';
        
        for ($inTable = 0; $inTable < count($_arrTables); $inTable++)
        {
            $strTables .= $_arrTables[$inTable] . ',';
        }
        
        if (strlen($strTables) > 1)
            $strTables = substr($strTables, 0, -1);
        
        $strTables .= ')';
        
        for ($inValue = 0; $inValue < count($_arrValues); $inValue++)
        {
            $objValue = $_arrValues[$inValue];
            
            $strValues .= $objValue->value . '=' . $objValue->compare . ',';
        }
        
        if (strlen($strValues) > 1)
            $strValues = substr($strValues, 0, -1);
        
        $strValues .= ')';
        
        return $strTables . ' ON ' . $strValues;
    }
}

?>