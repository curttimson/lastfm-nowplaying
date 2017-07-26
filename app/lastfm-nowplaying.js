angular.module('lastfm-nowplaying', [])
  .directive('lastfmnowplaying', ['lastFmAPI', 'canvasUI', function(lastFmAPI, canvasUI){

    var createCanvas = function(e, scope, data){
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      e.appendChild(canvas);
      canvasUI.applyUI(e, canvas, data);
    };

    var link = function(scope, element, attrs){

      lastFmAPI.getLatestScrobbles(scope.config).then(function(data){

        angular.forEach(element, function(e,i){

          createCanvas(e, scope, data);

        });

      });

    };

    return {
      scope:{
        config: '=config'
      },
      link: link
    };
  }])
  .factory('lastFmAPI', ['$q', '$http', function($q, $http){

    var getLatestScrobbles = function(config){

      var apiUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks'
                    + '&user=' + config.user
                    + '&api_key=' + config.apiKey
                    + '&format=json&limit=2';


      var defer = $q.defer();
      $http.get(apiUrl).then(function(data){
        console.log('data', data);
        defer.resolve(data);
      });
      return defer.promise;
    };

    return {
      getLatestScrobbles: getLatestScrobbles
    };

  }])
  .factory('canvasUI', [function(){

    var applyUI = function(e, canvas, lastFmData){

      var imgUrl = lastFmData.data.recenttracks.track[0].image[1]['#text'];

      console.log(imgUrl);

    };

    return {
      applyUI: applyUI
    };

  }]);;
