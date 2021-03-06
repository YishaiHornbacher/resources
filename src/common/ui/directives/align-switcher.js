﻿izendaRequire.define([
	'angular',
	'../module-definition'
], function (angular) {
	'use strict';

	angular.module('izenda.common.ui').directive('izendaAlignSwitcher', [
		function () {
			return {
				restrict: 'AE',
				scope: {
					ngModel: '=',
					title: '@'
				},
				template: '<span class="izenda-common-align-switcher glyphicon" ng-click="nextValue()" ng-attr-title="title" ng-class="alignShortcut"></span>',
				link: function ($scope, element, attrs) {
					var itemsArray = ['L', 'M', 'R', ' '];
					var shortcuts = {
						'L': 'glyphicon-align-left',
						'M': 'glyphicon-align-center',
						'R': 'glyphicon-align-right',
						' ': 'glyphicon-none'
					};

					var validateValue = function () {
						if (angular.isUndefined($scope.ngModel)) {
							return;
						}
						if (itemsArray.indexOf($scope.ngModel) < 0)
							throw 'Unknown align value: ' + $scope.ngModel;
					};

					var updateShortcut = function () {
						$scope.alignShortcut = shortcuts[$scope.ngModel];
					};

					$scope.nextValue = function () {
						var idx = itemsArray.indexOf($scope.ngModel);
						if (idx < itemsArray.length - 1)
							idx++;
						else
							idx = 0;
						$scope.ngModel = itemsArray[idx];
						updateShortcut();
					};

					//
					$scope.$parent.$watch(attrs.ngModel, function () {
						validateValue();
						updateShortcut();
					});
					validateValue();
					updateShortcut();
				}
			}
		}
	]);

});