﻿izendaRequire.define([
	'angular',
	'../../common/core/services/localization-service',
	'../../common/query/services/rs-query-service'
], function (angular) {

	/**
	 * Izenda query service which provides toolbar specific queries
	 * this is singleton
	 */
	angular.module('izenda.common.query').factory('$izendaDashboardToolbarQuery', [
		'$izendaRsQuery',
		'$izendaLocale',
		function ($izendaRsQuery, $izendaLocale) {
			'use strict';

			function loadDashboardNavigation() {
				return $izendaRsQuery.query('getdashboardcategories', [], {
					dataType: 'json'
				},
					// custom error handler:
					{
						handler: function () {
							return $izendaLocale.localeText('js_DashboardLoadCatsError', 'Failed to get dashboard categories');
						}
					});
			}

			/**
			 * Send report via email
			 */
			function sendReportViaEmail(type, to) {
				return $izendaRsQuery.query('sendReportEmail', [type, to], {
					dataType: 'json'
				},
					// custom error handler:
					{
						handler: function () {
							return $izendaLocale.localeText('js_DashboardSendEmailError', 'Failed to send report to email');
						},
						params: []
					});
			}

			function loadAutoRefreshIntervals() {
				return $izendaRsQuery.query('autorefreshintervals', [], {
					dataType: 'json'
				},
					// custom error handler:
					{
						handler: function () {
							return $izendaLocale.localeText('js_DashboardAutoRefreshError', 'Failed to get auto refresh intervals');
						},
						params: []
					});
			}

			// PUBLIC API
			return {
				loadDashboardNavigation: loadDashboardNavigation,
				sendReportViaEmail: sendReportViaEmail,
				loadAutoRefreshIntervals: loadAutoRefreshIntervals
			};
		}]);

});