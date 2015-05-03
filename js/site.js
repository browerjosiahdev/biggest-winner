var m_masterApp = angular.module('MasterApp', []);

m_masterApp.controller('MasterBodyCtrl', ['$scope', '$http', function( $scope, $http ) {
    $http.get('data/points.json').success(function( data ) {
        $scope.points = data; 
    });        
}]);