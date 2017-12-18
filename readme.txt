Information Architecture: Collaboration Map version 1.5 12/18/2017

Website can be seen at: demo.organicarchitecture.info

TO DO NOTES

November 28, 2017	The Realtime API is no longer available for new projects. Projects which accessed the Realtime API prior to November 28, 2017 continue to function. All new projects that attempt to access the Realtime API will fail after that time.
December 11, 2018	Realtime API documents become read-only, and attempts to modify document contents using the API fail.
January 15, 2019	The Realtime API is shut down. You can still export Realtime document data.

Google recommends migration to firestore, but says you can use any other database storage. Migration will require writing export and import code to use Realtime collaborative document in new storage. Will also have to rewrite authentication for firestore, current authentication is oauth for google.


APIS USED

vis.js (library for canvas elements)

google drive api
google drive share api
google picker api
google realtime api
google realtime-client-utils.js (utility for authentication, creating, and saving files)


SIMPLE WEBSITE USAGE STEPS

Creating a file
1. Click create file, insert name, if no name is inserted, it will create with default name of Untitled.

Deleting a file
1. You can only delete files through google drive

Opening a file
1. Opening a file will show only files created from this application

Adding a Topic
1. Click edit and then click add topic to add a main topic.
2. Click add topic and then click on main topic to add a sub topic.
3. Click add topic and then click on the canvas to add another main topic.
4. Only required fields are name and category

Adding a Relationship
1. Relationships are automatically added when you add a topic to another topic.

Editing a Topic/Relationship
1. Click on Topic or Relationship and then click edit to edit selected.
2. Click once Topic or Relationship to show form information.
3. Forms are realtime, autosaves and pushes to canvas elements on input.

Deleting a Topic
1. Deleting a topic will popup an alert(will popup alert)
2. Deleting a topic that has subtopics will delete all subtopics along with it(will popup alert)

Deleting an Edge
1. Cannot delete an edge due to issues with how edges work with library and hierarchical layout


