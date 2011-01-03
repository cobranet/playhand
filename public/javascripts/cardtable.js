var CT = 
    function(){
     var ctx; 
     var p={
         report_error: function(data){ 
                      $("#error_msg").html(data.responseText);},
	 alert: function (){ alert('tu sam') },
         init: function(){ ctx = $('#cardtable')[0].getContext("2d"); },
	 getCtx: function(){ return ctx; },
         getTableData: function(){
             $.ajax(
		 {
                     type: 'GET',
                     url:  'data/112',
                     success: function(data){ 
                                p.draw(data);
                              },
                     error  :  function(data){ p.report_error(data);} 
                 }
             );
         },
         draw: function(d){
             var i;
	     var im;
             for ( i=0;i<10;i++) { 
                     im=$('#'+d.player_cards[i])[0];
                     p.getCtx().drawImage(im,10+20*i,10);
	         }    
         }
     };
     
     return p;    
 }();

window.onload= function(){
      CT.init();
      var c=CT.getCtx();
      c.font = "bold 12px sans-serif"
      c.fillText("braca",248,43);
      CT.getTableData();

 };
/*
window.onload = function (){
  var canvas = document.getElementById("cardtable");
  var context = canvas.getContext("2d");
  var cat = document.getElementById("AH");
  context.drawImage(cat, 0, 0);
} */