define(['angular', 'NpfMobileConfig', 'invoiceself/js/invoice','commonModule','messagetipsModule','dateModule','areaModule','commonFuncModule','js/IdCardValidate'],
    function (angular, NpfMobileConfig, invoice) {
        invoice.controller('chooseForSearch', ['$scope', '$http', '$location', 'NpayInfo','commonUtil','MessagetipsUtils',
                function ($scope, $http, $location, NpayInfo,commonUtil,MessagetipsUtils) {
                    document.title = "发票查询";
                    $scope.invoice = NpayInfo;
                    $scope.bankcharge = NpayInfo;
//                    $scope.chooseGetWay = function(isPost) {
                        $scope.invoice.isPost = false;
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
                $scope.invoice.card_invoice = [] ,$scope.invoice.charge_invoice=[] ,$scope.invoice.cardList = [],$scope.invoice.chargeList=[] , $scope.invoice.cardMoney = 0;
                $scope.invoice.month_invoice = [] , $scope.invoice.monthInvoice = [] , $scope.invoice.month_limit = 0 , $scope.invoice.monthMoney = 0;
                $scope.invoice.pay_invoice = [] , $scope.invoice.payInvoice = [] , $scope.invoice.pay_limit = 0 , $scope.invoice.payMoney = 0;
                $scope.invoice.choosenMoney = 0 ;
                $scope.invoiceErrorMsg = "";
                $scope.bankcharge = NpayInfo;
                $scope.invoice.chargePrvoName="";
                $scope.invoice.chargeCityName="";
                $scope.chooseCityHidden=true;
                $scope.invoice.chargeMoney=0;
                $scope.isShowSave=true;
                $scope.invoice.isCardShow=true;
                $scope.invoice.NotAllowedChoose=false;
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
                    if(!$scope.invoice.isCardShow){
                        for(var i=0;i<$scope.invoice.card_invoice.length;i++) {
                            $scope.invoice.card_invoice[i].choosen = choosenFlag;
                            if(choosenFlag) {
                                $scope.invoice.cardList.push($scope.invoice.card_invoice[i].orderTime);
                                $scope.invoice.cardMoney = $scope.invoice.cardMoney + parseFloat(parseFloat($scope.invoice.card_invoice[i].showMoney).toFixed(2));
                            }
                        }
                        $scope.invoice.cardList=0;
                        return;
                    }
                    choosenFlag = undefined==choosenFlag ? $scope.invoice.cardList.length!=$scope.invoice.card_invoice.length : choosenFlag;
                    if($scope.invoice.NotAllowedChoose){
                        choosenFlag=false;
                    }
                    $scope.invoiceErrorMsg = "";
                    $scope.invoice.cardList = [];
                    for(var i=0;i<$scope.invoice.card_invoice.length;i++) {
                        $scope.invoice.card_invoice[i].choosen = choosenFlag;
                        if(choosenFlag) {
                            $scope.invoice.cardList.push($scope.invoice.card_invoice[i].orderTime);
                            $scope.invoice.cardMoney = $scope.invoice.cardMoney + parseFloat(parseFloat($scope.invoice.card_invoice[i].showMoney).toFixed(2));
                        }
                    }
                }
                $scope.chooseCard = function(cardRecord) {
                    if(!$scope.invoice.isCardShow){
                        return;
                    }
                    $scope.invoiceErrorMsg = "";
                    cardRecord.choosen = !cardRecord.choosen;
                    $scope.invoice.cardList = [];
                    for(var i=0;i<$scope.invoice.card_invoice.length;i++) {
                        if($scope.invoice.card_invoice[i].choosen) {
                            $scope.invoice.cardList.push($scope.invoice.card_invoice[i].orderTime);
                            $scope.invoice.cardMoney = $scope.invoice.cardMoney + parseFloat(parseFloat($scope.invoice.card_invoice[i].showMoney).toFixed(2));
                        }
                    }
                }
                $scope.chooseChargeAll = function(choosenFlag) {
                    choosenFlag = undefined==choosenFlag ? $scope.invoice.chargeList.length!=$scope.invoice.charge_invoice.length : choosenFlag;
                    if($scope.invoice.NotAllowedChoose){
                        choosenFlag=false;
                    }
                    $scope.invoiceErrorMsg = "";
                    $scope.invoice.chargeList = [];
                    for(var i=0;i<$scope.invoice.charge_invoice.length;i++) {
                        $scope.invoice.charge_invoice[i].choosen = choosenFlag;
                        if(choosenFlag) {
                            $scope.invoice.chargeList.push($scope.invoice.charge_invoice[i].orderTime);
                            $scope.invoice.chargeMoney = $scope.invoice.chargeMoney + parseFloat(parseFloat($scope.invoice.charge_invoice[i].showMoney).toFixed(2));
                        }
                    }
                }
                $scope.chooseCharge = function(chargeRecord) {
                    if(!$scope.invoice.isCardShow){
                        choosenFlag=false;
                        return ;
                    }
                    $scope.invoiceErrorMsg = "";
                    chargeRecord.choosen = !chargeRecord.choosen;
                    $scope.invoice.chargeList = [];
                    for(var i=0;i<$scope.invoice.charge_invoice.length;i++) {
                        if($scope.invoice.charge_invoice[i].choosen) {
                            $scope.invoice.chargeList.push($scope.invoice.charge_invoice[i].orderTime);
                            $scope.invoice.chargeMoney = $scope.invoice.chargeMoney + parseFloat(parseFloat($scope.invoice.charge_invoice[i].showMoney).toFixed(2));
                        }
                    }

                }
                //跳转发票/邮寄页面
                $scope.goInvoiceHtml = function () {
                    if($scope.invoice.chargeMoney>0||$scope.invoice.cardMoney>0){
                        $location.path('/invoinceInfo');
                    }
                    else{
                        $scope.invoiceErrorMsg="请重新选择要打印发票";
                    }
                }
                $scope.showInvoiceProvince= function(){
                    $scope.chooseCityHidden=false;

                    $scope.bankcharge.prvoinceNames=AreaUtils.provinces;
                    $scope.invoice.isShowProvince=true;

                }
                //组装省份地市
                $scope.invoiceProvinceCity= function(provinceCode,cityCode){
                    if(AreaUtils.municipality.indexOf(provinceCode)>=0){//直辖市
                        $scope.invoice.chargePrvoName = "";
                    }else{
                        $scope.invoice.chargePrvoName=AreaUtils.getProvinceName(provinceCode)+" ";
                    }
                    $scope.invoice.chargeCityName=AreaUtils.getCityName(provinceCode,cityCode);
                }

                //选择省份-->展示地市
                $scope.confirmProv = function (provinceCode,provinceName){
                    $scope.chooseCityHidden=false;
                    $scope.bankchargeErrorMsg="";
                    $scope.bankcharge.isBroadProvinceShow = false;
                    $scope.bankcharge.cityNames =AreaUtils.getCitiesByPorv(provinceCode);
                    $scope.invoice.provinceCode=provinceCode;
                    $scope.invoice.currentProvName = provinceName;
                    if(AreaUtils.municipality.indexOf(provinceCode)>=0){//直辖市
                        $scope.invoice.currentCityName = "";
                        $scope.invoice.isShowProvince=false;
                        $scope.invoice.isShowCity=false;
                        $scope.chooseCityHidden=true;
                        //获取发票配置信息  常用发票信息
                        $scope.getProInvoiceConfig(provinceCode,$scope.bankcharge.cityNames[0].id);
                    }else{
                        $scope.invoice.isShowCity=true;
                    }
                    $scope.invoice.isShowProvince=false;

                }

                //选择地市-->返回省份地市至宽带页面
                $scope.confirmCity = function (cityName,provCode,cityCode){
                    $scope.invoice.isShowProvince=false;
                    $scope.invoice.isShowCity=false;
                    $scope.bankchargeErrorMsg = "";
                    $scope.invoice.currentCityName = cityName;
                    if( AreaUtils.municipality.indexOf(provCode)>=0){
                        $scope.invoice.currentCityName = "";
                    }
                    $scope.chooseCityHidden=true;
                    $scope.getProInvoiceConfig(provCode,cityCode);
                }
                //自取发票购卡记录省份
                $scope.isCardInvoice = function(){
                    $scope.invoice.servicetypetemp ="08";
                    $scope.invoice.invoicetype = commonUtil.judgeEmpty($scope.invoice.cardinvoicerule[$scope.invoice.servicetypetemp])? "1" : $scope.invoice.cardinvoicerule[$scope.invoice.servicetypetemp]["invoice_type"];
                    if ($scope.invoice.invoicetype == "0") { // 自取
                        noSelfInvoice=false;
                        $(".noSelfInvoiceTip").empty().text("");
                        $("#invoice_card").find("input").attr("disabled",false);

                        $scope.invoice.isCardShow=true;
                        $scope.invoice.NotAllowedChoose=false;
                        $scope.invoiceErrorMsg="";
                    }

                    else{

                        $(".noSelfInvoiceTip").empty().text("您选择的省分仅支持月结发票的打印，无需勾选购卡发票，每月月初到本市自有营业厅领取。");
                        $scope.invoice.isCardShow=false;
                        $scope.invoice.NotAllowedChoose=true;
                        //对直充的代码要删除
                        //$scope.invoice.chargeList= $scope.invoice.charge_invoice;
                        $scope.chooseChargeAll(false);

                        //$scope.invoice.cardList=$scope.invoice.card_invoice;
                        $scope.chooseCardAll(false);


                        $scope.invoiceErrorMsg="您选择的省分仅支持月结发票的打印，无需勾选购卡发票，每月月初到本市自有营业厅领取。";
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
                    if(data.length<=0 || $scope.invoice.isPost && ($scope.invoice.mail_servicetype.length <= 0 || $scope.invoice.is4G) || !$scope.invoice.isPost && $scope.invoice.receive_servicetype.length <= 0) {//邮寄,无一卡充/自领取,无一卡充
                        return;
                    }
                    var beforeDate = DateUtil.getLastMonthDate(new Date(), $scope.invoice.month);
                    $scope.invoice.card_invoice=[];

                    for(var i=0;i<data.length;i++) {
                        data[i].showMoney = parseFloat(data[i]["topayTotalMoney"])/100;
                        data[i].choosen = false;
                        if(new Date(beforeDate) > new Date(data[i]["orderTime"]) || data[i].showMoney <= 0) break;
                        $scope.invoice.card_invoice.push(data[i]);
                    }
                }
                //填充直充发票记录
                $scope.fillChargeInvoiceRecord = function(data) {
                    if(data.length<=0 || $scope.invoice.isPost && ($scope.invoice.mail_servicetype.length <= 0 || $scope.invoice.is4G) || !$scope.invoice.isPost && $scope.invoice.receive_servicetype.length <= 0) {//邮寄,无一卡充/自领取,无一卡充
                        return;
                    }
                    $scope.invoice.charge_invoice=[];
                    var beforeDate = DateUtil.getLastMonthDate(new Date(), $scope.invoice.month);
                    for(var i=0;i<data.length;i++) {
                        data[i].showMoney = parseFloat(data[i]["topayTotalMoney"])/100;
                        data[i].choosen = false;
                        if(new Date(beforeDate) > new Date(data[i]["orderTime"]) || data[i].showMoney <= 0) break;
                        $scope.invoice.charge_invoice.push(data[i]);
                    }
                }
                $scope.fillPayInvoiceRecord = function(data) {
                    var records = data.fee_rec_info;
                    if(records.length<=0 || $scope.invoice.isPost && $scope.invoice.mail_invoicetype.indexOf("0") < 0 || !$scope.invoice.isPost && $scope.invoice.receive_invoicetype.indexOf("0") < 0) {//邮寄,无月结/自领取,无月结
                        return;
                    }
                    var beforeDate = DateUtil.getLastMonthDate(new Date(), $scope.invoice.month);
                    for(var i=0;i<records.length;i++) {
                        var money = parseFloat(records[i]["recvFee"])/100;
                        if(new Date(beforeDate).getTime() > Date.parse(records[i]["recvTime"].replace(/-/g, "/")) || money <= 0) break;
                        records[i].showMoney = money;
                        records[i].choosen = false;
                        $scope.invoice.pay_invoice.push(records[i]);
                    }
                    $scope.invoice.pay_limit = data.total_print_fee/100;
                }
                $scope.fillMoneyInvoiceRecord = function(data) {
                    var records = data.month_rec_info;
                    if(records.length<=0 || $scope.invoice.isPost && $scope.invoice.mail_invoicetype.indexOf("1") < 0 || !$scope.invoice.isPost && $scope.invoice.receive_invoicetype.indexOf("1") < 0) {//邮寄,无月结/自领取,无月结
                        return;
                    }
                    var beforeDate = DateUtil.getLastMonthDate(new Date(), $scope.invoice.month+1);
                    for(var i=0;i<records.length;i++) {
                        var bcycId = records[i]["bcycId"].substr(0,4) + "-" + records[i]["bcycId"].substr(4) , money = parseFloat(records[i]["totalFee"])/100;
                        if(new Date(beforeDate) > new Date(bcycId) || money <= 0) break;
                        records[i].showMoney = money;
                        records[i].showTime = bcycId;
                        records[i].choosen = false;
                        $scope.invoice.month_invoice.push(records[i]);
                    }
                    $scope.invoice.month_limit = data.total_print_fee/100;
                }
                $scope.getInvCardorChargeInfo=function(){
                    var service = $scope.invoice.receive_servicetype;
                    //$("#unicardServicetype").val(service);
                    var serviceArr=service.split(",");
                    for(var i=0;i<serviceArr.length;i++){
                        if((commonUtil.judgeEmpty(serviceArr[i]))) continue;
                        $scope.getInfo(serviceArr[i]);
                    }
                }
                $scope.getInfo =function(type){

                    var uri ="GetBuyCardInvoice";
                    $http({
                        method: 'post',
                        url:NpfMobileConfig.serviceInvoiceURL + "mobObtainInvoice/" + uri,
                        params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE,
                            'service':type}
                    })
                        .success(function(data, status, headers, config){
                            if("08"==type){
                                $scope.fillCardInvoiceRecord(data);
                            }else{
                                $scope.fillChargeInvoiceRecord(data);
                            }
                        })
                        .error(function(data, status, headers, config){
                        })
                }
                $scope.getInvoiceInfo = function(type) {
                    var uris = {"month":"obtainMonthInvoite","pay":"obtainPayfeeInvoice","card":"GetBuyCardInvoice"};
                    var uri = uris[type];
                    $http({
                        method: 'post',
                        url:NpfMobileConfig.serviceInvoiceURL + "mobObtainInvoice/" + uri,
                        params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE,
                                  'service':$scope.invoice.receive_servicetype}
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

                //新增，选取地市后读取发票规则  ln
                $scope.getProInvoiceConfig = function (provinceCode,cityCode) {
                    $http({
                        method: 'post',
                        url: NpfMobileConfig.serviceInvoiceURL + 'Invoice/getInvoiceRuleFinishPage.action',
                        params: {
                            'provCode': provinceCode,'commonBean.channelType' :NpfMobileConfig.CHANNEL_TYPE
                        }
                    })
                        .success(function (data, status, headers, config) {
                            $scope.invoice.cardinvoicerule = data;
                            $scope.isCardInvoice();
                        })
                        .error(function (data, status, headers, config) {
                        });
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
                            }
                            if($scope.invoice.mail_invoicetype.indexOf("0")>=0 ) { //获取实缴发票 0:实缴
                                $scope.getInvoiceInfo("pay");
                                initUpCls = commonUtil.judgeEmpty(initUpCls) ? "pay" : initUpCls;
                            }
                            if((($scope.invoice.mail_servicetype.indexOf("06")>=0 || $scope.invoice.mail_servicetype.indexOf("07")>=0 ||
                                $scope.invoice.mail_servicetype.indexOf("08")>=0) && !$scope.invoice.is4G) || $scope.invoice.receive_servicetype.indexOf("06")>=0 ||
                                $scope.invoice.receive_servicetype.indexOf("07")>=0 || $scope.invoice.receive_servicetype.indexOf("08")>=0) {//获取一卡充类型发票
                                $scope.getInvCardorChargeInfo("card");
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


                $scope.getCustomInvoice = function (data) {
                    if(commonUtil.judgeEmpty(data) && $scope.bankcharge.bankchargeamount) {
                        $scope.bankcharge.invoiceNorList = false;
                        $scope.bankcharge.invoiceinfohide = false;
                        return;
                    }
                    $scope.bankcharge.invoiceType = "";

                    $scope.bankcharge.invoiceType = data.invoice_type;
                    $scope.bankcharge.isMail = data.is_mail;

                    if (data.service_type == NpfMobileConfig.BUSINESS_TYPE_FIX || data.service_type == NpfMobileConfig.BUSINESS_TYPE_MOBILE) {
                        if($scope.bankcharge.invoiceType == "0"){
                            $scope.bankcharge.invoiceNorList = $scope.bankcharge.invoiceList.length <= 0 ? true : false;
                            $scope.bankcharge.invoiceinfohide = $scope.bankcharge.invoiceList.length <= 0 ? false : true;
                        }
                        else {
                            $scope.bankcharge.invoiceNorList = false;
                            $scope.bankcharge.invoiceinfohide = false;
                        }
                        $scope.bankcharge.invoiceNorMonthShow = $scope.bankcharge.invoiceinfohide;
                        $scope.bankcharge.invoiceMonthShow = $scope.bankcharge.invoiceType == "0" ? false : true;
                    }
                    else if (!$scope.bankcharge.bankchargeamount) {
                        $scope.bankcharge.invoiceMonthShow = $scope.bankcharge.isMail == "1" ? true : false;
                        $scope.bankcharge.invoiceNorList = false;
                        $scope.bankcharge.invoiceinfohide = false;
                    }

                    if (data.service_type == NpfMobileConfig.BUSINESS_TYPE_FIX || data.service_type == NpfMobileConfig.BUSINESS_TYPE_PAYFIX) {
                        $scope.bankcharge.fixInvoiceShow = true;
                    }
                    else if(data.service_type == NpfMobileConfig.BUSINESS_TYPE_MOBILE || data.service_type == NpfMobileConfig.BUSINESS_TYPE_PAYMOBILE) {
                        $scope.bankcharge.mobInvoiceShow = true;
                    }
                    $scope.bankcharge.otherAmountinvoice = false;
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