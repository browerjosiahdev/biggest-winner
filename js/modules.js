(function()
{
    
var appBiggestWinner = angular.module('BiggestWinnerApp', []);

appBiggestWinner.controller('PostsBodyController', ['$scope', function( $scope )
{
    getScripturePosts().then(function( data )
    {
        $scope.posts = data;
        
        $scope.$apply();
        
        onScripturesPageLoaded();
    });
}])
.controller('CommentController', ['$scope', function( $scope )
{    
    this.comment = {};
    this.addComment = function( post )
    {
        this.comment.scriptures_comments_date_created = getCurrentDate(true, true);
        this.comment.users_name                       = getUserName();
        
        post.comments = [this.comment].concat(post.comments);
        
        this.comment = {};
    };
}])
.controller('LeaderboardBodyController', ['$scope', function( $scope )
{
    getLeaders().then(function( data )
    {
        $scope.leaders = data;
        
        $scope.$apply();
    });
}])
.controller('LoginBodyController', ['$scope', function( $scope )
{
    $scope.name     = '';
    $scope.password = '';
}])
.directive('appHeader', function()
{
    return {
        template: '<div class="header">' + 
            '<div class="title"><span class="up">Christ</span><span class="">Family</span><span class="down">Temple</span><span class="">Church</span><span class="up">Scriptures</span><span class="">Prayer</span><span class="down">Health</span></div>' + 
        '</div>'  
    };
})
.directive('appTopMenu', function()
{
    return {
        template: '<div class="menu">' + 
                      '<div class="link"><a href="index.html">Home</a></div>' + 
                      '<div class="link"><a href="scriptures.html">Scriptures</a></div>' + 
                      '<div class="link"><a href="leaderboard.html">Leaderboard</a></div>' + 
                      '<div class="link"><a href="manage_account.html">Account</a></div>' + 
                  '</div>'
    };
});
    
})();