﻿/**
* Instant report charts controller definition
*/
angular
.module('izendaInstantReport')
.controller('InstantReportChartsController', [
			'$rootScope',
			'$scope',
			'$window',
			'$timeout',
			'$q',
			'$izendaUrl',
			'$izendaCompatibility',
			'$izendaInstantReportStorage',
			'$log',
			InstantReportChartsController
]);

function InstantReportChartsController(
			$rootScope,
			$scope,
			$window,
			$timeout,
			$q,
			$izendaUrl,
			$izendaCompatibility,
			$izendaInstantReportStorage,
			$log) {
	'use strict';
	var vm = this;

	$scope.$izendaInstantReportStorage = $izendaInstantReportStorage;
	vm.visualizationConfig = $izendaInstantReportStorage.visualizationConfig;
	vm.selectedChart = null;

	/**
	 * Select chart
	 */
	vm.selectChart = function (chart) {
		if (vm.selectedChart === chart) {
			vm.selectedChart = null;
			$izendaInstantReportStorage.selectChart(null);
			if (!$izendaCompatibility.isSmallResolution())
				$izendaInstantReportStorage.getReportPreviewHtml();
		} else {
			vm.selectedChart = chart;
			$izendaInstantReportStorage.selectChart(chart);
			if (!$izendaCompatibility.isSmallResolution())
				$izendaInstantReportStorage.getReportPreviewHtml();
		}
		
	};

	/**
	 * Prepare config
	 */
	vm.prepareConfig = function() {
		if (!angular.isObject(vm.visualizationConfig))
			return;
		if (!angular.isArray(vm.visualizationConfig.categories))
			return;
		angular.element.each(vm.visualizationConfig.categories, function(iCategory, category) {
			category.opened = iCategory === 0;
		});
	};

	/**
	 * Open new window with chart help
	 * @param {object} chart object
	 */
	vm.showChartHelp = function(chart) {
		if (!angular.isObject(chart))
			throw 'Chart parameter should be object';
		$window.open(chart.docUrl, '_blank');
	};

	/**
	* Initialize controller
	*/
	vm.init = function () {
		
		$scope.$watch('$izendaInstantReportStorage.getVisualizationConfig()', function (visConfig) {
			vm.visualizationConfig = visConfig;
			vm.prepareConfig();
		});

		$scope.$watch('$izendaInstantReportStorage.getSelectedChart()', function(chart) {
			vm.selectedChart = chart;
		});
	};
}
