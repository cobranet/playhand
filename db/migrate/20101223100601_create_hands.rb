

class CreateHands < ActiveRecord::Migration
  def self.up
    create_table :hands do |t|
      t.timestamps
    end
  end

  def self.down
    drop_table :hands
  end
end
