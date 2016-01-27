require(['angular', 'jQuery',
    'invoiceself/js/invoice',
    'invoiceself/js/chooseInfos',
    'invoiceself/js/choosePayInfo',
    'invoiceself/js/invoiceController',
    'invoiceself/js/choosePostInfo'],
    function (angular, $) {
        angular.bootstrap(document, ['invoiceself']);
    });