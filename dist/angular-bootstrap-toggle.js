(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('angularBootstrapToggle.config', [])
      .value('angularBootstrapToggle.config', {
          debug: true
      });

  // Modules
  angular.module('angularBootstrapToggle.directives', []);
  angular.module('angularBootstrapToggle',
      [
          'angularBootstrapToggle.config',
          'angularBootstrapToggle.directives'
      ]);

})(angular);
