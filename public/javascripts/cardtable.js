function newCard(){
var Card = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    image: 0,
    is_ready: 0,
    canvas: 0,
    ctx:0,
    target_x:0,
    target_y:0,
    current_frame: 0,
    speed: 0,
    init: function ( canvas,x,y,width,height,im){
        Card.is_ready=false;
        Card.x=x;
        Card.y=y;
        Card.width=width;
        Card.height=height;
        Card.speed=0;
        Card.current_frame= 0;
        Card.target_x=x;
        Card.target_y=y;
        Card.canvas=canvas;
        Card.canvas.setAttribute('width',width);
        Card.canvas.setAttribute('height',height);
        Card.ctx=Card.canvas.getContext('2d');
        Card.loadImage(im);    
    },
    loadImage: function(img_file){
        Card.image = new Image();
        Card.image.onload=function() { Card.is_ready=true;  };
        Card.image.src=img_file; 
    },
    drawImage: function(){
        Card.ctx.clearRect(0,0,Card.width,Card.height);
        if ( Card.is_ready ){
            Card.ctx.drawImage(Card.image,0,0);
            Card.move(); 
        } 
    },
    move: function(){
	if ( Card.x != Card.target_x || Card.y != Card.target_y ){
            if  ( Card.current_frame > Card.speed ){
		    Card.x=Card.x+(Card.target_x-Card.x)/abs(Card.target_x-Card.x);
                    Card.y=Card.y+(Card.target_y-Card.y)/abs(Card.target_y-Card.y)
                    Card.current_frame = 0;  
            } else {
                    Card.current_frame = Card.current_frame + 1;
	    };  
        };                
    }
} 
    return Card;
};
var cardT = {
    canvas: 0,
    ctx: 0,
    data: 0,
    timer:0,
    cards:[],
    add_card: function(card_file,index,x,y){
	var c;
        var new_cvs;
        c = newCard();
        new_cvs = document.createElement('canvas'); 
        c.init(new_cvs,x,y,72,96,card_file);
        cardT.cards[index]=c;
     },
     getTableData: function(){
        $.ajax(
 	 {
                     type: 'GET',
                     url:  'data/112',
                     success: function(data){ 
                         alert('success');
                                cardT.data = data;
                                cardT.refresh();
                              },
                     error  :  function(data){ p.report_error(data);} 
                 }
             );
         },
    refresh: function(){
        var i;
        for (i=0;i<cardT.data.player_cards.length;i++){
           cardT.add_card("/images/cards/"+cardT.data.player_cards[i]+".png"
                           ,i,10+i*20,10);
        }
    },
    init: function(canvas){ 
	var i;
        var c;
        var new_cvs;
        cardT.canvas = canvas;
        cardT.ctx=cardT.canvas.getContext('2d');
        cardT.timer = setInterval(cardT.drawFrame, 1400);
    },
    drawFrame: function(){
	var i;
        var c;
        for(i=0;i<cardT.cards.length;i++){
            c=cardT.cards[i];  
            if ( c ) {
            c.drawImage();
            cardT.ctx.drawImage(c.canvas,c.x,c.y,c.width,c.height);
	    } 
        };
    } 
};
$( function() {
    alert('once');
    var can =  $('#cardtable')[0];
    var ctx = can.getContext('2d');
    cardT.init(can);
    cardT.getTableData();
/*
    cardT.add_card("/images/cards/AH.png",0,10,10);
    cardT.add_card("/images/cards/KH.png",1,30,10);
  */
});
/*
var CT = 
    function(){
     var ctx; 
     var p={
         player_x_start: 100,
         player_y_start: 200,
         data: {},
         report_error: function(data){ 
                      $("#error_msg").html(data.responseText);},
	 alert: function (){ alert('tu sam') },
         init: function(){ ctx = $('#cardtable')[0].getContext("2d");
                           $('#cardtable').click( p.click );
                         },
	 getCtx: function(){ return ctx; },
         click: function() { alert('click'); },
         getTableData: function(){
             $.ajax(
		 {
                     type: 'GET',
                     url:  'data/112',
                     success: function(data){ 
                         p.data = data;
                                p.draw();
                              },
                     error  :  function(data){ p.report_error(data);} 
                 }
             );
         },
         draw: function(){
             var i;
	     var im;
             for ( i=0;i<10;i++) { 
                     im=$('#'+p.data.player_cards[i])[0];
                     p.getCtx().drawImage(im,p.player_x_start+20*i,p.player_y_start);
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
*/
