class HandsController < ApplicationController
def index
  @hands = Hand.find(:all)
end
def create
  @hand = Hand.new
  @hand.players << Player.new( :user_id => current_user.id )
  @hand.save!
  render  :text => 'ok' 
end
end
