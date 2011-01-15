function newCard(){
var Card = {
    x: 0,
    y: 0,
    selected: false,
    width: 0,
    height: 0,
    image: 0,
    is_ready: 0,
    in_move: false,
    canvas: 0,
    ctx:0,
    target_x:0,
    target_y:0,
    current_frame: 0,
    smer_x :0,
    smer_y :0,
    speed: 0,
    clicked: function (){
        if (Card.in_move === true) {
            return;
 }
	if ( Card.selected === true ){
            Card.selected = false;
            Card.target_y = Card.y + 10;
            Card.in_move = true;
            Card.smer_y = 1;  
        } else {
            Card.selected = true;
            Card.target_y = Card.y-10;
            Card.in_move = true;
            Card.smer_y = -1;  
        }
    },
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
        if ( Card.in_move === false ){
            return;
        }  
        if ( Card.x !== Card.target_x || Card.y !== Card.target_y ){
               if (Card.smer_x !== 0){
                    Card.x = Card.x + 2*Card.smer_x;
                    if ( Card.smer_x*Card.x > Card.smer_x*Card.target_x ) {
                        Card.x = Card.target_x;
                        Card.smer_x = 0;  
                   }  
                } 
                if (Card.smer_y !== 0 ) {
                    Card.y = Card.y + 2*Card.smer_y;
                    if ( Card.smer_y*Card.y > Card.smer_y*Card.target_y ) {
                        Card.y = Card.target_y;
                        Card.smer_y = 0;  
                    }  
                } 
                if ( Card.smer_y === 0 && Card.smer_y === 0 ){
                    Card.in_move=false; 
                }
        }  
    }
};
    return Card;
}
var cardT = {
    canvas: 0,
    ctx: 0,
    data: 0,
    timer:0,
    pos:0,
    cards:[],
    on_click: function(evntdata){
        var i;
        var clickked=0;
        var x=evntdata.pageX-cardT.pos.left;
        var y=evntdata.pageY-cardT.pos.top;
        for (i=0;i<10;i++){
            if (  x >  cardT.cards[i].x && x < cardT.cards[i].x+cardT.cards[i].width && y > cardT.cards[i].y && y < cardT.cards[i].y+cardT.cards[i].height ){
		clickked = i; 
	    }    
        }
        cardT.cards[clickked].clicked();
    },
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
                                cardT.data = data;
                                cardT.refresh();
                       //  setTimeout(cardT.getTableData,13000);
                              },
                     error  :  function(data){ p.report_error(data);} 
                 }
             );
           
         },
    refresh: function(){
        var i;
        for (i=0;i<cardT.data.player_cards.length;i++){
           cardT.add_card("/images/cards/"+cardT.data.player_cards[i]+".png",i,10+i*20,50);
        }
    },
    init: function(canvas){ 
        cardT.canvas = canvas;
        cardT.ctx=cardT.canvas.getContext('2d');
        cardT.timer = setInterval(cardT.drawFrame, 10);
        cardT.timerData = setTimeout(cardT.getTableData,100); 
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
        }
	}
    
    
};
$( function() {
    alert('once');
    var can =  $('#cardtable')[0];
    cardT.pos = $('#cardtable').position();
    $('#cardtable').bind("click",cardT.on_click);
    cardT.init(can);
    cardT.getTableData(); 
});
