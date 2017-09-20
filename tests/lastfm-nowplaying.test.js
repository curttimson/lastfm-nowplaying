describe('directive: lastfm-nowplaying', function () {

  var element, scope, rootScope, compile;

  beforeEach(module('lastfm-nowplaying'));

  beforeEach(inject(function($rootScope, $compile) {
    rootScope = $rootScope;
    compile = $compile;
    scope = rootScope.$new();
  }));

  var compiledElement = function(element) {
    element = compile(element)(scope);

    scope.$digest();
    return element;
  }

  it('should display empty element if no scope data passed', function(){
    var element = compiledElement('<div lastfmnowplaying></div>');
    expect(element[0].outerHTML).toBe('<div lastfmnowplaying="" class="ng-scope ng-isolate-scope"></div>');
  });

});
