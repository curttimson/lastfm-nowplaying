describe('service: lastFmParser', function () {

  var _lastFmParser;

  beforeEach(module('lastfm-nowplaying'));

  beforeEach(inject(function(lastFmParser) {
    _lastFmParser = lastFmParser;
  }));

  it('should parse last.fm api data to latestTrack object format', function(){

    var lastFMApiData = {
      data: JSON.parse('{"recenttracks":{"track":[{"artist":{"#text":"Foo Fighters","mbid":"67f66c07-6e61-4026-ade5-7e782fad3a5d"},"name":"Dirty Water","streamable":"0","mbid":"","album":{"#text":"Concrete and Gold","mbid":""},"url":"https://www.last.fm/music/Foo+Fighters/_/Dirty+Water","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/d5d57d52ebe8e00879960dd7cdcf9709.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/d5d57d52ebe8e00879960dd7cdcf9709.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/d5d57d52ebe8e00879960dd7cdcf9709.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/d5d57d52ebe8e00879960dd7cdcf9709.png","size":"extralarge"}],"date":{"uts":"1506085108","#text":"22 Sep 2017, 12:58"}}],"@attr":{"user":"curty_","page":"1","perPage":"1","totalPages":"136177","total":"136177"}}}')
    };

    var expectedOutput = {
      title: "Dirty Water",
      artist: "Foo Fighters",
      largeImgUrl: "https://lastfm-img2.akamaized.net/i/u/174s/d5d57d52ebe8e00879960dd7cdcf9709.png",
      xLargeImgUrl: "https://lastfm-img2.akamaized.net/i/u/300x300/d5d57d52ebe8e00879960dd7cdcf9709.png",
      nowplaying: undefined
    };

    var actualOutput = _lastFmParser.getLatestTrack(lastFMApiData);

    expect(expectedOutput).toEqual(actualOutput);
  });

});
