(function () {
  'use strict';

  angular.module('ui.toggle', [])

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
       * Description: Size of the toggle.
       * Possible values are btn-lg, btn-sm, btn-xs.
       */
      size: '',
      /**
       * Type: string
       * Default: "btn-primary"
       * Description: Style of the on toggle.
       * Possible values are btn-default, btn-primary, btn-success, btn-info, btn-warning, btn-danger
       */
      onstyle: 'btn-primary',
      /**
       * Type: string
       * Default: "btn-default"
       * Description: Style of the off toggle.
       * Possible values are btn-default, btn-primary,btn- success, btn-info, btn-warning, btn-danger
       */
      offstyle: 'btn-default',
      /**
       * Type: string
       * Default: ''
       * Description: Appends the value to the class attribute of the toggle.
       * This can be used to apply custom styles. Refer to Custom Styles for reference.
       */
      style: ''
    })

    .controller('ToggleController',
      ['$scope', '$attrs', '$interpolate', '$log', 'toggleConfig', '$toggleSuppressError',
        function ($scope, $attrs, $interpolate, $log, toggleConfig, $toggleSuppressError) {
          var self = this,
            ngModelCtrl = {$setViewValue: angular.noop};

          // Configuration attributes
          angular.forEach(['on', 'off', 'size', 'onstyle', 'offstyle', 'style'], function (key, index) {
            self[key] = angular.isDefined($attrs[key]) ?
              (index < 6 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) :
              toggleConfig[key];
          });

          this.init = function (ngModelCtrl_) {
            ngModelCtrl = ngModelCtrl_;

            self.computeStyle();

            ngModelCtrl.$render = function () {
              self.toggle();
            };

            ngModelCtrl.$viewChangeListeners.push(function () {
              $scope.$eval($attrs.ngChange);
            });
          };

          this.computeStyle = function () {
            var labels = self.element.find('label');
            angular.element(labels[0]).html(self.on);
            angular.element(labels[1]).html(self.off);
            var spans = self.element.find('span');
            var wrapperComputedWidth = self.width || Math.max(labels[0].offsetWidth, labels[1].offsetWidth) +
              (spans[0].offsetWidth / 2);
            var wrapperComputedHeight = self.height || Math.max(labels[0].offsetHeight, labels[1].offsetHeight);

            var divs = self.element.find('div');
            var wrapperWidth = divs[0].offsetWidth;
            var wrapperHeight = divs[1].offsetHeight;

            $scope.wrapperStyle = {};
            if (wrapperWidth < wrapperComputedWidth) {
              $scope.wrapperStyle.width = wrapperComputedWidth + 'px';
            } else {
              $scope.wrapperStyle.width = wrapperWidth + 'px';
            }

            if (wrapperHeight < wrapperComputedHeight && self.size !== 'btn-xs' && self.size !== 'btn-sm') {
              $scope.wrapperStyle.height = wrapperComputedHeight + 'px';
            } else {
              $scope.wrapperStyle.height = wrapperHeight + 'px';
            }

            $scope.onClass = [self.onstyle, self.size, 'toggle-on'];
            $scope.offClass = [self.offstyle, self.size, 'toggle-off'];
            $scope.handleClass = [self.size, 'toggle-handle'];
          };

          this.toggle = function () {
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

          angular.forEach(['on', 'off', 'size', 'onstyle', 'offstyle', 'style'], function (key) {
            $attrs.$observe(key, function (val) {
              if (self[key] !== val) {
                self[key] = val;
                self.computeStyle();
              }
            });
          });
        }])

    .directive('toggle', function () {
        return {
          restrict: 'E',
          transclude: true,
          template: '<div class="toggle btn" ng-class="wrapperClass" ng-style="wrapperStyle" ng-click="onSwitch()">' +
          '<div class="toggle-group">' +
          '<label class="btn" ng-class="onClass"></label>' +
          '<label class="btn active" ng-class="offClass"></label>' +
          '<span class="btn btn-default" ng-class="handleClass"></span>' +
          '</div>' +
          '</div>',
          scope: {
            bindModel: '=ngModel'
          },
          require: ['toggle', 'ngModel'],
          controller: 'ToggleController',
          controllerAs: 'toggle',
          compile: function (element, attrs, transclude) {
            return {
              pre: function (scope, element, attrs, ctrls) {
                var toggleCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                toggleCtrl.element = element;
                toggleCtrl.init(ngModelCtrl);
              },
              post: function () {}
            }
          }
        };
      }
    );
})();
