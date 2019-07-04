(function () {
	'use strict';
	angular.module('ui.toggle', [])
		.value('$toggleSuppressError', false)
		.constant('toggleConfig',
			{
				/**
				 * This object defines supported toggle widget attributes and their default values.
				 * Angular's ngClick and ngDisabled are handled separately. Search code below.
				 */
				/**
				 * This version simulates checkbox functionality which can have either true or false value.
				 * User-defined values are not supported.
				 */
				'btnCheckboxFalse': false,
				'btnCheckboxTrue': true,
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
				 * Default: ""
				 * Description: Allows to specify one of the standarg bootstrap's button sizes (class).
				 * Possible values are btn-lg, btn-sm, btn-xs.
				 */
				size: '',
				/**
				 * Type: string
				 * Default: "btn-primary"
				 * Description: Class for "on" state from one of standard bootstrap button types.
				 * Possible values: btn-default, btn-primary, btn-success, btn-info, btn-warning, btn-danger
				 */
				onClass: 'btn-primary',
				onstyle: '', /* for backward compatibility only */
				/**
				 * Type: string
				 * Default: "btn-default"
				 * Description: Class for "off" state from one of standard bootstrap button types.
				 * Possible values: btn-default, btn-primary, btn-success, btn-info, btn-warning, btn-danger
				 */
				offClass: 'btn-default',
				offstyle: '', /* for some backward compatibility only */
				/**
				 * Type: string
				 * Default: "btn-default"
				 * Description: Class for little bar from one of standard bootstrap button types.
				 * Possible values: btn-default, btn-primary, btn-success, btn-info, btn-warning, btn-danger
				 */
				barClass: 'btn-default',
				/**
				 * Type: JSON string
				 * Default: ""
				 * Description: Allows to pass user-defined style to the toggle's first immediate child (first DIV inside
				 * <toggle ...> which is what you actually see as widget's outer container).
				 * This can be used to alter widget's appearance. Use with caution! Note that "width" and "height" values
				 * will be overwritten by either auto-calculated values or used-specified values from "width" and "height"
				 * attributes.
				 * Example: <toggle ... toggle-style="{'border': '1px dashed #f00'}">
				 */
				toggleStyle: '',
				/**
				 * Type: string
				 * Default: ""
				 * Description: Passes a class to the toggle's first immediate child
				 **/
				toggleClass: '',
				style: '',
				/**
				 * Type: string
				 * Default: ""
				 * Description: Allows to force width and height to specified value. Use css notation such as 50px, 1%. etc.
				 * This is useful when you have a group of toggles with different text in the lables and, therefore,
				 * would never line-up to the same width.
				 * Example: <toggle ... width="90px">
				 */
				width: '',
				height: '',
				/**
				 * Type: boolean
				 * Default: false
				 * Description: Defines "disabled" attribute for the <toggle> directive itself. The ng-disabled dirrective
				 * manipulates this attribute, plus there is additional code that propagates its value to child elements.
				 * Applying "disabled" to <toggle> itself apparently does nothing, but when its value is propagated to
				 * two child <label> elements, it allows us to disable the widget.
				 * Note that attribute "disabled" is not the same as ng-disabled Angular directive. In most cases, you
				 * should use <toggle ... ng-disabled="expression"> (not <toggle ... disabled="{{expression}}">) for this
				 * to work properly.
				 * [Per HTML specs, the "disabled" property does not need a value. Just mentioning it is enough. Angular
				 * will, however, also add the value "disabled" (< ... disabled="disabled">)]
				 */
				disabled: false,
			})
		.provider('toggle', function () {
			var options;
			options = {};
			return {
				setOption: function (newOpts) {
					angular.extend(options, newOpts);
				},
				$get: function () {
					return options;
				}
			};
		})
		.controller('ToggleController',
			[
				'$scope', '$attrs', '$interpolate', '$log', '$document', 'toggleConfig', '$toggleSuppressError', '$parse', 'toggle',
				function ($scope, $attrs, $interpolate, $log, $document, toggleConfig, $toggleSuppressError, $parse, config) {

					// This controller (self)
					var self = this;

					angular.extend(toggleConfig, config);

                    // Support 'ng-true-value' and 'ng-false-value' attrs
                    var trueValue = parseConstantExpr($parse, $scope, 'ngTrueValue', $attrs.ngTrueValue, true);
                    var falseValue = parseConstantExpr($parse, $scope, 'ngFalseValue', $attrs.ngFalseValue, false);

                    function parseConstantExpr($parse, context, name, expression, fallback) {
                        var parseFn;
                        if (angular.isDefined(expression)) {
                            parseFn = $parse(expression);
                            if (!parseFn.constant) {
                                throw angular.ngModelMinErr('constexpr', 'Expected constant expression for `{0}`' +
                                    ', but saw `{1}`.', name, expression);
                            }
                            return parseFn(context);
                        }
                        return fallback;
                    }

					// Configuration attributes
					var toggleConfigKeys = Object.keys(toggleConfig);
					angular.forEach(toggleConfigKeys,
						function (k, i) {
							if (angular.isDefined($attrs[k])) {
								switch (typeof toggleConfig[k]) {
									case 'string':
										self[k] = $interpolate($attrs[k])($scope.$parent);
										break;
									case 'function':
										// TBD
										break;
									default:
										self[k] = $scope.$parent.$eval($attrs[k]);
								}
							} else { // use default from toggleConfig
								self[k] = toggleConfig[k];
							}
						});

					// Special treatment for onstyle and offstyle, now deprecated attributes:
					// If set, we will use their values for onClass and offClass respectively
					if (self.onstyle) {
						self.onClass = self.onstyle;
					}
					if (self.offstyle) {
						self.offClass = self.offstyle;
					}
					// Special treatment for style, now deprecated and replaced with toggleClass
					if (self.style) {
						self.toggleClass = self.style;
					}

					// Special case: empty on and off labels (replace with blank space)
					if (self.on === '') {
						self.on = '&nbsp;';
					}
					if (self.off === '') {
						self.off = '&nbsp;';
					}

					/**
					 * evaluateSize
					 **/
					this.evaluateSize = function() {

						// If width and height are already set, return immediately
						if (!!self.width && !!self.height) {
							return;
						}

						// Duplicate the On button, in the body, absolute position
						var dupOnElement = self.onElement.cloneNode(true);
						dupOnElement.style.position = 'absolute';
						dupOnElement.style.display = 'block';
						dupOnElement.style.visibility = 'hidden';
						dupOnElement.style.border = '0';
						dupOnElement.style.margin = '0';
						$document[0].body.appendChild(dupOnElement);

						// Duplicate the Off button, in the body, absolute position
						var dupOffElement = self.offElement.cloneNode(true);
						dupOffElement.style.position = 'absolute';
						dupOffElement.style.display = 'block';
						dupOffElement.style.visibility = 'hidden';
						dupOffElement.style.border = '0';
						dupOffElement.style.margin = '0';
						$document[0].body.appendChild(dupOffElement);

						// Calculate the proper width
						if (!self.width) {
							self.width = (Math.max(
								dupOnElement.scrollWidth,
								dupOffElement.scrollWidth
							) + 2) + 'px';
						}

						// Calculate the proper height
						if (!self.height) {
							self.height = (Math.max(
								dupOnElement.scrollHeight,
								dupOffElement.scrollHeight
							) + 2) + 'px';
						}

						// Remove the duplicated elements
						$document[0].body.removeChild(dupOnElement);
						$document[0].body.removeChild(dupOffElement);

					};

					/**
					 * init
					 **/
					this.init = function() {

						var labels = self.element.find('label');
						var spans = self.element.find('span');
						var divs = self.element.find('div');

						self.wrapperElement = divs[0];
						self.onElement = labels[0];
						self.offElement = labels[1];
						self.handleElement = spans[0];

						var onElement = angular.element(self.onElement);

						// Set wigget's visible text such as On/Off or Enable/Disable
						onElement.html(self.on);
						angular.element(self.offElement).html(self.off);

						// Set the button size
						angular.element(self.wrapperElement).addClass(self.size);
						onElement.addClass(self.size);
						angular.element(self.offElement).addClass(self.size);
						angular.element(self.handleElement).addClass(self.size);

						// Set the toggleClass on the wrapper
						angular.element(self.wrapperElement).addClass(self.toggleClass);
						angular.element(self.onElement).addClass(self.onClass);
						angular.element(self.offElement).addClass(self.offClass);
						angular.element(self.handleElement).addClass(self.barClass);

						self.evaluateSize();

						// Add the toggle-on and toggle-off classes, that change position and size of the labels
						// and make sure that the buttons are properly placed.
						// Once this is done, the height and width properties of the labels is no longer relevant,
						// because of their new placement.
						angular.element(self.onElement).addClass('toggle-on');
						angular.element(self.offElement).addClass('toggle-off');

						// Compute first style
						self.computeStyle();

						self.ngModelCtrl.$render = function () {
							self.toggle();
						};

						// ng-change (for optional onChange event handler)
						if (angular.isDefined($attrs.ngChange)) {
							self.ngModelCtrl.$viewChangeListeners.push(function () {
								$scope.$eval($attrs.ngChange);
							});
						}

					};

					this.computeStyle = function () {
						// Set wigget's disabled state.
						// This action is unrelated to computing the style, but this function is the right place for it.
						// The property must be propagated to lables and span inside the toggle-group container. This
						// triggers .btn[disabled] style (cursor: not-allowed; opacity: 0.65;) but it does not prohibit
						// the click event. Click event is handled in .onSwitch().
						angular.element(self.onElement).attr('disabled', self.disabled);
						angular.element(self.offElement).attr('disabled', self.disabled);
						angular.element(self.handleElement).attr('disabled', self.disabled);

						// Build an object for widget's ng-style
						$scope.wrapperStyle = (self.toggleStyle) ? $scope.$parent.$eval(self.toggleStyle) : {};
						$scope.wrapperStyle.width = self.width;
						$scope.wrapperStyle.height = self.height;
					};

					this.toggle = function () {
						if (angular.equals(self.ngModelCtrl.$viewValue, trueValue)) {
							angular.element(self.wrapperElement).removeClass('off ' + self.offClass)
								.addClass(self.onClass);
						} else {
							angular.element(self.wrapperElement).addClass('off ' + self.offClass)
								.removeClass(self.onClass);
						}
					};

					$scope.onSwitch = function (evt) {
						if (self.disabled) { // prevent changing .$viewValue if .disabled == true
							return false;
						} else {
							self.ngModelCtrl.$setViewValue(
								!angular.equals(self.ngModelCtrl.$viewValue, trueValue) ? trueValue : falseValue
							);
							self.ngModelCtrl.$render();
						}
						return true;
					};

					angular.forEach(toggleConfigKeys,
						function (k, i) {
							$attrs.$observe(k,
								function (v) {
									if (self[k] !== v) {
										self[k] = v;
										self.computeStyle();
									}
								});
						});

				}
			])
		.directive('toggle',
			function () {
				return {
					restrict: 'E',
					template: '<div ng-cloak class="toggle btn off" ng-style="wrapperStyle"' +
						'ng-click="onSwitch($event)">' +
						'<div class="toggle-group">' +
						'<label class="btn toggle-on-pad"></label>' +
						'<label class="btn toggle-off-pad active"></label>' +
						'<span class="btn toggle-handle"></span>' +
						'</div>' +
						'</div>',
					scope: {
						ngModel: '='
					},
					require: ['toggle', 'ngModel'],
					controller: 'ToggleController',
					controllerAs: 'toggle',
					compile: function(element, attrs, transclude) {
						return {
							post: function(scope, element, attrs, ctrls) {

								// Get the controller
								var toggleCtrl = ctrls[0];

								// Set the controller with element and ngModel's controller
								toggleCtrl.element = element;
								toggleCtrl.ngModelCtrl = ctrls[1];

								// Initialize and go!
								toggleCtrl.init();

							},
							pre: function () { }
						};
					}
				};
			}
		);
})();
