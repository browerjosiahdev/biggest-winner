$(document).ready(function()
{
    if (sessionStorage.getItem("userID") > 0)
    {
        console.log("User " + sessionStorage.getItem("userID") + " is logged in.");
    }
    else
        window.location.href = "login.html";
});