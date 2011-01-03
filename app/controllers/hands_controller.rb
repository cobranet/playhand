class HandsController < ApplicationController
def index
  @hands = Hand.find(:all)
end
def data
   @dat=Hash.new; 
   @hand=Hand.find_by_id(params[:id])
   @game=Game.new
   @game.from_data(@hand.game_data)
   a=@game.players_stacks[0]
   @dat[:player_cards] = a.to_string_array
   render :json => @dat.to_json , :layout => false
end 
def create
  @hand = Hand.find_open_game
  @hand.add_player( Player.new( :user_id => current_user.id ) )
  if @hand.status == 3 then
   g=Game.new
   @hand.game_data=GameData.new
   g.deal
   g.to_data(@hand.game_data)
   @hand.game_data.save!
  end
  @hand.save!
  @hands = Hand.find(:all)
  render 'index' , :layout => false
end
def show
 @hand = Hand.find_by_id(params[:id])
 @game = Game.new 
 @game.from_data(@hand.game_data)
end
end
