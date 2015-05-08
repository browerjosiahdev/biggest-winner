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
    var strReference = escape($('#scriptureReference').val());
    var strComment   = escape($('#scriptureComment').val());
    var strPostData  = 'reference=' + strReference +
                       '&comment=' + strComment + 
                       '&userID=' + getUserID() + 
                       '&userName=' + getUserName();
    
        // Call to post the scripture
    $.ajax({
        url: 'php/post_scripture.php',
        type: 'POST',
        dataType: 'json',
        data: strPostData + '&' + DB_URLSTRING,
        success: onScripturePostSuccess,
        error: onScripturePostError
    });
    
        // Create the message and data string.
    var strMessage  = EMAILTEMPLATE.split('%USER_NAME%').join(getUserName());
        strMessage  = strMessage.split('%FORUM%').join('scriptures');
        strMessage  = strMessage.split('%EMAIL_BODY%').join('<p><span style="font-size: 16px; font-weight: bold;">' + strReference + '</span></p>' + '<p><span style="font-size: 14px; font-weight: normal;">' + strComment + '</span></p>');
    var strData     = SMTP_URLSTRING.split('%MAIL_TO%').join('browerjosiah@gmail.com');
        strData     = strData.split('%SUBJECT%').join('Someone posted a scripture!');
        strData     = strData.split('%MESSAGE%').join(strMessage);    
    
console.log(strData);
    
        // Call to send the emails.
    $.ajax({
        url: 'php/send_mail.php',
        type: 'POST',
        dataType: 'json',
        data: strData + '&' + DB_URLSTRING,
        success: onSendPostEmailSuccess,
        error: onSendPostEmailError
    });
}

function onScripturePostSuccess( jsonData )
{
    if (jsonData.success)
    {
        if (DEBUG)
            debug(jsonData.message);        
        
        $('#scriptureReference').val('');
        $('#scriptureComment').val('');
    }
    else if (DEBUG)
        debug(jsonData.message);
    
    togglePoint(POINTTYPES['scripturesPost'], true);
}

function onScripturePostError()
{
    
}

function onSendPostEmailSuccess( jsonData )
{
    showPreloader(false);
    
    if (jsonData.success)
    {
        if (DEBUG)
            debug(jsonData.message);        
    }
    else if (DEBUG)
        debug(jsonData.message);
}

function onSendPostEmailError()
{
    showPreloader(false);
}

function getScripturePosts()
{
    return new Promise(function( resolve, reject )
    {
        var strData = 'queryTable=scriptures' + 
                      '&queryColumns=id, user_name, post_reference, post_comment, date_created' + 
                      '&queryRequirements=';

        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            dataType: 'json',
            data: strData + '&' + DB_URLSTRING,
            success: function( jsonData )
            {
                if (jsonData.success)
                {
                    if (DEBUG)
                        debug(jsonData.message);                    
                    
                    for (var inData = 0; inData < jsonData.data.length; inData++)
                    {
                        var objData     = jsonData.data[inData];
                        var intPostID   = objData.id;

                        objData.comments = [];

                        getScriptureComments(intPostID).then(function( data )
                        {
                            if (data.length > 0)
                                objData.comments = data;
                        });
                    }

                    resolve(jsonData.data);
                }
                else if (DEBUG)
                    debug(jsonData.message);
            },
            error: function()
            {
                reject('ajax error');   
            }
        });
    });
}

function getScriptureComments( intPostID )
{
    return new Promise(function( resolve, reject )
    {
        var strData = 'queryTable=scriptures_comments' + 
                      '&queryColumns=user_name, post_comment, date_created' + 
                      '&queryRequirements=post_id[eq]' + intPostID;

        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            dataType: 'json',
            data: strData + '&' + DB_URLSTRING,
            success: function( jsonData )
            {
                if (jsonData.success)
                {
                    if (DEBUG)
                        debug(jsonData.message);                    
                    
                    resolve(jsonData.data);
                }
                else if (DEBUG)
                    debug(jsonData.message);
            },
            error: function()
            {
                reject('ajax error');
            }
        });
    });
}

function postScriptureComment( objPostBtn )
{
    objPostBtn = $(objPostBtn);
    
    var intPostID = Number(objPostBtn.data('post-id'));
    var objPost   = $('.post[data-post-id="' + intPostID + '"]');
    
    if (objPost.html() !== undefined)
    {
        var objAddComment = objPost.find('.add-comment');   
        if (objAddComment.html() !== undefined)
        {
            var strComment = objAddComment.find('.comment-textarea').val();   
            var strData    = 'userID=' + getUserID() + 
                             '&userName=' + getUserName() + 
                             '&comment=' + escape(strComment) + 
                             '&postID=' + intPostID.toString();
            
            $.ajax({
                url: 'php/post_scripture_comment.php',
                type: 'POST',
                dataType: 'json',
                data: strData + '&' + DB_URLSTRING,
                success: onPostScriptureCommentSuccess,
                error: onPostScriptureCommentError
            });
        }
    }
}

function onPostScriptureCommentSuccess( jsonData )
{
    if (jsonData.success)
    {
        if (DEBUG)
            debug(jsonData.message);        
        
        var intPostID = Number(jsonData.postID);
        var objPost   = $('.post[data-post-id="' + intPostID + '"]');

        if (objPost.html() !== undefined)
        {
            var objAddComment = objPost.find('.add-comment');   
            if (objAddComment.html() !== undefined)
                objAddComment.find('.comment-textarea').val(''); 
        }
    }
    else if (DEBUG)
        debug(jsonData.message);
}

function onPostScriptureCommentError()
{
    
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Point Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function togglePoint(intPointType, bAdd)
{
    showPreloader(true);
    
    if (intPointType > 0)
    {
        var strData = 'userID=' + getUserID() + 
                      '&pointID=' + intPointType.toString() + 
                      '&add=' + bAdd.toString() + 
                      '&dateCreated=' + mysqlDate(getSelectedDate());

        $.ajax({
            url: 'php/toggle_point.php',
            type: 'POST',
            dataType: 'json',
            data: strData + '&' + DB_URLSTRING,
            success: onTogglePointSuccess,
            error: onTogglePointError
        });
    }
}

function onTogglePointSuccess( jsonData )
{
    showPreloader(false);
    
    if (jsonData.success)
    {
        if (DEBUG)
            debug(jsonData.message);
    }
    else if (DEBUG)
        debug(jsonData.message);
}

function onTogglePointError()
{   
    showPreloader(false);
}

function queryPoints()
{
    showPreloader(true);
    toggleCheckboxes();

   var strData = 'queryTable=users_points' + 
                 '&queryColumns=point_id' + 
                 '&queryRequirements=user_id[eq]' + getUserID() + 
                                   ' AND date_created[eq]\'' + mysqlDate(getSelectedDate()) + '\'';

    $.ajax({
        url: 'php/query.php',
        method: 'POST',
        dataType: 'json',
        data: strData + '&' + DB_URLSTRING,
        success: onQueryPointsSuccess,
        error: onQueryPointsError
    });
}

function onQueryPointsSuccess( jsonData )
{
    showPreloader(false);

    for (var inData = 0; inData < jsonData.data.length; inData++)
    {
        var intPointType  = jsonData.data[inData].point_id; 
        var strCheckboxID = POINTTYPELOOKUP[intPointType.toString()] + 'Checkbox';

        var objCheckbox = $('#' + strCheckboxID);
        if (objCheckbox.html() !== undefined)
        {
            objCheckbox.prop('checked', true);

            onCheckboxToggle(strCheckboxID, true);
        }
    }
}

function onQueryPointsError()
{
    showPreloader(false);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Checkbox Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function toggleCheckboxes()
{
    $('.checkbox').prop('checked', false);

    for (var strProp in POINTTYPES)
        onCheckboxToggle((strProp + 'Checkbox'), true);
}

function onCheckboxToggle( strCheckboxID, bIgnore )
{
    var objCheckbox = $('#' + strCheckboxID);
    if (objCheckbox.html() !== undefined)
    {
        if (objCheckbox.prop('checked'))
            $('.' + strCheckboxID).removeClass('hidden');
        else
            $('.' + strCheckboxID).addClass('hidden');

        if (bIgnore !== true)
            togglePoint(POINTTYPES[objCheckbox.data('point-type')], objCheckbox.prop('checked'));
    }
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

function getSelectedDate()
{
    return m_strSelectedDate;
}

function setSelectedDate( value )
{
    m_strSelectedDate = value;
}

function dateDiffDays( strSelectedDate ) 
{
    return (new Date(strSelectedDate) - new Date(getCurrentDate())) / (1000 * 60 * 60 * 24);
}

function mysqlDate( strDate )
{
    var arrDateInfo = strDate.split('/');
    if (arrDateInfo.length == 3)
        return arrDateInfo[2] + '-' + arrDateInfo[0] + '-' + arrDateInfo[1] + ' 00:00:00.0';
    else
        return '';
}

var m_strSelectedDate = getCurrentDate();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Date Picker Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setupDatePicker()
{
    var intMaxDays = Math.min(0, dateDiffDays(ENDDATE));

    $('#datePicker').datepicker({
        defaultDate: m_strSelectedDate,
        onSelect: onDatePickerSelect,
        minDate: dateDiffDays(STARTDATE),
        maxDate: intMaxDays
    }).val(m_strSelectedDate);
}

function onDatePickerSelect( strDate )
{
    
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Preloader Methods.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showPreloader( bShow )
{
    var objPreloaderContainer = $('#preloaderContainer');
    
    if (bShow)
    {
        objPreloaderContainer.removeClass('hidden');
        objPreloaderContainer.removeClass('fade-out');
        
        if (objPreloaderContainer.css('opacity') < 1)
            objPreloaderContainer.addClass('fade-in');
    }
    else
    {
        objPreloaderContainer.removeClass('fade-in');
        
        if (objPreloaderContainer.css('opacity') > 0)
            objPreloaderContainer.addClass('fade-out');
        else
            objPreloaderContainer.addClass('hidden');
    }
}




