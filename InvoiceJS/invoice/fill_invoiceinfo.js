/**
 * 加载可打发票信息 , 初始化页面
 */
var isvip = false , jifen = 2 , loginFlag = false , user_province = "0" ,user_city = "", login_type = "0" , is4G = true;//登录用户信息;
var invoiceHistory , postHistory , postAddrHistory;//用户输入完号码，自取  发票历史,邮寄发票抬头历史,邮寄地址历史
var invoicerule = {};
var month_invoice = {} , pay_invoice = {} , card_invoice = {} ,charge_invoice={}, pay_types = {}; // 月结
var current_invoice_id , current_post_id;//全局变量 ，当前要修改的发票记录id  (默认为null ,当有点击时不为null,为你选择的发票记录的id)
var month_invoice_limit = 0 , pay_invoice_limit = 0 , invoice_limit = 0, choosen_limit = 0 , rest_limit = 0;// 月结/实缴/所有可打发票总额,已选发票总额,剩余可选额度
var online_province = "" , oneallow = "084" , isallow = true; // 上线省份 , 月结/实缴同时只选一种
var month_limitdate = "" , pay_limitdate = "";//用户选择的截止时间
var mail_servicetype = "" , receive_servicetype = "" , mail_invoicetype = "" , receive_invoicetype = "";// 1:月结
var phone_login = "01,06,11,16" ; fix_login = "02,03,04,08";
var types = [];
var paytypes = {};
var noSelfInvoice=false;//自取页面选择地市不支持自取发票
$(function() {
    webRoot = invoicewebroot;
    isJudgeLogin(invoicewebroot,false,"");//获取用户登录及省份信息
    getLimitProvice();
    if(!showPage()){
        $(".service").hide();
        $(".no_service").show();
        $(".pointCon").remove();
        return;
    }
    
    $(".service").show();
    $(".no_service").hide();
    if(online_province.indexOf(user_province) >= 0) {// 上线省份
        isallow = oneallow.indexOf(user_province) >= 0 && !is4G;
        initOnlineInvoice();
    } else {
        initOldInvoice();
    }
    //获取月结发票
    if(mail_invoicetype.indexOf("1")>=0 ) {// 1:月结 || receive_invoicetype.indexOf("1")>=0
        getInvoiceInfo("month");
    }
    //获取实缴发票
    if(mail_invoicetype.indexOf("0")>=0 ) { //|| receive_invoicetype.indexOf("0")>=0
        getInvoiceInfo("pay");
    }
    //获取一卡充类型发票
    if(is4G && servicetype == '26') $("#card_list").hide();//CB号码不展示一卡充列表
    if(((mail_servicetype.indexOf("06")>=0 || mail_servicetype.indexOf("07")>=0 || mail_servicetype.indexOf("08")>=0)&& !is4G) || receive_servicetype.indexOf("06")>=0 || receive_servicetype.indexOf("07")>=0 || receive_servicetype.indexOf("08")>=0) {
        getCardorChargeInvInfo("card",receive_servicetype);
    }
});
function initOldInvoice() {
    $(".mail_invoice").hide();
    $(".oneself_receive_invoice").click();
    getInvoiceRuleNew(user_province);
    dealOldInvoiceRule();
    
    getPostOrInvoiceHistory("getHistoryGetOwn","historyGetOwn","");
}
function initOnlineInvoice() {
    getInvoiceRuleNew(user_province);
    dealInvoiceRule();
    if("26" == servicetype){
        getPostOrInvoiceHistory("getHistoryPost","historyPost","");
        getPostOrInvoiceHistory("getCustHistoryPost","custHistoryPost","post-history");
//        isJudgeVip();
        userJifen();
    }
    fillProvinceCitiesRegion("mailproviceid","--省--","mailcityid","--市--","mailregionid","--区--");//邮寄省份初始化
    
}

/** 填充发票记录信息 */
function fillInvoiceInfo() {
    $(".print_lines").hide();
    //var itype = $(".choose").eq(0).attr("class").indexOf("mail_invoice") >= 0 ? "26" : "27";//邮寄,自领取
    var month = parseInt($(".sel_scope .on").eq(0).attr("month"));
    invoice_limit = 0;
    var showInfos = fillMonthInfo(servicetype,month) ? "0" : "";
    showInfos += fillPayInfo(servicetype,month) ? "1" : "";
    showInfos += fillCardInfo(servicetype,month) ? "2" : "";
    showInfos += fillChargeInfo(servicetype,month) ? "3" : "";
    $(".invoice_list_box .list_table").show();
    $(".invoice_list_box h6").find('em').attr('class','open');
    var id = showInfos.indexOf("0") >= 0 ? "month_list" : showInfos.indexOf("1") >= 0 ? "pay_list" : "card_list";
    $("#" + id + " h6").find('em').attr('class','close');
    $(".invoice_list_box h6").click();
    invoiceInfoBund();
    $(".sel_all_checkBox").attr("checked",false);
    if(invoice_limit > 0) $(".print_lines").show();
    choosen_limit = 0, rest_limit = invoice_limit;
    $(".invoice_limit").text(invoice_limit);
    $(".choosen_limit").text(choosen_limit);
    $(".rest_limit").text(rest_limit);
}
function fillMonthInfo(itype,month) {
//    month = month==0 ? 1 : month;//最近一笔与最近一个月记录一致
    var beforeDate = getLastMonthDate(new Date(), month+1);
    $("#invoice_month tbody").attr("money","").attr("servicetypes","");
    $("#invoice_month , #no_month").removeClass("list_table").hide();$("#month_list .self").hide();$("#month_list h6 label").removeClass("nochoose");
    var tips = month_invoice["month_rec_info"];
    if(isEmpty(tips) || "26" == itype && mail_invoicetype.indexOf("1") < 0 || "27" == itype && receive_invoicetype.indexOf("1") < 0) {//邮寄,无月结/自领取,无月结
        $("#no_month").addClass("list_table");
        return false;
    }
    var html = "" , able = "27" == itype ? "disabled=\"disabled\"" : "" , totalMoney = 0;
    for(var i=0;i<tips.length;i++) {
        var bcycId = tips[i]["bcycId"].substr(0,4) + "-" + tips[i]["bcycId"].substr(4) , money = parseFloat(tips[i]["totalFee"])/100;
        if(new Date(beforeDate) > new Date(bcycId) || money <= 0) break;
        totalMoney += money;
        html += "<tr id=\"" + bcycId + "\" money=\"" + money + "\">" +
            "<td><input type=\"checkbox\" " + able + "\" class=\"checkBox mail_choose\" name=\"month_check\"/></td>" +
            "<td>" + bcycId + "</td>" +
            "<td>" + tips[i]["nickName"] + "</td>" +
            "<td>" + tips[i]["serialNumber"] + "</td>" +
            "<td>" + money + "</td>" +
            "</tr>";
    }
    totalMoney = parseFloat(totalMoney).toFixed(2);
    $("#invoice_month tbody").attr("money",totalMoney).attr("servicetypes",phone_login.indexOf(login_type) >= 0 ? "01" : "03").html(html);
    $(".all_month").find("input").attr("checked",false).attr("disabled","27" == itype);
    if(totalMoney > 0) {
        $("#invoice_month").addClass("list_table").show();
    } else {
        $("#no_month").addClass("list_table").show();
    }
    month_invoice_limit = totalMoney <= 0 && invoice_limit <= 0 ? 0 : parseFloat(month_invoice["total_print_fee"])/100;
    invoice_limit = month_invoice_limit;
    return totalMoney > 0;
}


function fillPayInfo(itype,month) {
    var beforeDate = getLastMonthDate(new Date(), month);
    $("#invoice_pay tbody").attr("money","").attr("servicetypes","");
    $("#invoice_pay , #no_pay").removeClass("list_table").hide(); $("#pay_list .self").hide();$("#pay_list h6 label").removeClass("nochoose");
    var tips = pay_invoice["fee_rec_info"];
    if(isEmpty(tips) || "26" == itype && mail_invoicetype.indexOf("0") < 0 || "27" == itype && receive_invoicetype.indexOf("0") < 0) {//邮寄,无实缴/自领取,无实缴
        $("#no_pay").addClass("list_table")
        return false;
    }
    var tips = pay_invoice["fee_rec_info"];
    var html = "" , able = "27" == itype ? "disabled=\"disabled\"" : "" , totalMoney = 0;
    for(var i=0;i<tips.length;i++) {
        var money = parseFloat(tips[i]["recvFee"])/100;
//        if(month <= 0) {
//            if(i<=0) {totalMoney += money; html += createPayfeeHtml(tips,i,money,able);}
//            break; //最近一笔
//        }
        if(new Date(beforeDate).getTime() > Date.parse(tips[i]["recvTime"].replace(/-/g, "/")) || money <= 0) break;
        totalMoney += money;
        html += createPayfeeHtml(tips,i,money,able);
    }
    totalMoney = parseFloat(totalMoney).toFixed(2);
    $("#invoice_pay tbody").attr("money",totalMoney).attr("servicetypes",phone_login.indexOf(login_type) >= 0 ? "01" : "03").html(html);
    $(".all_paid").find("input").attr("checked",false).attr("disabled","27" == itype);
    if(totalMoney > 0) {
        $("#invoice_pay").addClass("list_table").show();
    } else {
        $("#no_pay").addClass("list_table").show();
    }
    pay_invoice_limit = totalMoney <= 0 && invoice_limit <= 0 ? 0 : parseFloat(pay_invoice["total_print_fee"])/100;
    invoice_limit = pay_invoice_limit;
    return totalMoney > 0;
}
function createPayfeeHtml(tips,i,money,able) {
    return "<tr id=\"" + tips[i]["chargeId"] + "\" money=\"" + money + "\">" +
            "<td><input type=\"checkbox\" " + able + "\" class=\"mail_choose\" name=\"pay_check\"/></td>" +
            "<td>" + tips[i]["recvTime"] + "</td>" +
            "<td>" + tips[i]["payName"] + "</td>" +
            "<td>" + tips[i]["serialNumber"] + "</td>" +
            "<td>" + money + "</td>" +
            "</tr>";
}
function fillCardInfo(itype,month) {
//    month = month==0 ? 1 : month;//最近一笔与最近一个月记录一致
    var beforeDate = getLastMonthDate(new Date(), month);
    $("#invoice_card tbody").attr("money","").attr("servicetypes","");
    $("#invoice_card , #no_card").removeClass("list_table").hide();
    $(".invoice_name").hide();
    if(isEmpty(card_invoice) || "26" == itype && (mail_servicetype.length <= 0 || is4G) || "27" == itype && receive_servicetype.length <= 0) {//邮寄,无一卡充/自领取,无一卡充
        $("#no_card").addClass("list_table");
        $("#invoice_card tbody").attr("money","0").attr("servicetypes","").html("");
        return false;
    }
    var html = "" , totalMoney = 0;
    for(var i=0;i<card_invoice.length;i++) {
        var money = parseFloat(card_invoice[i]["topayTotalMoney"])/100;
        if(new Date(beforeDate) > new Date(card_invoice[i]["orderTime"]) || money <= 0) break;
        html += "<tr id=\"" + card_invoice[i]["orderTime"] + "\" money=\"" + money + "\">" +// card_invoice[i]["orderNo"]
            "<td><input type=\"checkbox\" class=\"\" name=\"card_check\"/></td>" +
            "<td>" + card_invoice[i]["orderTime"] + "</td>" +
            "<td>" + money + "</td>" +
            "</tr>";
        totalMoney += money;
    }
    totalMoney = parseFloat(parseFloat(totalMoney).toFixed(2));
    var sertype = servicetype == "27" ? "08" : (phone_login.indexOf(login_type) >= 0 ? "06,08" : "07,08");
    $("#invoice_card tbody").attr("money",totalMoney).attr("servicetypes",sertype).html(html);
    $(".all_buycard").find("input").attr("checked",false);
    var id = totalMoney > 0 ? "invoice_card" : "no_card";
    $("#" + id).addClass("list_table").show();
    if(totalMoney > 0) $(".invoice_name").show();
    return totalMoney > 0;
}

//填充直充发票记录
function fillChargeInfo(itype,month) {
//    month = month==0 ? 1 : month;//最近一笔与最近一个月记录一致
    var beforeDate = getLastMonthDate(new Date(), month);
    $("#invoice_charge tbody").attr("money","").attr("servicetypes","");
    $("#invoice_charge , #no_charge").removeClass("list_table").hide();
    $(".invoice_name").hide();
    if(isEmpty(charge_invoice) || "26" == itype && (mail_servicetype.length <= 0 || is4G) || "27" == itype && receive_servicetype.length <= 0) {//邮寄,无一卡充/自领取,无一卡充
        $("#no_charge").addClass("list_table");
        $("#invoice_charge tbody").attr("money","0").attr("servicetypes","").html("");
        return false;
    }
    var html = "" , totalMoney = 0;
    for(var i=0;i<charge_invoice.length;i++) {
        var money = parseFloat(charge_invoice[i]["topayTotalMoney"])/100;
        if(new Date(beforeDate) > new Date(charge_invoice[i]["orderTime"]) || money <= 0) break;
        html += "<tr id=\"" + charge_invoice[i]["orderTime"] + "\" money=\"" + money + "\">" +// card_invoice[i]["orderNo"]
            "<td><input type=\"checkbox\" class=\"\" name=\"charge_check\"/></td>" +
            "<td>" + charge_invoice[i]["orderTime"] + "</td>" +
            "<td>" + money + "</td>" +
            "</tr>";
        totalMoney += money;
    }
    totalMoney = parseFloat(parseFloat(totalMoney).toFixed(2));
    $("#invoice_charge tbody").attr("money",totalMoney).attr("servicetypes",phone_login.indexOf(login_type) >= 0 ? "06" : "07").html(html);
    $(".all_charge").find("input").attr("checked",false);
    var id = totalMoney > 0 ? "invoice_charge" : "no_charge";
    $("#" + id).addClass("list_table").show();
    if(totalMoney > 0) $(".invoice_name").show();
    var tempMunicipality = getProvinceName(user_province);
    var municipalityName =['','北京','天津','重庆','上海'];
    if(municipalityName.indexOf(tempMunicipality)!=-1){
    	
    }
    if($.inArray(tempMunicipality, municipalityName)){
        $(".invoiceproviceSelf").html(getCityName(user_province,user_city)+"市");
    }
    else{
        $(".invoiceproviceSelf").html(getProvinceName(user_province)+"省"+getCityName(user_province,user_city)+"市");
    }
    return totalMoney > 0;
}





/** 取可打发票记录 */
function getInvoiceInfo(type) {
    var uris = {"month":"obtainMonthInvoite","pay":"obtainPayfeeInvoice","card":"GetBuyCardInvoice"};
    var uri = uris[type];
    var service = servicetype == '26' ? mail_servicetype : receive_servicetype;
    $("#unicardServicetype").val(service);
    $.ajax({url:absolutebreswebroot+invoicewebroot + "obtainInvoice/" + uri,
        type: "get",
        data : {"service":service},
        dataType:'json',
        success:function(data){
            if(type == "month") month_invoice = data;
            if(type == "pay") pay_invoice = data;
            if(type == "card") card_invoice = data;
            fillInvoiceInfo();
        },
        error:function(xml){
        }
    });
}
/** 解析未上线省份发票规则 */
function dealOldInvoiceRule() {
    types = phone_login.indexOf(login_type) >= 0 ? ["06" , "08"] : ["07" , "08"];
    for(var i=0;i<types.length;i++) {
        var rule = invoicerule[types[i]];//对应业务类型的配置
        if(isEmpty(rule)) continue;
        if(rule["invoice_type"] != 1) {//非月结
            receive_servicetype += (isEmpty(receive_servicetype) ? "" : ",") + types[i];
        }
    }
}
/** 解析发票配置信息 */
function dealInvoiceRule() {
    types = phone_login.indexOf(login_type) >= 0 ? ["01" , "06" , "08"] : ["03" , "07" , "08"];
    for(var i=0;i<types.length;i++) {
        var rule = invoicerule[types[i]];//对应业务类型的配置
        if(isEmpty(rule)) continue;
        var mail = rule["mail"];
        var self = rule["receive"];
        
        getInvoiceTypes("26"==servicetype ? mail : self,servicetype,types[i]);
        //getInvoiceTypes(self,"27",types[i]);
    }
}
/** 区分邮寄与自领取及月结非月结的*/
function getInvoiceTypes(config,type,servicetype) {
    if(isEmpty(config)) return;
    for(var i=0;i<config.length;i++) {
        if(type == "26") {
            mail_invoicetype += (servicetype == "01" || servicetype == "03") ? config[i]["invoice_type"] : "";
            mail_servicetype += !(servicetype == "01" || servicetype == "03") && config[i]["invoice_type"] == "0" ? ","+servicetype : "";
        } else if(type == "27") {
            receive_invoicetype += (servicetype == "01" || servicetype == "03") ? config[i]["invoice_type"] : "";
            receive_servicetype += !(servicetype == "01" || servicetype == "03") && config[i]["invoice_type"] == "0" ?  ","+servicetype : "";
        }
    }
}
/** 计算剩余可打发票额度  true:额度充足,可选择  false:额度不足,不可选择  取消选择,计算取消后的剩余可打额度 */
function calRestList(obj,checked){
    if(obj.parents(".list_table").attr("id") == "invoice_card"||obj.parents(".list_table").attr("id") == "invoice_charge") return true;
    var choose_money = parseFloat(obj.parents("tr").attr("money"));
    if(rest_limit < choose_money && !checked) return false;
    rest_limit = !checked ? parseFloat(rest_limit - choose_money).toFixed(2) : parseFloat(rest_limit + choose_money).toFixed(2);
    choosen_limit = !checked ? parseFloat(choosen_limit + choose_money).toFixed(2) : parseFloat(choosen_limit - choose_money).toFixed(2);
    $(".choosen_limit").text(choosen_limit);
    $(".rest_limit").text(rest_limit);
    rest_limit = parseFloat(rest_limit) , choosen_limit = parseFloat(choosen_limit);
    return true;
}
function calOneRestList(obj,checked) {
    var thisid = obj.parents(".list_table").attr("id") == "invoice_month" ? "invoice_month" : "invoice_pay" , otherid = obj.parents(".list_table").attr("id") == "invoice_month" ? "invoice_pay" : "invoice_month";
    if(obj.parents(".list_table").attr("id") == "invoice_card") return true;
    var limit = thisid == "invoice_month" ? month_invoice_limit : pay_invoice_limit;
    var thisTableMoney = calMoneyChoosen(thisid) , otherTableMoney = calMoneyChoosen(otherid);
    var choose_money = parseFloat(obj.parents("tr").attr("money"));
    if((otherTableMoney > 0 ? 0 : choosen_limit) + choose_money > limit && !checked) return false;
    $("#"+otherid).find(':checkbox').attr("checked", false);
    choosen_limit = otherTableMoney > 0 ? choose_money : (!checked ? parseFloat(choosen_limit + choose_money).toFixed(2) : parseFloat(choosen_limit - choose_money).toFixed(2));
    //choosen_limit = !checked ? parseFloat(thisTableMoney).toFixed(2) : parseFloat(thisTableMoney - choose_money).toFixed(2);
    invoice_limit = limit , rest_limit = parseFloat(invoice_limit - choosen_limit).toFixed(2);
    rest_limit = parseFloat(rest_limit) , choosen_limit = parseFloat(choosen_limit);
    $(".choosen_limit").text(choosen_limit);
    $(".rest_limit").text(rest_limit);
    $(".invoice_limit").text(invoice_limit);
    return true;
}
/** 全选计算可打发票额度  true:客户充足,可全选  false:额度不足,不可全选  全取消选择,计算全取消后的剩余可打额度 */
function calAllRest(obj,checked) {
    var id = obj.parents(".list_table").attr("id");
    if(id == "invoice_card"||id == "invoice_charge") return true;
    var otherTableMoney = id == "invoice_month" ? calMoneyChoosen("invoice_pay") : calMoneyChoosen("invoice_month");//如果当前全选的是月结类,则计算实缴类型中已选择的发票记录金额总额
    var all_choose_money = parseFloat(obj.parents(".list_table").find('tbody').attr("money"));//
    if(invoice_limit < (otherTableMoney + all_choose_money) && checked) return false;
    var tmp_choosen_limit = !checked ? parseFloat(otherTableMoney + all_choose_money).toFixed(2) : parseFloat(otherTableMoney).toFixed(2);//已选发票金额总和
    var tmp_rest_limit = parseFloat(invoice_limit - tmp_choosen_limit).toFixed(2);
    if(tmp_rest_limit < 0 || tmp_choosen_limit < 0 ) return false;
    choosen_limit = tmp_choosen_limit;
    rest_limit = tmp_rest_limit;
    $(".choosen_limit").text(choosen_limit);
    $(".rest_limit").text(rest_limit);
    rest_limit = parseFloat(rest_limit) , choosen_limit = parseFloat(choosen_limit);
    return true;
}
function calOneAllRest(obj,checked){
    var thisid = obj.parents(".list_table").attr("id") == "invoice_month" ? "invoice_month" : "invoice_pay" , otherid = obj.parents(".list_table").attr("id") == "invoice_month" ? "invoice_pay" : "invoice_month";
    if(obj.parents(".list_table").attr("id") == "invoice_card") return true;
    var limit = thisid == "invoice_month" ? month_invoice_limit : pay_invoice_limit;
    var all_choose_money = parseFloat(obj.parents(".list_table").find('tbody').attr("money"));
    if(all_choose_money > limit && !checked) return false;
    $("#"+otherid).find(':checkbox').attr("checked", false);
    choosen_limit = !checked ? parseFloat(all_choose_money).toFixed(2) : 0;
    invoice_limit = limit , rest_limit = parseFloat(invoice_limit - choosen_limit).toFixed(2);
    $(".choosen_limit").text(choosen_limit);
    $(".rest_limit").text(rest_limit);
    $(".invoice_limit").text(invoice_limit);
    rest_limit = parseFloat(rest_limit) , choosen_limit = parseFloat(choosen_limit);
    return true;
}
/** 计算每个table中已选可打发票金额 */
function calMoneyChoosen(id) {
    var choosen_money = 0;
    var ids = "";
    $("#" + id + " tbody tr").slice(0).each(function(){
        if($(this).find(":checkbox").attr("checked")) {
            choosen_money += parseFloat($(this).attr("money"));
            var chooseid = $(this).attr("id");
            ids += (isEmpty(ids) ? "" : ",") + ("invoice_card"==id ? chooseid : chooseid.replace('-',''));//$(this).attr("id");
        }
    });
    $("#"+id).next(".invoicelist").val(ids);
    return parseFloat(parseFloat(choosen_money).toFixed(2));
}
/** 计算直充table中已选可打发票金额 */
function calMoneyChoosenCharege(id) {
    var choosen_money = 0;
    var ids = "";
    $("#" + id + " tbody tr").slice(0).each(function(){
        if($(this).find(":checkbox").attr("checked")) {
            choosen_money += parseFloat($(this).attr("money"));
            var chooseid = $(this).attr("id");
            ids += (isEmpty(ids) ? "" : ",") + ("invoice_charge"==id ? chooseid : chooseid.replace('-',''));//$(this).attr("id");
        }
    });
    $("#"+id).next(".invoicelist").val(ids);
    return parseFloat(parseFloat(choosen_money).toFixed(2));
}
/** 更改支付类型 */
function fillPayType() {
    //var itype = $(".choose").eq(0).attr("class").indexOf("mail_invoice") >= 0 ? "26" : "27";//邮寄,自领取
    if("27" == servicetype) {
        var month = calMoneyChoosen("invoice_month") , pay = calMoneyChoosen("invoice_pay"), card = calMoneyChoosen("invoice_card"),charge = calMoneyChoosenCharege("invoice_charge");
        if(parseFloat(card) ||parseFloat(charge) > 0) $(".oneself_receive_box,.submitData").show();
        else $(".oneself_receive_box,.submitData").hide();
        return;
    }
    paytypes = {};
    getAblePaytype("invoice_month");
    getAblePaytype("invoice_pay");
    getAblePaytype("invoice_card");
    showPayType();
}
function showPayType() {
    $(".pay_type_box,.fill_mail_infor,.pay_type,.post_tip,.jifen,.online,.owncityfree,.submitData").hide();
    var monthChoose = calMoneyChoosen("invoice_month") , payChoose = calMoneyChoosen("invoice_pay") , cardChoose = calMoneyChoosen("invoice_card");
    var total = parseFloat(monthChoose+payChoose+cardChoose).toFixed(2);
    var postpro = $("input[name='postBean.province_code']").eq(0).val();
    if((monthChoose+payChoose+cardChoose) <= 0) return;//未勾选内容,不展示支付类型
    if(isEmpty(postpro)) {//没有确认邮寄地址
        var text = !isEmpty(paytypes["pay_vip"]) ? "您是VIP金钻用户，可免费邮寄发票！" : !isEmpty(paytypes["pay_free"]) ? "单条金额大于200的发票可同城免费邮寄，" : "";
        $(".post_tip span").text("提供" + total + "元发票," + text + "请填写邮寄信息。");
        $(".post_tip,.fill_mail_infor").show();
        return;
    }
    if(!isEmpty(paytypes["pay_vip"])) { //vip用户
        $(".post_tip span").text("提供" + total + "元发票，您是VIP钻、金用户，可免费邮寄发票！");
        $(".post_tip,.fill_mail_infor,.submitData").show();
        $("input:radio[name='postBean.payment_method'][value='1']").attr("checked",true);
        return;
    }
    if(!isEmpty(paytypes["pay_free"])) {//优先选择满额免邮
        $(".owncityfree span").text("满" + parseInt(paytypes["pay_free"]["mailing_fee"])/100 + "交费，本省免费邮寄");
        $(".post_tip span").text("提供" + total + "元发票，单笔金额大于 " + parseInt(paytypes["pay_free"]["mailing_fee"])/100 + " 元的发票可同城免费邮寄，请填写邮寄信息。");
        $(".post_tip,.fill_mail_infor,.submitData").show();
        $("input:radio[name='postBean.payment_method'][value='4']").attr("checked",true);
        return;
    }
    var defaultType = "";
    if(!isEmpty(paytypes["pay_jifen"])) {//其次选择积分
        var need_jifen = user_province == postpro ? paytypes["pay_jifen"]["own_city"] : paytypes["pay_jifen"]["other_city"];
        if(!isEmpty(need_jifen) && !isEmpty(jifen)){
            if(parseInt(jifen) >= parseInt(need_jifen["payment"])) {
                defaultType = isEmpty(defaultType) ? "2" : defaultType;
                $(".jifen span").html("本次邮寄使用积分 <span class='cOrange'>" + need_jifen["payment"] + "</span> ，使用后剩余积分 <span class='cOrange'>" + (parseInt(jifen) - parseInt(need_jifen["payment"])) + "</span>");
                $(".jifen input").attr("cost",need_jifen["payment"]);
                $(".jifen").show();
            }
        }
    }
    if(!isEmpty(paytypes["pay_online"])) {//最后在线支付
        var need_pay = user_province == postpro ? paytypes["pay_online"]["own_city"] : paytypes["pay_online"]["other_city"];
        if(!isEmpty(need_pay)){
            defaultType = isEmpty(defaultType) ? "3" : defaultType;
            $(".online span").html("本次邮寄费 <b class='cOrange'>" + (parseFloat(need_pay["payment"])/100).toFixed(2) + "元</b>");
            $(".online input").attr("cost",(parseFloat(need_pay["payment"])/100).toFixed(2));
            $(".online").show();
        }
    }
    $("input:radio[name='postBean.payment_method'][value='" + defaultType + "']").attr("checked",true);
    if(isEmpty(defaultType)) {//用户已选邮寄省份，无可选邮寄支付方式-->不支持此省邮寄
        $(".post_tip span").text("无可选邮寄支付方式!");
        $(".post_tip,.fill_mail_infor").show();
    } else {
        $(".post_tip span").text("提供" + total + "元发票，请确认邮寄信息！");$(".post_tip").show();
        $(".pay_type_box,.fill_mail_infor,.pay_type,.submitData").show();
    }
}
/** 获取可用的支付类型 */
function getAblePaytype(id) {
    var postpro = $("input[name='postBean.province_code']").eq(0).val() , postcity = $("input[name='postBean.city_code']").eq(0).val();
    var typearr = $("#" + id).find('tbody').attr("servicetypes").split(",") , isOwnPro = user_province == postpro , isOwnCity = isOwnPro && (user_city == postcity);
    if(isEmpty(typearr)) return;
    for(var i=0;i<typearr.length;i++) {
        var config = invoicerule[typearr[i]];//对应业务类型的配置
        if(isEmpty(config)) continue;
        var mail = config["mail"];
        if(isEmpty(mail)) continue;
        for(var j=0;j<mail.length;j++) {
            if("invoice_month" == id && mail[j]["invoice_type"] != 1) continue;//如果table内容为月结发票记录,而邮寄配置的发票类型为非月结,则继续一下条
            if("invoice_pay" == id && mail[j]["invoice_type"] != 0) continue;//如果table内容为实缴发票记录,而邮寄配置的发票类型为月结,则继续一下条
            var choosen_money = 0;
            $("#" + id + " tbody tr").slice(0).each(function(){
                var money = parseFloat($(this).attr("money"));
                if($(this).find(":checkbox").attr("checked")){
                    choosen_money += money;
                    if(!isEmpty(mail[j]["pay_free"]) && money > parseInt(mail[j]["pay_free"]["mailing_fee"])/100 && isOwnCity && isEmpty(paytypes["pay_free"])) paytypes["pay_free"] = mail[j]["pay_free"];
                }
            });
            if(choosen_money <= 0) return;
            if(isvip && !isEmpty(mail[j]["pay_vip"]) && choosen_money > parseInt(mail[j]["pay_vip"]["mailing_fee"])/100 && isEmpty(paytypes["pay_vip"])) paytypes["pay_vip"] = mail[j]["pay_vip"];
            if(!isEmpty(mail[j]["pay_jifen"]) && isEmpty(paytypes["pay_jifen"])){
                if(isOwnPro && !isEmpty(mail[j]["pay_jifen"]["own_city"]) || !isOwnPro && !isEmpty(mail[j]["pay_jifen"]["other_city"])) paytypes["pay_jifen"] = mail[j]["pay_jifen"];
            }
            if(!isEmpty(mail[j]["pay_online"]) && isEmpty(paytypes["pay_online"])){
                if(isOwnPro && !isEmpty(mail[j]["pay_online"]["own_city"]) || !isOwnPro && !isEmpty(mail[j]["pay_online"]["other_city"])) paytypes["pay_online"] = mail[j]["pay_online"];
            }
        }
    }
}

/** 历史发票样式处理 loactionID  getway : post  getown */
function handleAll(loactionID,getway){
    if($("." + loactionID + " li").length > 0){
        setHiddenConst($("." + loactionID + " li:first b"));//第一个默认选中，且隐藏变量添加
    }
}

/** 创建一条发票信息 li id citydata showdata hidedata  @return 本条发票信息 */
function createHistoryli(id,citydata,showdata,hidedata){
    var tmpdata = toJson(hidedata);
    return "<li class='history_list fixed' id='"+id+"'>" +
               //"<input value='" + id + "' type=\"hidden\" name=\"invoice_infor\" class=\"checkBox left\"/>" +
               "<b class='left' id='" + id + "'>" + tmpdata["postname"] + " " + getProvinceName(citydata.split(" ")[0]) + "</b>" +
               "<span >"+showdata+"</span>" +
               "<em class='invoice_edit'></em>" +
               "<em class='invoice_del'></em>" +
               "<div class='del_layer' style='display:none;'>" +
               "<p>确定删除这条发票？</p>" +
               "<label class='del_sur'>确认</label>" +
               "<label class='del_cel'>取消</label>" +
               "</div>" +
               "<input class='hidden_data' type='hidden' value='"+hidedata+"' />" +//邮寄地址
               "<input class='procity' type='hidden' value='"+citydata+"' />" +//省分地市编码 拼接
               "</li>";
}
/**
 * 加载生成的html的各种js 事件
 * 每次重新改变那个发票页面html，都必须加上这些功能
 * @return
 */
function addFunction(){
    //发票历史列表    li鼠标悬浮效果
    $(".post-history li,.invoice-history-two li").hover(function() {
        var _this=$(this);
//        _this.addClass('bg-fff');
        _this.find("em").show();//修改和删除按钮出现
    }, function() {
        var _this=$(this);
        if (_this.find("input:radio").is(":checked")) {
            return;
        } else {
            _this.removeClass('bg-fff');
            _this.find("em").hide();
        }
    });
     
    /** 删除操作 */
    // 删除弹出层
    $(".invoice_del").click(function() {
        var _this=$(this);
        var X = _this.position().top + 20;
        var Y = _this.position().left - 6;
        _this.parent().find(".del_layer").show().css({'top':X,'left':Y});
    });
    // 删除弹出层，取消删除
    $(".del_cel").click(function() {
       $(".del_layer").hide();
    });
    // 删除弹出层，确认删除
    $(".post-history .del_layer .del_sur").click(function() {
        var _this=$(this);
        var id = _this.parents("li").attr("id");
        del(_this);
        operateInvoiceInfo("del",id);
    });
    addMyFunction(); //邮寄/自领取个性化操作
}

function del(_this) {
    var ul = _this.parents("ul");
    _this.parents("li").remove();
    $(".invoice-fill").hide();
    $(".cOrgB_tip").html("").show();
    
    if(ul.find(".history-list").length!=0){//判断是否有历史记录，有的话(length!=0)才赋值隐藏变量
        ul.find("li").find("input:radio").attr('checked',false);//去除所有单选按钮选中状态
        ul.find("li:first span").click();
    } else {
        $(".add_post").click();
    }
}
function autoAddEllipsis(pStr, pLen) { 
   return cutString(pStr, pLen); 
} 

/**
 * 取可显示的字符串
 * @param {Object} 原字符串
 * @param {Object} 允许显示的字符串长度
 * @return 可显示的字符串,显示不下的加 “...”
 */
function cutString(pStr, pLen) { 
    var _strLen = pStr.length; // 原字符串长度
    var _cutString; // 新字符串
    var _lenCount = 0; 
    if (_strLen <= pLen/2) {
        return pStr;
    } 
    for (var i = 0; i < _strLen ; i=i+1 ) { 
        _lenCount = isFull(pStr.charAt(i)) ? (_lenCount + 2) : (_lenCount + 1); // 全角占2个字节长度，否则1个字节长度
        if (_lenCount > pLen) { 
            _cutString = pStr.substring(0, i); 
            break; 
        } else if (_lenCount == pLen) { 
            _cutString = pStr.substring(0, i + 1); 
            break; 
        }
    }
    _cutString = isEmpty(_cutString) ? pStr : _cutString;
    return _cutString.length == _strLen ? pStr : _cutString + "..."; 
} 

/**
 * 判断全角半角
 * @param {Object} pChar
 * @return true:全角 false:半角
 */
function isFull (pChar) {
    for (var i = 0; i < pChar.length ; i=i+1 ) {
        if ((pChar.charCodeAt(i) > 128)) {
            return true;
        }
        return false;
    }
}
/**
 * 计算字符串的字节长度
 * @param {Object} s
 */
function ByteLength(s) {
    if(isEmpty(s)) return 0;
    var len;
    for (var i = 0; i < s.length ; i=i+1 ) { 
        len = isFull(s.charAt(i)) ? (len + 2) : (len + 1); // 全角占2个字节长度，否则1个字节长度
    }
    return len;
}

/** 获取当前历史发票信息的总条数 */ 
function getCurrentNum(name){
    var current_num=0;//当前历史发票个数
    $(name+" .history_list span").each(function() {//迭代发票历史ul下标的li
        current_num+=1;
    });
    return current_num;
}

/** 获得第一条历史历史记录的 li id */
function getFirstId(name){//eg name: .post-history || .post-history
    return $(name+" li:first").attr("id");
}

/**获得最后一条历史记录的 li id */
function getLastId(name){//eg name: .post-history || .post-history
    return $(name+" li:eq("+(getCurrentNum(name)-1)+")").attr("id");
}

var cardTypes = {"0":"身份证","1":"军官证","2":"护照","3":"港澳台通行证","4":"户口簿"};
/** 通过证件类型编码取证件名 value 证件类型编码 @return 证件名 */
function cardType(value){
    return cardTypes[value];
}
/** 通过证件名获取证件类型编码 name 证件名 @return 返回证件类型编码 */
function cardTypeValue(name){
    for(var key in cardTypes) {
        if(name == cardTypes[key]) {
            return key;
        }
    }
    return null;
}