$(document).ready(function()
{
//    localStorage.clear();
});

function checkLoggedIn()
{
    if (!isLoggedIn())
        window.location.href = 'login.html';    
}

function isLoggedIn()
{
    return ((sessionStorage.getItem('userID') > 0) || (localStorage.getItem('userID') > 0));
}

function isValidInput( objInput, strType )
{
    var strValue = objInput.val();
    if (strValue === null || strValue == '')
    {
        objInput.addClass('invalid');
        
        return '';   
    }
    
    switch (strType)
    {
        case INPUTEMAIL:
        {
            if (strValue.indexOf('@') == -1)
            {
                objInput.addClass('invalid');
                
                return '';
            }
        }
    }
    
    objInput.removeClass('invalid');
    
    return strValue;
}