require 'card.rb'
class Game
  attr_reader :players_stacks
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
