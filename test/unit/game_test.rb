require 'test_helper'
class GameTest < ActiveSupport::TestCase
  test "game_deal" do
     p=Game.new
     p.deal
     (0..2).each do |x|
       assert p.players_stacks[x].size == 10
     end
  end
end
