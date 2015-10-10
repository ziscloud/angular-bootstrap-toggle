'use strict';

describe('', function () {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function (module) {
    return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function () {

    // Get module
    module = angular.module('ui.toggle');
    dependencies = module.requires;
  });

  it('should load config module', function () {
    expect(hasModule('ui.toggle')).to.be.ok;
  });
});
