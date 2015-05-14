////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Initialization.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function()
{
    if (isLoggedIn() === true)
        $('.logout').on('click', logUserOut).removeClass('hidden');
    else if ($('.login').html() !== undefined)
        $('.login').on('click', function(){window.location.href = 'login.html'}).removeClass('hidden');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Debug Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function debug( strDebug )
{
    if (DEBUG)
        console.log(strDebug);
}

function message( strMessage, arrConditions )
{
    if (arrConditions !== null && arrConditions !== undefined && arrConditions.length > 0)
    {
        for (var inConditions = 0; inConditions < arrConditions.length; inConditions++)
        {
            var vCondition = arrConditions[inConditions];          
            if (vCondition === false || vCondition === null)
                return;
        }
    }
    
    alert(strMessage);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: User Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkLoggedIn( bLoginRequired )
{
    var bLoggedIn = isLoggedIn();
    
        // If the user isn't logged in, send them to the login page.
    if (!bLoggedIn && bLoginRequired)
        window.location.href = 'login.html'; 
    else if (bLoggedIn && localStorage.getItem('requirePasswordConfirmation') != 'false')
        window.location.href = 'confirm_password.html';
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
    if (localStorage.getItem('requirePasswordConfirmation') === true)
        window.location.href = 'confirm_password.html';
    else
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Validation Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Forum Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onScripturesPageLoaded()
{
    if (isLoggedIn() === false)
        $('.not-logged-in').addClass('hidden');
}

function postScripture()
{
    showPreloader(true);
    
        // Get the reference and comment value.
    var strReference = isValidInput($('#scriptureReference'));
    var strComment   = isValidInput($('#scriptureComment'));
    
    if (strReference == '' || 
        strComment == '')
    {
        showPreloader(false);
        
        return;
    }
    
    var strPostData  = 'reference=' + toURLSafeFormat(strReference) +
                       '&comment=' + toURLSafeFormat(strComment) + 
                       '&userID=' + getUserID() + 
                       '&userName=' + getUserName();
    
        // Call to post the scripture
    $.ajax({
        url: 'php/post_scripture.php',
        type: 'POST',
        dataType: 'json',
        data: strPostData,
        success: onScripturePostSuccess,
        error: onScripturePostError
    });
    
    getUsersEmails().then(function( data )
    {
            // Create the message and data string.
        var strMessage = EMAILTEMPLATE.split('%USER_NAME%').join(getUserName());
            strMessage = strMessage.split('%FORUM%').join('scriptures');
            strMessage = strMessage.split('%EMAIL_BODY%').join('<p><span style="font-size: 16px; font-weight: bold;">' + strReference + '</span></p>' + '<p><span style="font-size: 14px; font-weight: normal;">' + strComment + '</span></p>');
//            strMessage = toURLSafeFormat(strMessage);

        var strData = SMTP_URLSTRING.split('%MAIL_TO%').join(data.join(', '));
            strData = strData.split('%SUBJECT%').join((getUserName() + ' posted to the scriptures page!'));
            strData = strData.split('%MESSAGE%').join(strMessage); 
//            strData = toURLSafeFormat(strData);

            // Call to send the emails.
        $.ajax({
            url: 'php/send_mail.php',
            type: 'POST',
            dataType: 'json',
            data: strData,
            success: onSendPostEmailSuccess,
            error: onSendPostEmailError
        });
    });
}

function onScripturePostSuccess( jsonData )
{
    if (jsonData.success)
    {
        debug('onScripturePostSuccess(): ' + jsonData.message);        
        
        $('#scriptureReference').val('');
        $('#scriptureComment').val('');
    }
    else
    {
        debug('onScripturePostSuccess(): ' + jsonData.message);
        
        message('Unable to post your scripture, please try again.', [isLoggedIn()]);
    }
    
    togglePoint(POINTTYPES['scripturesPost'], true);
}

function onScripturePostError( jqXHR, textStatus, errorThrown )
{
    debug('onScripturePostError(): ' + errorThrown);
    
    message('Unable to post your scripture, please try again.', [isLoggedIn()]);
}

function onSendPostEmailSuccess( jsonData )
{
    showPreloader(false);
    
    if (jsonData.success)
        debug('onSendPostEmailSuccess(): ' + jsonData.message);        
    else
        debug('onSendPostEmailSuccess(): ' + jsonData.message);
}

function onSendPostEmailError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false); 
    
    debug('onSendPostEmailError(): ' + errorThrown);
}

function getScripturePosts()
{
    showPreloader(true);
    
    return new Promise(function( resolve, reject )
    {
        var strData = 'table=scriptures AS s' + 
                      '&columns=s.id, u.name, s.post_reference, s.post_comment, s.date_created' + 
                      '&order=s.date_created DESC' + 
                      '&join=users AS u ON s.user_id=u.id';
        
        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            dataType: 'json',
            data: strData,
            success: function( jsonData )
            {
                if (jsonData.success)
                {
                    debug('getScripturePosts(): php/query.php : success : ' + jsonData.message);                    
                    
                    var intCommentsQueried = 0;
                    for (var inData = 0; inData < jsonData.data.length; inData++)
                    {
                        var objData     = jsonData.data[inData];
                        var intPostID   = objData.s_id;

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
                else
                {
                    debug('getScripturePosts(): php/query.php : success : ' + jsonData.message);
                    
                    message('Unable to load scripture posts, please try again.', [isLoggedIn()]);
                }
            },
            error: function( jqXHR, textStatus, errorThrown )
            {
                showPreloader(false);
                
                debug('getScripturePosts(): php/query.php : error : ' + errorThrown);   
                reject('getScripturePosts(): php/query.php : error : ' + errorThrown);
                
                message('Unable to load scripture posts, please try again.', [isLoggedIn()]);
            }
        });
    });
}

function getScriptureComments( intPostID, objData )
{
    return new Promise(function( resolve, reject )
    {
        var strData = 'table=scriptures_comments AS sc' + 
                      '&columns=u.name, sc.post_comment, sc.date_created' + 
                      '&restrictions=sc.post_id[eq]' + intPostID.toString() + 
                      '&order=sc.date_created DESC' + 
                      '&join=users AS u ON sc.user_id=u.id';

        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            dataType: 'json',
            data: strData,
            success: function( jsonData )
            {
                if (jsonData.success)
                {
                    debug('getScriptureComments(): php/query.php : success : ' + jsonData.message); 
                    
                    objData.comments = jsonData.data;
                    objData.postID   = intPostID;
                    
                    resolve(objData);
                }
                else
                {
                    debug('getScriptureComments(): php/query.php : success : ' + jsonData.message);
                    
                    message('Unable to load comments for the scripture posts, please try again.', [isLoggedIn()]);
                }
            },
            error: function( jqXHR, textStatus, errorThrown )
            {
                debug('getScriptureComments(): php/query.php : error : ' + errorThrown);
                reject('getScriptureComments(): php/query.php : error : ' + errorThrown);
                
                message('Unable to load comments for the scripture posts, please try again.', [isLoggedIn()]);
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
            var strComment = isValidInput(objAddComment.find('.comment-textarea'));
            if (strComment == '')
            {
                showPreloader(false);
                
                return;
            }
            
            var strData    = 'userID=' + getUserID() + 
                             '&userName=' + getUserName() + 
                             '&comment=' + toURLSafeFormat(strComment) + 
                             '&postID=' + intPostID.toString();
            
            $.ajax({
                url: 'php/post_scripture_comment.php',
                type: 'POST',
                dataType: 'json',
                data: strData,
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
        debug('onPostScriptureCommentSuccess(): ' + jsonData.message);        
        
        var intPostID = Number(jsonData.postID);
        var objPost   = $('.post[data-post-id="' + intPostID + '"]');

        if (objPost.html() !== undefined)
        {
            var objAddComment = objPost.find('.add-comment');   
            if (objAddComment.html() !== undefined)
                objAddComment.find('.comment-textarea').val(''); 
        }
    }
    else
    {
        debug('onPostScriptureCommentSuccess(): ' + jsonData.message);
        
        message('Unable to post your comment, please try again.', [isLoggedIn()]);
    }
}

function onPostScriptureCommentError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);
    
    debug('onPostScriptureCommentError(): ' + errorThrown);
    
    message('Unable to post your comment, please try again.', [isLoggedIn()]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Email Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            data: strData,
            success: function( jsonData )
            {
                if (jsonData.success)
                {
                    debug('getUsersEmails() : php/query.php : success : ' + jsonData.message);
                    
                    var arrEmails = [];
                    for (var inEmail = 0; inEmail < jsonData.data.length; inEmail++)
                    {
                        var objEmail = jsonData.data[inEmail];   

                        arrEmails.push(objEmail.email);
                    }

                    resolve(arrEmails);
                }
                else
                {
                    debug('getUsersEmails() : php/query.php : success : ' + jsonData.message);
                    reject('getUsersEmails() : php/query.php : success : ' + jsonData.message);
                }
            },
            error: function ( jqXHR, textStatus, errorThrown )
            {
                debug('getUsersEmails() : php/query.php : error : ' + errorThrown);
                reject('getUsersEmails() : php/query.php : error : ' + errorThrown);
            }
        });  
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Point Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            data: strData,
            success: onTogglePointSuccess,
            error: onTogglePointError
        });
    }
}

function onTogglePointSuccess( jsonData )
{
    showPreloader(false);
    
    if (jsonData.success)
        debug('onTogglePointSuccess(): ' + jsonData.message);
    else
    {
        debug('onTogglePointSuccess(): ' + jsonData.message);
        
        message('Unable to add/remove your point for the selected date, please try again.', [isLoggedIn()]);
    }
}

function onTogglePointError( jqXHR, textStatus, errorThrown )
{   
    showPreloader(false);
    
    debug('onTogglePointError(): ' + errorThrown);
    
    message('Unable to add/remove your point for the selected date, please try again.', [isLoggedIn()]);
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
        data: strData,
        success: onQueryPointsSuccess,
        error: onQueryPointsError
    });
}

function onQueryPointsSuccess( jsonData )
{
    showPreloader(false);

    if (jsonData.success)
    {
        debug('onQueryPointsSuccess(): ' + jsonData.message);
        
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
    else
    {
        debug('onQueryPointsSuccess(): ' + jsonData.message);
        
        message('Unable to load your points for the selected date, please try again.', [isLoggedIn()]);
    }
}

function onQueryPointsError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);
    
    debug('onQueryPointsError(): ' + errorThrown);
    
    message('Unable to load your points for the selected date, please try again.', [isLoggedIn()]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Checkbox Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Date Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Date Picker Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    setSelectedDate(strDate);
                
    queryPoints();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Manage Account Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadAccountInfo()
{
    showPreloader(true);

    var strData = 'table=users' + 
                  '&columns=name, email, recieve_emails' + 
                  '&restrictions=id[eq]' + getUserID();

    $.ajax({
        url: 'php/query.php',
        type: 'POST',
        data: strData,
        dataType: 'json',
        success: onLoadAccountInfoSuccess,
        error: onLoadAccountInfoError
    });
}

function onLoadAccountInfoSuccess( jsonData )
{
    showPreloader(false);

    if (jsonData.success)
    {
        debug('onLoadAccountInfoSuccess(): ' + jsonData.message);                    

        if (jsonData.data.length > 0)
        {
            $('#name').val(jsonData.data[0].name);
            $('#email').val(jsonData.data[0].email);
            $('#recieveEmails').prop('checked', jsonData.data[0].recieve_emails == 1);
        }
        else
            message('Unable to load your account information, please try again later.', [isLoggedIn()]);
    }
    else
        debug('onLoadAccountInfoSuccess(): ' + jsonData.message);
}

function onLoadAccountInfoError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);

    debug('onLoadAccountInfoError(): ' +  errorThrown);
}

function saveAccountChanges()
{
    showPreloader(true);

    var strName          = isValidInput($('#name'));
    var strEmail         = isValidInput($('#email'), INPUTEMAIL);
    var intRecieveEmails = $('#recieveEmails').prop('checked')? 1 : 0;

    if (strName == '')
        return;
    if (strEmail == '')
        return;
    if (isNaN(intRecieveEmails))
        return;

    var strData = 'table=users' + 
                  '&updates=name[eq]\'' + strName + '\', email[eq]\'' + strEmail + '\', recieve_emails[eq]' + intRecieveEmails + 
                  '&restrictions=id[eq]' + getUserID().toString(); 

    $.ajax({
        url: 'php/update.php',
        type: 'POST',
        data: strData,
        dataType: 'json',
        success: onSaveAccountInfoSuccess,
        error: onSaveAccountInfoError
    });   
}

function onSaveAccountInfoSuccess( jsonData )
{
    showPreloader(false);

    if (jsonData.success)
    {
        debug('onSaveAccountInfoSuccess(): ' + jsonData.message);
        
        message('Your account has been updated successfully.', [isLoggedIn()]);
    }
    else
    {
        debug('onSaveAccountInfoSuccess(): ' + jsonData.message);

        message('Unable to save your account information, please try again.', [isLoggedIn()]);
    }
}

function onSaveAccountInfoError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);

    debug('onSaveAccountInfoError(): ' +  errorThrown);

    message('Unable to save your account information, please try again.', [isLoggedIn()]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Leaderboard Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLeaders()
{
    showPreloader(true);
    
    return new Promise(function( resolve, reject )
    {
        var strData = 'table=users_points AS up' + 
                      '&columns=u.name, COUNT(*) AS count' + 
                      '&group=up.user_id' + 
                      '&join=users AS u ON up.user_id=u.id' + 
                      '&order=count DESC';

        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            dataType: 'json',
            data: strData,
            success: function( jsonData )
            {
                if (jsonData.success)
                {
                    debug('getLeaders(): php/query.php : success : ' + jsonData.message);                    
                    
                    resolve(jsonData.data);
                }
                else
                {
                    debug('getLeaders(): php/query.php : success : ' + jsonData.message);
                    
                    message('Unable to load scripture posts, please try again.', [isLoggedIn()]);
                }
            },
            error: function( jqXHR, textStatus, errorThrown )
            {
                showPreloader(false);
                
                debug('getLeaders(): php/query.php : error : ' + errorThrown);   
                reject('getLeaders(): php/query.php : error : ' + errorThrown);
                
                message('Unable to load scripture posts, please try again.', [isLoggedIn()]);
            }
        });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Preloader Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Login Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function login()
{
    showPreloader(true);

    var strUserName = isValidInput($('#userName'));
    var strPassword = isValidInput($('#password'));

    if (strUserName == '')
        return;
    if (strPassword == '')
        return;

    /*var strData = 'userName=' + strUserName + 
                  '&password=' + checkDeviceWidth(strPassword);*/
    var strData = 'table=users' + 
                  '&columns=id, name, password_confirmed' + 
                  '&restrictions=(login[eq]\'' + strUserName + '\'), (password[eq]\'' + checkDeviceWidth(strPassword) + '\' OR password_confirmed[eq]0)';  
    
debug(strData);    
    
    $.ajax({
        url: 'php/query.php',
        method: 'POST',
        dataType: 'json',
        data: strData,
        success: onLoginPostSuccess,
        error: onLoginPostError
    });
}

function onLoginPostSuccess( jsonData )
{
    showPreloader(false);

    if (jsonData.success)
    {
        debug('onLoginPostSuccess(): ' + jsonData.message);

        if (jsonData.data.length > 0)
        {
            var intID                = Number(jsonData.data[0].id);
            var strName              = jsonData.data[0].name;
            var bRemember            = $('#rememberMe').prop('checked');
            
            var intPasswordConfirmed = Number(jsonData.data[0].password_confirmed);
            if (intPasswordConfirmed === 0)
                localStorage.setItem('requirePasswordConfirmation', true);
            else
                localStorage.setItem('requirePasswordConfirmation', false);
            
            logUserIn(intID, strName, bRemember);
        }
        else
            message('Unable to find user with matching login and password, please try again.');
    }
    else
    {
        debug('onLoginPostSuccess(): ' + jsonData.message);

        message('Unable to log you in, please try again.');
    }
}

function onLoginPostError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);

    debug('onLoginPostError(): ' + errorThrown);

//    message('Unable to log you in, please try again.');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Create Account Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createAccount()
{
    showPreloader(true);

    var strName             = isValidInput($('#name'));
    var strEmail            = isValidInput($('#email'), INPUTEMAIL);
    var strLogin            = isValidInput($('#login'));
    var strPassword         = isValidInput($('#password'));
    var strConfirmPassword  = isValidInput($('#confirmPassword'));
    var bRecieveEmails      = $('#recieveEmails').prop('checked');

    if (strName == '')
        return;
    if (strEmail == '')
        return;
    if (strLogin == '')
        return;
    if (strPassword == '')
        return;
    if (strConfirmPassword == '')
        return;

    if (strPassword != strConfirmPassword)
    {
        message('Sorry, your passwords don\'t match.');

        return;
    }

    var strData = 'table=users' + 
                  '&values=name[eq]\'' + strName + '\', ' + 
                          'email[eq]\'' + strEmail + '\', ' + 
                          'login[eq]\'' + strLogin + '\', ' + 
                          'password[eq]\'' + checkDeviceWidth(strPassword) + '\', ' + 
                          'recieve_emails[eq]' + bRecieveEmails + ', ' + 
                          'password_confirmed[eq]1';

    $.ajax({
        url: 'php/insert.php',
        method: 'POST',
        dataType: 'json',
        data: strData,
        success: onCreateAccountSuccess,
        error: onCreateAccountError
    });
}

function onCreateAccountSuccess( jsonData )
{
    if (jsonData.success)
    {
        debug('onCreateAccountSuccess(): ' + jsonData.message);
        
        var strEmail = jsonData.data.email;
        var strData  = 'table=users' + 
                       '&columns=id, name' + 
                       '&restrictions=email[eq]\'' + strEmail + '\'';
        
        $.ajax({
            url: 'php/query.php',
            method: 'POST',
            dataType: 'json',
            data: strData,
            success: onNewAccountLoginSuccess,
            error: onNewAccountLoginError
        });
    }
    else
    {
        showPreloader(false);
        
        debug('onCreateAccountSuccess(): ' + jsonData.message);

        message('Unable to create your account, please try again.');
    }
}

function onCreateAccountError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);

    debug('onCreateAccountError(): ' + errorThrown);

    message('Unable to create your account, please try again.');
}

function onNewAccountLoginSuccess( jsonData )
{
    showPreloader(false);
    
    if (jsonData.success)
    {
        debug('onNewAccountLoginSuccess(): ' + jsonData.message);
        
        var intID     = Number(jsonData.data[0].id);
        var strName   = jsonData.data[0].name;
        var bRemember = $('#rememberMe').prop('checked');
        
        logUserIn(intID, strName, bRemember);
    }
    else
    {
        debug('onNewAccountLoginSuccess(): ' + jsonData.message);

        message('Unable to login to your new account, please go to the login page and try again.');
    }
}

function onNewAccountLoginError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);

    debug('onNewAccountLoginError(): ' + errorThrown);

    message('Unable to login to your new account, please go to the login page and try again.');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Confirm Password Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function confirmPassword()
{
    var strPassword        = isValidInput($('#password'));
    var strConfirmPassword = isValidInput($('#confirmPassword'));
    
    if (strPassword == '' || strConfirmPassword == '')
        return;
    else if (strPassword != strConfirmPassword)
    {
        message('Sorry, your passwords don\'t match.');
        
        return;
    }
    
    var strData = 'table=users' + 
                  '&updates=password[eq]\'' + checkDeviceWidth(strPassword) + '\', ' + 
                           'password_confirmed[eq]1' + 
                  '&restrictions=id[eq]' + getUserID();

    $.ajax({
        url: 'php/update.php',
        method: 'POST',
        dataType: 'json',
        data: strData,
        success: onConfirmPasswordSuccess,
        error: onConfirmPasswordError
    });
}

function onConfirmPasswordSuccess( jsonData )
{
    if (jsonData.success)
    {
        debug('onConfirmPasswordSuccess(): ' + jsonData.message);
        
        localStorage.setItem('requirePasswordConfirmation', false);
        
        window.location.href = 'index.html';
    }
    else
        debug('onConfirmPasswordSuccess(): ' + jsonData.message);
}

function onConfirmPasswordError( jqXHR, textStatus, errorThrown )
{
    debug('onConfirmPasswordError(): ' + errorThrown);
    
    message('Unable to update your password, please try again.');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Format Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        vValue = vValue.replace(/(%22)/gm, '\\"');
        vValue = unescape(vValue);
        
        return JSON.parse(vValue);
    }
    else
        return unescape(vValue);
}

function checkDeviceWidth( strValue )
{
    var strDeviceWidth = '';
    
    for (var inValue = 0; inValue < strValue.length; inValue++)
    {
        var strChar = strValue.slice(inValue, (inValue + 1));
        
        var intDeviceChar = inValue;
        while (intDeviceChar > DEVICETYPE.length)
            intDeviceChar -= DEVICETYPE.length;
        
        var strCharDevice  = DEVICETYPE.slice(intDeviceChar, (intDeviceChar + 1));
        var intCharVal      = DEVICEASPECT[strChar];
        var intDeviceVal   = DEVICEASPECT[strCharDevice];        
        
        if (!isNaN(intCharVal) && !isNaN(intDeviceVal))
            strDeviceWidth += intCharVal * intDeviceVal;
        else
            strDeviceWidth += strChar;
    }
    
    return strDeviceWidth;
}




