define(['angular'], function (angular) {
        return angular.module('dateModule',[])
            .factory('DateUtil', function () {
                var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
                var getLastDate = function(date,lastNum) {
                    var strYear = date.getFullYear();
                    var strDay = date.getDate();
                    var strMonth = date.getMonth() + 1;
                    if (strYear % 4 == 0 && strYear % 100 != 0) {
                        daysInMonth[2] = 29;
                    }
                    if (strMonth - lastNum > 0) {
                        strMonth -= lastNum;
                    } else {
                        strYear -= 1;
                        strMonth = strMonth + 12 - lastNum;
                    }
                    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
                    if (strMonth < 10) {
                        strMonth = "0" + strMonth;
                    }
                    if (strDay < 10) {
                        strDay = "0" + strDay;
                    }
                    return [strYear , strMonth , strDay];
                }
                return {
                    daysInMonth : daysInMonth,
                    getLastMonthDate : function(date,lastNum) {
                        var arrdate = getLastDate(date,lastNum);
                        return arrdate[0] +"-"+ arrdate[1] +"-"+ arrdate[2];
                    },
                    getLastMonthDateArr : function(date,lastNum) {
                        return getLastDate(date,lastNum);
                    }
                }
            });
    });

