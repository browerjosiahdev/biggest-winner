//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Initialization.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function()
{
    $('.logout').on('click', logUserOut);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: User Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkLoggedIn()
{
        // If the user isn't logged in, send them to the login page.
    if (!isLoggedIn())
        window.location.href = 'login.html';    
}

function isLoggedIn()
{
        // Check if a user ID is defined.
    return getUserID() > 0;
}

function getUserID()
{
        // Check the session and local storage for a userID variable.
    return (sessionStorage.getItem('userID') || localStorage.getItem('userID'));
}

function getUserName()
{
        // Check the session and local storage for a userName variable.
    return (sessionStorage.getItem('userName') || localStorage.getItem('userName'));
}

function logUserIn( intUserID, strUserName, bRemember )
{
        // If we should remember the user...save their user ID, and
        // name to the local storage. Otherwise, save them to the
        // session storage.
    if (bRemember)
    {
        localStorage.setItem('userID', intUserID);
        localStorage.setItem('userName', strUserName);
    }
    else
    {
        sessionStorage.setItem('userID', intUserID);
        sessionStorage.setItem('userName', strUserName);
    }
    
        // Navigate the user to the home page.
    window.location.href = 'index.html';
}

function logUserOut()
{
        // Clear the session and local storage.
    sessionStorage.setItem('userID', 0); 
    sessionStorage.setItem('userName', '');
    
    localStorage.setItem('userID', 0); 
    localStorage.setItem('userName', '');
    
        // Navigate the user to the login page.
    window.location.href = 'login.html';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Validation Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Forum Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function postScripture()
{
    var strReference    = escape($('#scriptureReference').val());
    var srtComment      = escape($('#scriptureComment').val());
    
    var strMessage  = EMAILTEMPLATE.split('%USER_NAME%').join(getUserName()).split('%FORUM%').join('scriptures').split('%EMAIL_BODY%').join(strReference + '\r\n\r\n' + srtComment);
    var strData     = SMTP_URLSTRING.split('%MAIL_TO%').join('emily.tryon@gmail.com').split('%SUBJECT%').join('Someone posted a scripture!').split('%MESSAGE%').join(strMessage);

    $.ajax({
        url: 'php/send_mail.php',
        type: 'POST',
        data: strData + '&' + DB_URLSTRING,
        success: onSendPostEmailSuccess,
        error: onSendPostEmailError
    });
}

function onScripturePostSuccess( vData )
{
    
}

function onScripturePostError()
{
    alert('There was an error posting your scripture, please try again. If the issue persists, contact your administrator.');
}

function onSendPostEmailSuccess( vData )
{
    if (vData == 'success')
    {
        if (DEBUG)
            alert('You successfully sent an email!');
    }
}

function onSendPostEmailError()
{
    
}

function getCurrentDate() 
{
    var date        = new Date();
    var intDay      = date.getDate();
    var intMonth    = date.getMonth() + 1;
    var intYear     = date.getFullYear();
    
    if (intDay < 10)
        intDay = "0" + intDay;
    if (intMonth < 10)
        intMonth = "0" + intMonth;
    
    return intMonth.toString() + "/" + intDay.toString() + "/" + intYear.toString();
}

function dateDiffDays( strSelectedDate ) 
{
    return (new Date(strSelectedDate) - new Date(getCurrentDate())) / (1000 * 60 * 60 * 24);
}




