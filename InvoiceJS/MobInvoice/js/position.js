 (function($){    
     $.fn.center = function(){
         var top = ($(window).height() - this.height())/2;
         var left = ($(window).width() - this.width())/2;
         var scrollTop = $(document).scrollTop();
         var scrollLeft = $(document).scrollLeft();

  //       alert(document.body.clientHeight+","+$(window).height()+","+document.body.scrollHeight+","+$(document).height()+","+$(document.body).height());
         return this.css( { position : 'absolute', 'top' : document.body.clientHeight/2, left : left + scrollLeft } ).show();
     }
 })(jQuery);

 function setSelectionRange(obj,pos) {
     if (obj.setSelectionRange) {
         obj.focus();
         obj.setSelectionRange(pos, pos);
     }
     else if (obj.createTextRange) {
         var range = obj.createTextRange();
         range.collapse(true);
         range.moveEnd('character', pos);
         range.moveStart('character', pos);
         range.select();
     }
 }

 function getPosition(obj){
     return obj.selectionStart;
 }

 function setFref() {
     var refercookie = getCookie("HISPAGE");
     if("wapsc" == refercookie) {
         $(".arrow-l").attr("href","http://m.10010.com/mfront/views/my-order/main.html#/myflowpkg?oneKey=f");
     }
     else {
         $(".arrow-l").attr("href","http://wap.10010.com/t/siteMap.htm?menuId=pay");
     }
 }