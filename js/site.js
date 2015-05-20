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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Validation Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function isValidInput( objInput, strType )
{
    var strValue = objInput.val();
    if ((strValue === null) || (strValue == ''))
    {
        objInput.addClass('invalid');
        
        return '';   
    }
    
    if (strValue.match(/(<)|(>)|(\sselect\s)|(\salter\s)|(\supdate\s)|(\sinsert\s)|(\sremove\s)|(\{)|(\})|(=)|(;)|(var )/gim) !== null)
    {
        objInput.addClass('invalid');
        
        //message('Invalid character, inputs must not contain any of the following characters: <>{}=;');
        
        return '';
    }
    
    objInput.removeClass('invalid');
    
    return strValue;
}

function validateInput( strInput )
{
    return strInput;
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
    
    var strData = 'table=scriptures' + 
                  '&columns=user_id ^ user_name ^ post_reference ^ post_comment ^ date_created' + 
                  '&values=' + getUserID().toString() + 
                        ' ^ \'' + getUserName() + '\'' + 
                        ' ^ \'' + toURLSafeFormat(strReference) + '\'' + 
                        ' ^ \'' + toURLSafeFormat(strComment) + '\'' + 
                        ' ^ \'' + getCurrentDate(true, true) + '\'' + 
                  '&query=INSERT';
    
    $.ajax({
        url: 'php/query.php',
        type: 'POST',
        data: strData,
        success: onScripturePostSuccess,
        error: onScripturePostError
    });
}

function onScripturePostSuccess( jsonData )
{
    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
        if (jsonData.success)
        {
            debug('onScripturePostSuccess(): ' + jsonData.message);        

            var strPostReference = $('#scriptureReference').val();
            var strPostComment   = $('#scriptureComment').val();
            
            $('#scriptureReference').val('');
            $('#scriptureComment').val('');
            
            message('Your scriptures was posted successfully.', [isLoggedIn()]);
            
            getUsersEmails().then(function( jsonData )
            {
                jsonData = toJSON(jsonData)
                if (jsonData !== null)
                {
                    if (jsonData.success)
                    {
                        debug('getUsersEmails(): ' + jsonData.message);

                            // Create the message and data string.
                        var strMessage = EMAILTEMPLATE.replace(/(\%USER_NAME\%)/g, getUserName());
                            strMessage = strMessage.replace(/(\%FORUM\%)/g, 'scriptures');
                            strMessage = strMessage.replace(/(\%EMAIL_BODY\%)/g, EMAILBODYTEMPLATE.replace(/(\%REFERENCE\%)/g, strPostReference).replace(/(\%COMMENT\%)/g, strPostComment));

                        var strEmails = '';
                        for (var inEmails = 0; inEmails < jsonData.data.length; inEmails++)
                            strEmails += jsonData.data[inEmails].email + ', ';   

                        if (strEmails.length > 0)
                            strEmails = strEmails.substr(0, (strEmails.length - 2));

                        var strData = SMTP_URLSTRING.replace(/(\%MAIL_TO\%)/g, strEmails);
                            strData = strData.replace(/(\%SUBJECT\%)/g, (getUserName() + ' posted to the scriptures page!'));
                            strData = strData.replace(/(\%MESSAGE\%)/g, toURLSafeFormat(strMessage));                 

                        $.ajax({
                            url: 'php/send_mail.php',
                            type: 'POST',
                            data: strData,
                            success: onSendPostEmailSuccess,
                            error: onSendPostEmailError
                        });
                    }
                    else
                        debug('getUsersEmails(): ' + jsonData.message);  
                }
            });
        }
        else
        {
            debug('onScripturePostSuccess(): ' + jsonData.message);

            message('Unable to post your scripture, please try again.', [isLoggedIn()]);
        }

        togglePoint(POINTTYPES['scripturesPost'], true);
    }
}

function onScripturePostError( jqXHR, textStatus, errorThrown )
{
    debug('onScripturePostError(): ' + errorThrown);
    
    message('Unable to post your scripture, please try again.', [isLoggedIn()]);
}

function onSendPostEmailSuccess( jsonData )
{
    showPreloader(false);
    
    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
        if (jsonData.success)
            debug('onSendPostEmailSuccess(): ' + jsonData.message);        
        else
            debug('onSendPostEmailSuccess(): ' + jsonData.message);
    }
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
        var strData = 'table=scriptures' + 
                      '&columns=scriptures.id ^ users.name ^ scriptures.post_reference ^ scriptures.post_comment ^ scriptures.date_created' + 
                      '&order=scriptures.date_created DESC' + 
                      '&join=users ^ scriptures.user_id[eq]users.id' + 
                      '&limit=20' + 
                      '&query=SELECT';
        
        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            data: strData,
            success: function( jsonData )
            {
                jsonData = toJSON(jsonData);                
                if (jsonData !== null)
                {
                    if (jsonData.success)
                    {
                        debug('getScripturePosts(): php/query.php : success : ' + jsonData.message);                    

                        var intCommentsQueried = 0;
                        for (var inData = 0; inData < jsonData.data.length; inData++)
                        {
                            var objData     = jsonData.data[inData];
                            var intPostID   = objData.scriptures_id;

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
        var strData = 'table=scriptures_comments' + 
                      '&columns=users.name ^ scriptures_comments.post_comment ^ scriptures_comments.date_created' + 
                      '&restrictions=scriptures_comments.post_id[eq]' + intPostID.toString() + 
                      '&order=scriptures_comments.date_created DESC' + 
                      '&join=users ^ scriptures_comments.user_id=users.id' + 
                      '&query=SELECT';

        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            data: strData,
            success: function( jsonData )
            {
                jsonData = toJSON(jsonData);
                if (jsonData !== null)
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

function postScriptureComment( intPostID )
{    
    showPreloader(true);
    
    /*objPostBtn = $(objPostBtn);
    
    var intPostID = Number(objPostBtn.data('post-id'));*/
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
            
            var strData = 'table=scriptures_comments' + 
                          '&columns=user_id ^ user_name ^ post_comment ^ post_id ^ date_created' + 
                          '&values=' + getUserID().toString() + 
                                ' ^ \'\'' + 
                                ' ^ \'' + toURLSafeFormat(strComment) + '\'' + 
                                ' ^ ' + intPostID.toString() + 
                                ' ^ \'' + getCurrentDate(true, true) + '\'' + 
                          '&query=INSERT';
            
            $.ajax({
                url: 'php/query.php',
                type: 'POST',
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
    
    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
        if (jsonData.success)
        {
            debug('onPostScriptureCommentSuccess(): ' + jsonData.message);        

            var objPost = $('.post[data-post-id="' + jsonData.data.post_id + '"]');
            if (objPost.html() !== undefined)
            {
                var objAddComment = objPost.find('.add-comment');   
                if (objAddComment.html() !== undefined)
                    objAddComment.find('.comment-textarea').val(''); 
            }
            
            message('Your comment was posted successfully.', [isLoggedIn()]);
        }
        else
        {
            debug('onPostScriptureCommentSuccess(): ' + jsonData.message);

            message('Unable to post your comment, please try again.', [isLoggedIn()]);
        }
    }
}

function onPostScriptureCommentError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);
    
    debug('onPostScriptureCommentError(): ' + errorThrown);
    
    message('Unable to post your comment, please try again.', [isLoggedIn()]);
}

function toggleNewPostForm()
{
    var objNewPost = $('#newPost');   
    if (objNewPost.html() !== undefined)
    {
        if (objNewPost.hasClass('new-post-slide-up'))
        {
            objNewPost.removeClass('new-post-slide-up');
            objNewPost.addClass('new-post-slide-down');
        }
        else
        {
            objNewPost.removeClass('new-post-slide-down');
            objNewPost.addClass('new-post-slide-up');   
        }
    }
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
                      '&restrictions=recieve_emails[eq]1' + 
                                 ' ^ archived[eq]0' + 
                      '&query=SELECT';
        
        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            data: strData,
            success: function( jsonData )
            {
                resolve(jsonData);
            },
            error: function ( jqXHR, textStatus, errorThrown )
            {
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
        var strData = 'table=users_points' + 
                      '&columns=id' + 
                      '&restrictions=user_id[eq]' + getUserID().toString() + 
                                ' ^ point_id[eq]' + intPointType.toString() + 
                                ' ^ date_created[eq]\'' + getSelectedDate(true, true) + '\'' + 
                      '&query=SELECT';
        
        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            data: strData,
            success: function( jsonData )
            {
                jsonData = toJSON(jsonData);
                if (jsonData !== null)
                {
                    if (jsonData.success)
                    {
                        debug('togglePoint(): php/query.php : success: ' + jsonData.message);
                        
                        if (bAdd)
                        {
                            if (jsonData.data.length === 0)
                            {
                                strData = 'table=users_points' + 
                                          '&columns=user_id ^ point_id ^ date_created' + 
                                          '&values=' + getUserID().toString() + 
                                               ' ^ ' + intPointType.toString() + 
                                               ' ^ \'' + getSelectedDate(true, true) + '\'' + 
                                          '&query=INSERT';
                                
                                $.ajax({
                                    url: 'php/query.php',
                                    type: 'POST',
                                    data: strData,
                                    success: onTogglePointSuccess,
                                    error: onTogglePointError
                                });
                            }
                            else
                            {
                                showPreloader(false);
                                
                                debug('togglePoint(): php/query.php : success: unable to add point because it already exists');
                            }
                        }
                        else
                        {
                            if (jsonData.data.length > 0)
                            {
                                strData = 'table=users_points' + 
                                          '&restrictions=user_id[eq]' + getUserID().toString() + 
                                                    ' ^ point_id[eq]' + intPointType.toString() + 
                                                    ' ^ date_created[eq]' + getSelectedDate(true, true) + 
                                          '&query=DELETE';
                                
                                $.ajax({
                                    url: 'php/query.php',
                                    type: 'POST',
                                    data: strData,
                                    success: onTogglePointSuccess,
                                    error: onTogglePointError
                                });
                            }
                            else
                            {
                                showPreloader(false);
                                
                                debug('togglePoint(): php/query.php : success: unable to remove point because it doesn\'t exist');
                            }
                        }
                    }
                    else
                    {
                        showPreloader(false);
                        
                        debug('togglePoint(): php/query.php : success: ' + jsonData.message);
    
                        message('Unable to add/remove your point for the selected date, please try again.', [isLoggedIn()]);
                    }
                }
            },
            error: function( jqXHR, textStatus, errorThrown )
            {
                showPreloader(false);
                
                debug('togglePoint(): php/query.php : error: ' + errorThrown);
    
                message('Unable to add/remove your point for the selected date, please try again.', [isLoggedIn()]);
            }
        });
    }
}

function onTogglePointSuccess( jsonData )
{
    showPreloader(false);
    
    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
        if (jsonData.success)
            debug('onTogglePointSuccess(): ' + jsonData.message);
        else
        {
            debug('onTogglePointSuccess(): ' + jsonData.message);

            message('Unable to add/remove your point for the selected date, please try again.', [isLoggedIn()]);
        }
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
                 '&restrictions=user_id[eq]' + getUserID().toString() + 
                            ' ^ date_created[eq]\'' + getSelectedDate(true, true) + '\'' + 
                 '&query=SELECT';
    
    $.ajax({
        url: 'php/query.php',
        method: 'POST',
        data: strData,
        success: onQueryPointsSuccess,
        error: onQueryPointsError
    });
}

function onQueryPointsSuccess( jsonData )
{
    showPreloader(false);
    
    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
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

function getCurrentDate( bMySQL, bTime ) 
{
    var date        = new Date();
    var intDay      = date.getDate();
    var intMonth    = date.getMonth() + 1;
    var intYear     = date.getFullYear();
    
    if (intDay < 10)
        intDay = '0' + intDay;
    if (intMonth < 10)
        intMonth = '0' + intMonth;
    
    var strDate = '';
    
    if (!bMySQL)
    {
        strDate = intMonth.toString() + '/' + 
                  intDay.toString() + '/' + 
                  intYear.toString();   
    }
    else
    {
        strDate = intYear.toString() + '-' + 
                  intMonth.toString() + '-' + 
                  intDay.toString();  
        
        if (!bTime)
            strDate += ' 00:00:00';   
    }
    
    if (bTime)
    {
        var intHours   = date.getHours();
        var intMinutes = date.getMinutes();
        var intSeconds = date.getSeconds();
        
        if (intHours < 10)
            intHours = '0' + intHours.toString();
        if (intMinutes < 10)
            intMinutes = '0' + intMinutes.toString();
        if (intSeconds < 10)
            intSeconds = '0' + intSeconds.toString();
        
        strDate += ' ';
        strDate += intHours + ':' + 
                   intMinutes + ':' + 
                   intSeconds;
    }
    
    return strDate;
}

function getSelectedDate( bMySQL, bTime )
{
    var strSelectedDate = m_strSelectedDate;
    
    if (bMySQL)
    {
        var arrDateInfo = strSelectedDate.match(/(\d*)\/(\d*)\/(\d*)/);
            arrDateInfo.shift();
        
        strSelectedDate = arrDateInfo[2] + '-' + arrDateInfo[0] + '-' + arrDateInfo[1];
    }
    
    if (bTime)
        strSelectedDate += ' 00:00:00';
    
    return strSelectedDate;
}

function setSelectedDate( value )
{
    m_strSelectedDate = value;
}

function dateDiffDays( strSelectedDate ) 
{
    return (new Date(strSelectedDate) - new Date(getCurrentDate())) / (1000 * 60 * 60 * 24);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Date Picker Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var m_strSelectedDate = getCurrentDate();

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
                  '&columns=name ^ email ^ recieve_emails' + 
                  '&restrictions=id[eq]' + getUserID().toString() + 
                  '&query=SELECT';

    $.ajax({
        url: 'php/query.php',
        type: 'POST',
        data: strData,
        success: onLoadAccountInfoSuccess,
        error: onLoadAccountInfoError
    });
}

function onLoadAccountInfoSuccess( jsonData )
{
    showPreloader(false);

    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
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
    var strEmail         = isValidInput($('#email'));
    var intRecieveEmails = $('#recieveEmails').prop('checked')? 1 : 0;

    if (strName == '')
        return;
    if (strEmail == '')
        return;
    if (isNaN(intRecieveEmails))
        return;
    
    var strData = 'table=users' + 
                  '&columns=name ^ email ^ recieve_emails' + 
                  '&values=\'' + strName + '\'' + 
                       ' ^ \'' + strEmail + '\'' + 
                       ' ^ ' + intRecieveEmails.toString() + 
                  '&restrictions=id[eq]' + getUserID().toString() + 
                  '&query=UPDATE';
    
    $.ajax({
        url: 'php/query.php',
        type: 'POST',
        data: strData,
        success: onSaveAccountInfoSuccess,
        error: onSaveAccountInfoError
    });  
}

function onSaveAccountInfoSuccess( jsonData )
{
    showPreloader(false);

    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
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
        var strData = 'table=users_points' + 
                      '&columns=users.name ^ COUNT(*)' + 
                      '&group=users_points.user_id' + 
                      '&join=users ^ users_points.user_id=users.id' + 
                      '&order=COUNT(*) DESC' + 
                      '&limit=5' + 
                      '&query=SELECT';

        $.ajax({
            url: 'php/query.php',
            type: 'POST',
            data: strData,
            success: function( jsonData )
            {
                showPreloader(false);
                
                jsonData = toJSON(jsonData);
                if (jsonData !== null)
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

function login( strName, strPassword, bRemember )
{
    showPreloader(true);

    strName     = validateInput(strName);
    strPassword = validateInput(strPassword);
    
    if (strName == '' || strPassword == '')
    {
        message('Login failed');
        
        return;
    }
    
    var strData = 'table=users' + 
                  '&columns=id ^ name' + 
                  '&restrictions=login[eq]\'' + strName + 
                           '\' ^ password[eq]\'' + strPassword + 
                  '&query=SELECT';
    
    $.ajax({
        url: 'php/query.php',
        method: 'POST',
        data: strData,
        success: onLoginPostSuccess,
        error: onLoginPostError
    });
}

function onLoginPostSuccess( jsonData )
{
    showPreloader(false);
    
    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
        if (jsonData.success)
        {
            debug('onLoginPostSuccess(): ' + jsonData.message);

            if (jsonData.data.length > 0)
            {
                var intID                = Number(jsonData.data[0].id);
                var strName              = jsonData.data[0].name;
                var bRemember            = $('#rememberMe').prop('checked');

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
}

function onLoginPostError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);

    debug('onLoginPostError(): ' + errorThrown);

    message('Unable to log you in, please try again.');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Create Account Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createAccount()
{
    var strName             = isValidInput($('#name'));
    var strEmail            = isValidInput($('#email'));
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

    showPreloader(true);
    
    var strData = 'table=users' + 
                  '&columns=name ^ email ^ login ^ password ^ recieve_emails' + 
                  '&values=\'' + strName + '\' ^ ' + 
                          '\'' + strEmail + '\' ^ ' + 
                          '\'' + strLogin + '\' ^ ' + 
                          '\'' + strPassword + '\' ^ ' + 
                          '\'' + bRecieveEmails + '\' ^ ' + 
                  '&query=INSERT';

    $.ajax({
        url: 'php/query.php',
        method: 'POST',
        data: strData,
        success: onCreateAccountSuccess,
        error: onCreateAccountError
    });
}

function onCreateAccountSuccess( jsonData )
{
    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
        if (jsonData.success)
        {
            debug('onCreateAccountSuccess(): ' + jsonData.message);      
            
            var strEmail = jsonData.data.email;
            var strData  = 'table=users' + 
                           '&columns=id ^ name' + 
                           '&restrictions=email[eq]' + strEmail + 
                           '&query=SELECT';

            $.ajax({
                url: 'php/query.php',
                method: 'POST',
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
    
    jsonData = toJSON(jsonData);
    if (jsonData !== null)
    {
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
}

function onNewAccountLoginError( jqXHR, textStatus, errorThrown )
{
    showPreloader(false);

    debug('onNewAccountLoginError(): ' + errorThrown);

    message('Unable to login to your new account, please go to the login page and try again.');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Format Methods.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function toURLSafeFormat( strValue )
{
    strValue = strValue.replace(/(\r\n|\r|\n)/gm, ' ');
    strValue = strValue.replace(/'/gm, '&apos;');
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
        vValue = vValue.replace(/&apos;/gm, '\'');
        
        return JSON.parse(vValue);
    }
    else
        return unescape(vValue);
}

function toJSON( jsonData )
{
    try
    {   
        jsonData = JSON.parse(jsonData);   
        
        return jsonData;
    }
    catch (error)
    {
        $('.php-error').html(jsonData);
        
        return null;
    }
}