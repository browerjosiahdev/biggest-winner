$(document).ready(function()
{
    if (sessionStorage.getItem("userID") > 0)
    {
        
    }
    else
        window.location.href = "login.html";
});