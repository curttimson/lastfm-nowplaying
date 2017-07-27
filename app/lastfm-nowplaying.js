angular.module('lastfm-nowplaying', [])
  .directive('lastfmnowplaying', ['uiCreation', 'lastFmAPI', 'lastFmParser', function(uiCreation, lastFmAPI, lastFmParser){

    var link = function(scope, element, attrs){

      lastFmAPI.getLatestScrobbles(scope.config).then(function(data){

        var latestTrack = lastFmParser.getLatestTrack(data);

        angular.forEach(element, function(e,i){

          angular.element(element).addClass('lastfm-nowplaying');
          uiCreation.create(e, scope, latestTrack);

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
  .factory('uiCreation', ['$q', 'canvasUI', function($q, canvasUI){

    var create = function(e, scope, latestTrack){
      createCanvas(e, scope, latestTrack.xLargeImgUrl).then(function(data){
        createImage(e, latestTrack.largeImgUrl);
        createText(e, latestTrack, data.useBlackText);
      });
    }

    var createCanvas = function(e, scope, imgUrl){
      var canvas = document.createElement('canvas');
      e.appendChild(canvas);

      var defer = $q.defer();

      canvasUI.applyUI(e, canvas, imgUrl, function(){

        setTimeout(function(){

          var canvasColor = getCanvasColor(canvas);

          console.log('canvasColor', canvasColor);

          var useBlackText = false;
          if ((canvasColor.r*0.299 + canvasColor.g*0.587 + canvasColor.b*0.114) > 186){
            useBlackText = true;
          }
          console.log('useBlackText', useBlackText);

          defer.resolve({
            useBlackText: useBlackText
          });

        },200);

      });

      return defer.promise;

    };

    var getCanvasColor = function(canvas){
      var width = canvas.width;
      var height = canvas.height;
      var ctx = canvas.getContext('2d');
      var imageData = ctx.getImageData(0, 0, width, height);
      var data = imageData.data;
      var r = 0;
      var g = 0;
      var b = 0;

      for (var i = 0, l = data.length; i < l; i += 4) {
        r += data[i];
        g += data[i+1];
        b += data[i+2];
      }

      r = Math.floor(r / (data.length / 4));
      g = Math.floor(g / (data.length / 4));
      b = Math.floor(b / (data.length / 4));

      return { r: r, g: g, b: b };
    }

    var createImage = function(e, imgUrl){
      var image = document.createElement('img');
      angular.element(image).attr('src', imgUrl);
      e.appendChild(image);
    };

    var createText = function(e, latestTrack, useBlackText){

      var header = document.createElement('h3');
      angular.element(header).text('Now Playing');

      var trackTitle = document.createElement('p');
      angular.element(trackTitle).addClass('track')
                                .text(latestTrack.title);

      var trackArtist = document.createElement('p');
      angular.element(trackArtist).addClass('artist')
                                .text(latestTrack.artist);

      var div = document.createElement('div');
      angular.element(div).addClass('text');
      angular.element(div).toggleClass('black', useBlackText);
      div.appendChild(header);
      div.appendChild(trackTitle);
      div.appendChild(trackArtist);

      e.appendChild(div);
    }

    return {
      create: create
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
        title: latestTrack.name,
        artist: latestTrack.artist['#text'],
        largeImgUrl: latestTrack.image[2]['#text'],
        xLargeImgUrl: latestTrack.image[3]['#text']
      }
    }

    return {
      getLatestTrack: getLatestTrack
    }
  }])
  .factory('canvasUI', ['imageFx', function(imageFx){

    var applyUI = function(e, canvas, imgUrl, callback){
      imageFx.blur($(e), canvas, 6, imgUrl, function(){
        callback();
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
            image.crossOrigin = "Anonymous";
            image.onload = function () {

                canvasImage = new CanvasImage(canvas, this);
                canvasImage.blur(blurAmount);
                maintainRatio($(element), $(canvas), image);

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
            blur: function (element, canvas, blurAmount, src, callback) {
                var canvasSupported = !!$window.HTMLCanvasElement;
                if(canvasSupported) {

                    return blurGenerator(element, canvas, blurAmount, src, callback);
                } else {
                    return false;
                }
            }
        };
    });
