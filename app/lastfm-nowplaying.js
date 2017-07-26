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
  .factory('canvasUI', ['imageFx', function(imageFx){

    var applyUI = function(e, canvas, lastFmData){

      var imgUrl = lastFmData.data.recenttracks.track[0].image[1]['#text'];

      imageFx.blur(angular.element(e), canvas, 1, imgUrl, function(){
        console.log('blur done');
      });

    };

    return {
      applyUI: applyUI
    };

  }])
  .factory('imageFx', function ($window, $timeout) {

        var CanvasImage = function (e, t) {
            this.image = t;
            this.element = e;
            this.element.width = this.image.width;
            this.element.height = this.image.height;
            this.context = this.element.getContext("2d");
            this.context.drawImage(this.image, 0, 0);
        };

        CanvasImage.prototype = {
            blur: function (e) {
                this.context.globalAlpha = 0.5;
                for (var t = -e; t <= e; t += 2) {
                    for (var n = -e; n <= e; n += 2) {
                        this.context.drawImage(this.element, n, t);
                        if (n >= 0 && t >= 0) {
                            this.context.drawImage(this.element, -(n - 1), -(t - 1));
                        }
                    }
                }
                this.context.globalAlpha = 1;
            }
        };

        var blurGenerator = function (element, canvas, blurAmount, src, callback) {

                var image, canvasImage;
                var maintainRatio = function() {

                  if((image.width / image.height) > ($window.innerWidth / $window.innerHeight)) {

                    element.height($window.innerHeight);
                    element.width(element.height() * (image.width / image.height))
                    element.css('marginLeft', $window.innerWidth - element.width());

                  } else {
                    element.width($window.innerWidth);
                    element.height(element.width() * (image.height / image.width));
                    element.css('marginLeft', 0);
                  }

                };
                image = document.createElement("img");
                image.onload = function () {

                    canvasImage = new CanvasImage(canvas, this);
                    canvasImage.blur(blurAmount);
                    //maintainRatio();

                    element.addClass('loaded');

                  if(callback) {
                      callback();
                  }
                };
                image.src = src;

                angular.element($window).bind('resize', function(){
                  maintainRatio();
                });

        };

        return {
            blur: function (element, blurAmount, src, callback) {

                var canvasSupported = !!$window.HTMLCanvasElement;
                if(canvasSupported) {

                    return blurGenerator(element, blurAmount, src, callback);
                } else {
                    return false;
                }
            }
        };
    });
