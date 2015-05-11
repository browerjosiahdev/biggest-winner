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
    $scope.comment = {};
    $scope.addComment = function( post )
    {
        $scope.comment.date_created = getCurrentDate();
        $scope.comment.user_name    = getUserName();
        
        post.comments.push($scope.comment);
        
        $scope.comment = {};
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