/**
 * 邮寄发票信息
 */
var servicetype = '27';
var webRoot = invoicewebroot;
$(function(){
    getPostOrInvoiceHistory("getHistoryGetOwn","historyGetOwn","");
});

/*购卡和直充发票分开ln*/
function getCardorChargeInvInfo(type,servicetype){
    var service = receive_servicetype;
    $("#unicardServicetype").val(service);
    var serviceArr=service.split(",");
    for(var i=0;i<serviceArr.length;i++){
        if(isEmpty(serviceArr[i])) continue;
        getInfo(serviceArr[i]);
    }
    //showProvCity();
 
}

function getInfo(service) {
    var uri = "GetBuyCardInvoice";
    $.ajax({url:absolutebreswebroot+invoicewebroot + "obtainInvoice/" + uri,
            type: "get",
            //data : {"service":service},
            data : {"service":service},
            dataType:'json',
            success:function(data){
                if(service=="08")card_invoice = data;
                else charge_invoice = data;
                fillInvoiceInfo();
            },
            error:function(xml){
            }
        });
}
function showProvCity(){
               /*var provincename = getProvinceName(provArr[0]);
               var cityname = getCityName(provArr[0], provArr[1]);
               var municipality = ['011','013','031','083'];
               if(municipality.toString().indexOf(provArr[0]) > -1){邮寄地址省市自动显                   $(".adressAreaInfo").empty().text(provincename);
               } else {
                   $(".adressAreaInfo").empty().text(provincename + "  " + cityname);
               }
               */
               
        var provincename = getProvinceName(provArr[0]);
            var cityname = getCityName(provArr[0], provArr[1]);
            var municipality = ['011','013','031','083'];
            if(municipality.toString().indexOf(provArr[0]) > -1){
                //$(".invoiceTop02 span").empty().text("提供"+$('#totalPrice').html()+"发票，交费后第二天凭有效证件到" + cityname + "市联通营业厅（非代理点）领取，如需要实销月结发票，请输入其他金额交费。");
            	$(".adressAreaInfo").empty().text(provincename);
            } else {
                //$(".invoiceTop02 span").empty().text("提供"+$('#totalPrice').html()+"发票，交费后第二天凭有效证件到" + cityname + "市联通营业厅（非代理点）领取，如需要实销月结发票，请输入其他金额交费。");
            	$(".adressAreaInfo").empty().text(provincename + "  " + cityname);
            }
}
/** 页面是否能展示 */
function showPage() {
    var noPhoneOrFix = (phone_login.indexOf(login_type)<0 && fix_login.indexOf(login_type)<0);
    if(!loginFlag || noPhoneOrFix || isEmpty(user_province)) {
        var text = !loginFlag ? "请登录后刷新此页面!" : noPhoneOrFix ? "此业务不支持邮箱/第三方用户登录，请使用交费号码进行登录!" : "请登录后刷新此页面!";
        $("#no_server_tip").text(text);
        if(!loginFlag || noPhoneOrFix) $(".loginlink").attr("href",LoginRedirectUrl+"?redirectURL="+absolutebreswebroot+"/npfinvoiceweb/invoice_self_fill.htm").show();
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
//    if(locationID == 'invoice-history-two' ){//手机||固话      >>>自取
        var data=invoiceHistory;
        if(data!=null && data!=""){
            for(var i=0;i<data.length;i=i+1){
                var showdata = autoAddEllipsis(data[i].invoice_head,12)+"-"+autoAddEllipsis(cardType(data[i].card_type)+"-"+data[i].id_cardno,15);
                var hidedata = (data[i].invoice_head+"-"+cardType(data[i].card_type)+"-"+data[i].id_cardno);
                var citydata = (datali.province_code+" "+datali.city_code);
                html=html + createHistoryli((i+1),citydata,showdata,hidedata);
            }
        }
        html=html + createNewli("add-self");
//    }
    $("."+locationID).html(html);
    handleAll(locationID , locationID == "post-history" ? "post" : "getown");
    addFunction();//加载生成的html的各种js 事件
}

/** 改变隐藏变量 》》 action 》》Oracle 以传值给省份下发 */
function setHiddenConst(_obj){ //name： li中的input复选框
    var _this=_obj;
    var _thisParent=_this.parent();//当前操作的一条记录  li
    
    var provinceHidden = $("#provinceHidden").val();
    var cityHidden = $("#cityHidden").val();
    _thisParent.parent().find("input").each(function(){//寻找所有历史记录的  hidden的input 并且删除
        if(($(this).attr("type")!="radio" && $(this).attr("class")!="procity") && $(this).attr("class")!="hidden_data" ){//不是省分地市编码和隐藏信息的隐藏input，删掉
            $(this).remove();
        }
    });
    var hidden_data=_thisParent.find(".hidden_data").val().split("-");
    var procity=_thisParent.find(".procity").val().split(" ");
    var hiddenStr="<input type='hidden' name='invoiceBean.invoice_head' value='"+hidden_data[0]+"'/>"+
                  "<input type='hidden' name='invoiceBean.card_type'value='"+cardTypeValue(hidden_data[1])+"'/>"+//类型汉字 转换成编码
                  "<input type='hidden' name='invoiceBean.id_cardno' value='"+hidden_data[2]+"'/>"+
                  "<input type='hidden' name='invoiceBean.province_code' value='"+provinceHidden+"'/>"+
                  "<input type='hidden' name='invoiceBean.city_code' value='"+cityHidden+"'/>";
    _thisParent.append(hiddenStr);//给当前操作的一条记录  li ，加上隐藏变量input ,并赋值
}
/**
 * 加载生成的html的各种js 事件
 * 每次重新改变那个发票页面html，都必须加上这些功能
 * @return
 */
function addMyFunction(){
    /**取消按钮**/
    //邮寄  取消 发票填写表单
    $(".close1").click(function(){
        $(".invoice_post").find(".error").hide();
        $(".invoice_post").hide();
        if ($(".post-history").find(".history-list").length==0) { //不存在历史列表
        } else {
            if (isEmpty($('input:radio[name="invoice_infor"]:checked').val())) { // 新增发票信息，取消时默认选中第一个
                $(".post-history li:first span").click();
            }
        }
        fillPayType();
    });
    //自取  取消 发票填写表单
    $(".close2").click(function(){
        $(".invoice-two").hide();
        $(".invoice-two").find(".error").hide();
        if($(".invoice-history-two").find(".history-list").length==0){//不存在历史列表
            setInvoice2default();
            $("#oneselfToReceive").hide();
            $("input:radio[name='invoice-type'][value='3']").attr("checked","true");
        } else {
            if ($(".invoice-history-two input:radio:checked").parent("li").hasClass("add-self")) { // 新增发票信息，取消时默认选中第一个
                $(".invoice-history-two .history-list:first").find("input:radio").click();
            }
        }
    });
     
    //自取    单选按钮 选中效果
    $(".invoice-history-two input").click(function(){
        var _this=$(this),_thisParent=_this.parent();//_this：当前input（单选按钮），_thisParent:当前单选按钮所在的li
        $(".invoice-history-two li").removeClass('bg-fff');//去除所有li的样式
        $(".invoice-history-two em").hide();// 隐藏编辑按钮
        $(".invoice-history-two input").attr('checked',false);//去除所有单选按钮选中状态
        _thisParent.addClass('bg-fff');//增加当前选中的li  样式
        _thisParent.find("em").show();
        _this.attr('checked',true);//增加当前选中的  样式
    });
    $(".invoice-history-two .history-list input").click(function(){
        $(".invoice-fill").hide();
        setHiddenConst($(this),"getown");
    });
    $(".invoice-history-two li span").click(function(){
        $(this).siblings("input:radio").click();
    });
    
    //自取  点击新增按钮 新建1个邮寄信息列表表单
    $(".add-self input").click(function() {
       if(getCurrentNum(".invoice-history-two")<5){//如果当前个数小于5，可以点击新增，从而显示表单
           $(".invoice-two").show();
           current_invoice_id=null;//
           $("#posttitle,#idno").val("");//表单清空
       }else{
           $(".invoice-two").hide();
           $(".add-self .cOrgB_tip").html("  （发票历史记录最多五条，删除一条后才能再添加）").show();
       }
     });
    
    /**自取 修改**/
    // 自取  历史列表的修改图标，出现表单
    $(".invoice-history-two .invoice-edit").click(function() {
        current_invoice_id=$(this).parent().attr("id");//当前要修改的记录的id
        var current_value=$(this).parent().find(".hidden_data").val().split("-")//当前要修改的记录里的值
        
        $(this).parent().find("input:radio").click();
        
        $(".invoice-two").show();
        $("#posttitle").val(current_value[0]);
        $("#cardtype").val(cardTypeValue(current_value[1]));
        $("#idno").val(current_value[2]);
    });
}
/** 处理发票信息 */
function operateInvoiceInfo(modtype,id) {
    
}
/** 提交时做信息校验(自领取) */
function invoiceVerify() {
    var _this = $("#idno") , idNo = _this.val() , cardtype = $("#cardtype").val();
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
        $("#posttitle").attr("name","invoiceBean.invoice_head");
    }catch(err){
        _this.next(".error").html(err).show();
        return false;
    }
    _this.next(".error").hide();
    return true;
}