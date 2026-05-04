create those two schemas 
and create just the rescourse for both and don't make any logic 

Table sessions {
  id int [pk, increment]
  patient_id int [not null, ref: > patients.id]
  file_path varchar
  duration int
  status varchar
  note text
  channel_count int
}

Table seizure_events {
  id int [pk, increment]
  session_id int [not null, ref: > sessions.id]
  onset_side varchar
  onset_region varchar
  start_time datetime
  end_time datetime
}