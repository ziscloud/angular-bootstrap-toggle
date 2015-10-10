'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('angularBootstrapToggle');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('angularBootstrapToggle.config')).to.be.ok;
  });

  

  
  it('should load directives module', function() {
    expect(hasModule('angularBootstrapToggle.directives')).to.be.ok;
  });
  

  

});