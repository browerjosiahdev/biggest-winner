///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Initialization.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function()
{
    if (isLoggedIn() === true)
        $('.logout').on('click', logUserOut).removeClass('hidden');
    else if ($('.login').html() !== undefined)
        $('.login').on('click', function(){window.location.href = 'login.html'}).removeClass('hidden');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Debug Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function debug( strDebug )
{
    console.log(strDebug);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: User Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    var intUserID = sessionStorage.getItem('userID');
    if (intUserID === null || intUserID === undefined || isNaN(intUserID) || intUserID == 0)
        intUserID = localStorage.getItem('userID');
    
    return intUserID;
}

function getUserName()
{
        // Check the session and local storage for a userName variable.
    var strUserName = sessionStorage.getItem('userName');
    if (strUserName === null || strUserName === undefined || strUserName.length == 0)
        strUserName = localStorage.getItem('userName');
    
    return strUserName;
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Validation Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Forum Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onScripturesPageLoaded()
{
    if (isLoggedIn() === false)
        $('.add-comment').addClass('hidden');
}

function postScripture()
{
    showPreloader(true);
    
        // Get the reference and comment value.
    var strReference = toURLSafeFormat($('#scriptureReference').val());
    var strComment   = toURLSafeFormat($('#scriptureComment').val());
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
    
    getUsersEmails().then(function( data )
    {
            // Create the message and data string.
        var strMessage = EMAILTEMPLATE.split('%USER_NAME%').join(getUserName());
            strMessage = strMessage.split('%FORUM%').join('scriptures');
            strMessage = strMessage.split('%EMAIL_BODY%').join('<p><span style="font-size: 16px; font-weight: bold;">' + strReference + '</span></p>' + '<p><span style="font-size: 14px; font-weight: normal;">' + strComment + '</span></p>');
            strMessage = toURLSafeFormat(strMessage);

        var strData = SMTP_URLSTRING.split('%MAIL_TO%').join(data.join(', '));
            strData = strData.split('%SUBJECT%').join((getUserName() + ' posted to the scriptures page!'));
            strData = strData.split('%MESSAGE%').join(strMessage); 
            strData = toURLSafeFormat(strData);

            // Call to send the emails.
        $.ajax({
            url: 'php/send_mail.php',
            type: 'POST',
            dataType: 'json',
            data: strData + '&' + DB_URLSTRING,
            success: onSendPostEmailSuccess,
            error: onSendPostEmailError
        });
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

function onScripturePostError( jqXHR, textStatus, errorThrown )
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

function onSendPostEmailError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);    
}

function getScripturePosts()
{
    showPreloader(true);
    
    return new Promise(function( resolve, reject )
    {
        var strData = 'table=scriptures' + 
                      '&columns=id, user_name, post_reference, post_comment, date_created' + 
                      '&restrictions=';

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
                    
                    var intCommentsQueried = 0;
                    for (var inData = 0; inData < jsonData.data.length; inData++)
                    {
                        var objData     = jsonData.data[inData];
                        var intPostID   = objData.id;

                        objData.comments = [];
                        
                        getScriptureComments(intPostID, objData).then(function( data )
                        {   
                            intCommentsQueried++;
                            
                            if (intCommentsQueried == jsonData.data.length)
                            {
                                var jsonResolveData = fromURLSafeFormat(jsonData.data);
                                
                                resolve(jsonResolveData);
                                
                                showPreloader(false);
                            }
                        });
                    }
                }
                else if (DEBUG)
                    debug(jsonData.message);
            },
            error: function( jqXHR, textStatus, errorThrown )
            {
                showPreloader(false);
                
                reject('getScripturePosts(): ' + errorThrown);   
            }
        });
    });
}

function getScriptureComments( intPostID, objData )
{
    return new Promise(function( resolve, reject )
    {
        var strData = 'table=scriptures_comments' + 
                      '&columns=user_name, post_comment, date_created' + 
                      '&restrictions=post_id[eq]' + intPostID;

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
                    
                    objData.comments = jsonData.data;
                    objData.postID   = intPostID;
                    
                    resolve(objData);
                }
                else if (DEBUG)
                    debug(jsonData.message);
            },
            error: function( jqXHR, textStatus, errorThrown )
            {
                reject('getScriptureComments() -- ' + errorThrown);
            }
        });
    });
}

function postScriptureComment( objPostBtn )
{
    showPreloader(true);
    
    objPostBtn = $(objPostBtn);
    
    var intPostID = Number(objPostBtn.data('post-id'));
    var objPost   = $('.post[data-post-id="' + intPostID + '"]');
    
    if (objPost.html() !== undefined)
    {
        var objAddComment = objPost.find('.add-comment');   
        if (objAddComment.html() !== undefined)
        {
            var strComment = toURLSafeFormat(objAddComment.find('.comment-textarea').val());
            var strData    = 'userID=' + getUserID() + 
                             '&userName=' + getUserName() + 
                             '&comment=' + strComment + 
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
    showPreloader(false);
    
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

function onPostScriptureCommentError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Email Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getUsersEmails()
{
    return new Promise(function( resolve, reject )
    {
        var strData = 'table=users' + 
                      '&columns=email' + 
                      '&restrictions=recieve_emails[eq]1 ' + 
                                    'AND archived[eq]0';
        
        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            dataType: 'json',
            data: strData + '&' + DB_URLSTRING,
            success: function( jsonData )
            {
                var arrEmails = [];
                for (var inEmail = 0; inEmail < jsonData.data.length; inEmail++)
                {
                    var objEmail = jsonData.data[inEmail];   
                    
                    arrEmails.push(objEmail.email);
                }
                
                resolve(arrEmails);
            },
            error: function ( jqXHR, textStatus, errorThrown )
            {
                reject('getUsersEmails(): ' + errorThrown);
            }
        });  
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Point Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

function onTogglePointError( jqXHR, textStatus, errorThrown )
{   
    showPreloader(false);
}

function queryPoints()
{
    showPreloader(true);
    
    toggleCheckboxes();

   var strData = 'table=users_points' + 
                 '&columns=point_id' + 
                 '&restrictions=user_id[eq]' + getUserID() + 
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Checkbox Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Date Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Date Picker Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Preloader Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Format Methods.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function toURLSafeFormat( strValue )
{
    strValue = strValue.replace(/(\r\n|\r|\n)/gm, ' ');
    strValue = escape(strValue);
    
    return strValue;
}

function fromURLSafeFormat( vValue )
{
    if (typeof vValue == 'object')
    {
        vValue = JSON.stringify(vValue);
        vValue = unescape(vValue);
        
        return JSON.parse(vValue);
    }
    else
        return unescape(vValue);
}




