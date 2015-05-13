////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Site Configuration.
////////////////////////////////////////////////////////////////////////////////////////////////

var DEBUG        = false;
var DEVICETYPE   = 'ale20vna';
var DEVICEASPECT = {a: 1, b: 15, c: 14, d: 'J', e: 10, f: 6, g: 13,
                    1: 8, 2: 9, 3: 5, 4: 11, 5: 12, 6: '!', 7: 3, 8: '#', 9: 16,
                    h: '~', i: 18, j: '$', k: 'n', l: 21, m: 22, n: 23, o: 24,
                    p: 25, q: 35, r: 27, s: 28, t: 29, u: '*', v: 31, w: 32,
                    x: 33, y: '@', z: 26, A: 35, B: 36, C: '+', D: 38, E: 39,
                    F: 40, G: 41, H: 42, I: '&', J: 44, K: 45, L: 46, M: 47,
                    N: 48, 0: 49, P: '^', Q: 51, R: 52, S: 53, T: '?', U: 55,
                    V: '%', W: 57, X: 58, Y: 59, Z: 60};

////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Database Configuration.
////////////////////////////////////////////////////////////////////////////////////////////////

var DB_IPADDRESS    = '50.62.209.12';

// Live site settings.
/*var DB_USERNAME     = 'sysadmin';
var DB_PASSWORD     = 'Zikj3?67';
var DB_NAME         = 'biggest_winner';*/

// Test site settings.
var DB_USERNAME     = 'sysadmin_test';
var DB_PASSWORD     = 'ysdM70?8';
var DB_NAME         = 'biggest_winner_test';

var DB_URLSTRING    = 'dbUserName=' + DB_USERNAME + '&dbPassword=' + DB_PASSWORD + '&dbIP=' + DB_IPADDRESS + '&dbName=' + DB_NAME;

////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Form Configuration.
////////////////////////////////////////////////////////////////////////////////////////////////

var INPUTEMAIL = 'INPUT_EMAIL';

////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Email Configuration.
////////////////////////////////////////////////////////////////////////////////////////////////

// Gmail smtp setup.
/*var SMTP            = 'aspmx.l.google.com';
var MAILCLIENT      = 'biggestwinnertracker@gmail.com';*/

// Godaddy smtp setup.
var SMTP            = 'smtpout.secureserver.net';
var MAILCLIENT      = 'admin@biggestwinnertracker.com';

var EMAILTEMPLATE   = '<b>%USER_NAME%</b> just posted to the %FORUM% page!<br/><br/>%EMAIL_BODY%<br/><br/>Join in on the conversation by posting a <a href="http://www.biggestwinnertracker.com/%FORUM%.html">comment!</a>';

var SMTP_URLSTRING  = 'smtp=' + SMTP + '&mailClient=' + MAILCLIENT + '&mailTo=%MAIL_TO%&subject=%SUBJECT%&message=%MESSAGE%';

////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Point Configuration.
////////////////////////////////////////////////////////////////////////////////////////////////

var POINTTYPES = {
    "scriptures": 1,
    "exercise": 2,
    "water": 3,
    "treats": 4,
    "scripturesPost": 5
};
var POINTTYPELOOKUP = {
    "1": "scriptures",
    "2": "exercise",
    "3": "water",
    "4": "treats",
    "5": "scripturesPost"
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Group: Date Configuration.
////////////////////////////////////////////////////////////////////////////////////////////////

var STARTDATE   = '05/04/2015';
var ENDDATE     = '07/31/2015';