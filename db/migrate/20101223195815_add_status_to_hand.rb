class AddStatusToHand < ActiveRecord::Migration
  def self.up
    add_column :hands, :status, :integer
  end

  def self.down
    remove_column :hands, :status
  end
end
