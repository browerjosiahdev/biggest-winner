/////////////////////////////////////////////////////////////////////////////////////////////
// Group: Apps.
/////////////////////////////////////////////////////////////////////////////////////////////

var m_masterApp     = angular.module('MasterApp', []);
var m_postsApp      = angular.module('PostsApp', []);

/////////////////////////////////////////////////////////////////////////////////////////////
// Group: Controllers.
/////////////////////////////////////////////////////////////////////////////////////////////

m_masterApp.controller('MasterBodyCtrl', ['$scope', '$http', function( $scope, $http ) 
{
    $http.get('data/points.json').success(function( data ) 
    {
        $scope.points = data;
    });
}]);

m_postsApp.controller('PostsBodyCtrl', ['$scope', '$http', function( $scope, $http )
{
    $http.get('data/scriptures.json').success(function( data )
    {
        $scope.posts = data;
    });
}]);