define(['angular','commonModule','focus','cookieInfo'], function (angular) {
    return angular.module('commonFuncModule', [])
        .factory('commonUtil', function () {
            return {
                judgeEmpty: function(str) {
                    return null == str || undefined == str || "" == str || str.length==0;
                },
                arrToStr: function(arr) {
                    var str = "";
                    for(var i=0;i<arr.length;i++){
                        str += (str=="" ? "" : ",") + arr[i];
                    }
                    return str;
                },
                removeSpace: function(data){
                    data = data.replace(/^\s\s*/, ''), ws = /\s/, i = data.length;
                    while (ws.test(data.charAt(--i)));
                    return data.slice(0, i + 1);
                },
                getInvoiceTypeName: function (invoiceCerttype) {
                    if ("0" == invoiceCerttype) {
                        return "身份证";
                    }
                    else if ("1" == invoiceCerttype) {
                        return "军官证";
                    }
                    else if ("2" == invoiceCerttype) {
                        return "护照";
                    }
                    else if ("3" == invoiceCerttype) {
                        return "港澳台通行证";
                    }
                    else if ("4" == invoiceCerttype) {
                        return "户口薄";
                    }
                },
                changeTwoDecimal_f : function(x) {
                    var f_x = parseFloat(x);
                    if (isNaN(f_x)) {
                        return false;
                    }
                    var f_x = Math.round(x*100)/100;
                    var s_x = f_x.toString();
                    var pos_decimal = s_x.indexOf('.');
                    if (pos_decimal < 0) {
                        pos_decimal = s_x.length;
                        s_x += '.';
                    }
                    while (s_x.length <= pos_decimal + 2) {
                        s_x += '0';
                    }
                    return s_x;
                },
                judgeInvoiceHead:function(){

                    if (judgeEmpty($scope.invoice.invoiceHeader) || /^.*[,\^\*\?#<>&\!@%`+\$}{'"\\\/\[\]+].*$/.test($scope.invoice.invoiceHeader)
                        || /^.*[\u005f\u003d\uff5b\uff5d\u3001\u007c\uff5c\u003b\uff1b\uff1f\uff01\uffe5\u2026\u201c\u201d\u2018\u2019].*$/.test($scope.invoice.invoiceHeader)
                        || ($.trim($scope.invoice.invoiceHeader) == "null")) {
                        $scope.invoiceErrorMsg = "请正确填写发票抬头";
                        return false;
                    }
                    return true;
                }
            }
    });
});

//客户端调用通讯录,type用作区分直充和充值
function chooseAddress(phone,name,type){
    name=judgeEmpty(name)? "" :name.trim();
    var nameIsEmpty =judgeEmpty(name) || phone == name || /^(0\d{2,3}-*\d{7,8})$/.test(name);
    phone=formateNumGetBasicPhone(phone);
    /**/
    //宽带页面从通讯录选择号码在页面的展示
    var isBroadband = $("#broadband").attr("class");
    if(isBroadband == "broadband select") { //宽带页面;
        //3.输入值
        if($("#broadBandfix").attr("class").lastIndexOf("ng-hide") == -1) {
            $("#broadBandfix").val(phone);
            $("#broadBandfix").attr("class","num-ipt-bold").css("color","#333");
        } else if ($("#broadBandAccount").attr("class").lastIndexOf("ng-hide") == -1) {
            $("#broadBandAccount").val(phone);
            $("#broadBandAccount").attr("class","num-ipt-bold").css("color","#333");
        } else if ($("#broadBandPhone").attr("class").lastIndexOf("ng-hide") == -1) {
            $("#broadBandPhone").val(phone);
            $("#broadBandPhone").attr("class","num-ipt-bold").css("color","#333");
        }
        $("#addressBookDiv").hide();
        $("#historyNumDiv").hide();
        $("#fixHisNumDiv").hide();
        $("#broadHisNumDiv").hide();
        $("#addressBookUl").html("");
        return;
    }
    if (!/^((13|15|18|14|17)+\d{9})$/.test(phone)  && !/^(0\d{2,3}-*\d{7,8})$/.test(phone) && !/^(\d{7,8})$/.test(phone)) {
        $("#phoneError").html("请输入正确的手机号码");
        return;
    }
    var inputPhone=phone.replace(/[^\d()+]/g, "").substr(0, 11).replace(/(^\d{3}|\d{4})\B/g, "$1 ");
    var resultPhone = nameIsEmpty ? inputPhone : inputPhone+"("+name+")";
    //选择固话号码则点击确定后将banner页转至固话页签
    //在固话页签选择通讯录号码为手机，区号框子为空，点击确定页签转到手机页签
    if(/^((13|15|18|14|17)+\d{9})$/.test(phone) && !/^(0\d{2,3}-*\d{7,8})$/.test(phone)){
        $("#fixPhone").val(resultPhone);
    }else{
        if(/^(010)|(02[0-9])$/.test(phone.substr(0,3))){
            var fixCode = phone.substr(0,3);
            var fixNum = nameIsEmpty ?phone.substr(3):phone.substr(3)+"("+name+")";
            $("#fixPhone").val(fixCode+fixNum);
        }else if(/^0\d{3}$/.test(phone.substr(0,4))){
            var fixCode = phone.substr(0,4);
            var fixNum = nameIsEmpty ?phone.substr(4):phone.substr(4)+"("+name+")";
            $("#fixPhone").val(fixCode+fixNum);
        }else if(/^(\d{7,8})$/.test(phone) ){
            $("#fixPhone").val(nameIsEmpty ?phone:phone+"("+name+")");
        }
    }
    $("#fixPhone").blur();
    $("#number").val(resultPhone);
    $("#number").attr("class","num-ipt-bold").css("color","#333");
    $("#fixPhone").attr("class","num-ipt-bold").css("color","#333");
    $("#addressBookDiv").hide();
    $("#historyNumDiv").hide();
    $("#fixHisNumDiv").hide();
    $("#addressBookUl").html("");
}
function formateNumGetBasicPhone (phone) {
    if (null == phone || undefined == phone || "" == phone) {
        return;
    }
    if(phone.indexOf("+86") == 0){
        phone = phone.substr(3);
    }else if(phone.indexOf("86")==0){
        phone = phone.substr(2);
    }
    if(phone.length=="16"){
        phone = phone.substr(5);
    }
    return phone.replace(/[^0-9]/ig, "").trim();
}

function judgeEmpty(val){
    if(null == val || undefined == val || ""== val){
        return true;
    }
    return false;
}
//校验宽带号码
function checkBroadBandNumber(phone,netType) {
    if(netType == "与宽带绑定的固话号码") {
        //var reg = /^.*[,\^\*\?#<>&\!@%`+\$}{'"\\\/].*$/;  ^(010|02[0-9]|0[3-9][0-9]{2})\\-\\d{7,8}$
        if(!/^(010|02[0-9]|0[3-9][0-9]{2})\-?([2-9][0-9]{6,7})$/.test(phone)) {
            return "fixError";
        }
    }
    else if(netType == "宽带拨号账号") {
        if(!/^([\w-\.\@]){1,30}$/.test(phone)) {
            return "accountError";
        }
    }
    else if(netType == "统一宽带编码") {
        if(!/^(010|02[0-9]|0[3-9][0-9]{2})\-?([0][0-9]{6,7})$/.test(phone)) {
            return "codeError";
        }
    }
    return "ok";
}
