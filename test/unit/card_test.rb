require 'test_helper'
class CardTest < ActiveSupport::TestCase
  test "create card from string" do 
     c=Card.new "AH" 
     assert c.to_s == "AH" 
  end
  test "create card as suit , value " do 
     c=Card.new 0,0
     assert c.to_s == "7S"
  end
  test "adding cards to stack" do 
     s=Stack.new
     assert s.size == 0
     s.add Card.new "AH" 
     assert s.size == 1
  end 
end
