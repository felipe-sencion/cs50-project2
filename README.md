# Project 2

Web Programming with Python and JavaScript

The Flack project consist of a chat-like application between users using several channels. The project is divided into different files, each of which are described below.

application.py
It contains the back-end for the application. It's implemented with Python and Flask using the SoketIO module for the communication between the back and front end. The server listens for the messages "create channel" and "post message" and reacts accordingly to each one of them. 

The messages are stored in a dictionary where the channel names are the keys ant as values it contains a list of messages for every channel. Only the most recent 100 messages are stored per channel.

index.html
Defines the containers and elements the will display messages and forms. Its an extension of layout.html

layout.html
Defines the general structure of a web page. Includes the bootstrap's link and references to css and javascript files needed for the project.

index.js
Defines the front-end behavior of the project. It contains all the events the are handled by Flack, such as clicking on the forms' buttons, selecting and creating a new channel and also contains some control over the animations defined in style.css. Within this file a websocket is created to stablish communication with the server and then preocess the response in order to display it to the final user. The use of local storage is implemented in this file. When a user leaves the page his/her name is remembered so when they come back they can still see the messages and also the channel they were in.

style.css
Defines the styling for some of the visual elements and also the animmation needed to indicate that a new message has come.

As a personal touch I added an animation when a new message has arrived and its for a channel that is not the current one for the user. I also added a bootstrap list for the channels.
