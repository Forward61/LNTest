define(['angular', 'NpfMobileConfig', 'invoiceself/js/invoice','commonModule','areaModule','messagetipsModule','dateModule','commonFuncModule'],
    function (angular, NpfMobileConfig, invoice) {
        invoice.controller('payInfo', ['$scope', '$http', '$location', 'NpayInfo','MessagetipsUtils','commonUtil',
                function ($scope, $http, $location, NpayInfo,MessagetipsUtils,commonUtil) {
                    document.title = "支付信息";
                    $scope.invoice = NpayInfo;
                    $scope.goChoosePostInfo = function() {
                        $location.path('/choosePostInfo');
                    }
                    $scope.goChoosePayInfo = function() {
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postname) || !$scope.invoice.isPost) {
                            return;
                        }
                        $location.path('/choosePayInfo');
                    }
                    $scope.userJifen = function(){/** 用户剩余积分*/
                        $http({
                            method: 'post',
                            url: NpfMobileConfig.serviceInvoiceURL + 'mobObtainInvoice/QueryPhoneIntegral',
                            params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE}
                        })
                            .success(function (data, status, headers, config) {
                                var phonePoint = data.phonePoint;
                                $scope.invoice.jifen = /^\d{1,}$/.test(phonePoint) && phonePoint > 0 ? phonePoint : undefined;
                            })
                            .error(function (data, status, headers, config) {
                            });
                    }
                    $scope.getSubUrl = function() {/** 获取提交submit的url */
                        if($scope.invoice.isPost && $scope.invoice.paytype.payment_method == "3"){
                            return NpfMobileConfig.serviceInvoiceURL + "mobObtainInvoice/ObtainInvoiceApply.action";
                        }else{
                            return NpfMobileConfig.serviceInvoiceURL + "mobObtainInvoice/InvoiceSubmit.action";
                        }
                    }
                    $scope.subInvoice = function(sec) {
                        $http({
                            method: 'post',
                            url: $scope.getSubUrl(),
                            params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE,'secstate.state': sec}
                        })
                            .success(function (data, status, headers, config) {
                                $(".loadingdiv").hide();
                                if (undefined == data.out) {
                                    $scope.invoiceErrorMsg = "交费系统繁忙，请稍候再试。";
                                    return;
                                }
                                if ("success" == data.out) {
                                    window.location.href = data.payResultUrl;
                                }
                                else if("nopay" == data.out){
                                    $scope.invoice.orderState = data.orderStatus;
                                    $scope.invoice.payAmount = data.payAmount;
                                    $scope.invoice.orderno = data.orderNo;
                                    $scope.invoice.invoiceTotalMoney= data.invoiceTotalMoney;
                                    $scope.invoice.is_mailing = data.is_mailing;
                                    $scope.invoice.payState = data.payState;
                                    $scope.invoice.payment_method = data.payment_method;
                                    $location.path('/invoiceState');
                                }
                                else {
                                    $scope.invoiceErrorMsg = data.out;
                                }
                            })
                            .error(function (data, status, headers, config) {
                                $(".loadingdiv").hide();
                                $scope.invoiceErrorMsg = "尊敬的用户您好，系统繁忙，请稍后再试。";
                            });
                    }
                    $scope.getCheckParam = function() {
                        return {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE,
                            'commonBean.payAmount' : $scope.invoice.paytype.cost,
                            'invoiceBean.is_mailing' : $scope.invoice.isPost ? '1' : '0',
                            'invoiceBean.need_invoice' : '1',
                            'postBean.monthInvoice' : commonUtil.arrToStr($scope.invoice.monthInvoice),
                            'postBean.payInvoice' : commonUtil.arrToStr($scope.invoice.payInvoice),
                            'postBean.cardList' : commonUtil.arrToStr($scope.invoice.cardList),
                            'postBean.invoice_total_money' : $scope.invoice.monthMoney+$scope.invoice.payMoney+ $scope.invoice.cardMoney,
                            'postBean.month_method' : $scope.invoice.month,//选择的月份1个月/3个月/6个月
                            'postBean.payment' : $scope.invoice.paytype.cost,
                            'postBean.payment_method' : $scope.invoice.paytype.payment_method,
                            'postBean.post_to' : $scope.invoice.provinceCode == $scope.invoice.postInfo.postProviceCode ? "0" : "1",
                            'postBean.province_code' : $scope.invoice.postInfo.postProviceCode,
                            'postBean.city_code' : $scope.invoice.postInfo.postCityCode,
                            'postBean.district_code' : $scope.invoice.postInfo.postRegionCode,
                            'postBean.invoice_head' : $scope.invoice.invoiceHeader,
                            'postBean.post_code' : $scope.invoice.postInfo.postcode,
                            'postBean.receiver_addr' : $scope.invoice.postInfo.adressAreaInfo + " " + $scope.invoice.postInfo.postaddr,
                            'postBean.receiver_name' : $scope.invoice.postInfo.postname,
                            'postBean.receiver_phone' : $scope.invoice.postInfo.postphone,
                            'postBean.unicardServicetype' : $scope.invoice.isPost ? $scope.invoice.mail_servicetype : $scope.invoice.receive_servicetype,
                            'secstate.state' : '3mCBuETgA/YTbuZO79gHFA==^@^0.0.1'
                        };
                    }
                    $scope.checkInvoice = function() {
                        $(".loadingdiv").show();
                        $http({
                            method: 'post',
                            url: NpfMobileConfig.serviceInvoiceURL + "mobObtainInvoice/ObtainInvoiceCheck",
                            params: $scope.getCheckParam()
                        })
                            .success(function (data, status, headers, config) {
                                if (undefined == data.out) {
                                    $(".loadingdiv").hide();
                                    $scope.invoiceErrorMsg = "系统繁忙，请稍候再试！";
                                    return;
                                }
                                if ("success" == data.out) {
                                    $scope.subInvoice(data.secstate);
                                } else {
                                    $(".loadingdiv").hide();
                                    $scope.invoiceErrorMsg = data.out;
                                }
                            })
                            .error(function (data, status, headers, config) {
                                $(".loadingdiv").hide();
                                $scope.invoiceErrorMsg = "尊敬的用户您好，系统繁忙，请稍后再试。";
                            });
                    }
                    $scope.invoiceSubmit = function() {
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postname)) return;
                        if(commonUtil.judgeEmpty($scope.invoice.paytype.payment_method)) return;
                        $scope.checkInvoice();
                    }
                    // 初始化页面
                    if(undefined == $scope.invoice.invoicerule["01"]) $location.path('/invoice');
                    if($scope.invoice.isPost && $scope.invoice.jifen<=0) {
                        $scope.userJifen();
                    }
                    $scope.goBack = function() {
                        $location.path('/chooseRecords');
                    }
//                    $scope.servieType = "confirm";
//                    MessagetipsUtils.fillMessagetips($scope.servieType);
                }])
            .controller('choosePayInfo', ['$scope', '$http','$location', 'NpayInfo','MessagetipsUtils','DateUtil','commonUtil',
                function ($scope,$http,$location,NpayInfo,MessagetipsUtils,DateUtil,commonUtil) {
                    document.title = "支付方式";
                    $scope.invoice = NpayInfo;
                    $scope.invoice.payment = [];
                    $scope.fillPayType = function() {/** 更改支付类型 */
                        $scope.invoice.paytypes = {};
                        $scope.getAblePaytype($scope.invoice.monthInvoice,$scope.invoice.monthMoney,/^\d{11}$/.test($scope.invoice.phone)?["01"]:["03"]);
                        $scope.getAblePaytype($scope.invoice.payInvoice,$scope.invoice.payMoney,/^\d{11}$/.test($scope.invoice.phone)?["01"]:["03"]);
                        $scope.getAblePaytype($scope.invoice.cardList,$scope.invoice.cardMoney,/^\d{11}$/.test($scope.invoice.phone)?["06","08"]:["07","08"]);
                        $scope.showPayType();
                    }
                    $scope.showPayType = function() {
                        var total = $scope.invoice.monthMoney+$scope.invoice.payMoney+$scope.invoice.cardMoney;
                        if(total <= 0 || commonUtil.judgeEmpty($scope.invoice.postInfo.postProviceCode)) {//未勾选内容,不展示支付类型
                            $location.path('/chooseRecords');
                            return;
                        }
                        if(!commonUtil.judgeEmpty($scope.invoice.paytypes["pay_free"])) {//优先选择满额免邮
                            var type = {};
                            type.desc = [];
                            type.title = "免费邮寄";
                            type.desc[0] = "满" + parseInt($scope.invoice.paytypes["pay_free"]["mailing_fee"])/100 + "交费，本市免费邮寄";
                            type.cost = 0;
                            type.payment_method = "4";
                            $scope.invoice.payment.push(type);
                        }else{
                        if(!commonUtil.judgeEmpty($scope.invoice.paytypes["pay_jifen"])) {//其次选择积分
                            var need_jifen = $scope.invoice.provinceCode == $scope.invoice.postInfo.postProviceCode ? $scope.invoice.paytypes["pay_jifen"]["own_city"] : $scope.invoice.paytypes["pay_jifen"]["other_city"];
                            if(!commonUtil.judgeEmpty(need_jifen) && !commonUtil.judgeEmpty($scope.invoice.jifen)){
                                if($scope.invoice.jifen >= parseInt(need_jifen["payment"])) {
                                    var type = {};
                                    type.desc = [];
                                    type.title = "积分支付";
                                    type.desc[0] = "本次邮寄使用积分 " ,type.desc[1] = need_jifen["payment"] ,
                                        type.desc[2] = "使用后剩余积分 " ,type.desc[3] = ($scope.invoice.jifen - parseInt(need_jifen["payment"]));
                                    type.cost = parseInt(need_jifen["payment"]);
                                    type.payment_method = "2";
                                    $scope.invoice.payment.push(type);
                                }
                            }
                        }
                        if(!commonUtil.judgeEmpty($scope.invoice.paytypes["pay_online"])) {//最后在线支付
                            var need_pay = $scope.invoice.provinceCode == $scope.invoice.postInfo.postProviceCode ? $scope.invoice.paytypes["pay_online"]["own_city"] : $scope.invoice.paytypes["pay_online"]["other_city"];
                            if(!commonUtil.judgeEmpty(need_pay)){
                                var type = {};
                                type.desc = [];
                                type.title = "在线支付";
                                type.cost = parseFloat((parseFloat(need_pay["payment"])/100).toFixed(2));
                                type.desc[0] = "本次邮寄费 " ,type.desc[1] = type.cost + "元";
                                type.payment_method = "3";
                                $scope.invoice.payment.push(type);
                            }
                        }}
                    }
                    /** 获取可用的支付类型 */
                    $scope.getAblePaytype = function(choosenList,choosenMoney,typearr) {
                        var isOwnPro = $scope.invoice.provinceCode == $scope.invoice.postInfo.postProviceCode;
                        var isOwnCity = isOwnPro && ($scope.invoice.cityCode == $scope.invoice.postInfo.postCityCode);
                        if(commonUtil.judgeEmpty(choosenList) || choosenMoney <= 0) return;
                        if(undefined == $scope.invoice.invoicerule["01"]) $location.path('/invoice');
                        for(var i=0;i<typearr.length;i++) {
                            var config = $scope.invoice.invoicerule[typearr[i]];//对应业务类型的配置
                            if(commonUtil.judgeEmpty(config)) continue;
                            var mail = config["mail"];
                            if(commonUtil.judgeEmpty(mail)) continue;
                            for(var j=0;j<mail.length;j++) {
                                if(!commonUtil.judgeEmpty(mail[j]["pay_free"]) && choosenMoney > parseInt(mail[j]["pay_free"]["mailing_fee"])/100 &&
                                    isOwnCity && commonUtil.judgeEmpty($scope.invoice.paytypes["pay_free"])){
                                    $scope.invoice.paytypes["pay_free"] = mail[j]["pay_free"];
                                }
                                //if(isvip && !commonUtil.judgeEmpty(mail[j]["pay_vip"]) && choosen_money > parseInt(mail[j]["pay_vip"]["mailing_fee"])/100 && commonUtil.judgeEmpty(paytypes["pay_vip"])) paytypes["pay_vip"] = mail[j]["pay_vip"];
                                if(!commonUtil.judgeEmpty(mail[j]["pay_jifen"]) && commonUtil.judgeEmpty($scope.invoice.paytypes["pay_jifen"]) &&
                                    (isOwnPro && !commonUtil.judgeEmpty(mail[j]["pay_jifen"]["own_city"]) || !isOwnPro && !commonUtil.judgeEmpty(mail[j]["pay_jifen"]["other_city"])) ){
                                    $scope.invoice.paytypes["pay_jifen"] = mail[j]["pay_jifen"];
                                }
                                if(!commonUtil.judgeEmpty(mail[j]["pay_online"]) && commonUtil.judgeEmpty($scope.invoice.paytypes["pay_online"]) &&
                                    (isOwnPro && !commonUtil.judgeEmpty(mail[j]["pay_online"]["own_city"]) || !isOwnPro && !commonUtil.judgeEmpty(mail[j]["pay_online"]["other_city"]))){
                                    $scope.invoice.paytypes["pay_online"] = mail[j]["pay_online"];
                                }
                            }
                        }
                    }
                    $scope.choosePayType = function(payment) {
                        $scope.invoice.paytype = payment;
                        $location.path('/payInfo');
                    }
                    //初始化页面
                    if(undefined == $scope.invoice.invoicerule["01"]) $location.path('/invoice');
                    $scope.fillPayType();

//                $scope.servieType = "reinvoiceFinish";
//                MessagetipsUtils.fillMessagetips($scope.servieType);

                    $scope.goBack = function() {
                        $location.path('/payInfo');
                    }
            }])
    });