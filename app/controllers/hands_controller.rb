class HandsController < ApplicationController
def index
  @hands = Hand.find(:all)
end
def create
  @hand = Hand.find_open_game
  @hand.add_player( Player.new( :user_id => current_user.id ) )
  @hand.save!
  @hands = Hand.find(:all) 
  render :text => 'ok'
end
end
