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

      var imgUrl = lastFmData.data.recenttracks.track[0].image[3]['#text'];

      imageFx.blur($(e), canvas, 6, imgUrl, function(){
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

        var maintainRatio = function(container, canvas, image) {

          if((image.width / image.height) > (container.innerWidth / container.innerHeight)) {

            canvas.height(container.innerHeight);
            canvas.width(canvas.height() * (image.width / image.height))
            canvas.css('marginLeft', container.innerWidth - canvas.width());

          } else {
            canvas.width(container.innerWidth);
            canvas.height(canvas.width() * (image.height / image.width));
            canvas.css('marginLeft', 0);
          }

        };

        var blurGenerator = function (element, canvas, blurAmount, src, callback) {

            var image, canvasImage;

            image = document.createElement("img");
            image.onload = function () {

                canvasImage = new CanvasImage(canvas, this);
                canvasImage.blur(blurAmount);
                //maintainRatio($window, canvas, image);

                element.addClass('loaded');

              if(callback) {
                  callback();
              }
            };
            image.src = src;

            angular.element($window).bind('resize', function(){
              maintainRatio($window, canvas, image);
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
