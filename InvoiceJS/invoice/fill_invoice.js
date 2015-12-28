
$(function(){
    //选择领取方式、选择发票时间
    $(".dChange a").click(function(){
        $(this).addClass("on").siblings().removeClass("on");
        $(this).addClass("choose").siblings().removeClass("choose");
    });
    //全选按钮，全选当前列表
    $(".sel_all_checkBox").click(function() {
        if($(this).attr("disabled")) return;
        if (this.checked) {//未选中 --> 选中的过程
            var checked = isallow ? calOneAllRest($(this),!$(this).attr("checked")):calAllRest($(this),!$(this).attr("checked"));
            if(checked) {
                $(this).parents(".list_table").find(':checkbox').attr("checked", checked);
            } else {
                $(this).attr("checked",false);
            }
        }else{
            var checked = !calAllRest($(this),!this.checked);
            $(this).parents(".list_table").find(':checkbox').attr("checked", checked);
        }
        fillPayType();
    });
    //全选按钮后文字全选当前列表
    $(".sel_all label").click(function() {
        var _box = $(this).parents(".list_table").find(".sel_all_checkBox");
        if($(_box).attr("disabled")) return;
        if (!$(_box).attr("checked")) {//未选中 --> 选中的过程
            var checked = isallow ? calOneAllRest($(_box),$(_box).attr("checked")):calAllRest($(_box),$(_box).attr("checked"));
            if(checked) {
                $(this).parents(".list_table").find(':checkbox').attr("checked", checked);
            } else {
                $(this).attr("checked",false);
            }
        }else{
            var checked = !calAllRest($(_box),$(_box).attr("checked"));
            $(this).parents(".list_table").find(':checkbox').attr("checked", checked);
        }
        fillPayType();
    });
    invoiceInfoBund();
    //展开收起发票列表
    $(".invoice_list_box h6").click(function() {
        var _this=$(this),emClass=_this.find('em').attr('class');
        if (emClass=="open") {
            _this.parents(".invoice_list_box").find(".list_table").hide();
            _this.find('em').attr('class','close');
            if(_this.parents(".invoice_list_box").attr("id") == "card_list" && parseFloat(_this.next("table").find("tbody").attr("money")).toFixed(2) > 0) $(".invoice_name").hide();
        }else{
            _this.parents(".invoice_list_box").find(".list_table").show();
            _this.find('em').attr('class','open');
            if(_this.parents(".invoice_list_box").attr("id") == "card_list" && parseFloat(_this.next("table").find("tbody").attr("money")).toFixed(2) > 0) $(".invoice_name").show();
        }
    });
    //新增发票信息
    $(".add_invoice").click(function() {
        $(".invoice_self").show();
    });

    //发票抬头校验
    $("#posttitle").blur(function(){
        var _this = $(this);
        try{
            checkInvoiceTitle(_this);
        }catch(err){
            return false;
        }
        _this.next(".error").hide();
    });
    
    // 证件号码校验
    $("#idno").blur(function(){
        var _this = $(this) , idNo = $(this).val() , cardtype = $("#cardtype").val();
        try{
            checknull(_this,"请输入证件号码！");
            if (cardtype == 0) { // 身份证 0
                if (!IdCardValidate(_this.val())) {
                    throw "请输入正确的身份证号码！";
                }
            } else if (cardtype == 1) { // 军官证 1
                if(!isNaN(idNo.substr(0,1))||!isNaN(idNo.substr(1,1))||!isNaN(idNo.substr(2,1))
                    || idNo.substr(idNo.length-1,1)!="号" || isNaN(idNo.substr(4,5))){
                    throw "请输入正确的军官证号码！";
                }
            } else if (cardtype == 2) { // 护照 2
                checkIdNo(_this,"请输入正确的护照号码！");
            } else if (cardtype == 3) { // 港澳台通行证 3
                checkIdNo(_this,"请输入正确的港澳台通行证号码！");
            } else if (cardtype == 4) { // 户口簿 4
                checkIdNo(_this,"请输入正确的户口簿号码！");
            }
        }catch(err){
            _this.next(".error").html(err).show();
            return false;
        }
        _this.next(".error").hide();
    });
     // 收件人
    $("#postname").blur(function(){
        var _this = $(this);
        try{
            checknull(_this,"请输入收件人！");
            checkIllegal(_this,"请输入正确的收件人！");
        }catch(err){
            return false;
        }
        _this.next(".error").hide();
    });
    
    // 联系电话
    $("#postphone").blur(function(){
        var _this = $(this);
        try{
            checknull(_this,"请输入联系电话！");
            checkNum(_this,"请输入正确的联系电话！");
        }catch(err){
            return false;
        }
        _this.next(".error").hide();
    });
    
    // 邮编校验
    $("#postcode").blur(function(){
        var _this = $(this);
        try{
            checknull(_this,"请填写邮编！");
            checkPost(_this,"请填写正确的邮编！");
        }catch(err){
            return false;
        }
        _this.next(".error").hide();
    });
    
    // 详细地址
    $("#postaddr").blur(function(){
        var _this = $(this);
        try{
            checknull(_this,"请填写详细地址！");
            checkIllegal(_this,"请填写正确的详细地址！");
        }catch(err){
            return false;
        }
        _this.next(".error").hide();
    });
    $("#mailproviceid").blur(function(){//邮寄的省份
        var _this = $(this);
        if (trim(_this.val()) == "") {
            $("#mailregionid").next(".error").html("请选择省份！").show();
            return false;
        }
    //    $("#mailregionid").next(".error").hide();
    });
    $("#mailcityid").blur(function(){//邮寄地市
        var _this = $(this);
        if (trim(_this.val()) == "") {
            $("#mailregionid").next(".error").html("请选择地市！").show();
            return false;
        }
    //    $("#mailregionid").next(".error").hide();
    });
    $("#mailregionid").blur(function(){//邮寄区县
        var _this = $(this);
        try{
            checknull(_this,"请选择区县！");
        }catch(err){
            return false;
        }
    });
    //帮助提示
    $(".help_infor").hover(
        function(){
            $(this).css("position","relative");
            $(this).find(".help_body").show();
        },function(){
            $(this).css("position","");
            $(this).find(".help_body").hide();
        }
    );

    $(".sel_scope a").click(function() {
        fillInvoiceInfo();
        fillPayType();
    });
    //领取发票记录列表分栏背景颜色
    $("#payFee tr:even").addClass('f7f7f7');
    
    $("#mailproviceid").change(function() {//邮寄省份选择
        $("#mailregionid").next(".error").hide();
        var pro = $(this).val() , txt = $(this).find("option:selected").text() , sel = $(this).find("option:selected").attr("data-value");
        var cityoption = "<option value=''>--市--</option>";
        if(!isEmpty(pro)) {
            var cityList = allArea.PROVINCE_MAP[sel];
            $.each(cityList, function(i, city) {//地市联动
                cityoption = cityoption + "<option data-value=\"" + city.CITY_CODE + "\" value=\"" + city.ESS_CITY_CODE + "\">" + city.CITY_NAME + "</option>";
            });
        }else {
            $("#mailregionid").next(".error").html("请选择省份！").show();
            $(".adressAreaInfo").text("");
        }
        $("#mailcityid").html(cityoption).change();
        showPostSelectedName();
    });
    
    $("#mailcityid").change(function() {//邮寄地市选择
        var city = $(this).val() , txt = $(this).find("option:selected").text() , sel = $(this).find("option:selected").attr("data-value") , prosel = $("#mailproviceid").val();
        $(".invoice-tip").hide();
        var regionoption = "<option value=''>--区--</option>";
        if(!isEmpty(city)) {
            var areaList = allArea.CITY_MAP[sel];
            $.each(areaList, function(i, area) {//区县联动
                regionoption = regionoption + "<option value=\"" + area.DISTRICT_CODE + "\">" + area.DISTRICT_NAME + "</option>";
            });
        }
        $("#mailregionid").html(regionoption);
        showPostSelectedName();
    });
    $("#mailregionid").change(function() {//邮寄区县选择
        var region = $(this).val() , txt = $(this).find("option:selected").text();
        showPostSelectedName();
    });
    //支付提示层点击已完成支付
    $("#showOrderId").click(function() {
        var ajaxCheckUrl = absolutebreswebroot + callBackWebRoot;
        $("#invoiceForm").attr("action",absolutebreswebroot + callBackWebRoot + "obtainInvoiceCallBack/showInvoiceFeeOrder");
        $("#invoiceForm").attr("target", "_self");
        $("#invoiceForm").submit();
    });
});
/** 给发票可打信息动态绑定事件 */
function invoiceInfoBund() {
    //点击单条发票历史信息记录
//    $(".invoice_history input").click(function(){
//        var _this=$(this),_thisParent=_this.parent();
//        $(".invoice_history li").removeClass('bg_fff');
//        _thisParent.addClass('bg_fff');
//        $(".del_layer").hide();
//        $(".invoice_history").find("em").hide();
//            _thisParent.find("em").show();
//        $(".invoice_fill").show();
//    });
    //鼠标滑过table效果
    $(".list_table tbody tr").hover(function() {
        var _this=$(this);
        _this.css('background-color', '#f7f7f7');
    }, function() {
        var _this=$(this);
        _this.css('background-color', '');
    });
    //点击发票列表选中当前行，并判断当前列表全选是否存在
    $(".list_table tbody tr").slice(0).each(function(){
        var p = this;
        var tmp=$(this).parent("tbody").find(":checkbox");
        $(this).children().slice(1).click(function(){
            $($(p).children()[0]).children().each(function(){
                if($(this).attr("disabled")) return;
                if(this.type=="checkbox"){
                    if(!this.checked){//未选中->选中 的过程
                        if(isallow) {
                            if(!calOneRestList($(this),this.checked)) return;
                        } else {
                            if(!calRestList($(this),this.checked)) return;
                        }
                        this.checked = !this.checked;
                    }else{
                        calRestList($(this),this.checked);
                        this.checked = false;
                    }
                }
            });
            $(this).parents(".list_table").find(".sel_all_checkBox").attr('checked', tmp.length==tmp.filter(':checked').length);
            fillPayType();
        });
    });
    //判断当前列表是否全选
    $(".list_table tbody input:checkbox").click(function() {
        var obj = $(this).parent("tr");
        if(this.type=="checkbox"){
            if($(this).attr("disabled")) return;
            if(this.checked){//未选中 -> 选中 的过程
                if(isallow) {
                    if(!calOneRestList($(this),!this.checked)) this.checked = !this.checked;
                } else {
                    if(!calRestList($(this),!this.checked)) this.checked = !this.checked;;
                }
            }else{
                calRestList($(this),!this.checked);
            }
        }
        var tmp = $(this).parents(".list_table tbody").find(":checkbox");
        $(this).parents(".list_table").find(".sel_all_checkBox").attr('checked', tmp.length==tmp.filter(':checked').length);
        fillPayType();
    });
}

/**
 * 填充默认的省份/地市信息
 * @param {Object} proid          需要填充的省份select
 * @param {Object} defaultpro     需要填充的省份默认展示信息
 * @param {Object} cityid         需要填充的地市select
 * @param {Object} defaultcity    需要填充的地市默认展示信息
 * @param {Object} regionid       需要填充的区域select
 * @param {Object} defaultregion  需要填充的区域默认展示信息
 */
function fillProvinceCitiesRegion(proid,defaultpro,cityid,defaultcity,regionid,defaultregion){
    var provinceoption = "<option value=''>" + defaultpro + "</option>";
    var provinceList = allArea.PROVINCE_LIST;
    $.each(provinceList, function(i, province) {
        provinceoption = provinceoption + "<option data-value=\"" + province.PROVINCE_CODE + "\" value=\"0" + province.ESS_PROVINCE_CODE + "\">" + province.PROVINCE_NAME + "</option>";
    });
    $("#" + proid).html(provinceoption);
    $("#" + cityid).html("<option value=''>" + defaultcity + "</option>");
    if(!isEmpty(regionid)) $("#" + regionid).html("<option value=''>" + defaultregion + "</option>");
}
function fillProvinceCities(proid,cityid) {
    // 省份地市默认值
    var provinceoption = "<option value=''>请选择</option>";
    for (var i = 0; i < province.length; i=i+1) {
        provinceoption = provinceoption + "<option value='" + province[i]["id"] + "'>" + province[i]["name"] + "</option>";
    }
    $("#" + cityid).html("<option value=''>请选择</option>");
    $("#" + proid).html(provinceoption);
}
var showPostSelectedName = function() {
    var pro = $("#mailproviceid").val() , protxt = isEmpty(pro) ? "" : $("#mailproviceid").find("option:selected").text();
    var city = $("#mailcityid").val() , citytxt = isEmpty(city) ? "" : municipality.toString().indexOf(pro) >= 0 ? "" : $("#mailcityid").find("option:selected").text();
    var region = $("#mailregionid").val() , regiontxt = isEmpty(region) ? "" : $("#mailregionid").find("option:selected").text();
    $(".adressAreaInfo").text(protxt + " " + citytxt + " " + regiontxt);
}
/** 发票配置为空 @return true : null ; false : not null */
function isInvoiceConfigNull(servicetypetemp) {
    return invoicerule[servicetypetemp] == undefined || invoicerule[servicetypetemp] == null;
}
/** 没配置、月结、非月结（但是不知道邮寄）都展示次月领取 */
function isMailConfig(servicetypetemp) {
    if (isInvoiceConfigNull(servicetypetemp)) {
        return false;
    } else if (invoicerule[servicetypetemp]["is_mail"] == "0") {
        return false;
    }
    return true;
}

// 邮寄保存校验
function checkMailSave() {
    var _this = null;
    try{
        _this = $("#mailproviceid");
        if (trim(_this.val()) == "" || trim($("#mailcityid").val()) == "") {
            $("#mailregionid").next(".error").html("请选择省份地市！").show();
            return false;
        }
        _this = $("#mailregionid");
        checknull(_this,"请选择区县！");
        _this = $("#postaddr");// 详细地址
        checknull(_this,"请填写详细地址！");
        checkIllegal(_this,"请填写正确的详细地址！");
        _this = $("#postcode");// 邮编
        checknull(_this,"请填写邮编！");
        checkPost(_this,"请填写正确的邮编！");
        _this = $("#postname");// 收件人
        checknull(_this,"请输入收件人！");
        checkIllegal(_this,"请输入正确的收件人！");
        _this = $("#postphone");// 联系电话
        checknull(_this,"请输入联系电话！");
        checkNum(_this,"请输入正确的联系电话！");
    }catch(err){
        return false;
    }
    return true;
}
/**非空校验*/
function checknull(_obj,msg){
    if (trim(_obj.val()) == "") {
        _obj.next(".error").html(msg).show();
        throw msg;
    }
    return true;
}
/**校验非法字符*/
function checkIllegal(_obj,msg){
    if (/^.*[,\^\*\?<>&)\!@%`+\$}{('"\\\/\[\]+].*$/.test(trim(_obj.val()))
          || /^.*[\u005f\u003d\uff5b\uff5d\u3001\u007c\uff5c\u003b\uff1b\uff1f\uff01\uffe5\u2026\u201c\u201d\u2018\u2019].*$/.test(trim(_obj.val()))
          || trim(_obj.val()) == "null") {
        _obj.next(".error").html(msg).show();
        throw msg;
    }
    return true;
}
/**校验字符串长度*/
function checkByteLength(_obj,len,msg) {
    var _len = ByteLength(trim(_obj.val()));
    if(_len > len) {
        obj.next(".error").html(msg).show();
        throw msg;
    }
    return true;
}
function checkIdNo(_obj,msg){
    if (!/^\w{1,18}$/.test(trim(_obj.val()))) {
        _obj.next(".error").html(msg).show();
        throw msg;
    }
    return true;
}
/**校验手机号*/
function checkNum(_obj,msg){
    if (!/^(\d{11}|\d{12}|\d{10}|\d{8}|\d{7})$/.test(trim(_obj.val()))) {
        _obj.next(".error").html(msg).show();
        throw msg;
    }
    return true;
}
/**校验邮编*/
function checkPost(_obj,msg){
    if (!/^\d{6}$/.test(trim(_obj.val()))) {
        _obj.next(".error").html(msg).show();
        throw msg;
    }
    return true;
}
/**校验发票抬头*/
function checkInvoiceTitle(_this) {
    try{
        checknull(_this,"请输入发票抬头！");
        checkIllegal(_this,"请输入正确的发票抬头！");
        checkByteLength(_this,50,"发票抬头超长,请重新输入!");
    }catch(err){
        throw err;
    }
    _this.next(".error").hide();
    return true;
}
/*检验地市*/
function checkProvCity(_this,msg){
      if(isEmpty(_this.val())){
         throw msg;
      }
}
/** 提交 */
$(".sub_btn").bind("click", subInvoice);
function subInvoice() {
    $(".sub_btn").next(".error").hide();
    var monthChoose = servicetype == "26"?calMoneyChoosen("invoice_month"):0 , payChoose = servicetype == "26"?calMoneyChoosen("invoice_pay"):0 , cardChoose = calMoneyChoosen("invoice_card"),chargChoose=calMoneyChoosenCharege("invoice_charge");
    if(!normalVerify(monthChoose,payChoose,cardChoose,chargChoose)) return;
    $(".chooseMonth").val($(".sel_scope .on").eq(0).attr("month"));//选择的月份
    if(isEmpty(servicetype)) return;
    if(!invoiceVerify()) return;
    $("#invoiceTotalMoney").val(parseFloat(monthChoose+payChoose+cardChoose+chargChoose).toFixed(2));
    var ajaxCheckUrl = absolutebreswebroot + invoicewebroot + "obtainInvoice/ObtainInvoiceCheck";
    if(servicetype == "26" && $('input:radio[name="postBean.payment_method"]:checked').val() == "3"){
        $("#invoiceForm").attr("action",absolutebreswebroot + invoicewebroot + "obtainInvoice/ObtainInvoiceApply.action");
        ajaxFormSubmit(ajaxCheckUrl, $(".sub_btn"), subInvoice, $("#invoiceForm"), "_blank", servicetype, "01");
    }else{
        $("#invoiceForm").attr("action",absolutebreswebroot + invoicewebroot + "obtainInvoice/InvoiceSubmit.action");
        ajaxFormSubmit(ajaxCheckUrl, $(".sub_btn"), subInvoice, $("#invoiceForm"), "_self", servicetype, "01");
    }
}
/** 基础检验(不用区分邮寄/自领取) */
function normalVerify(monthChoose,payChoose,cardChoose,chargChoose) {
    try{
        if((monthChoose + payChoose + cardChoose+chargChoose) <= 0) {
            throw "请选择要打印的发票信息!";
        }
        if(cardChoose > 0) {
            checkInvoiceTitle($("#posttitle"));
            if(servicetype == '27')
               checkProvCity($("#invoicecity"),"请选择省份地市！");
               if(noSelfInvoice){
                  return false;//您选择的省分仅支持月结发票的打印，选择其它省分
               }
        }
    } catch(err) {
        $(".sub_btn").next(".error").html(err).show();
        return false;
    }
    return true;
}