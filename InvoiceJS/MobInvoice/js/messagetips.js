var count =0 ;
var show=0;
define(['angular'], function (angular) {
    return angular.module('messagetipsModule', [])
        .factory('MessagetipsUtils', function () {
            return {
                fillMessagetips:function(serviceType){
                    var pageSerType = pageSerTypeMap().get(serviceType);
                    if(pageSerType!=undefined){
                        actionName=pageCodeMapping().get(pageSerType);
                    }
                    var fileName = '';
                    if (actionName != 'welcome') {
                        if (actionName == undefined || actionName == "") {
                            return;
                        }
                        var url = messagetipwebroot + "messageTips.js?callback=?";
                        var params = {};
                        params["pageCode"] = actionName.toUpperCase();
                        var contextIndex=0;
                       $.getJSON(url, params, function(json) {
                            fileName = json.fileName;
                            var pageContentList = '';
                            //加载并执行js文件
                            $.ajax({
                                url: fileName,
                                dataType: "script",
                                //async: false,
                                success: function() {
                                    if (typeof (messageTipfiledata) != 'undefined') {

                                        if (messageTipfiledata != '') {
                                            var messagetipsdata = eval(messageTipfiledata);
                                            $.each(messagetipsdata, function(i, obj) {
                                                contextIndex = i + 1;
                                                count = i+1;
                                                pageContentList += "<p  style='font-size:12px'>" + contextIndex + "、" + obj.pageContent + "</p>";
                                            });
                                            $("#messageTipsDiv").append(pageContentList);
                                            $(".pointCon p").eq(1).nextAll("p").hide();
                                            $("#messageTipsDiv").show();
                                            if($(".pointCon p").length>2){
                                                $("#messageTipsDiv").append(" <span class='cBlue right openPrompt' onclick='openPrompt()'>点击了解更多</span>");
                                                show = 1;

                                            }
                                            flag = contextIndex;
                                        }
                                        else {
                                        }
                                    }
                                    getAddr(actionName,url);
                                },
                                error:function() {
                                }
                            });
                         

                        });
                }
            }
            }
        });
});

function pageSerTypeMap(){
    var pageSerType =new Map();
    pageSerType.put('bankcharge','bankcharge');//直充初始页面
    pageSerType.put('recharge','recharge');//充值初始页面
    pageSerType.put('confirm','confirm');//充值确认页面
    pageSerType.put('rechargeFinish','rechargeFinish');//充值完成页面
    pageSerType.put('mobquery','mobquery');//充值完成页面
    return pageSerType;
}
function pageCodeMapping(){
    var pageCodeMapping=new Map();
    /*pageCodeMapping.put('bankcharge','MOBILEWRITE');
    pageCodeMapping.put('recharge','MOBILEWRITE');
    pageCodeMapping.put('confirm','MOBILEFINISH');
    pageCodeMapping.put('rechargeFinish','MOBILEFINISH'); */
    pageCodeMapping.put('bankcharge','MOBANKCHARGEWRITE');
    pageCodeMapping.put('recharge','MOBRECHARGEWRITE');
    pageCodeMapping.put('confirm','MOBRECHARGECONFIRM');
    pageCodeMapping.put('rechargeFinish','MOBRECHARGEFINISH');
    pageCodeMapping.put('mobquery','MOBQUERYWRITE');
    return pageCodeMapping;
}
function getAddr(actionName,url){
    var params = {};
    params["pageCode"] = actionName.toUpperCase();
    params["provinceCode"] ='098';
    $.getJSON(url, params, function(json) {
        fileName = json.fileName;
        var pageContentList = '';
        //加载并执行js文件
        $.getScript(fileName, function() {
            if (typeof (messageTipfiledata) != 'undefined') {
                if (messageTipfiledata != '') {
                    var messagetipsdata = eval(messageTipfiledata);
                    $.each(messagetipsdata, function(i, obj) {
                        contextIndex = i+1+count;
                        pageContentList += "<p style='font-size:12px'>" + contextIndex + "、" + obj.pageContent + "</p>";
                    });
                    $("#messageTipsDiv").append(pageContentList);
                    $(".pointCon p").eq(1).nextAll("p").hide();
                    // $("#messageTipsDiv").append("<dd id ='showProv' onclick='getProvFileAddr("+contextIndex+",\""+actionName+"\",\""+url+"\");' style='cursor: pointer; float:right;'>------------更多</dd>")
                    $("#messageTipsDiv").show();
                    if($(".pointCon p").length>2 && show === 0){
                        $("#messageTipsDiv").append(" <span class='cBlue right openPrompt' onclick='openPrompt()'>点击了解更多</span>");
                    }

                }
            }
        });
    });
}

function hideProvMtips(){
    $("#showProv").show();
    $("#provMtipsDiv").hide();
    $("#hideProv").hide();
}

function Map() {
    this.container = new Object();
}

Map.prototype.put = function(key, value) {
    this.container[key] = value;
}

Map.prototype.get = function(key) {
    return this.container[key];
}

Map.prototype.keySet = function() {
    var keyset = new Array();
    var count = 0;
    for ( var key in this.container) {
        // 跳过object的extend函数
        if (key == 'extend') {
            continue;
        }
        keyset[count] = key;
        count++;
    }
    return keyset;
}

Map.prototype.size = function() {
    var count = 0;
    for ( var key in this.container) {
        // 跳过object的extend函数
        if (key == 'extend') {
            continue;
        }
        count++;
    }
    return count;
}

Map.prototype.remove = function(key) {
    delete this.container[key];
}

Map.prototype.toString = function() {
    var str = "";
    for ( var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
        str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
    }
    return str;
}


$(".pointCon p").eq(1).nextAll("p").hide();


function openPrompt(){
    var _this= $(".openPrompt");
    //  _this.addClass('packupPrompt').removeClass('openPrompt').html("收起");
    _this.remove();
    $("#messageTipsDiv").append(" <span class='cBlue right packupPrompt' onclick='packupPrompt()'>收起</span>");
    $(".pointCon p").show();
}

function packupPrompt(){
    var _this= $(".packupPrompt");
    _this.remove();
    $("#messageTipsDiv").append(" <span class='cBlue right openPrompt' onclick='openPrompt()'>点击了解更多</span>");
    $(".pointCon p").eq(1).nextAll("p").hide();
}