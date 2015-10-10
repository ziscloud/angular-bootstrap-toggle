(function () {
  'use strict';

  angular.module('ui.toggle',[])

    .value('$toggleSuppressError', false)

    .constant('toggleConfig', {
      /**
       * Type: string/html
       * Default: "On"
       * Description: Text of the on toggle
       */
      on: 'On',
      /**
       * Type: string/html
       * Default: "Off"
       * Description: Text of the off toggle
       */
      off: 'Off',
      /**
       * Type: string
       * Default: ''
       * Description: Size of the toggle. Possible values are btn-lg, btn-sm, btn-xs.
       */
      size: '',
      /**
       * Type: string
       * Default: "btn-primary"
       * Description: Style of the on toggle. Possible values are btn-default, btn-primary, btn-success, btn-info, btn-warning, btn-danger
       */
      onstyle: 'btn-primary',
      /**
       * Type: string
       * Default: "btn-default"
       * Description: Style of the off toggle. Possible values are btn-default, btn-primary,btn- success, btn-info, btn-warning, btn-danger
       */
      offstyle: 'btn-default',
      /**
       * Type: string
       * Default: ''
       * Description: Appends the value to the class attribute of the toggle. This can be used to apply custom styles. Refer to Custom Styles for reference.
       */
      style: '',
      /**
       * Type: integer
       * Default: null
       * Description: Sets the width of the toggle. if set to null, width will be calculated.
       */
      width: null,
      /**
       * Type: integer
       * Default: null
       * Description: Sets the height of the toggle. if set to null, height will be calculated.
       */
      height: null
    })

    .controller('ToggleController',
    ['$scope', '$attrs', '$interpolate', '$log', 'toggleConfig', '$toggleSuppressError',
      function ($scope, $attrs, $interpolate, $log, toggleConfig, $toggleSuppressError) {
        var self = this,
          ngModelCtrl = {$setViewValue: angular.noop};

        // Configuration attributes
        angular.forEach(['on', 'off', 'size', 'onstyle', 'offstyle', 'style', 'width', 'height'], function (key, index) {
          self[key] = angular.isDefined($attrs[key]) ? (index < 6 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : toggleConfig[key];
        });

        this.init = function (ngModelCtrl_) {
          ngModelCtrl = ngModelCtrl_;

          ngModelCtrl.$render = function () {
            self.render();
          };

          ngModelCtrl.$viewChangeListeners.push(function () {
            $scope.$eval($attrs.ngChange);
          });

          var labels = self.element.find('label');
          angular.element(labels[0]).html(self.on);
          angular.element(labels[1]).html(self.off);

          var spans = self.element.find('span');

          var width = self.width || Math.max(labels[0].offsetWidth, labels[1].offsetWidth) + (spans[0].offsetWidth / 2);
          var height = self.height || Math.max(labels[0].offsetHeight, labels[1].offsetHeight);

          $scope.wrapperStyle = {width: width, height: height};

          $scope.onClass = [self.size, 'toggle-on'];
          $scope.offClass = [self.size, 'toggle-off'];
          $scope.handleClass = [self.size, 'toggle-handle'];
        };

        this.render = function () {
          if (angular.isDefined(ngModelCtrl.$viewValue)) {
            this.isOn = ngModelCtrl.$viewValue;
          } else {
            this.isOn = false;
          }
          if (this.isOn) {
            $scope.wrapperClass = [self.onstyle, self.size, self.style];
          } else {
            $scope.wrapperClass = [self.offstyle, 'off ', self.size, self.style];
          }
        };

        $scope.onSwitch = function (evt) {
          ngModelCtrl.$setViewValue(!ngModelCtrl.$viewValue);
          ngModelCtrl.$render();
        };

        // Watchable date attributes
        angular.forEach(['ngModel'], function (key) {
          var watch = $scope.$parent.$watch($attrs[key], function (value) {
            ngModelCtrl.$render();
          });
          $scope.$parent.$on('$destroy', function () {
            watch();
          });
        });
      }])

    .directive('toggle', function () {
      return {
        restrict: 'E',
        transclude: true,
        template: '<div class="toggle btn" ng-class="wrapperClass" ng-style="::wrapperStyle" ng-click="onSwitch()"><div class="toggle-group"><label class="btn btn-primary" ng-class="::onClass"></label><label class="btn btn-default active" ng-class="::offClass"></label><span class="btn btn-default" ng-class="::handleClass"></span></div></div>',
        scope: {
          bindModel: '=ngModel'
        },
        require: ['toggle', 'ngModel'],
        controller: 'ToggleController',
        controllerAs: 'toggle',
        link: function (scope, element, attrs, ctrls) {
          var toggleCtrl = ctrls[0], ngModelCtrl = ctrls[1];
          toggleCtrl.element = element;
          toggleCtrl.init(ngModelCtrl);
        }
      };
    }
  );
})();
