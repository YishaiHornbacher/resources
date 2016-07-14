﻿// Create dashboards angular module
angular.module('izendaDashboard', [
	'ngCookies',
	'izenda.common.compatibility',
	'izenda.common.query',
	'izenda.common.ui',
	'izendaFilters',
	'impressjs'
]);

/**
 * Configuration and startup angular application
 */
(function () {
	'use strict';

	/**
	 * Create and configure modules
	 */
	function configureModules(configObject) {
		// configure common ui module:
		angular
			.module('izenda.common.ui')
			.constant('izendaCommonUiConfig', {
				clearShareRules: false, // show rules which defined in current report set.
				clearScheduleOptions: false // show schedule options for current report set.
			})
			.value('izenda.common.ui.reportNameInputPlaceholderText', ['js_DashboardName', 'Dashboard Name'])
			.value('izenda.common.ui.reportNameEmptyError', ['js_DashboardNameCantBeEmpty', 'Dashboard name can\'t be empty.'])
			.value('izenda.common.ui.reportNameInvalidError', ['js_InvalidDashboardName', 'Invalid dashboard Name']);

		// configure instant report module
		var module = angular
			.module('izendaDashboard')
			.constant('izendaDashboardConfig', {
				showDashboardToolbar: true,
				defaultDashboardCategory: null,
				defaultDashboardName: null
			})
			.config(['$logProvider', function ($logProvider) { $logProvider.debugEnabled(false); }])
			.constant('$izendaDashboardSettings', configObject);

		return module;
	}

	/**
	 * Bootstrap angular app:
	 * window.urlSettings$ objects should be defined before this moment.
	*/
	angular.element(document).ready(function () {
		// common settings promise:
		var commonQuerySettingsLoader = new izendaCommonQuerySettingsLoader();
		var commonQuerySettingsPromise = commonQuerySettingsLoader.loadSettings();

		// instant report settings promise:
		var urlSettings = window.urlSettings$;
		var rsPageUrl = urlSettings.urlRsPage;
		var settingsUrl = rsPageUrl + '?wscmd=getDashboardSettings';
		var dashboardsSettingsPromise = angular.element.get(settingsUrl);

		// wait while all settings are loaded:
		angular.element
			.when(commonQuerySettingsPromise, dashboardsSettingsPromise)
			.then(function (commonSettingsResult, dashboardsSettingsResult) {

				// get instant report config object
				var configObject = dashboardsSettingsResult[0];

				// create and configure modules:
				configureModules(configObject);

				// bootstrap application:
				angular.bootstrap('#izendaDashboardMainContainer', ['izendaDashboard']);
			});
	});
})();
