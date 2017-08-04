# lastfm-nowplaying
Last.fm "Now Playing" AngularJs Module

## Example

![](https://user-images.githubusercontent.com/15653985/28838108-2fcc5a1c-76e7-11e7-8282-65a3089a886c.png)

### Try it yourself

https://curttimson.github.io/lastfm-nowplaying/

## Installation

```
npm install lastfm-nowplaying
```
https://www.npmjs.com/package/lastfm-nowplaying

### Required Files
```
./node_modules/lastfm-nowplaying/dist/lastfm-nowplaying.min.js
./node_modules/lastfm-nowplaying/dist/lastfm-nowplaying.min.css
```


### Configuration

 - `apiKey` - Your Last.fm API Key which can be obtained here: https://www.last.fm/api/account/create
 - `user` - Your Last.fm username

#### Optional Configuration

 - `containerClass` - Allows the ability to specify a class for the content within the last.fm now playing component. This will allow you to set the same margins as the rest of your content.


### Example Usage

```
angular.module('app', ['lastfm-nowplaying'])
  .controller('mainCtrl', ['$scope', function($scope){

    $scope.lastFmConfig = {
        apiKey: 'API_KEY',
        user: 'USERNAME',
        containerClass: 'content'
      };

  }]);
```

```
<div lastfmnowplaying config="lastFmConfig"></div>
```


## Development

Please feel free to help develop this further. Below are the CLI steps you'll require to get setup.

```
npm install
gulp dev
```
