angular.module('lastfm-nowplaying', [])
  .directive('lastfmnowplaying', ['uiCreation', 'lastFmAPI', 'lastFmParser', function(uiCreation, lastFmAPI, lastFmParser){

    var link = function(scope, element, attrs){

      lastFmAPI.getLatestScrobbles(scope.config).then(function(data){

        var latestTrack = lastFmParser.getLatestTrack(data);

        angular.forEach(element, function(e,i){

          angular.element(element).addClass('lastfm-nowplaying');
          uiCreation.createCanvas(e, scope, latestTrack.xLargeImgUrl);

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
  .factory('uiCreation', ['canvasUI', function(canvasUI){

    var createCanvas = function(e, scope, imgUrl){
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      e.appendChild(canvas);
      canvasUI.applyUI(e, canvas, imgUrl);
    };

    return {
      createCanvas: createCanvas
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
        defer.resolve(data);
      });
      return defer.promise;
    };

    return {
      getLatestScrobbles: getLatestScrobbles
    };

  }])
  .factory('lastFmParser', [function(){

    var getLatestTrack = function(lastFMApiData){
      var latestTrack = lastFMApiData.data.recenttracks.track[0]

      console.log('latestTrack', latestTrack);

      return {
        largeImgUrl: latestTrack.image[2]['#text'],
        xLargeImgUrl: latestTrack.image[3]['#text']
      }
    }

    return {
      getLatestTrack: getLatestTrack
    }
  }])
  .factory('canvasUI', ['imageFx', function(imageFx){

    var applyUI = function(e, canvas, imgUrl){
      imageFx.blur($(e), canvas, 6, imgUrl);
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

        var maintainRatio = function($container, $canvas, image) {

          var marginLeft = 0;
          var marginTop = 0;

          if((image.width / image.height) > ($container.width() / $container.height)) {

            $canvas.height($container.height());
            $canvas.width($canvas.height() * (image.width / image.height))
            marginLeft = $container.width() - $canvas.width();

          } else {
            $canvas.width($container.width());
            $canvas.height($canvas.width() * (image.height / image.width));
          }

            marginTop = (($canvas.height()-$container.height())/2)*-1;


          $canvas.css({
            'marginLeft': marginLeft,
            'marginTop': marginTop
          });

        };

        var blurGenerator = function (element, canvas, blurAmount, src, callback) {

            var image, canvasImage;

            image = document.createElement("img");
            image.onload = function () {

                canvasImage = new CanvasImage(canvas, this);
                canvasImage.blur(blurAmount);
                maintainRatio($(element), $(canvas), image);

                element.addClass('loaded');

              if(callback) {
                  callback();
              }
            };
            image.src = src;

            angular.element($window).bind('resize', function(){
              maintainRatio($(element), $(canvas), image);
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
