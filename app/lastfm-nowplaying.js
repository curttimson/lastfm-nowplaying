angular.module('lastfm-nowplaying', [])
  .directive('lastfmnowplaying', [function(){

    var link = function(scope, element, attrs){
      
    };

    return {
      scope:{
        config: '=config'
      },
      link: link
    },
  }]);
