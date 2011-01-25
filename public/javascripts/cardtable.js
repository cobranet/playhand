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
    card_images:[],
    images_ready:0,
    total_images:33,
    background_draw: false,
/* CARD OBJECT */
    newCard:function(id){
       var Card = {
            id:id,
            x: 0,
            y: 0,
            selected: false,
            width: 0,
            height: 0,
            image: cardT.card_images[id],
            is_ready: 0,
            in_move: false,
            canvas: document.createElement('canvas') ,
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
                if (Card.in_move ) { return; }
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
},
/*STACKS Stacks are group of cards Thay keep positions of cards */
    newStack:function(px,py,pstepx,pstepy,pcardw,pcardh){
        var s = {
                cards: [],
                x:px,
                cardh:pcardh,
                cardw:pcardw,
                y:py,
                step_x:pstepx,
                step_y:pstepy,
                l:0,
                clickable: false,
                pos: function(index){
                    var p={
                        x:0,
                        y:0
                    };
                    p.x=s.x+s.step_x*index;
                    p.y=s.y+s.step_y*index;
                    return p;
                },
                remove:function(index){
                    var i;
                    s.cards[index]=null;
                    for(i=index;i<s.l-1;i++){
                        s.cards[i]=s.cards[i+1];
                    }
                    s.l--;
                },
                add: function(index,card){
                    card.is_ready=true;
                    card.speed=0;
                    card.current_frame= 0;
                    card.canvas.setAttribute('width',s.cardw);
                    card.canvas.setAttribute('height',s.cardh);
                    card.ctx=card.canvas.getContext('2d');
                    card.width = s.cardw;
                    card.height = s.cardh;
                    s.cards[index]=card;
                    s.l++;
/* if cards is visible move it to new position  if not just set it */
                    if (card.visible===true){
                        card.in_move=false;
                        cardT.move_card(card,s.pos(index).x,s.pos(index).y);
                    } else {
                        card.x= s.pos(index).x;
                        card.y= s.pos(index).y;
                    }
                    card.visible=true;
                }
            };
        return s;
    },
    getCard: function(stack,cardindex){
        return cardT.stacks[stack].cards[cardindex];
    },
    loadCardImage: function(img_file){
        var index;
        index=cardT.card_images.length;
        cardT.card_images[index] = new Image();
        cardT.card_images[index].onload=function(){
            cardT.images_ready=cardT.images_ready+1;
        };
        cardT.card_images[index].src=img_file;
    },
    is_ready: function(){
        if (cardT.images_ready === cardT.total_images ){
            return true;
        }
        return false;
    },
    loadBackground: function(img_file){
        cardT.background = new Image();
        cardT.background.onload=function(){
            cardT.images_ready=cardT.images_ready+1;
        };
        cardT.background.src=img_file;
    },
    /* you can click only on clckable staks */
    on_click: function(evntdata){
        var i;
        var clickked=-1;
        var stack_clicked=-1;
        var card=0;
        var k;
        var c=0;
        var x=evntdata.pageX-cardT.pos.left;
        var y=evntdata.pageY-cardT.pos.top;
        for (i=0; i< cardT.stacks.length;i++){
            if (cardT.stacks[i].clickable){
                for (k=0;k<cardT.stacks[i].l;k++){
                    card=cardT.getCard(i,k);
                    if (  x >  card.x && x < card.x+card.width
                        && y > card.y && y < card.y+card.height ){
                        clickked = k;
                        stack_clicked=i;
                    }
                 }
            }
        }
        /* no card is selected */
        if ( clickked === -1) {
            return ;
        }
        c=cardT.getCard(stack_clicked,clickked);
        /* if card is moving do nothing */
        if ( c.in_move === true ) {
            return;
        }
        /* if selected deselect others */
        if ( c.selected === true ){
            cardT.play_card(stack_clicked,clickked);
        } else {
        /* if not selected .... select that and deselect others
           from that stack  */
            c.select();
            for(i=0;i<cardT.stacks[stack_clicked].l;i++){
                c=cardT.getCard(stack_clicked,i);
                if (i !== clickked && c.selected ){
                    c.deselect();
                }
            }
        }
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
    loadAllCardImages: function(){
        var i;
        var k;
        var suits = ['S','D','H','C'];
        var values =  ['7','8','9','T','J','Q','K','A'];
        for (i=0;i<4;i++){
            for (k=0;k<8;k++){
                cardT.loadCardImage("/images/cards/"+values[k]+suits[i]+".png");
            }
        }

    },
    refresh: function(){
        var i;
        for (i=0;i<cardT.data.play_cards.length;i++){
            cardT.add_card("/images/cards/"+cardT.data.player_cards[i]+".png",i,150+i*20,250);
        }
    },
    move_card: function(c,x,y){
        c.move_to(x,y);
    },
    play_card: function(stack,index){
        var i;
        var c;
        var c1=cardT.getCard(stack,index);
        var s=cardT.stacks[stack];
        c1.selected=false;
        c1.in_move=false;
        /* all cards from player stack except played */
        for (i=0;i<index;i++){
            c=cardT.getCard(stack,i);
            cardT.move_card(c, c.x+s.step_x,c.y);
        }
        for (i=index+1;i<s.l;i++){
            c=cardT.getCard(stack,i);
            cardT.move_card(c,c.x-s.step_x,c.y);
        }
        cardT.stacks[1].add(cardT.stacks[1].l,c1);
        s.remove(index);
    },
    move: function(){
        var i;
        var c;
        var s;
        for (s=0;s<cardT.stacks.length;s++){
            for (i=0;i<cardT.stacks[s].l;i++){
                c=cardT.getCard(s,i)
                c.move();
            }
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
        cardT.loadAllCardImages();
    },
    drawCard:function( c ){
        if ( c ) {
            c.drawImage();
            cardT.ctx.drawImage(cardT.background,
                                c.last_x,
                                c.last_y,
                                c.width,
                                c.height,
                                c.last_x,
                                c.last_y,
                                c.width,
                                c.height );
            cardT.ctx.drawImage(c.canvas,c.x,c.y,c.width,c.height);
            c.last_x=c.x; c.last_y=c.y;
        }
    },
    drawFrame: function(){
        var i;
        var k;
        var card;
        if (cardT.is_ready === false){
            return;
        }
        if (cardT.background_draw === false ){
            cardT.draw_background();
        }
        for(i=0;i<cardT.stacks.length;i++){
            for (k=0;k<cardT.stacks[i].l;k++){
                card=cardT.stacks[i].cards[k];
                cardT.drawCard(card);
            }
        }
    },
    testTable: function(){
        var i;
        var card;
        if (cardT.is_ready === false ){
            setTimeout(cardT.testTable,1000);
        }
        var stack=cardT.newStack(100,200,25,0,72,96);
        var move_stack=cardT.newStack(30,100,25,0,72,96);
        stack.clickable=true;
        for (i=0;i<10;i++){
            card=cardT.newCard(i);
            stack.add(i,card);
        }
        cardT.stacks[0]=stack;
        cardT.stacks[1]=move_stack;
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
