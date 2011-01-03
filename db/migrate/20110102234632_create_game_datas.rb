class CreateGameDatas < ActiveRecord::Migration
  def self.up
    create_table :game_datas do |t|
      t.column :hand_id , :intiger
      t.column :player0stack,:string
      t.column :player1stack,:string
      t.column :player2stack,:string
      t.column :player0taken,:string
      t.column :player1taken,:string
      t.column :player2taken,:string
      t.column :talon,:string
      t.column :tab,:string
      t.column :on_move,:intiger
      t.column :biding ,:string
      t.column :status,:intiger 
      t.timestamps
    end
  end

  def self.down
    drop_table :game_datas
  end
end
