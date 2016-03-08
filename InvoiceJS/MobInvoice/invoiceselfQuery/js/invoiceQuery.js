define(['angular', 'NpfMobileConfig', 'invoiceselfQuery/js/query','commonModule','messagetipsModule','dateModule','commonFuncModule'],
    function (angular, NpfMobileConfig, invoiceQuery) {
        invoiceQuery.controller('invoiceQuery', ['$scope', '$http', '$location', 'NpayInfo','commonUtil','DateUtil','MessagetipsUtils',
                function ($scope, $http, $location, NpayInfo,commonUtil,DateUtil,MessagetipsUtils) {
                    document.title = "交费充值-发票自取记录";
                    $scope.invoiceQuery = NpayInfo;
                    $scope.invoiceQuery.invoiceList = [];
                    $scope.getOrderStateDesc = function(state) {
                        if(state=="00"){
                            return " 未支付";
                        }
                        else if(state=="05"){
                            return "已退款";
                        }
                        else if(state=="01" || state=="02" || state =="03" ||state== "04"){
                            return "成功";
                        }
                    }
                    $scope.change = function(money) {
                        var re;
                        re=money/100;
                        var result = commonUtil.changeTwoDecimal_f(re);
                        return  result;
                    }
                    $scope.getMailFee = function(fundType,incomeTotalMoney,serviceType) {
                        if(serviceType=="27"||parseInt(incomeTotalMoney) <= 0||fundType=="5"||fundType=="6"){
                            return "-";
                        }
                        var money = fundType=="1" ? $scope.change(incomeTotalMoney) : incomeTotalMoney;
                        var desc = fundType=="1" ? " 元" : " 积分";
                        return money + desc;
                    }
                    $scope.fillRecords = function(data) {
                        $scope.invoiceQuery.invoiceList = [];
                        for(var i=0;i<data.length;i++) {
                            if(commonUtil.judgeEmpty(data[i].incomeTotalMoney) || data[i].incomeTotalMoney==0) {
                                data[i].incomeTotalMoney = "-";
                            }
                            data[i].showPayMont = $scope.getMailFee(data[i].fundType,data[i].incomeTotalMoney,data[i].serviceType);
                            data[i].showOrderdesc = $scope.getOrderStateDesc(data[i].orderState);
                            data[i].orderTime = data[i].orderTime.split('T')[0] + " " + data[i].orderTime.split('T')[1];
                            $scope.invoiceQuery.invoiceList.push(data[i]);
                        }
                    }
                    $scope.getInvoiceRecord = function(month) {
                        $(".loadingdiv").show();
                        var endDate = $scope.invoiceQuery.queryMonths[0].month == month.month ? ''
                            : month.year+'-'+month.month+'-'+DateUtil.daysInMonth[parseInt(month.month)]
                        $http({
                            method: 'post',
                            url: NpfMobileConfig.serviceQueryURL + "invoiceSearch/invoiceSearch.action",
                            params:{'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE,
                                'beginDate' : month.year+'-'+month.month+'-01',
                                'endDate' : endDate,
                                'serviceType' : "27"}
                        })
                            .success(function (data, status, headers, config) {
                                $(".loadingdiv").hide();
                                if(data.length<=0){
                                    $scope.invoiceQuery.invoiceList = [];
                                    return;
                                }
                                $scope.fillRecords(data);
                            })
                            .error(function(data, status, headers, config) {
                                $scope.invoiceQuery.invoiceList = [];
                            })
                    }
                    $scope.queryMonth = function(month) {
                        if($scope.invoiceQuery.targetMonth.month == month.month) return;
                        $scope.invoiceQuery.targetMonth = month
                        $scope.getInvoiceRecord(month);
                    }
                    // 初始化页面
                    $scope.invoiceQuery.queryMonths = [];
                    for(var i=0;i<6;i++) {
                        var date = DateUtil.getLastMonthDateArr(new Date(),i);
                        var target = {};
                        target.year = date[0];
                        target.month = date[1]+"";
                        target.showMonth = target.month.substr(0,1)=="0" ? target.month.substr(1) : target.month;
                        $scope.invoiceQuery.queryMonths.push(target);
                        if(i==0) $scope.invoiceQuery.targetMonth = target;
                    }
                    $scope.getInvoiceRecord($scope.invoiceQuery.targetMonth);

//                    $scope.servieType = "confirm";
//                    MessagetipsUtils.fillMessagetips($scope.servieType);
                }])
    });