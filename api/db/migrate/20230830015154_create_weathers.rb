class CreateWeathers < ActiveRecord::Migration[7.0]
  def change
    create_table :weathers do |t|
      t.references :city, null: false, foreign_key: true
      t.datetime :date_time, null: false
      t.string :weather, null: false
      t.float :temp, null: false
      t.float :temp_max, null: false
      t.float :temp_min, null: false
      t.integer :humidity, null: false
      t.string :description, null: false
      t.text :alert

      t.timestamps
    end
    add_index :weathers, [:city_id, :date_time], unique: true
  end
end
