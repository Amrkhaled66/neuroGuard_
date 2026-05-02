- create the medication tab and add the route in src/app/router router.tsx and appRouter.tsx under the patient pages

- add the tab in the patient in the PatientTabs.tsx
- make modal called Add New Medication Modal 
- in this modal we want to fetch the to fetch all the medication for the doctor and make it in DropDownMenu.tsx (learn from AddPatientModal.tsx)
- we want to add button Add New Medication and use The Button.tsx with the primary variant and this button open the modal
- use Table.tsx and make a components called PatientMedication 
in this table we we want to make the table with the props of the medication and make column for action and add edit button 
this edit button open the modal of medication and the doctor can edit the infos 


ensure you follow our feature-based structure 
be sure all the api calls with the backend be with services and with queries 
for the form use react hook form & zod form implementation
  