class CreateWeathers < ActiveRecord::Migration[7.0]
  def change
    create_table :weathers do |t|
      t.string :weather
      t.float :temp
      t.float :temp_max
      t.float :temp_min
      t.integer :humidity
      t.string :description
      t.text :alert

      t.timestamps
    end
  end
end
