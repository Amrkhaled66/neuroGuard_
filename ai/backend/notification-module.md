we want to create this table for notification modal 
Table notifications {
  id int [pk, increment]
  user_id int [not null, ref: >patients.id ]
  title varchar
  message text
  is_read boolean [default: false]
}

create route for creating new notification only doctor will enable to do that 

create another routes to finish the notifitcans for use and we want to paginate it 

create a router for the patient to make it as read or not
and we want to know create_at and read_at to calc the avg response time 


in the route that return the all notification paginated we want to return two states 
avg response time 
Patient Response Rate