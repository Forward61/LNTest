var  flag =0;
var count =0 ;
var show = 0;
$(document).ready(function() {
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
                                pageContentList += "<p style='font-size:12px'>" + contextIndex + "、" + obj.pageContent + "</p>";
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

    function pageSerTypeMap(){
        var pageSerType =new Map();
        pageSerType.put('bankchargeCallBack','bankchargeCallBack');//直充完成页面
        return pageSerType;
    }
    function pageCodeMapping(){
        var pageCodeMapping=new Map();
        pageCodeMapping.put('bankchargeCallBack','MOBBANKCHARGECALLBACK');
        return pageCodeMapping;
    }
});

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