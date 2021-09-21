Feature:Show/Hide events details

Scenario: an event element is collapsed by default 
Given user has not tried to select the event element 
When the user selects the element with their mouse
Then the user should be able to see the details of the event 

Scenario: User can expand an event to see its details
Given the user has selected the event element available to click 
When the user does click for more details
Then the user will be given an expanded view of the details of said event  

Scenario: User can collapse an event to hide its details
Given the user is done looking at expanded information
When the user selects the collapse button
Then the user will no longer have the event’s details shown to view 