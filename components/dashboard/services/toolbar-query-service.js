﻿/**
 * Izenda query service which provides toolbar specific queries
 * this is singleton
 */
angular
  .module('izendaQuery')
  .factory('$izendaDashboardToolbarQuery', [
    '$izendaRsQuery',
    '$log',
    function ($izendaRsQuery, $log) {
      'use strict';

      function loadDashboardNavigation() {
        return $izendaRsQuery.query('getdashboardcategories', [], {
          dataType: 'json'
        },
        // custom error handler:
        {
          handler: function () {
            return 'Failed to get dashboard categories';
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
            return 'Failed to send report to email';
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
            return 'Failed to get auto refresh intervals';
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