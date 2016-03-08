/**
 * 邮寄发票信息
 */
var servicetype = '26';
$(function(){
    
    /** 页面滚动额度提示层浮动 */
    $(window).scroll(function() {
        var goodsTab = $('.print_lines').offset().top;
        if($(window).scrollTop() >= 226){
            $('.print_lines').addClass("sticky");
        }else{
            $('.print_lines').removeClass("sticky");
        }
    });
    /**新增历史记录 **/
    $(".add_invoice").click(function() {
       if(getCurrentNum(".post-history")<5){//如果当前个数小于5，可以点击新增，从而显示表单
           current_post_id=null;//
           $(".invoice_fill_box").show().center();
           $(".thick-div").show();
       }else{
           $(".invoice_fill_box").hide();
           //$(".add_post .cOrgB_tip").html(" （发票历史记录最多五条，删除一条后才能再添加）").show();
       }
    });
    //保存邮寄信息
    $(".byMail").click(function(){//邮寄  新添发票 确认键
        $("a.nextBtn01").nextAll(".error").hide();
        if (!checkMailSave()) {
            return;
        }
        var postto = user_province == $("#mailproviceid").val() ? "0" : "1";
        if(isEmpty(current_post_id)){//未点击过发票历史记录修改图标（纯新建一条）
            var current_num=getCurrentNum(".post-history");
            if(current_num<5){
                var showdata = autoAddEllipsis($("#postname").val()+"-"+$("#postphone").val()+"-"+$("#postcode").val()+"-"+$(".adressAreaInfo").text()+" "+$("#postaddr").val(),60);
                var hidedata = '{"postname":"'+$("#postname").val()+'","postphone":"'+$("#postphone").val()+'","postcode":"'+$("#postcode").val()+'","postaddr":"'+$("#postaddr").val()+'","adressAreaInfo":"'+$(".adressAreaInfo").text()+'","postto":"'+postto+'","store":"true"}';
                var citydata = ($("#mailproviceid").val()+" "+$("#mailcityid").val()+" "+$("#mailregionid").val());
                var html = createHistoryli((-current_num),citydata,showdata,hidedata);
                $(".post-history").html(html+$(".post-history").html());
                
                addFunction();//增加整套js事件
                setHiddenConst($(".post-history  li:first b"),"post");//新增发票  默认选中第一个  设置第一个li的隐藏变量
                $(".invoice_fill_box , .thick-div").hide();//隐藏输入发票内容的表格
                var add = operateInvoiceInfo("add");
                if(add) {
                    $(".post-history  li:first").attr("id",postAddrHistory[0].postId);
                    $(".post-history  li:first b").val(postAddrHistory[0].postId);
                }
            }
        }else{//点击过发票历史记录修改图标（修改一条已有发票历史记录）
            $(".post-history li").each(function(){//迭代所有的li 匹配id是否==current_post_id
                if($(this).attr("id")==current_post_id){//匹配成功
                    $(this).find("span").html(autoAddEllipsis($("#postname").val()+"-"+$("#postphone").val()+"-"+$("#postcode").val()+"-"+$(".adressAreaInfo").text()+" "+$("#postaddr").val(),60));//《限制长度，》
                    $(this).find(".hidden_data").val('{"postname":"'+$("#postname").val()+'","postphone":"'+$("#postphone").val()+'","postcode":"'+$("#postcode").val()+'","postaddr":"'+$("#postaddr").val()+'","adressAreaInfo":"'+$(".adressAreaInfo").text()+'","postto":"'+postto+'","store":"true"}');
                    $(this).find(".procity").val($("#mailproviceid").val()+" "+$("#mailcityid").val()+" "+$("#mailregionid").val());
                    setHiddenConst($(this).find("b"),"post");//新增发票  默认选中第一个  设置第一个li的隐藏变量
                    $(this).find("b").html($("#postname").val() + " " + getProvinceName($("#mailproviceid").val()));
                    operateInvoiceInfo("modify",$(this).attr("id"));
                    current_post_id=null;//null,下次新增记录时 （纯新增 默认状态）
                    $(".invoice_fill_box , .thick-div").hide();//隐藏输入发票内容的表格
                }
            });
        }
        $("#mailproviceid,#mailcityid,#mailregionid,#postname,#postphone,#postcode,#postaddr,#mailtitle").val("");//表单清空
        fillPayType();
        $("#saveflag").val("true");
    });
    /** 邮寄  取消 发票填写表单 */
    $(".invoice_close_btn").click(function(){
        $("#mailproviceid,#mailcityid,#mailregionid,#postname,#postphone,#postcode,#postaddr,#mailtitle").val("");//表单清空
        $(".adressAreaInfo").text("");
        $(".pay_type,.error").hide();
        $(".invoice_post").find(".error").hide();
        $(".invoice_fill_box , .thick-div").hide();
        fillPayType();
    });
});
function getCardorChargeInvInfo(type,servicetype){ 	
    getInvoiceInfo("card");
}
function getOnlineProvinceName() {
    var onlinearr = online_province.split(",");
    var onlinename = "";
    for(var i=0;i<onlinearr.length;i++) {
        if(isEmpty(onlinearr[i])) continue;
        onlinename += (isEmpty(onlinename) ? "" : "、") + getProvinceName(onlinearr[i]);
    }
    return isEmpty(onlinename) ? "" : onlinename;
}
/** 页面是否能展示 */
function showPage() {
    var noPhoneOrFix = (phone_login.indexOf(login_type)<0 && fix_login.indexOf(login_type)<0);
    if(!loginFlag || noPhoneOrFix || isEmpty(user_province) || online_province.indexOf(user_province) < 0) {
        var text = !loginFlag ? "请登录后刷新此页面!" : noPhoneOrFix ? "此业务不支持邮箱/第三方用户登录，请使用交费号码进行登录!" : "请登录后刷新此页面!";
        if(online_province.indexOf(user_province) < 0) {
            var onlineNames = getOnlineProvinceName();
            text = isEmpty(onlineNames) ? "您省暂未开通邮寄发票功能，敬请期待！" : "您省暂未开通邮寄发票功能，目前邮寄发票功能上线省：" + getOnlineProvinceName() + "，敬请期待！";
        }
        $("#no_server_tip").text(text);
        if(!loginFlag || noPhoneOrFix) $(".loginlink").attr("href",LoginRedirectUrl+"?redirectURL="+absolutebreswebroot+"/npfinvoiceweb/invoice_post_fill.htm").show();
        return false;
    }
    return true;
}
/**
 * 动态生成邮寄地址历史列表html
 * @param data
 * @return html
 */
function loadHistoryList(locationID){//locationID:在哪动态生成历史列表；
    var html = "";
    //if(locationID == 'post-history'){//邮寄
        var data = postAddrHistory;
        //[{"cityCode":"110100","cityName":"北京市","districtCode":"110102","districtName":"西城区","email":"","fixPhone":"","mobilePhone":"18612837030","postAddr":"qqqqqqqqqqq","postCode":"100000","postId":"5814022601587110","provinceCode":"110000","provinceName":"北京","receiverName":"aa","receiverPsptNo":"","receiverPsptType":""},{"cityCode":"360800","cityName":"吉安市","districtCode":"360881","districtName":"井冈山市","email":"","fixPhone":"","mobilePhone":"18610737030","postAddr":"龙市镇","postCode":"343600","postId":"1313122001583896","provinceCode":"360000","provinceName":"江西","receiverName":"粗粮","receiverPsptNo":"","receiverPsptType":""}]
        if(!isEmpty(data)){
            for(var i=0;i<data.length;i=i+1){
                var procode = getEssProvinceCode(data[i]["provinceCode"]) , citycode = getEssCityCode(data[i]["provinceCode"],data[i]["cityCode"]);
                var adressAreaInfo = data[i].provinceName + " " + data[i].cityName + " " + data[i].districtName;
                var showdata = autoAddEllipsis(data[i].receiverName+"-"+data[i].mobilePhone+"-"+data[i].postCode+"-"+adressAreaInfo+" "+data[i].postAddr,60);
                var hidedata = '{"postname":"'+data[i].receiverName+'","postphone":"'+data[i].mobilePhone+'","postcode":"'+data[i].postCode+'","postaddr":"'+data[i].postAddr+'","adressAreaInfo":"'+adressAreaInfo+'","postto":"' + (procode==user_province?"0":"1") + '"}';
                var citydata = (procode+" "+citycode+" "+data[i]["districtCode"]);
                html = html + createHistoryli(data[i].postId,citydata, showdata, hidedata);
            }
        }
    //}
    $("."+locationID).html(html);
    handleAll(locationID , locationID == "post-history" ? "post" : "getown");
    addFunction();//加载生成的html的各种js 事件
    fillPayType();
}

/** 改变隐藏变量 》》 action 》》Oracle 以传值给省份下发 */
function setHiddenConst(_obj){ //_obj： li中的b
    $(".post-history b").removeClass('list_sel');//去除所有历史地址的选中状态
    _obj.addClass('list_sel');
    var _thisParent=_obj.parent();//当前操作的一条记录  li
    
    _thisParent.parent().find("input").each(function(){//寻找所有历史记录的  hidden的input 并且删除
        if(($(this).attr("class")!="procity") && $(this).attr("class")!="hidden_data" ){//不是省分地市编码和隐藏地信息址的隐藏input，删掉
            $(this).remove();
        }
    });
    var hidden_data=toJson(_thisParent.find(".hidden_data").val());
    var procity=_thisParent.find(".procity").val().split(" ");
    var hiddenStr="<input type='hidden' name='postBean.receiver_name' value='"+hidden_data["postname"]+"'/>"+
                  "<input type='hidden' name='postBean.receiver_phone'value='"+hidden_data["postphone"]+"'/>"+
                  "<input type='hidden' name='postBean.post_code' value='"+hidden_data["postcode"]+"'/>"+
                  "<input type='hidden' name='postBean.receiver_addr' value='"+hidden_data["adressAreaInfo"]+" "+hidden_data["postaddr"]+"'/>"+
//                  "<input type='hidden' name='postBean.invoice_head' value='"+hidden_data["mailtitle"]+"'/>"+
//                  "<input type='hidden' name='postBean.payment_method' value='"+hidden_data["paytype"]+"'/>"+
                  "<input type='hidden' name='postBean.post_to' value='"+hidden_data["postto"]+"'/>"+
                  "<input type='hidden' name='postBean.province_code' value='"+procity[0]+"'/>"+
                  "<input type='hidden' name='postBean.city_code' value='"+procity[1]+"'/>" +
                  "<input type='hidden' name='postBean.district_code' value='"+procity[2]+"'/>";
    _thisParent.append(hiddenStr);//给当前操作的一条记录  li ，加上隐藏变量input ,并赋值
}
/**
 * 加载生成的html的各种js 事件
 * 每次重新改变那个发票页面html，都必须加上这些功能
 * @return
 */
function addMyFunction() {
    /**点击历史邮寄地址选中效果**/
    $(".history_list b").click(function(){
        setHiddenConst($(this));
        fillPayType();
    });
    
    /**邮寄 修改**/
    $(".post-history .invoice_edit").click(function() {
        setHiddenConst($(this).parents(".history_list").find("b"));
        selectPost($(this));
        $(".invoice_fill_box").show().center();
        $(".thick-div").show();
    });
}
/** 将要修改信息填入框中 */
function selectPost(_this) {
    current_post_id=_this.parent().attr("id");//当前要修改的记录的id
    if(isEmpty(current_post_id)) return;//新增发票信息,不用设置参数
    var current_value=toJson(_this.parent().find(".hidden_data").val());//当前要修改的记录里的值
    var procity = _this.parent().find(".procity").val().split(" ");
    $("#mailproviceid").val(procity[0]).change();
    $("#mailcityid").val(procity[1]).change();
    $("#mailregionid").val(procity[2]).change();
    $(".invoice_fill").show();
    $("#postname").val(current_value["postname"]);
    $("#postphone").val(current_value.postphone);
    $("#postcode").val(current_value["postcode"]);
    $("#postaddr").val(current_value["postaddr"]);
//    $("#mailtitle").val(current_value["mailtitle"]);
}
/** 调后台修改邮寄信息  modtype:del,modify,add */
function operateInvoiceInfo(modtype,id) {
    var param = fillPostParam(modtype,id);
    var Ok = false;
    $.ajax({url:absolutebreswebroot+querywebroot+"Invoice/editCustHistoryPost",
        type: "get",
        jsonp: "callback",
        jsonpCallback:"custHistoryPost",
        dataType:'jsonp',
        async : false,
        data : param,
        success:function(data){
            postAddrHistory = data;
            Ok = isEmpty(data) && (modtype == "add" || modtype == "modify") ? false : true;
        },
        error:function(xml){
            // do nothing
        }
    });
    return Ok;
}
function fillPostParam(modtype,id) {
    var param = {};
    param["operate_type"] = modtype;
    param["post_id"] = id;
    if("del" == modtype) {
        return param;
    }
    param["receiver_name"] = trim($("#postname").val());
    param["mobile_phone"] = trim($("#postphone").val());
    param["fix_phone"] = "";
    param["post_code"] = trim($("#postcode").val());
    param["province_code"] = $("#mailproviceid").find("option:selected").attr("data-value");
    param["city_code"] = $("#mailcityid").find("option:selected").attr("data-value");
    param["district_code"] = $("#mailregionid").val();
    param["post_addr"] = trim($("#postaddr").val());
    param["email"] = "";
    return param;
}
/** 提交时做信息校验(邮寄) */
function invoiceVerify() {
    try{
        if(isEmpty($("input[name='postBean.province_code']").eq(0).val())) {
            throw "请确认邮寄地址!";
        }
        if(isEmpty($('input:radio[name="postBean.payment_method"]:checked').val())) {
            throw "所选省份不支持邮寄!";
        }
        checkPostType();
        $(".cost").val($('input:radio[name="postBean.payment_method"]:checked').attr("cost"));
        $("#posttitle").attr("name","postBean.invoice_head");
    } catch(err) {
        $(".sub_btn").next(".error").html(err).show();
        return false;
    }
    return true;
}
var paytypeWithDesc = {"1":"pay_vip","2":"pay_jifen","3":"pay_online","4":"pay_free"};
/** 校验用户选择的支付方式是否合理 */
function checkPostType() {
    var choosenPayType = $('input:radio[name="postBean.payment_method"]:checked').val();
    var paytype = paytypes[paytypeWithDesc[choosenPayType]];
    if (isEmpty(paytype)) {
        throw "请重新选择支付方式!";
    }
}