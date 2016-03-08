define(['angular', 'NpfMobileConfig', 'ngRoute','areaModule', 'commonModule','messagetipsModule','dateModule','commonFuncModule'],
    function (angular, NpfMobileConfig) {
        return angular.module('invoiceQuery', ['ngRoute','areaModule','commonModule','cookieModule','messagetipsModule','dateModule','commonFuncModule'])
            .config(['$routeProvider', function ($routeProvider) {
                $routeProvider
                    .when('/invoiceQuery', {
                        templateUrl: 'invoice_record.html',
                        controller: 'invoiceQuery'
                    })
                    .otherwise({
                        redirectTo: '/invoiceQuery'
                    });
            }])
        //'invoice/js/chooseForSearch','invoice/js/chooseRecords','invoice/js/payInfo','invoice/js/choosePostInfo','invoice/js/choosePayInfo','invoice/js/invoiceState'
    });