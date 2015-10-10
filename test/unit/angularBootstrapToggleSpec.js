'use strict';

describe('', function () {

  var compile, scope, directiveElem;

  beforeEach(function () {
    // Load the ui.toggle module, which contains the directive
    module('ui.toggle');

    inject(function ($compile, $rootScope) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.toggleStatus = jasmine.createSpy('toggleStatus');
    });

    directiveElem = getCompiledElement();
  });

  function getCompiledElement(template) {
    var t = template || '<toggle ng-model="model"></toggle>';
    var element = angular.element(t);
    var compiledElement = compile(element)(scope);
    scope.$digest();
    return compiledElement;
  }

  it('should have default label elements', function () {
    var labelElement = directiveElem.find('label');

    expect(labelElement).toBeDefined();
    expect(angular.element(labelElement[0]).text()).toEqual('On');
    expect(angular.element(labelElement[1]).text()).toEqual('Off');
  });

  it('should have customized label elements', function () {
    directiveElem = getCompiledElement('<toggle ng-model="model" ng-change="toggleStatus(m)" on="Enabled" off="Disabled"></toggle>')
    var labelElement = directiveElem.find('label');

    expect(labelElement).toBeDefined();
    expect(angular.element(labelElement[0]).text()).toEqual('Enabled');
    expect(angular.element(labelElement[1]).text()).toEqual('Disabled');
  });

  it('ngChange should be called', function () {
    directiveElem = getCompiledElement('<toggle ng-model="model" ng-change="toggleStatus(m)" on="Enabled" off="Disabled"></toggle>')
    var wrapper = directiveElem.find('div')[0];
    angular.element(wrapper).triggerHandler('click');
    scope.$digest();

    expect(scope.toggleStatus).toHaveBeenCalled();
  });

  it('should in the off status', function () {
    var wrapper = directiveElem.find('div')[0];

    expect(angular.element(wrapper).hasClass('off')).toBe(true);
  });

  it('should in the on status', function () {
    scope.model = true;
    scope.$digest()
    var wrapper = directiveElem.find('div')[0];

    expect(angular.element(wrapper).hasClass('off')).toBe(false);
  });

  it('should update model value', function () {
    var wrapper = directiveElem.find('div')[0];
    angular.element(wrapper).triggerHandler('click');
    scope.$digest();

    expect(angular.element(wrapper).hasClass('off')).toBe(false);
    expect(scope.model).toBe(true);
  });

  it('should fail if ng-model is not specified', function () {
    expect(function () {
      getCompiledElement('<toggle ng-change="toggleStatus(m)" on="Enabled" off="Disabled"></toggle>');
    }).toThrow();
  });

  it('should work if ng-model is specified and not wrapped in form', function () {
    expect(function () {
      getCompiledElement();
    }).not.toThrow();
  });
});
