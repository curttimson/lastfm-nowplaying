angular.module('lastfm-nowplaying', [])
  .directive('lastfmnowplaying', ['lastFmAPI', function(lastFmAPI){

    var link = function(scope, element, attrs){

      lastFmAPI.getLatestScrobbles(scope.config).then(function(data){

        console.log('lastfmAPI callback');

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

  }]);
