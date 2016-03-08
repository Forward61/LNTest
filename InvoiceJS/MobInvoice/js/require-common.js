'use strict';

require.config({
//    urlArgs: 'rand=' + (new Date()).getTime(),// for development\
    baseUrl: '../',
    urlArgs: 'version='+version,
    paths: {
        'angular': 'bower_components/angular/angular.min',
        'ngResource': 'bower_components/angular-resource/angular-resource.min',
        'ngCookies': 'bower_components/angular-cookies/angular-cookies.min',
        'ngRoute': 'bower_components/angular-route/angular-route.min',
        'jQuery': 'bower_components/jquery/jquery.min',
        'commonFuncModule':'js/commonModule',
        'NpfMobileConfig':'js/config',
        'areaModule':'js/area',
        'commonModule':'js/main',
        'cookieInfo':'js/cookieInfo',
        'dateModule':'js/dateUtils',
        'focus':'js/directive/focus',
        'position':'js/position',
        'messagetipsModule':'js/messagetips'
    },
        shim: {
        ngResource: {
            deps: ['angular'],
            exports: 'angular'
        },
        ngCookies: {
            deps: ['angular'],
            exports: 'angular'
        },
        ngRoute: {
            deps: ['angular'],
            exports: 'angular'
        },
        angular: {
            exports: 'angular'
        },
        jQuery: {
            exports: 'jQuery'
        },
        commonFuncModule: {
            deps: ['angular'],
            exports: 'commonFuncModule'
        },
        NpfMobileConfig: {
            exports: 'NpfMobileConfig'
        },
        areaModule: {
            exports: 'areaModule'
        },
        dateModule: {
            exports: 'dateModule'
        },
        position: {
            deps: ['jQuery'],
            exports: 'position'
        },
        messagetipsModule: {
            deps: ['jQuery'],
            exports: 'messagetipsModule'
        }
    }
});