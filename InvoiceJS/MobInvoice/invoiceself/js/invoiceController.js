define(['angular','NpfMobileConfig','invoiceself/js/invoice','invoiceself/js/chooseInfos','js/IdCardValidate','commonFuncModule'],
    function (angular,NpfMobileConfig, invoice) {
    return invoice.controller('invoiceController', ['$scope', '$http', '$window', '$location', 'NpayInfo','IdCard','commonUtil',
        function ($scope, $http, $window, $location, NpayInfo,IdCard,commonUtil) {
            document.title = "发票信息";
            $scope.invoiceInfo = NpayInfo;
            $scope.invoice=NpayInfo;
            $scope.invoiceInfo.uri = "/chooseRecords";
            $scope.invoiceSelectOption = [
                {certid: '0', certname: '身份证'},
                {certid: '1', certname: '军官证'},
                {certid: '2', certname: '护照'},
                {certid: '3', certname: '港澳台通行证'},
                {certid: '4', certname: '户口簿'}
            ]
            $scope.isShowSave=true;
	    //特殊字符校验：_=｛｝、|｜;；？！￥…“”‘’
            $scope.invoiceJudge = function () {
                if (!$scope.bankchargeForm.invoiceHeader.$valid || /^.*[,\^\*\?#<>&\!@%`+\$}{'"\\\/\[\]+].*$/.test($scope.invoiceInfo.invoiceHeader)
                    || /^.*[\u005f\u003d\uff5b\uff5d\u3001\u007c\uff5c\u003b\uff1b\uff1f\uff01\uffe5\u2026\u201c\u201d\u2018\u2019].*$/.test($scope.invoiceInfo.invoiceHeader)
                    || ($.trim($scope.invoiceInfo.invoiceHeader) == "null")) {
                    $scope.invoiceErrorMsg = "请正确填写发票抬头";
                    return;
                }
                if ($scope.bankchargeForm.invoiceTypeCode.$error.required) {
                    $scope.invoiceErrorMsg = "请选择发票类型";
                    return;
                }

                var invoiceCerttype = $scope.invoiceInfo.invoiceTypeCode;
                var certificateNum = $scope.invoiceInfo.certificateNum;
                if ("0" == invoiceCerttype) {
                    if (!IdCard.IdCardValidate($scope.invoiceInfo.certificateNum)) {
                        $scope.invoiceErrorMsg = "身份证号码格式不正确";
                        return;
                    }
                } else if ("1" == invoiceCerttype) {
                    if (!$scope.bankchargeForm.certificateNum.$valid || !isNaN(certificateNum.substr(0, 1)) || !isNaN(certificateNum.substr(1, 1)) || !isNaN(certificateNum.substr(2, 1))
                        || certificateNum.substr(certificateNum.length - 1, 1) != "号" || isNaN(certificateNum.substr(4, 5)) || ($.trim(certificateNum) == "null")) {
                        $scope.invoiceErrorMsg = "军官证号码格式不正确";
                        return;
                    }
                } else {
                    if ((!$scope.bankchargeForm.certificateNum.$valid) || ($.trim(certificateNum) == "null")) {
                        $scope.invoiceErrorMsg = commonUtil.getInvoiceTypeName(invoiceCerttype) + "号码格式不正确";
                        return;
                    }
                }
                var invoiceList = [
                    {
                        'INVOICE_HEAD': commonUtil.removeSpace($scope.invoiceInfo.invoiceHeader),
                        'CARD_TYPE_NAME': $scope.invoiceInfo.invoiceTypeName,
                        'ID_CARDNO': commonUtil.removeSpace($scope.invoiceInfo.certificateNum),
                        'CARD_TYPE': $scope.invoiceInfo.invoiceTypeCode
                    }
                ];

                $scope.invoiceInfo.invoiceList = invoiceList;
                if($scope.invoiceInfo.fixBannersel){
                    $scope.fillInvoice();
                    $scope.invoiceInfo.inputPhoneShow=false;
                    $scope.invoiceInfo.inputFixShow=false;
                }else{
                    $scope.fillInvoice();
                    $scope.invoiceInfo.inputPhoneShow=false;
                    $scope.invoiceInfo.inputFixShow=false;
                }
                $scope.isShowSave=false;
                $scope.invoiceErrorMsg = "";
                return true;
                //$location.path($scope.invoiceInfo.uri);
            }

            $scope.goPayInfo = function() {
                $scope.invoiceErrorMsg = "";
                if($scope.invoice.monthInvoice.length<=0 && $scope.invoice.payInvoice.length<=0 && $scope.invoice.cardList.length<=0&&$scope.invoice.chargeList.length<=0) {
                    $scope.invoiceErrorMsg = "请选择要打印的发票信息!";
                    return;
                }
                if(!commonUtil.judgeEmpty($scope.invoice.cardList) && !$scope.judgeInvoiceHeard()&&!commonUtil.judgeEmpty($scope.invoice.chargeList)) {
                    return;
                }
                if($scope.invoice.isPost) {
                    $location.path('/payInfo');
                }else {
                    if(!$scope.invoiceJudge()) {
                        return;
                    }
                    $scope.checkInvoice();
                }
            }

            $scope.getCheckParam = function() {
                return {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE,
                    'invoiceBean.is_mailing' : $scope.invoice.isPost ? '1' : '0',
                    'invoiceBean.need_invoice' : '1',
                    'invoiceBean.province_code' : $scope.invoice.provinceCode,
                    'invoiceBean.city_code': $scope.invoice.currentCityName,
                    'postBean.monthInvoice' : commonUtil.arrToStr($scope.invoice.monthInvoice),
                    'postBean.payInvoice' : commonUtil.arrToStr($scope.invoice.payInvoice),
                    'postBean.cardList' : commonUtil.arrToStr($scope.invoice.cardList),
                    'postBean.chargeList' :commonUtil.arrToStr($scope.invoice.chargeList),
                    'postBean.invoice_total_money' : $scope.invoice.monthMoney+$scope.invoice.payMoney+ $scope.invoice.cardMoney+ $scope.invoice.chargeMoney,
                    'commonBean.invoiceTotalMoney' : $scope.invoice.monthMoney+$scope.invoice.payMoney+ $scope.invoice.cardMoney+ $scope.invoice.chargeMoney,
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

            $scope.hideInvoice = function() {
                $scope.invoiceInfo.invoiceNorList = true;
                $scope.invoiceInfo.invoiceinfohide = false;
                $scope.invoiceInfo.invoiceNorMonthShow = false;
                $scope.invoiceInfo.invoiceMonthShow = false;
                $scope.invoiceInfo.invoiceHeader="";
                $scope.invoiceInfo.certificateNum="";
            }
            $scope.fillInvoice = function() {
                $scope.invoiceInfo.invoiceNorList = false;
                $scope.invoiceInfo.invoiceinfohide = true;
                $scope.invoiceInfo.invoiceNorMonthShow = true;
                $scope.invoiceInfo.invoiceMonthShow = false;
            }

            $scope.changeInvoiceType = function () {
               $scope.invoiceInfo.invoiceTypeName = commonUtil.getInvoiceTypeName($scope.invoiceInfo.invoiceTypeCode);
            }

            $scope.invoiceCancelOrDel = function () {
                $scope.invoiceInfo.inputPhoneShow=false;
                if ($scope.invoiceInfo.invoiceDelOrCancelTag == "取消") {
                    $location.path($scope.invoiceInfo.uri);
                } else {
                    //$(".thickdiv").hide();
                    $(".page").hide();
                    $("#del-invoice").show().center();
                }
            }

            $scope.cancleInvoice=function(){
                $("#del-invoice").hide();
                //$(".thickdiv").show();
                $(".page").show();
            }
            $scope.delInvoice=function(){
               //$(".thickdiv").hide();
                $(".page").show();
                $scope.noInvoiceInfo();
                $scope.hideInvoice();

                /*$scope.invoiceInfo.invoiceList = [];
                $scope.hideInvoice();
                $scope.invoiceInfo.invoiceType="";

                $scope.invoiceInfo.invoiceTypeName = commonUtil.getInvoiceTypeName( $scope.invoiceInfo.invoiceList[0].CARD_TYPE);*/
                $location.path($scope.invoiceInfo.uri);
                $("#del-invoice").hide();
            }

            $scope.cardremove=function(){
                $scope.invoiceInfo.certificateNum="";
                $scope.invoiceInfo.cardremove=false;
                $("#certificateNum").focus();
            }
            $scope.headeremove=function(){
                $scope.invoiceInfo.invoiceHeader="";
                $scope.invoiceInfo.headeremove=false;
                $("#invoiceHeader").focus();
            }
            $scope.showcard=function(){
                if(commonUtil.judgeEmpty($scope.invoiceInfo.certificateNum)){
                    $scope.invoiceInfo.cardremove=false;
                }else{
                    $scope.invoiceInfo.cardremove=true;
                }
            }
            $scope.showheader=function(){
                if(commonUtil.judgeEmpty($scope.invoiceInfo.invoiceHeader)){
                    $scope.invoiceInfo.headeremove=false;
                }else{
                    $scope.invoiceInfo.headeremove=true;
                }
            }
            //  初始化发票页面
            $scope.invoiceListShow = function (data) {
                $scope.invoiceInfo.invoiceList = data;
                $scope.invoiceInfo.invoiceHeader = $scope.invoiceInfo.invoiceList[0].INVOICE_HEAD;
                $scope.invoiceInfo.certificateNum = $scope.invoiceInfo.invoiceList[0].ID_CARDNO;
                $scope.invoiceInfo.invoiceTypeName = commonUtil.getInvoiceTypeName($scope.invoiceInfo.invoiceList[0].CARD_TYPE);
                $scope.invoiceInfo.invoiceTypeCode = $scope.invoiceInfo.invoiceList[0].CARD_TYPE;
                $scope.invoiceInfo.invoiceDelOrCancelTag = "删除";
                $scope.invoiceInfo.headeremove = true;
                $scope.invoiceInfo.cardremove = true;
            }

            $scope.noInvoiceInfo = function() {
                $scope.invoiceInfo.invoiceTypeName = "身份证";
                $scope.invoiceInfo.invoiceTypeCode = "0";
                $scope.invoiceInfo.invoiceDelOrCancelTag = "取消";
                $scope.invoiceInfo.invoiceHeader = "";
                $scope.invoiceInfo.certificateNum = "";
                $scope.invoiceInfo.headeremove = false;
                $scope.invoiceInfo.cardremove = false;
            }
            if (commonUtil.judgeEmpty($scope.invoiceInfo.invoiceList)) {
                //获取最后的发票信息
                var url = $scope.invoiceInfo.fixBannersel ? NpfMobileConfig.fixBankchargeURL : NpfMobileConfig.serviceBankchargeURL;
                var uri = $scope.invoiceInfo.isWap ? "Invoice/wapGetInvoiceRecord.action" : "Invoice/getInvoiceRecord.action";
                $http({
                    method: 'post',
                    url: url + uri
                })
                    .success(function (data, status, headers, config) {
                        if (data.length > 0) {
                            $scope.invoiceListShow(data);
                        } else {
                            $scope.noInvoiceInfo();
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $scope.noInvoiceInfo();
                    });
            } else {
                $scope.invoiceListShow($scope.invoiceInfo.invoiceList);
            }
        }])
});
