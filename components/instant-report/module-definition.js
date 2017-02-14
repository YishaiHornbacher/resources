﻿define(function (require) {
	'use strict';
	// Create instant report angular module
	angular.module('izendaInstantReport', [
			'izenda.common.compatibility',
			'izenda.common.query',
			'izenda.common.ui'
	]);

	function configureInstantReportModules(configObject) {
		// configure common ui module:
		angular
			.module('izenda.common.ui')
			.constant('izendaCommonUiConfig', {
				clearShareRules: false, // do not show rules which defined in current report set.
				clearScheduleOptions: true // do not show schedule options for current report set.
			})
			.value('izenda.common.ui.reportNameInputPlaceholderText', ['js_ReportName', 'Report Name'])
			.value('izenda.common.ui.reportNameEmptyError', ['js_NameCantBeEmpty', 'Report name can\'t be empty.'])
			.value('izenda.common.ui.reportNameInvalidError', ['js_InvalidReportName', 'Invalid report name']);

		// configure instant report module
		var module = angular
			.module('izendaInstantReport')
			.config([
				'$logProvider', function ($logProvider) {
					$logProvider.debugEnabled(false);
				}])
			.constant('$izendaInstantReportSettings', configObject);

		return module;
	}

	/**
	 * Bootstrap angular app:
	 * window.urlSettings$ objects should be defined before this moment.
	 */
	var bootstrapInstantReports = function (commonSettingsLoader) {
		angular.element(document).ready(function () {
			// common settings promise:
			var commonSettingsLoader = require('../common/module-definition');
			var commonQuerySettingsPromise = commonSettingsLoader.loadSettings();

			// instant report settings promise:
			var urlSettings = window.urlSettings$;
			var rsPageUrl = urlSettings.urlRsPage;
			var settingsUrl = rsPageUrl + '?wscmd=getInstantReportSettings';
			var instantReportSettingsPromise = angular.element.get(settingsUrl);

			// wait while all settings are loaded:
			angular.element
				.when(commonQuerySettingsPromise, instantReportSettingsPromise)
				.then(function (commonSettingsResult, instantReportSettingsResult) {

					// get instant report config object
					var configObject = instantReportSettingsResult[0];
					configObject['moveUncategorizedToLastPostion'] = true;

					// create and configure modules:
					configureInstantReportModules(configObject);

					// bootstrap application:
					angular.element('#izendaInstantReportRootContainer').removeClass('hidden');
					angular.bootstrap('#izendaInstantReportRootContainer', ['izendaInstantReport']);
				});
		});
	}

	return {
		bootstrap: bootstrapInstantReports
	};
});
