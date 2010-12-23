class HandsController < ApplicationController
def index
  @hands = Hand.find(:all)
end
def create
  @hand = Hand.new
  @hand.status = 1
  @hand.save!
end
end
