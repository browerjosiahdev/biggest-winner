/////////////////////////////////////////////////////////////////////////////////////////////
// Group: Apps.
/////////////////////////////////////////////////////////////////////////////////////////////

var m_postsApp = angular.module('PostsApp', []);

/////////////////////////////////////////////////////////////////////////////////////////////
// Group: Controllers.
/////////////////////////////////////////////////////////////////////////////////////////////

m_postsApp.controller('PostsBodyController', ['$scope', function( $scope )
{
    getScripturePosts().then(function( data )
    {
        $scope.posts = data;
        
        $scope.$apply();
    });
}]);

m_postsApp.controller('CommentController', ['$scope', function( $scope )
{
    $scope.comment = {};
    $scope.addComment = function( post )
    {
        
console.log('addComment()');
        
        $scope.comment.date_created = getCurrentDate();
        $scope.comment.user_name    = getUserName();
        
        post.comments.push($scope.comment);
        
        $scope.comment = {};
    };
}]);