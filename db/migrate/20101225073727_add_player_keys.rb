class AddPlayerKeys < ActiveRecord::Migration
  def self.up
    add_column :players, :user_id , :intiger
    add_column :players, :hand_id , :intiger
  end

  def self.down
  end
end
