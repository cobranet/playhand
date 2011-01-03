require 'card.rb'
class Game
  attr_reader :players_stacks,:talon,:tab,:taken_stacks
  def to_data(gd)
    gd.player0stack = @players_stacks[0].to_s
    gd.player1stack = @players_stacks[1].to_s
    gd.player2stack = @players_stacks[2].to_s
    gd.player0taken = @taken_stacks[0].to_s
    gd.player1taken = @taken_stacks[1].to_s
    gd.player2taken = @taken_stacks[2].to_s
    gd.talon = @talon.to_s
    gd.tab = @tab.to_s
  end
  def from_data(gd)
   @players_stacks[0].load_string(gd.player0stack)
   @players_stacks[1].load_string(gd.player1stack)
   @players_stacks[2].load_string(gd.player2stack)
   @taken_stacks[0].load_string(gd.player0taken)
   @taken_stacks[1].load_string(gd.player1taken)
   @taken_stacks[2].load_string(gd.player2taken)
   @talon.load_string(gd.talon)
   @tab.load_string(gd.tab)
  end 
  def deal
    deck =Stack.new
    (0..3).each do |s|
      (0..7).each do |v|
        deck.add Card.new s,v
       end 
     end
    deck.randomize!
    (0..2).each do |i|
      @players_stacks[i]=Stack.new
      (0..9).each do |x| 
        @players_stacks[i].add(deck.cards[10*i+x])
      end 
      @players_stacks[i].sort!
    end 
    @talon.add(deck.cards[30])
    @talon.add(deck.cards[31])
  end
  def initialize
   @players_stacks=[]
   @taken_stacks=[]
   @talon = Stack.new
   @tab = Stack.new
   (0..2).each do |x|
      @players_stacks[x] = Stack.new
      @taken_stacks[x]=Stack.new
   end 
  end  
end;
