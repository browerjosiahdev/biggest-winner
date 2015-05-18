(function()
{
/////////////////////////////////////////////////////////////////////////////////////////////
// Group: Apps.
/////////////////////////////////////////////////////////////////////////////////////////////

var m_postsApp       = angular.module('PostsApp', []);
var m_leaderboardApp = angular.module('LeaderboardApp', []);

/////////////////////////////////////////////////////////////////////////////////////////////
// Group: Controllers.
/////////////////////////////////////////////////////////////////////////////////////////////

m_postsApp.controller('PostsBodyController', ['$scope', function( $scope )
{
    getScripturePosts().then(function( data )
    {
        $scope.posts = data;
        
        $scope.$apply();
        
        onScripturesPageLoaded();
    });
}]);

m_postsApp.controller('CommentController', ['$scope', function( $scope )
{    
    this.comment = {};
    this.addComment = function( post )
    {
        this.comment.scriptures_comments_date_created = getCurrentDate(true, true);
        this.comment.users_name                       = getUserName();
        
        post.comments = [this.comment].concat(post.comments);
        
        this.comment = {};
    };
}]);

m_leaderboardApp.controller('LeaderboardBodyController', ['$scope', function( $scope )
{
    getLeaders().then(function( data )
    {
        $scope.leaders = data.slice(0, 5);
        
        $scope.$apply();
    });
}]);
})();