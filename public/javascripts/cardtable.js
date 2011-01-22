function newCard(){
    var Card = {
            id:0,
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
            last_x:0,
            last_y:0,
            current_frame: 0,
            smer_x :0,
            smer_y :0,
            speed: 0,
            visible: false,
/* seting new position for card */
            move_to: function(x,y){
                if (Card.in_move) { return; }
                Card.target_x=x;
                Card.target_y=y;
                if(y !== Card.y){
                    Card.in_move = true;
                    if (y-Card.y > 0 ) {
                        Card.smer_y=1;
                    } else {
                        Card.smer_y=-1;
                    }
                }
                if (x!==Card.x){
                    Card.in_move=true;
                    if (x-Card.x > 0 ) {
                        Card.smer_x=1;
                    } else {
                        Card.smer_x=-1;
                    }
                }
            },
/* When select card from stack all other must be deselected */
            select: function (){
                Card.selected = true;
                Card.target_y = Card.y-10;
                Card.in_move = true;
                Card.smer_y = -1;
            },
/* deslect */
            deselect: function(){
                Card.selected = false;
                Card.target_y = Card.y + 10;
                Card.in_move = true;
                Card.smer_y = 1;
            },
            clicked: function (){
                if (Card.in_move === true) {
                    return;
                }
                if ( Card.selected === true ){
                    Card.deselect();
                } else {
                    Card.select();
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
                if ( Card.is_ready && Card.visible ){
                    Card.ctx.drawImage(Card.image,0,0);
                }
            },
            move: function(){
                if ( Card.in_move === false ){
                    return;
                }
                if ( Card.smer_x !== 0 || Card.smer_y !== 0 ){
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
                    if ( Card.smer_x === 0 && Card.smer_y === 0 ){
                        Card.in_move=false;
                    }
                }
            }
        };
    return Card;
}
/****************************************************************
cardT Glavna tabla
*****************************************************************/
var cardT = {
    canvas: 0,
    ctx: 0,
    data: 0,
    timer:0,
    move_timer:0,
    pos:0,
    stacks:[],
    background:0,
    all_cards:[],
    is_ready: false,
    background_draw: false,
    /* Stacks are group of cards , they keep only reference to card from
       cardT
       Thay keep positions of cards */
    newStack:function(px,py,pstepx,pstepy){
        var s = {
                cards: [],
                x:px,
                y:py,
                step_x:pstepx,
                step_y:pstepy,
                l:0,
                pos: function(index){
                    var p={
                        x:0,
                        y:0
                    };
                    p.x=s.x+s.step_x*index;
                    p.y=s.y+s.step_y*index;
                    return p;
                },
                add: function(index,cardindex){
                    var card=cardT.all_cards[cardindex];
                    s.cards[index]=cardindex;
                    s.l++;
/* if cards is visible move it to new position  if not just set it */
                    if (card.visible===true){
                        cardT.move_to(index,s.pos(index).x,s.pos(index).y);
                    } else {
                        card.x= s.pos(index).x;
                        card.y= s.pos(index).y;
                    }
                }
            };
        return s;
    },
    loadBackground: function(img_file){
        cardT.background = new Image();
        cardT.background.onload=function() { cardT.is_ready=true;  };
        cardT.background.src=img_file;
    },
    on_click: function(evntdata){
        var i;
        var clickked=-1;
        var c=0;
        var x=evntdata.pageX-cardT.pos.left;
        var y=evntdata.pageY-cardT.pos.top;
        for (i=0;i<10;i++){
            if (  x >  cardT.all_cards[i].x && x < cardT.all_cards[i].x+cardT.all_cards[i].width && y > cardT.all_cards[i].y && y < cardT.all_cards[i].y+cardT.all_cards[i].height ){
                clickked = i;
            }
        }
        /* no card is selected */
        if ( clickked === -1) {
            return ;
        }
        c=cardT.all_cards[clickked];
        /* if card is moving do nothing */
        if ( c.in_move === true ) {
            return;
        }
        /* if selected deselect others */
        if ( c.selected === true ){
            cardT.play_card(clickked);
        } else {
        /* if not selected .... select that and deselect others */
            c.select();
            for(i=0;i<10;i++){
                if (i !== clickked && cardT.all_cards[i].selected ){
                    cardT.all_cards[i].deselect();
                }
            }
        }
    },
    add_card: function(card_file,index,x,y){
        var c;
        var new_cvs;
        c = newCard();
        new_cvs = document.createElement('canvas');
        c.init(new_cvs,x,y,72,96,card_file);
        cardT.all_cards[index]=c;
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
                error  :  function(data){
                    p.report_error(data);
                }
            }
        );
    },
    loadAllCards: function(){
        var i;
        var k;
        var suits = ['S','D','H','C'];
        var values =  ['7','8','9','T','J','Q','K','A'];
        for (i=0;i<4;i++){
            for (k=0;k<8;k++){
                cardT.add_card("/images/cards/"+values[k]+suits[i]+".png",
                                i*8+k,150+i*20,100+k*17);
            }
        }

    },
    refresh: function(){
        var i;
        for (i=0;i<cardT.data.player_cards.length;i++){
            cardT.add_card("/images/cards/"+cardT.data.player_cards[i]+".png",i,150+i*20,250);
        }
    },
    move_card: function(index,x,y){
        cardT.all_cards[index].move_to(x,y);
    },
    play_card: function(index){
        var i;
        cardT.all_cards[index].selected=false;
        cardT.move_card(index,100,100);
        /* all cards from player stack except played */
        for (i=0;i<index;i++){
            cardT.move_card(i,cardT.all_cards[i].x+10,cardT.all_cards[i].y);
        }
        for (i=index+1;i<10;i++){
            cardT.move_card(i,cardT.all_cards[i].x-10,cardT.all_cards[i].y);
        }
    },
    move: function(){
        var i;
        var c;
        for (i=0;i<cardT.all_cards.length;i++){
            c=cardT.all_cards[i];
            c.move();
        }
    },
    draw_background: function (){
        if (cardT.is_ready) {
            cardT.ctx.drawImage(cardT.background,0,0,600,400);
            cardT.background_draw=true;
        }
    },
    init: function(canvas){
        cardT.canvas = canvas;
        cardT.ctx=cardT.canvas.getContext('2d');
        cardT.loadBackground("/images/table.png");
        cardT.timer = setInterval(cardT.drawFrame, 10);
        cardT.move_timer =  setInterval(cardT.move,20);
        // cardT.timerData = setTimeout(cardT.getTableData,100);
        cardT.loadAllCards();
    },
    drawCard:function( card_index ){
        var c;
        c=cardT.all_cards[card_index];
        if ( c ) {
            c.drawImage();
            cardT.ctx.drawImage(cardT.background,
                                c.last_x,c.last_y,
                                c.width,c.height,
                                c.last_x,c.last_y,
                                c.width,c.height);
            cardT.ctx.drawImage(c.canvas,c.x,c.y,c.width,c.height);
            c.last_x=c.x; c.last_y=c.y;
        }
    },
    drawFrame: function(){
        var i;
        var k;
        var card;
        if (cardT.background_draw === false ){
            cardT.draw_background();
        }
        for(i=0;i<cardT.stacks.length;i++){
            console.log(cardT.stacks[i].cards.length);
            for (k=0;k<cardT.stacks[i].cards.length;k++){
                card=cardT.stacks[i].cards[k];
                console.log(card);
                cardT.drawCard(card);
            }
        }
    },
    testTable: function(){
        var stack=cardT.newStack(100,100,20,0);
        stack.add(0,0);
        cardT.all_cards[0].visible=true;
        cardT.stacks[0]=stack;
        console.log("test table"+ cardT.stacks.length);
    }
};
$( function() {
    console.log('once');
    var can =  $('#cardtable')[0];
    cardT.pos = $('#cardtable').position();
    $('#cardtable').bind("click",cardT.on_click);
    cardT.init(can);
    cardT.testTable();
});
