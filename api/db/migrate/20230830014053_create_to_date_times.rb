class CreateToDateTimes < ActiveRecord::Migration[7.0]
  def change
    create_table :to_date_times do |t|
      t.datetime :date_time, null: false

      t.timestamps
    end
  end
end
