define(['angular', 'NpfMobileConfig', 'ngRoute','areaModule', 'commonModule','messagetipsModule','dateModule','commonFuncModule','js/IdCardValidate'],
    function (angular, NpfMobileConfig) {
        return angular.module('invoiceself', ['ngRoute','areaModule','commonModule','cookieModule','messagetipsModule','dateModule','commonFuncModule','IdCardModule'])
            .config(['$routeProvider', function ($routeProvider) {
                $routeProvider
                    .when('/invoice', {
                        templateUrl: 'invoice_search.html',
                        controller: 'chooseForSearch'
                    })
                    .when('/invoinceInfo',{
                        templateUrl: 'invoice_info.html',
                        controller: 'invoiceController'
                    })
                    .when('/chooseRecords', {
                        templateUrl: 'invoice_list.html',
                        controller: 'chooseRecords'
                    })
                    .when('/payInfo', {
                        templateUrl: 'invoice_pay.html',
                        controller: 'payInfo'
                    })
                    .when('/choosePostInfo', {
                        templateUrl: 'invoice_post_info.html',
                        controller: 'choosePostInfo'
                    })
                    .when('/editPostInfo', {
                        templateUrl: 'invoice_post_edit.html',
                        controller: 'editPostInfo'
                    })
                    .when('/choosePayInfo', {
                        templateUrl: 'invoice_pay_info.html',
                        controller: 'choosePayInfo'
                    })
                    .when('/invoiceState', {
                        templateUrl: 'invoice_pay_state.html',
                        controller: 'invoiceWithoutCallbackStateController'
                    })
                    .otherwise({
                        redirectTo: '/invoice'
                    });
            }])
        //'invoice/js/chooseForSearch','invoice/js/chooseRecords','invoice/js/payInfo','invoice/js/choosePostInfo','invoice/js/choosePayInfo','invoice/js/invoiceState'
    });

