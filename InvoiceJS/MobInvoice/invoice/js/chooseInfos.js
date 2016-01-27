define(['angular', 'NpfMobileConfig', 'invoice/js/invoice','commonModule','messagetipsModule','dateModule','commonFuncModule','js/IdCardValidate'],
    function (angular, NpfMobileConfig, invoice) {
        invoice.controller('chooseForSearch', ['$scope', '$http', '$location', 'NpayInfo','commonUtil','MessagetipsUtils',
                function ($scope, $http, $location, NpayInfo,commonUtil,MessagetipsUtils) {
                    document.title = "发票查询";
                    $scope.invoice = NpayInfo;
//                    $scope.chooseGetWay = function(isPost) {
                        $scope.invoice.isPost = true;
//                    }
                    $scope.chooseMonth = function(month) {
                        $scope.invoice.month = month;
                    }
                    /** 获取上线省份 */
                    $scope.getOnlineProvince = function() {
                        $http({
                            method: 'post',
                            url: NpfMobileConfig.serviceInvoiceURL + 'mobObtainInvoice/getOnlineProvince.action',
                            params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE}
                        })
                            .success(function (data, status, headers, config) {
                                $scope.invoice.onlineProvince = data.param;
                                $scope.invoice.isOnlineProvince = $scope.invoice.onlineProvince.indexOf($scope.invoice.provinceCode) >= 0;
                                //$scope.invoice.isPost = $scope.invoice.isOnlineProvince;
                            })
                            .error(function (data, status, headers, config) {
                            });
                    }
                    /** 获取登录用户信息 */
                    $scope.getUserInfo = function() {
                        $http({
                            method: 'post',
                            url: NpfMobileConfig.serviceInvoiceURL + 'UserInfo/getLoginUserInfo.action',
                            params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE}
                        })
                            .success(function (data, status, headers, config) {
                                $scope.invoice.provinceCode = data.provinceCode;
                                $scope.invoice.cityCode = data.cityCode;
                                $scope.invoice.loginType = data.loginType;
                                $scope.invoice.phone = data.phone;
                                $scope.invoice.is4G = data.is4G;
                                if(commonUtil.judgeEmpty($scope.invoice.phone)) { //手机号为空 , 未登录或登录超时
                                    window.location.href = "/npfwap/npfMobWeb/html/callLogin.html";
                                }
                                $scope.getOnlineProvince();
                            })
                            .error(function (data, status, headers, config) {
                            });
                    }
                    $scope.goRecordsPage = function() {
                        $location.path('/chooseRecords');
                    }
                    // 初始化页面
                    $scope.getUserInfo();

//                    $scope.servieType = "confirm";
//                    MessagetipsUtils.fillMessagetips($scope.servieType);
                }])
        .controller('chooseRecords', ['$scope', '$http','$location', 'NpayInfo','MessagetipsUtils','DateUtil','commonUtil','AreaUtils','IdCard',
            function ($scope,$http,$location,NpayInfo,MessagetipsUtils,DateUtil,commonUtil,AreaUtils,IdCard) {
                document.title = "发票列表";
                $scope.invoice = NpayInfo;
                $scope.invoice.oneallow = "084";//陕西月结/实缴只允许同时选一种
                $scope.invoice.phone_login = "01,06,11,16";
                $scope.invoice.mail_invoicetype = "";
                $scope.invoice.mail_servicetype = "";
                $scope.invoice.receive_invoicetype = "";
                $scope.invoice.receive_servicetype = "";
                $scope.invoice.card_invoice = [] , $scope.invoice.cardList = [] , $scope.invoice.cardMoney = 0;
                $scope.invoice.month_invoice = [] , $scope.invoice.monthInvoice = [] , $scope.invoice.month_limit = 0 , $scope.invoice.monthMoney = 0;
                $scope.invoice.pay_invoice = [] , $scope.invoice.payInvoice = [] , $scope.invoice.pay_limit = 0 , $scope.invoice.payMoney = 0;
                $scope.invoice.choosenMoney = 0 ;
                $scope.invoiceErrorMsg = "";
                $scope.invoice.chargePrvoName="";
                $scope.invoice.chargeCityName="";
                $(".list-head").click(function() {
                    var _this=$(this),_thisIClass=_this.find('i').attr('class');
                    if (_thisIClass != "arrow-d") {
                        $(".list-head").siblings().slideUp();
                        _this.siblings().slideDown();
                        $(".list-head").find('i').attr('class', 'arrow-r');
                        _this.find('i').attr('class', 'arrow-d');
                    };
                });
                $scope.chooseMonthAll = function(choosenFlag) {
                    choosenFlag = undefined==choosenFlag ? $scope.invoice.monthInvoice.length!=$scope.invoice.month_invoice.length : choosenFlag;
                    if(choosenFlag){
                        var tmpMonthMoney = 0.00;
                        for(var i=0;i<$scope.invoice.month_invoice.length;i++) {
                            tmpMonthMoney = tmpMonthMoney + parseFloat(parseFloat($scope.invoice.month_invoice[i].showMoney).toFixed(2))
                        }
                        var tmpMoney = parseFloat((tmpMonthMoney + $scope.invoice.payMoney).toFixed(2));
                        if($scope.invoice.invoice_limit < tmpMoney){
                            return;
                        }
                    }
                    
                    $scope.invoiceErrorMsg = "";
                    $scope.invoice.monthInvoice = [];
                    $scope.invoice.monthMoney = 0;
                    for(var i=0;i<$scope.invoice.month_invoice.length;i++) {
                        $scope.invoice.month_invoice[i].choosen = choosenFlag;
                        if(choosenFlag) {
                            $scope.invoice.monthInvoice.push($scope.invoice.month_invoice[i].bcycId);
                            $scope.invoice.monthMoney = $scope.invoice.monthMoney + parseFloat(parseFloat($scope.invoice.month_invoice[i].showMoney).toFixed(2));
                        }
                    }
                    if(choosenFlag&&($scope.invoice.oneallow.indexOf($scope.invoice.provinceCode) >= 0)&&!$scope.invoice.is4G) $scope.choosePayAll(false);
                    $scope.invoice.choosenMoney = parseFloat(($scope.invoice.monthMoney + $scope.invoice.payMoney).toFixed(2));
                    $scope.invoice.invoice_rest = parseFloat(($scope.invoice.invoice_limit - $scope.invoice.choosenMoney).toFixed(2));
                }
                $scope.chooseMonth = function(monthRecord) {
                    if(($scope.invoice.invoice_rest < parseFloat(parseFloat(monthRecord.showMoney).toFixed(2))) && !monthRecord.choosen){
                        return;
                    }
                    
                    $scope.invoiceErrorMsg = "";
                    monthRecord.choosen = !monthRecord.choosen;
                    $scope.invoice.monthInvoice = [];
                    $scope.invoice.monthMoney = 0;
                    for(var i=0;i<$scope.invoice.month_invoice.length;i++) {
                        if($scope.invoice.month_invoice[i].choosen) {
                            $scope.invoice.monthInvoice.push($scope.invoice.month_invoice[i].bcycId);
                            $scope.invoice.monthMoney = $scope.invoice.monthMoney + parseFloat(parseFloat($scope.invoice.month_invoice[i].showMoney).toFixed(2));
                        }
                    }
                    if(monthRecord.choosen&&($scope.invoice.oneallow.indexOf($scope.invoice.provinceCode) >= 0)&&!$scope.invoice.is4G) $scope.choosePayAll(false);
                    $scope.invoice.choosenMoney = parseFloat(($scope.invoice.monthMoney + $scope.invoice.payMoney).toFixed(2));
                    $scope.invoice.invoice_rest = parseFloat(($scope.invoice.invoice_limit - $scope.invoice.choosenMoney).toFixed(2));
                }
                $scope.choosePayAll = function(choosenFlag) {
                    choosenFlag = undefined==choosenFlag ? $scope.invoice.payInvoice.length!=$scope.invoice.pay_invoice.length : choosenFlag;
                    if(choosenFlag){
                        var tmpPayMoney = 0.00;
                        for(var i=0;i<$scope.invoice.pay_invoice.length;i++) {
                            tmpPayMoney = tmpPayMoney + parseFloat(parseFloat($scope.invoice.pay_invoice[i].showMoney).toFixed(2))
                        }
                        var tmpMoney = parseFloat((tmpPayMoney + $scope.invoice.monthMoney).toFixed(2));
                        if($scope.invoice.invoice_limit < tmpMoney){
                            return;
                        }
                    }
                    
                    $scope.invoiceErrorMsg = "";
                    $scope.invoice.payInvoice = [];
                    $scope.invoice.payMoney = 0;
                    for(var i=0;i<$scope.invoice.pay_invoice.length;i++) {
                        $scope.invoice.pay_invoice[i].choosen = choosenFlag;
                        if(choosenFlag) {
                            $scope.invoice.payInvoice.push($scope.invoice.pay_invoice[i].chargeId);
                            $scope.invoice.payMoney = $scope.invoice.payMoney + parseFloat(parseFloat($scope.invoice.pay_invoice[i].showMoney).toFixed(2));
                        }
                    }
                    if(choosenFlag&&($scope.invoice.oneallow.indexOf($scope.invoice.provinceCode) >= 0)&&!$scope.invoice.is4G) $scope.chooseMonthAll(false);
                    $scope.invoice.choosenMoney = parseFloat(($scope.invoice.monthMoney + $scope.invoice.payMoney).toFixed(2));
                    $scope.invoice.invoice_rest = parseFloat(($scope.invoice.invoice_limit - $scope.invoice.choosenMoney).toFixed(2));
                }
                $scope.choosePay = function(payRecord) {
                    if(($scope.invoice.invoice_rest < parseFloat(parseFloat(payRecord.showMoney).toFixed(2))) && !payRecord.choosen){
                        return;
                    }
                    
                    $scope.invoiceErrorMsg = "";
                    payRecord.choosen = !payRecord.choosen;
                    $scope.invoice.payInvoice = [];
                    $scope.invoice.payMoney = 0;
                    for(var i=0;i<$scope.invoice.pay_invoice.length;i++) {
                        if($scope.invoice.pay_invoice[i].choosen) {
                            $scope.invoice.payInvoice.push($scope.invoice.pay_invoice[i].chargeId);
                            $scope.invoice.payMoney = $scope.invoice.payMoney + parseFloat(parseFloat($scope.invoice.pay_invoice[i].showMoney).toFixed(2));
                        }
                    }
                    if(payRecord.choosen&&($scope.invoice.oneallow.indexOf($scope.invoice.provinceCode) >= 0)&&!$scope.invoice.is4G) $scope.chooseMonthAll(false);
                    $scope.invoice.choosenMoney = parseFloat(($scope.invoice.monthMoney + $scope.invoice.payMoney).toFixed(2));
                    $scope.invoice.invoice_rest = parseFloat(($scope.invoice.invoice_limit - $scope.invoice.choosenMoney).toFixed(2));
                }
                $scope.chooseCardAll = function(choosenFlag) {
                    choosenFlag = undefined==choosenFlag ? $scope.invoice.cardList.length!=$scope.invoice.card_invoice.length : choosenFlag;
                    $scope.invoiceErrorMsg = "";
                    $scope.invoice.cardList = [];
                    $scope.invoice.cardMoney = 0;
                    for(var i=0;i<$scope.invoice.card_invoice.length;i++) {
                        $scope.invoice.card_invoice[i].choosen = choosenFlag;
                        if(choosenFlag) {
                            $scope.invoice.cardList.push($scope.invoice.card_invoice[i].orderTime);
                            $scope.invoice.cardMoney = $scope.invoice.cardMoney + parseFloat(parseFloat($scope.invoice.card_invoice[i].showMoney).toFixed(2));
                        }
                    }
                }
                $scope.chooseCard = function(cardRecord) {
                    $scope.invoiceErrorMsg = "";
                    cardRecord.choosen = !cardRecord.choosen;
                    $scope.invoice.cardList = [];
                    $scope.invoice.cardMoney = 0;
                    for(var i=0;i<$scope.invoice.card_invoice.length;i++) {
                        if($scope.invoice.card_invoice[i].choosen) {
                            $scope.invoice.cardList.push($scope.invoice.card_invoice[i].orderTime);
                            $scope.invoice.cardMoney = $scope.invoice.cardMoney + parseFloat(parseFloat($scope.invoice.card_invoice[i].showMoney).toFixed(2));
                        }
                    }
                }
                /** 区分邮寄与自取及月结非月结的*/
                $scope.getInvoiceTypes = function(config,type,servicetype) {
                    if(commonUtil.judgeEmpty(config)) return;
                    for(var i=0;i<config.length;i++) {
                        if($scope.invoice.isPost) {
                            $scope.invoice.mail_invoicetype += (servicetype == "01" || servicetype == "03") ? config[i]["invoice_type"] : "";
                            $scope.invoice.mail_servicetype += !(servicetype == "01" || servicetype == "03") && config[i]["invoice_type"] == "0" ? ","+servicetype : "";
                        } else {
                            $scope.invoice.receive_invoicetype += (servicetype == "01" || servicetype == "03") ? config[i]["invoice_type"] : "";
                            $scope.invoice.receive_servicetype += !(servicetype == "01" || servicetype == "03") && config[i]["invoice_type"] == "0" ?  ","+servicetype : "";
                        }
                    }
                }
                $scope.dealInvoiceRule = function() {
                    var types = /^\d{11}$/.test($scope.invoice.phone) ? ["01" , "06" , "08"] : ["03" , "07" , "08"];
                    for(var i=0;i<types.length;i++) {
                        var rule = $scope.invoice.invoicerule[types[i]];//对应业务类型的配置
                        if(commonUtil.judgeEmpty(rule)) continue;
                        var config = $scope.invoice.isPost ? rule["mail"] : rule["receive"];

                        $scope.getInvoiceTypes(config,$scope.invoice.isPost,types[i]);
                    }
                }
                /** 解析未上线省份发票规则 */
                $scope.dealOldInvoiceRule = function() {
                    var types = /^\d{11}$/.test($scope.invoice.phone) ? ["06" , "08"] : ["07" , "08"];
                    for(var i=0;i<types.length;i++) {
                        var rule = $scope.invoice.invoicerule[types[i]];//对应业务类型的配置
                        if(commonUtil.judgeEmpty(rule)) continue;
                        if(rule["invoice_type"] != 1) {//非月结
                            $scope.invoice.receive_servicetype += (commonUtil.judgeEmpty($scope.invoice.receive_servicetype) ? "" : ",") + types[i];
                        }
                    }
                }
                $scope.fillCardInvoiceRecord = function(data) {
                    $scope.invoice.card_invoice = [];
                    
                    if(data.length<=0 || $scope.invoice.isPost && ($scope.invoice.mail_servicetype.length <= 0 || $scope.invoice.is4G) || !$scope.invoice.isPost && $scope.invoice.receive_servicetype.length <= 0) {//邮寄,无一卡充/自取,无一卡充
                        return;
                    }
                    var beforeDate = DateUtil.getLastMonthDate(new Date(), $scope.invoice.month);
                    for(var i=0;i<data.length;i++) {
                        data[i].showMoney = parseFloat(data[i]["topayTotalMoney"])/100;
                        data[i].choosen = false;
                        if(new Date(beforeDate) > new Date(data[i]["orderTime"]) || data[i].showMoney <= 0) break;
                        $scope.invoice.card_invoice.push(data[i]);
                    }
                }
                $scope.fillPayInvoiceRecord = function(data) {
                    $scope.invoice.pay_invoice = [];
                    
                    var records = data.fee_rec_info;
                    if(!(records == null || records.length<=0 || $scope.invoice.isPost && $scope.invoice.mail_invoicetype.indexOf("0") < 0 || !$scope.invoice.isPost && $scope.invoice.receive_invoicetype.indexOf("0") < 0)) {//邮寄,无月结/自取,无月结
                        var beforeDate = DateUtil.getLastMonthDate(new Date(), $scope.invoice.month);
                        for(var i=0;i<records.length;i++) {
                            var money = parseFloat(records[i]["recvFee"])/100;
                            if(new Date(beforeDate).getTime() > Date.parse(records[i]["recvTime"].replace(/-/g, "/")) || money <= 0) break;
                            records[i].showMoney = money;
                            records[i].choosen = false;
                            $scope.invoice.pay_invoice.push(records[i]);
                        }
                    }
                    if(data.total_print_fee != null && data.total_print_fee > 0){
                        $scope.invoice.pay_limit = data.total_print_fee/100;
                    }
                }
                
                $scope.fillMoneyInvoiceRecord = function(data) {
                    $scope.invoice.month_invoice = [];
                    
                    var records = data.month_rec_info;
                    if(!(records == null || records.length<=0 || $scope.invoice.isPost && $scope.invoice.mail_invoicetype.indexOf("1") < 0 || !$scope.invoice.isPost && $scope.invoice.receive_invoicetype.indexOf("1") < 0)) {//邮寄,无月结/自取,无月结
                        var beforeDate = DateUtil.getLastMonthDate(new Date(), $scope.invoice.month+1);
                        for(var i=0;i<records.length;i++) {
                            var bcycId = records[i]["bcycId"].substr(0,4) + "-" + records[i]["bcycId"].substr(4) , money = parseFloat(records[i]["totalFee"])/100;
                            if(new Date(beforeDate) > new Date(bcycId) || money <= 0) break;
                            records[i].showMoney = money;
                            records[i].showTime = bcycId;
                            records[i].choosen = false;
                            $scope.invoice.month_invoice.push(records[i]);
                        }
                    }
                    if(data.total_print_fee != null && data.total_print_fee > 0){
                        $scope.invoice.month_limit = data.total_print_fee/100;
                    }
                }
                $scope.getInvoiceInfo = function(type) {
                    var uris = {"month":"obtainMonthInvoite","pay":"obtainPayfeeInvoice","card":"GetBuyCardInvoice"};
                    var uri = uris[type];
                    $http({
                        method: 'post',
                        url:NpfMobileConfig.serviceInvoiceURL + "mobObtainInvoice/" + uri,
                        params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE,
                                  'service':$scope.invoice.mail_servicetype}
                    })
                        .success(function(data, status, headers, config){
                            if(type == "month") $scope.fillMoneyInvoiceRecord(data);
                            if(type == "pay") $scope.fillPayInvoiceRecord(data);
                            if(type == "card") $scope.fillCardInvoiceRecord(data);
                            if(type == "month" || type == "pay") {
                                $scope.invoice.invoice_limit = !commonUtil.judgeEmpty($scope.invoice.month_limit) ? $scope.invoice.month_limit : $scope.invoice.pay_limit;
                                $scope.invoice.invoice_rest = $scope.invoice.invoice_limit;
                            }
                        })
                        .error(function(data, status, headers, config){
                        })
                }
                //组装省份地市
                $scope.invoiceProvinceCity= function(provinceCode,cityCode){
                    if(AreaUtils.municipality.indexOf(provinceCode)>=0){//直辖市
                        $scope.invoice.chargePrvoName = "";
                    }else{
                        $scope.invoice.chargePrvoName=AreaUtils.getProvinceName(provinceCode)+"省";
                    }

                    $scope.invoice.chargeCityName=AreaUtils.getCityName(provinceCode,cityCode)+"市";
                }
                /** 获取发票配置并处理展示相关可选 月结/交费/购卡 记录 */
                $scope.getInvoiceConfig = function(provinceCode) {
                    $http({
                        method: 'post',
                        url: NpfMobileConfig.serviceInvoiceURL + 'mobObtainInvoice/getInvoiceRuleNew.action',
                        params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE}
                    })
                        .success(function (data, status, headers, config) {
                            $scope.invoice.invoicerule = data;
                            $scope.invoice.isOnlineProvince ? $scope.dealInvoiceRule() : $scope.dealOldInvoiceRule();
                            var initUpCls = "";
                            if($scope.invoice.mail_invoicetype.indexOf("1")>=0 ) {// 获取月结发票 1:月结
                                $scope.getInvoiceInfo("month");
                                initUpCls = "month";
                                $scope.invoice.monthshow = true;
                            }
                            if($scope.invoice.mail_invoicetype.indexOf("0")>=0 ) { //获取实缴发票 0:实缴
                                $scope.getInvoiceInfo("pay");
                                initUpCls = commonUtil.judgeEmpty(initUpCls) ? "pay" : initUpCls;
                                $scope.invoice.payshow = true;
                            }
                            if((($scope.invoice.mail_servicetype.indexOf("06")>=0 || $scope.invoice.mail_servicetype.indexOf("07")>=0 ||
                                $scope.invoice.mail_servicetype.indexOf("08")>=0) && !$scope.invoice.is4G) || $scope.invoice.receive_servicetype.indexOf("06")>=0 ||
                                $scope.invoice.receive_servicetype.indexOf("07")>=0 || $scope.invoice.receive_servicetype.indexOf("08")>=0) {//获取一卡充类型发票
                                $scope.getInvoiceInfo("card");
                                initUpCls = commonUtil.judgeEmpty(initUpCls) ? "card" : initUpCls;
                            }
                            if(initUpCls != "") {
                                $("."+initUpCls).click();//展开对应列表(若月结发票列表不为空则展开月结发票列表/其次为实缴,再次为一卡充)
                            }

                        })
                        .error(function (data, status, headers, config) {
                            //
                        });
                }
                $scope.judgeInvoiceHeard = function() {
                    if (commonUtil.judgeEmpty($scope.invoice.invoiceHeader) || /^.*[,\^\*\?#<>&\!@%`+\$}{'"\\\/\[\]+].*$/.test($scope.invoice.invoiceHeader)
                        || /^.*[\u005f\u003d\uff5b\uff5d\u3001\u007c\uff5c\u003b\uff1b\uff1f\uff01\uffe5\u2026\u201c\u201d\u2018\u2019].*$/.test($scope.invoice.invoiceHeader)
                        || ($.trim($scope.invoice.invoiceHeader) == "null")) {
                        $scope.invoiceErrorMsg = "请正确填写发票抬头";
                        return false;
                    }
                    return true;
                }
                $scope.invoice.invoiceSelectOption = [{certid: '0', certname: '身份证'},{certid: '1', certname: '军官证'},{certid: '2', certname: '护照'},{certid: '3', certname: '港澳台通行证'},{certid: '4', certname: '户口簿'}];
                $scope.invoice.certType = {"0" : "身份证" , "1" : "军官证" , "2" : "护照" , "3" : "港澳台通行证" , "4" : "户口薄"};
                $scope.invoiceJudge = function () {
                    if (commonUtil.judgeEmpty($scope.invoice.invoiceTypeCode)) {
                        $scope.invoiceErrorMsg = "请选择发票类型";
                        return false;
                    }
                    var invoiceCerttype = $scope.invoice.invoiceTypeCode;
                    var certificateNum = $scope.invoice.certificateNum;
                    if ("0" == invoiceCerttype && !IdCard.IdCardValidate($scope.invoice.certificateNum)) {
                        $scope.invoiceErrorMsg = "身份证号码格式不正确";
                        return false;
                    } else if ("1" == invoiceCerttype) {
                        if (!$scope.invoice.certificateNum || !isNaN(certificateNum.substr(0, 1)) || !isNaN(certificateNum.substr(1, 1)) || !isNaN(certificateNum.substr(2, 1))
                            || certificateNum.substr(certificateNum.length - 1, 1) != "号" || isNaN(certificateNum.substr(4, 5)) || ($.trim(certificateNum) == "null")) {
                            $scope.invoiceErrorMsg = "军官证号码格式不正确";
                            return false;
                        }
                    } else if ((!/^\w{1,18}$/.test($scope.invoice.certificateNum)) || ($.trim($scope.invoice.certificateNum) == "null")) {
                        $scope.invoiceErrorMsg = $scope.invoice.certType[invoiceCerttype] + "号码格式不正确";
                        return false;
                    }
                    return true;
                }
                $scope.goPayInfo = function() {
                    $scope.invoiceErrorMsg = "";
                    if($scope.invoice.monthInvoice.length<=0 && $scope.invoice.payInvoice.length<=0 && $scope.invoice.cardList.length<=0) {
                        $scope.invoiceErrorMsg = "请选择要打印的发票信息!";
                        return;
                    }
                    if(!commonUtil.judgeEmpty($scope.invoice.cardList) && !$scope.judgeInvoiceHeard()) {
                        return;
                    }
                    if($scope.invoice.isPost) {
                        $scope.invoice.paytype = {};
                        $location.path('/payInfo');
                    }else {
                        if(!$scope.invoiceJudge()) {
                            return;
                        }
                        $scope.checkInvoice();
                    }
                }
                $scope.subInvoice = function(sec) {
                    $http({
                        method: 'post',
                        url: NpfMobileConfig.serviceInvoiceURL + "mobObtainInvoice/InvoiceSubmit.action",
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
                        'invoiceBean.is_mailing' : $scope.invoice.isPost ? '1' : '0',
                        'invoiceBean.need_invoice' : '1',
                        'postBean.monthInvoice' : commonUtil.arrToStr($scope.invoice.monthInvoice),
                        'postBean.payInvoice' : commonUtil.arrToStr($scope.invoice.payInvoice),
                        'postBean.cardList' : commonUtil.arrToStr($scope.invoice.cardList),
                        'postBean.invoice_total_money' : $scope.invoice.monthMoney+$scope.invoice.payMoney+ $scope.invoice.cardMoney,
                        'postBean.month_method' : $scope.invoice.month,//选择的月份1个月/3个月/6个月
                        'postBean.unicardServicetype' : $scope.invoice.isPost ? $scope.invoice.mail_servicetype : $scope.invoice.receive_servicetype,
                        'invoiceBean.invoice_head' : $scope.invoice.invoiceHeader,
                        'invoiceBean.card_type' : $scope.invoice.invoiceTypeCode,
                        'invoiceBean.id_cardno' : $scope.invoice.certificateNum,
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
                //初始化页面
                if(commonUtil.judgeEmpty($scope.invoice.phone)) $location.path('/invoice');
                $scope.getInvoiceConfig($scope.invoice.provinceCode);
                $scope.invoiceProvinceCity($scope.invoice.provinceCode, $scope.invoice.cityCode);
//                $scope.servieType = "reinvoiceFinish";
//                MessagetipsUtils.fillMessagetips($scope.servieType);

                $scope.goBack = function() {
                    $location.path('/invoice');
                }
        }])
    });