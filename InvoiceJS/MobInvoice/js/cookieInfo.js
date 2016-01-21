define(['angular', 'NpfMobileConfig', 'commonModule', 'ngCookies'],
    function (angular, NpfMobileConfig) {
        return angular.module('cookieModule', ["ngCookies"])
            .factory('CookieUtil', ['$cookies', 'UrlName', function ($cookies, UrlName) {
                return {
                    getCookieInfo: function () {
                        var cookievalue = $cookies.MUT_V;
                        if (undefined == cookievalue) return "none";
                        var cookieInfo = unescape(cookievalue).split("@");
                        if (cookieInfo.length != 2) return "none";
                        if (NpfMobileConfig.IOS_COOKIE_NAME == cookieInfo[0] &&
                            cookieInfo[1] >= NpfMobileConfig.IOS_VERSION) {
                            return "iphone";
                        } else if (NpfMobileConfig.ANDROID_COOKIE_NAME == cookieInfo[0]
                            && cookieInfo[1] >= NpfMobileConfig.ANDROID_VERSION) {
                            return "android";
                        } else {
                            return "none";
                        }
                    },
                    setCookieInfo: function () {
                        if(undefined == UrlName.GetRequest("version") || null == UrlName.GetRequest("version") || "" == UrlName.GetRequest("version")) {
                            return;
                        }
                        document.cookie = "MUT_V=" + escape(UrlName.GetRequest("version")) + "; path=/;domain=10010.com;";
                    },
                    setReferCookie: function () {
                        //refer=wapsc
                        var exp = new Date();
                        exp.setTime(exp.getTime() + 0.5*60*60*1000);
                        if(undefined == UrlName.GetRequest("refer") || null == UrlName.GetRequest("refer") || "" == UrlName.GetRequest("refer")) {
                            document.cookie = "HISPAGE=default;path=/;domain=10010.com;expires=" + exp.toGMTString();
                        }
                        else {
                            document.cookie = "HISPAGE=" + escape(UrlName.GetRequest("refer")) + "; path=/;domain=10010.com;expires=" + exp.toGMTString();
                        }
                    }
                }
            }]);
    });

function getCookie(cookiename) {
    var arrstr = document.cookie.split("; ");
    for(var i = 0;i < arrstr.length;i ++){
        var temp = arrstr[i].split("=");
        if(temp[0] == cookiename) return unescape(temp[1]);
    }
}

