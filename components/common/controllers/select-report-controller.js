﻿izendaRequire.define(['angular', '../services/services', '../directive/directives'], function (angular) {

	/**
	 * Select report report part modal dialog control.
	 */
	angular
		.module('izenda.common.ui')
		.controller('IzendaSelectReportController', [
			'$rootScope',
			'$scope',
			'$q',
			'$log',
			'$element',
			'$izendaUrl',
			'$izendaLocale',
			'$izendaSettings',
			'$izendaCommonQuery',
			IzendaSelectReportController]);

	function IzendaSelectReportController($rootScope, $scope, $q, $log, $element,
		$izendaUrl, $izendaLocale, $izendaSettings, $izendaCommonQuery) {
		'use strict';
		var vm = this;

		var uncategorizedText = $izendaLocale.localeText('js_Uncategorized', 'Uncategorized');
		vm.izendaUrl = $izendaUrl;
		vm.category = uncategorizedText;
		vm.isLoading = false;
		vm.tileId = null;
		vm.categories = [];
		vm.groups = [];

		/**
		 * Reset form
		 */
		vm.reset = function () {
			vm.category = uncategorizedText;
			vm.isLoading = true;
			vm.categories = [];
			vm.groups = [];
			$scope.$applyAsync();
		};

		/**
		 * Add report parts to modal
		 */
		vm.addReportPartsToModal = function (reportParts) {
			vm.groups.length = 0;
			if (reportParts == null || reportParts.length === 0) {
				return;
			}
			// add groups:
			var currentGroup = [];
			for (var i = 0; i < reportParts.length; i++) {
				if (i > 0 && i % 4 === 0) {
					vm.groups.push(currentGroup);
					currentGroup = [];
				}
				var reportPart = reportParts[i];
				reportPart.isReportPart = true;
				currentGroup.push(reportPart);
			}
			vm.groups.push(currentGroup);
		};

		/**
		 * Add reportset categories to modal select control.
		 */
		vm.addCategoriesToModal = function (reportSets) {
			if (reportSets == null)
				return;
			vm.categories.length = 0;
			for (var i = 0; i < reportSets.length; i++) {
				var report = reportSets[i];
				if (report.Dashboard)
					continue;
				var category = report.Category;
				if (category == null || category === '')
					category = uncategorizedText;
				var item = !report.Subcategory ? category : category + $izendaSettings.getCategoryCharacter() + report.Subcategory;
				if (vm.categories.indexOf(item) < 0) {
					vm.categories.push(item);
				}
			}
		};

		/**
		 * Add report to modal dialog body.
		 */
		vm.addReportsToModal = function (reportSets) {
			vm.groups.length = 0;
			var reportSetsToShow = angular.element.grep(reportSets, function (currentReportSet) {
				return !currentReportSet.Dashboard && currentReportSet.Name;
			});
			if (reportSetsToShow == null || reportSetsToShow.length === 0) {
				return;
			}

			// add groups:
			var currentGroup = [];
			vm.groups.length = 0;
			for (var i = 0; i < reportSetsToShow.length; i++) {
				if (i > 0 && i % 4 === 0) {
					vm.groups.push(currentGroup);
					currentGroup = [];
				}
				var reportSet = reportSetsToShow[i];
				reportSet.isReportPart = false;
				currentGroup.push(reportSet);
			}
			vm.groups.push(currentGroup);
		};

		/**
		 * Select report part modal
		 */
		vm.show = function () {
			vm.reset();
			var $modal = angular.element($element);
			$modal.modal();
			$izendaCommonQuery.getReportSetCategory(uncategorizedText).then(function (data) {
				var reportSets = data.ReportSets;
				vm.addCategoriesToModal(reportSets);
				vm.addReportsToModal(reportSets);
				vm.isLoading = false;
				$scope.$evalAsync();
			});
		};

		/**
		 * Select category handler
		 */
		vm.categoryChangedHandler = function () {
			vm.isLoading = true;
			vm.groups.length = 0;
			if (vm.category === null)
				vm.category = uncategorizedText;
			$izendaCommonQuery.getReportSetCategory(vm.category).then(function (data) {
				vm.addReportsToModal(data.ReportSets);
				vm.isLoading = false;
				$scope.$evalAsync();
			});
		};

		/**
		 * User clicked to report set item
		 */
		vm.itemSelectedHandler = function (item) {
			var isReportPart = item.isReportPart;
			var reportFullName = item.Name;

			if (item.CategoryFull != null && item.CategoryFull !== '')
				reportFullName = item.CategoryFull + $izendaSettings.getCategoryCharacter() + reportFullName;

			if (!isReportPart) {
				// if report set selected
				vm.isLoading = true;
				vm.groups.length = 0;
				$izendaCommonQuery.getReportParts(reportFullName).then(function (data) {
					var reports = data.Reports;
					vm.addReportPartsToModal(reports);
					vm.isLoading = false;
					$scope.$evalAsync();
				});
			} else {
				// if report part selected
				var $modal = angular.element('#izendaSelectPartModal');
				$modal.modal('hide');
				$rootScope.$broadcast('selectedReportPartEvent', [vm.tileId, item]);
			}
		};

		/**
		 * Controller initialize
		 */
		vm.initialize = function () {

			// open modal event handler
			$scope.$on('openSelectPartModalEvent', function (event, args) {
				vm.tileId = args.length > 0 ? args[0] : null;
				vm.show();
			});
		};
	}

});