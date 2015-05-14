<?php

class Join
{   
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Variables.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    protected $p_arrTables = array();
    protected $p_arrValues = array();
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Setup Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public function addTables( $arrTables )
    {
        for ($inTable = 0; $inTable < count($arrTables); $inTable++)
            array_push($p_arrTables, $arrTables[$inTable]);   
    };
    
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

            array_push($p_arrValues, $arrValue);   
        }
    };
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// Group: Format Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    
    public function getString()
    {
        $strTables = '(';
        $strValues = '(';
        
        for ($inTable = 0; $inTable < count($p_arrTables); $inTable++)
        {
            $strTables .= $p_arrTables[$inTable] . ',';
        }
        
        if (strlen($strTables) > 1)
            $strTables = substr($strTables, 0, -1);
        
        $strTables .= ')';
        
        for ($inValue = 0; $inValue < count($p_arrValues); $inValue++)
        {
            $objValue = $p_arrValues[$inValue];
            
            $strValues .= $objValue->value . '=' . $objValue->compare . ',';
        }
        
        if (strlen($strValues) > 1)
            $strValues = substr($strValues, 0, -1);
        
        $strValues .= ')';
        
        return $strTables . ' ON ' . $strValues;
    };
};

?>