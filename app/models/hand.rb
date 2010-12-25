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
   self.status = self.players.size
 end
end
