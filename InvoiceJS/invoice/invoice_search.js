// 初始页脚
var pageFlag = 1,pagesPerFlag=5;//页码块（五页一块）初始状态
var records;//查询记录
/**查询记录页数*/
var recordsPage = 0;
/** 查询记录数*/
var recordsLen = 0;
/** 当前页码 ，默认第一页 */
var currentPage=1;
/**每页数据条数*/
var recordsPerPage = 5;
var pageType="invoice";
$(function() {
    getTime();   //初始时间
    queryByDate(true);// 初始化查询
    
    var nowDate = new Date().format("yyyy-MM-dd");
    var beginDate = $("#txtB").val();
    var endDate = $("#txtE").val();
    if (beginDate != nowDate || beginDate != nowDate) {
        $(".dChange a[name='today']").removeClass("on");
    }
    if (beginDate == getLastMonthDate(new Date(), 1) && endDate == nowDate) {
        $(".dChange a[name='month']").addClass("on");
    }
    else if (beginDate == getLastMonthDate(new Date(), 12) && endDate == nowDate) {
        $(".dChange a[name='mothes']").addClass("on");
    }
    if (!checkNotNullAndVaild(endDate, beginDate)) {
        showErrorDiv("起始时间应小于截止时间！");
    }
    $("#feeSearchTable_inputPageNo").val("");//跳转框
    // 跳转指定页面
    $(".determineBtn").click(function() {
        var wantPage = $("#feeSearchTable_inputPageNo").val();
        if(isEmpty(wantPage)) {
            return;
        }
        wantPage = wantPage <= 0 ? 1 : (wantPage > recordsPage ? recordsPage : wantPage);
        var wantFlag;
        if ((parseInt(wantPage) / recordsPerPage) > Math.floor(parseInt(wantPage) / recordsPerPage)) {//块数
            wantFlag = Math.floor(parseInt(wantPage) / recordsPerPage) + 1;
        } else {
            wantFlag = Math.floor(parseInt(wantPage) / recordsPerPage);
        }
        currentPage = wantPage;
        pageFlag = wantFlag;
        if (wantPage > (pageFlag * recordsPerPage) || wantPage < ((pageFlag - 1) * recordsPerPage + 1)) {
            queryByDate(false);
        }else{
            goPage(currentPage);
        } 
        pageCodeShow();
    });
});

function queryOnChange($this) {
    if ($($this).val() != new Date().format("yyyy-MM-dd")) {
        $(".dChange a[name='today']").removeClass("on");
    }
    queryByDate(true);
}

function queryByDate(isFisrtSear) {
    var txtBval = $("#txtB").val() , txtEval = $("#txtE").val();
    var mon = 6;
    var overMonthes = getLastMonthDate(new Date(), mon);
    if (!checkNotNullAndVaild(txtBval, overMonthes) || !checkNotNullAndVaild(new Date().format("yyyyMMdd"), txtEval)) {
        showErrorDiv("请选择" + mon + "个月以内日期！");
        return;
    }
    if (!checkNotNullAndVaild(txtEval, txtBval)) {
        showErrorDiv("起始时间应小于截止时间！");
        return;
    }
    pageFlag = isFisrtSear  ? 1 : pageFlag;//第一块 
    currentPage = isFisrtSear ? 1 : currentPage;//第一页
    removeTableContent(pageType);
    $(".noneRecord").hide();
    $(".beingQueried").show();

    $.ajax( { url :absolutebreswebroot+ invoicewebroot + "invoiceSearch/InvoiceSearchNew?",
        data : "startDate=" + txtBval + "&endDate=" + txtEval + "&pageFlag=" + pageFlag + "&servicetype=" + servicetype,
        dataType : 'json',
        type : 'get',
        //stimeout : 10000,
        success : function(data) {
            getRecords(data);
            if((parseInt(recordsLen)/recordsPerPage)>Math.floor(parseInt(recordsLen)/recordsPerPage)){//总页数
                recordsPage=Math.floor(parseInt(recordsLen)/recordsPerPage)+1;
            }else{
                recordsPage=Math.floor(parseInt(recordsLen)/recordsPerPage);
            }
            showRecordsOnPage(currentPage);//展示table
            if(records.length==0){//没有记录
                $(".beingQueried").hide();
                $(".noneRecord").show();
            }else{
                $(".beingQueried,.noneRecord").hide();
            }
        }, 
        error : function(xml) {
            $(".beingQueried").hide();
            $(".noneRecord").show();
        }
    });
}

function getRecords(data){
    records=data.hits.hits;
    recordsLen=data.hits.total;
}

function showRecordsOnPage(currentPage){
    if(0<=currentPage<=recordsPage){
        goPage(currentPage);
    }
    pageCodeShow();
    $("#pageNum").html("共"+recordsPage+"页");
}

function goPage(currentPage){
    var html = assemblePayfeeRecord();
    removeTableContent(pageType);
    $("#"+pageType).append(html);
}
function assemblePayfeeRecord(){
      var html="";
      var beginrecord = (currentPage-(pageFlag-1)*recordsPerPage)*recordsPerPage-recordsPerPage;
      var endrecord = currentPage<recordsPage ? (currentPage-(pageFlag-1)*recordsPerPage)*recordsPerPage : (recordsLen-(pageFlag-1)*25);
      var j = 0;
      for(var i=beginrecord;i<endrecord;i++){//注意数组从0开始
          var order = records[i]._source;
          var cls = j%2!=0?' class="f7f7f7"':'';
          var orderTime = order.orderTime.split("T")[0]+"  "+order.orderTime.split("T")[1];
          html+="<tr" + cls + "><td>"+order.orderNo+"</td>";
          html+="<td>"+orderTime+"</td>";
          html+="<td class=\"payNum\">"+change(order.invoiceTotalMoney)+"</td>";
          html+=servicetype=="26" ? "<td>"+getMailFee(order.fundType,order.topayTotalMoney,order.serviceType)+"</td>" : "";
          html+="<td>"+getOrderStateDesc(order.orderState)+"</td>";
          html+="</tr>";
          j++;
      }
      return html;
}

function getMailFee(fundType,incomeTotalMoney,serviceType){
    if(serviceType=="27"||parseInt(incomeTotalMoney) <= 0||fundType=="5"||fundType=="6"){
        return "-";
    }
    var money = fundType=="1" ? change(incomeTotalMoney) : incomeTotalMoney;
    var desc = fundType=="1" ? " 元" : " 积分";
    return money + desc;
}

function change(money){
    var re;
    re=money/100;
    var result = changeTwoDecimal_f(re);
    return  result;
}

function changeTwoDecimal_f(x) {  
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
}
//00  未支付  01--04 成功  05 已退款
function getOrderStateDesc(state){
    if(state=="00"){
        return " 未支付";
    }
    else if(state=="05"){
        return "已退款";
    }
    else if(state=="01" || state=="02" || state =="03" ||state== "04"){
        return "成功";
    }
}
function pageCodeShow(){
    $(".clickpage").html("");
    if(pageFlag>=1){
        var x = (pageFlag - 1) * recordsPerPage + 1;
        var htm = "";
        for ( var y = x; y < x + recordsPerPage; y++) {
            if (y <= recordsPage ) {
                htm += "<a class='' >" + y + "</a>";
            }
        }
    }
    $(".clickpage").append("<span id='prevPage' class='pageUpGray' >上一页</span>" + htm
                         + "<span id='nextPage' class='nextPageGray' >下一页</span> ");
    $(".clickpage a").removeClass("pagingSelect");//除去页码样式
    $(".clickpage a").eq((currentPage-pageFlag*pagesPerFlag)-1).addClass("pagingSelect");
    changeColor4NextAndPrev(currentPage);
    addFunction();
}
/**
 * 分页 页码点击
 */
function addFunction(){
    
    //页面页码点击
    $(".clickpage a,.clickpage span ").click(function(){
        var _this=$(this);
        var page=_this.html().trim();
        if(page=="上一页"){
            if(currentPage < 1) {
                $(".tips").html("已经是首页 ").show();
                $("#prevPage").addClass("pagingSelect");
                return;
            }
            //第一页....第五页
            currentPage=currentPage>1 ? parseInt(currentPage)-1 : currentPage;
            if(currentPage>=((pageFlag-1)*recordsPerPage+1) && currentPage<=(pageFlag*recordsPerPage)){//当前块里的跳页
                goPage(currentPage);
            }else if(currentPage<=((pageFlag-1)*recordsPerPage)){
                pageFlag=pageFlag-1;
                queryByDate(false);
            }
            $(".tips").hide();
        }else if(page=="下一页"){
            if(currentPage>recordsPage) {
                $(".tips").html("已经是末页 ").show();
                $("#nextPage").addClass("pagingSelect");
                return;
            }
            //不是最后一页
            currentPage=currentPage<recordsPage?parseInt(currentPage)+1:currentPage;
            if(currentPage>=((pageFlag-1)*recordsPerPage+1) && currentPage<=(pageFlag*recordsPerPage)){//当前块里的跳页
                goPage(currentPage);
            }else if( currentPage>(pageFlag*recordsPerPage)){
                pageFlag=pageFlag+1;
                queryByDate(false);
            }
            $(".tips").hide();
        }else{
            currentPage=parseInt(page);//当前页面
            goPage(page);//走你
            $(".tips").hide();
        }
        pageCodeShow();
    });
}

function changeColor4NextAndPrev(currentPage){
    if (currentPage <= 1) {
        $("#prevPage").attr("class", "pageUpGray");
    } else {
        $("#prevPage").attr("class", "pageUpOrange");
    }
    if (currentPage >= recordsPage) {
        $("#nextPage").attr("class", "nextPageGray");
    } else {
        $("#nextPage").attr("class", "nextPageGrayOrange");
    }
}

/** check time  if checkStr>overMonthes return true */
function checkNotNullAndVaild(checkStr, overMonthes) {
    if (!isEmpty(checkStr)) {
        return Number(checkStr.replace(/-/g, "")) >= Number(overMonthes.replace(/-/g, ""));
    }
    return false;
}
//显示错误提示层
function showErrorDiv(errorMes){
        $("#errors").html(errorMes);
        $("#thickDiv").show();
        $("#activity").show().center();;
}
  //取消错误提示弹出层
$(".layer .close , .shortOrangeBtn").click(function(){
  $(this).closest(".layer").hide();$(".thick-div").hide();
});


//多少天前
function getTime(){
    var now = new Date();
    var y=now.getFullYear() , m=parseInt(now.getMonth())+1 , d=now.getDate();
    var time;
    time=y+"-"+(((m+"").length==1)?("0"+m):(""+m))+"-"+(((d+"").length==1)?("0"+d):(""+d));
    $("#txtE").val(time); 
    $("#txtB").val(time);
    $( "#txtB" ).datepicker({
        changeMonth: true,
        numberOfMonths: 1,
        dateFormat:"yy-mm-dd",
        minDate:'-6m',
        maxDate:$( "#txtE" ).val(),
        onClose: function( selectedDate ) {
            $( "#txtE" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    $( "#txtE" ).datepicker({
        changeMonth: true,
        numberOfMonths: 1,
        dateFormat:"yy-mm-dd",
        minDate:$( "#txtB" ).val(),
        maxDate:new Date(),
        onClose: function( selectedDate ) {
            $( "#txtB" ).datepicker( "option", "maxDate", selectedDate );
        }
    });
}

function senfe(o,a,b,c,d){
    var t=document.getElementById(o).getElementsByTagName("tr");
    for(var i=0;i<t.length;i++){
        t[i].style.backgroundColor=(t[i].sectionRowIndex%2==0)?a:b;
        t[i].onclick=function(){
           for(var j=0;j<t.length;j++){
                t[j].x="0";
                t[j].style.backgroundColor=(t[j].sectionRowIndex%2==0)?a:b;     
             }
             if(this.x!="1"){
            this.x="1";
            this.style.backgroundColor=d;
           }else{
            this.x="0";
            this.style.backgroundColor=(this.sectionRowIndex%2==0)?a:b;
           }
        };
        t[i].onmouseover=function(){
           if(this.x!="1")this.style.backgroundColor=c;
        };
        t[i].onmouseout=function(){
           if(this.x!="1")this.style.backgroundColor=(this.sectionRowIndex%2==0)?a:b;
        };
    }
}
/** 删除table中的记录 */
function removeTableContent(tid) {
    $("#"+tid+" tr").each(function(){
        if($(this).attr("class").indexOf("nodele") < 0){
            $(this).remove();
        }
    });
}
