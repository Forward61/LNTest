define(['commonModule'], function (commonModule) {
    commonModule.directive('npayFocus', ['$timeout', function ($timeout) {
        return function (scope, elem, attrs) {
            scope.$watch(attrs.npayFocus, function (newval) {
                if (newval) {
                    $timeout(function () {
                        elem[0].focus();
                    }, 0, false);
                }
            });
        };
    }]);
})