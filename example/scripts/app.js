angular.module('app', ['lastfm-nowplaying'])
  .controller('mainCtrl', ['$scope', function($scope){

    $scope.loadLastFM = function(){

      $scope.lastFmConfig = {
        apiKey: $scope.apiKey,
        user: $scope.username,
        title: $scope.title,
        artist: $scope.artist,
        imgUrl: $scope.largeimgurl,
        backgroundImgUrl: $scope.xlargeimgurl,
        containerClass: 'content'
      };

    }

  }]);
