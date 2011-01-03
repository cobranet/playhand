require 'test_helper'
class GameTest < ActiveSupport::TestCase
  test "game_deal" do
     p=Game.new
     p.deal
     (0..2).each do |x|
       assert p.players_stacks[x].size == 10
     end
  end
  test "save_data_to_game_data" do
    g=Game.new
    gd=GameData.new
    
    g.players_stacks[0].add( Card.new "7S" )
    g.players_stacks[0].add( Card.new "8S" )
    g.players_stacks[0].add( Card.new "9S" )
    g.players_stacks[0].add( Card.new "TS" )
    g.players_stacks[0].add( Card.new "JS" )
    g.players_stacks[0].add( Card.new "QS" )
    g.players_stacks[0].add( Card.new "KS" )
    g.players_stacks[0].add( Card.new "AS" )
    g.players_stacks[0].add( Card.new "7D" )
    g.players_stacks[0].add( Card.new "8D" )
    

    g.players_stacks[1].add( Card.new "9D" )
    g.players_stacks[1].add( Card.new "TD" )
    g.players_stacks[1].add( Card.new "JD" )
    g.players_stacks[1].add( Card.new "QD" )
    g.players_stacks[1].add( Card.new "KD" )
    g.players_stacks[1].add( Card.new "AD" )
    g.players_stacks[1].add( Card.new "7H" )
    g.players_stacks[1].add( Card.new "8H" )
    g.players_stacks[1].add( Card.new "9H" )
    g.players_stacks[1].add( Card.new "TH" )

    g.players_stacks[2].add( Card.new "JH" )
    g.players_stacks[2].add( Card.new "QH" )
    g.players_stacks[2].add( Card.new "KH" )
    g.players_stacks[2].add( Card.new "AH" )
    g.players_stacks[2].add( Card.new "7C" )
    g.players_stacks[2].add( Card.new "8C" )
    g.players_stacks[2].add( Card.new "9C" )
    g.players_stacks[2].add( Card.new "TC" )
    g.players_stacks[2].add( Card.new "JC" )
    g.players_stacks[2].add( Card.new "QC" )
    
    g.talon.load_string("KCAC") 
     
    g.to_data(gd)

    assert gd.talon  == "KCAC"
    assert gd.player0stack == "7S8S9STSJSQSKSAS7D8D"
    assert gd.player1stack == "9DTDJDQDKDAD7H8H9HTH"
    assert gd.player2stack == "JHQHKHAH7C8C9CTCJCQC"
  
     
  end
end
