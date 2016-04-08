class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :fb_user_id, unique: true
      t.string :fb_user_first_name
      t.string :fb_user_last_name
      t.json :youtube_ids

      t.timestamps
    end
  end
end
