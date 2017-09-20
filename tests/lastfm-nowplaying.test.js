describe('directive: lastfm-nowplaying', function () {

  var element, scope;

  beforeEach(module('lastfm-nowplaying'));

  beforeEach(inject(function($rootScope, $compile) {

    var compiledElement = function(element) {
      scope = $rootScope.$new();
      element = $compile(element)(scope);
      scope.$digest();
    }

  }));

});
