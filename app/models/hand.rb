
class Hand < ActiveRecord::Base
 has_many :players
 # hand status must be changed affter players is added 
 # status is 1 created waiting for 2 players
 #           2 created waiting for 1 player
 #           3 in play
 #           4 ended  
 def add_player ( player )
   if self.players.size == 3 then 
     raise "can't add players" 
   end
   self.players << player 
   self.status = self.players.size
 end
 def self.find_open_game
   hands=Hand.find_by_sql("select * from hands where status in (1,2) order by status desc")
   if hands.size == 0 then
     h=Hand.new
     return h
   else
     return hands[0]
   end
 end
end
