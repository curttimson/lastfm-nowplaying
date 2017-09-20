angular.module('app', ['lastfm-nowplaying'])
  .controller('mainCtrl', ['$scope', function($scope){

    $scope.loadLastFM = function(){

      $scope.lastFmConfig = {
        apiKey: $scope.apiKey,
        user: $scope.username,
        title: $scope.title,
        artist: $scope.artist,
        largeImgUrl: $scope.largeimgurl,
        xLargeImgUrl: $scope.xlargeimgurl,
        containerClass: 'content'
      };

    }

  }]);
