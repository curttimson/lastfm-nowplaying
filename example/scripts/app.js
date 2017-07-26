angular.module('app', ['lastfm-nowplaying'])
  .controller('mainCtrl', ['$scope', function($scope){
    $scope.lastFmConfig = {
      apiKey = 'API_KEY',
      username = 'username'
    };
  }]);
