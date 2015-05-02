var m_masterApp = angular.module('MasterApp', []);

m_masterApp.controller('MasterBodyCtrl', ['$scope', function( $scope ) {
    $scope.tests = [
        {
            'content': 'This is my test content - 1'
        },
        {
            'content': 'This is my test content - 2'
        },
        {
            'content': 'This is my test content - 3'
        },
        {
            'content': 'This is my test content - 4'
        }
    ];
}]);