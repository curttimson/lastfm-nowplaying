angular.module('lastfm-nowplaying', [])
  .directive('lastfmnowplaying', ['uiCreation', 'lastFmAPI', 'lastFmParser', function(uiCreation, lastFmAPI, lastFmParser){

    var link = function(scope, element, attrs){

      scope.$watch('config', function(value) {
        load();
      });

      var load = function(){

        var latestTrack;

        if (scope.config){

          if (scope.config.apiKey){

            lastFmAPI.getLatestScrobbles(scope.config).then(function(data){

              latestTrack = lastFmParser.getLatestTrack(data);
              angular.element(element).addClass('lastfm-nowplaying');
              uiCreation.create(element[0], scope.config.containerClass, latestTrack);

            }, function(reason) {
              //Last.fm failure
            });

          }
          else{
            var latestTrack = {
              title: scope.config.title,
              artist: scope.config.artist,
              largeImgUrl: scope.config.imgUrl,
              xLargeImgUrl: scope.config.backgroundImgUrl,
            }
            angular.element(element).addClass('lastfm-nowplaying');
            uiCreation.create(element[0], scope.config.containerClass, latestTrack);
          }

        }
      }

    };

    return {
      scope:{
        config: '=config'
      },
      link: link
    };
  }])
  .factory('uiCreation', ['$q', '$interval', 'canvasUI', function($q, $interval, canvasUI){

    var create = function(e, containerClass, latestTrack){
      createCanvas(e, latestTrack.xLargeImgUrl).then(function(data){

        angular.element(e).find('div').remove();

        var container = document.createElement('div');
        if (containerClass){
          angular.element(container).addClass(containerClass);
        }

        createArtwork(container, latestTrack.largeImgUrl);
        createText(container, latestTrack, data.useBlackText);

        e.appendChild(container);
      });
    }

    var createCanvas = function(e, imgUrl){

      e.innerHTML = '';

      var canvas = document.createElement('canvas');
      e.appendChild(canvas);

      var defer = $q.defer();

      canvasUI.applyUI(e, canvas, imgUrl, function(){

        $interval(function(){

          var canvasColor = canvasUI.getAverageCanvasColor(canvas);

          var useBlackText = false;
          if ((canvasColor.r*0.299 + canvasColor.g*0.587 + canvasColor.b*0.114) > 186){
            useBlackText = true;
          }

          defer.resolve({
            useBlackText: useBlackText
          });

        },200);

      });

      return defer.promise;

    };

    var createArtwork = function(e, imgUrl){
      var artwork = document.createElement('div');
      angular.element(artwork).attr('style', 'background-image:url(' + imgUrl + ');')
                            .addClass('artwork');
      e.appendChild(artwork);
    };

    var createText = function(e, latestTrack, useBlackText){

      var header = document.createElement('h3');
      angular.element(header).text(latestTrack.nowplaying ? 'Now Playing' : 'Listening To');

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

      var defer = $q.defer();

      if (config && config.user && config.apiKey){

        var apiUrl = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks'
                      + '&user=' + config.user
                      + '&api_key=' + config.apiKey
                      + '&format=json&limit=1';

        $http.get(apiUrl).then(function(data){
          defer.resolve(data);
        });

      }
      else{
        defer.reject('user or apiKey missing');
      }
      return defer.promise;
    };

    return {
      getLatestScrobbles: getLatestScrobbles
    };

  }])
  .factory('lastFmParser', [function(){

      var getLatestTrack = function(lastFMApiData){
      var latestTrack = lastFMApiData.data.recenttracks.track[0];

      return {
        title: latestTrack.name,
        artist: latestTrack.artist['#text'],
        largeImgUrl: latestTrack.image[2]['#text'],
        xLargeImgUrl: latestTrack.image[3]['#text'],
        nowplaying: latestTrack['@attr'] && latestTrack['@attr'].nowplaying
      }
    }

    return {
      getLatestTrack: getLatestTrack
    }
  }])
  .factory('canvasUI', ['imageFx', function(imageFx){

    var applyUI = function(e, canvas, imgUrl, callback){
      imageFx.blur(e, canvas, 6, imgUrl, function(){
        callback();
      });
    };

    var getAverageCanvasColor = function(canvas){
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

    return {
      applyUI: applyUI,
      getAverageCanvasColor: getAverageCanvasColor
    };

  }])
  .factory('imageFx', ['$window', '$timeout', function ($window, $timeout) {

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

          var marginLeft = 0;
          var marginTop = 0;

          if((image.width / image.height) > (container.clientWidth / container.clientHeight)) {

            canvas.style.height = container.clientHeight + "px";
            canvas.style.width = (canvas.clientHeight * (image.width / image.height)) + "px";

            marginLeft = container.clientWidth - canvas.clientWidth;

          } else {
            canvas.style.width = (container.clientWidth + "px");
            canvas.style.height = (canvas.clientWidth * (image.height / image.width)) + "px";
          }

          marginTop = ((canvas.clientHeight-container.clientHeight)/2)*-1;

          canvas.style.marginLeft = marginLeft + 'px';
          canvas.style.marginTop = marginTop + 'px';

        };

        var blurGenerator = function (element, canvas, blurAmount, src, callback) {

            var image, canvasImage;

            var _maintainRatio = function(){
              maintainRatio(element, canvas, image);
            };

            image = document.createElement("img");
            image.crossOrigin = "Anonymous";
            image.onload = function () {

                canvasImage = new CanvasImage(canvas, this);
                canvasImage.blur(blurAmount);
                _maintainRatio();

              if(callback) {
                callback();
              }
            };
            image.src = src;

            angular.element($window).bind('resize', function(){
              _maintainRatio();
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
    }]);
