//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Initialization.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function()
{
    $('.logout').on('click', logUserOut);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Debug Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function debug( strDebug )
{
    console.log(strDebug);
}

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
    showPreloader(true);
    
        // Get the reference and comment value.
    var strReference    = escape($('#scriptureReference').val());
    var srtComment      = escape($('#scriptureComment').val());
    
        // Create the message and data string.
    var strMessage  = EMAILTEMPLATE.split('%USER_NAME%').join(getUserName());
        strMessage  = strMessage.split('%FORUM%').join('scriptures');
        strMessage  = strMessage.split('%EMAIL_BODY%').join('<p><span style="font-size: 16px; font-weight: bold;">' + strReference + '</span></p>' + '<p><span style="font-size: 14px; font-weight: normal;">' + srtComment + '</span></p>');
    var strData     = SMTP_URLSTRING.split('%MAIL_TO%').join('browerjosiah@gmail.com');
        strData     = strData.split('%SUBJECT%').join('Someone posted a scripture!');
        strData     = strData.split('%MESSAGE%').join(strMessage);

        // Call to send the emails.
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
    if (DEBUG)
        debug('DEBUG: onScripturePostError() -- There was an error posting your scripture, please try again. If the issue persists, contact your administrator.');
}

function onSendPostEmailSuccess( vData )
{
    showPreloader(false);
    
    if (vData == 'success')
    {
        if (DEBUG)
            debug('DEBUG: onSendPostEmailSuccess() -- You successfully sent an email!');
    }
    else if (DEBUG)
        debug('DEBUG: onSendPostEmailSuccess() -- ' + vData);
}

function onSendPostEmailError()
{
    showPreloader(false);
    
    if (DEBUG)
        debug('DEBUG: onSendPostEmailError() -- There was an error sending the notification email.');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Date Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Preloader Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showPreloader( bShow )
{
    $('#preloaderContainer')[bShow? 'removeClass' : 'addClass']('hidden');
    $('#preloader')[bShow? 'removeClass' : 'addClass']('hidden');
}




