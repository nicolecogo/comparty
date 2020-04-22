### Comparty

This is an app that allows people to play songs together. The playback is synchronized between users, each listening in its own device, and every user can control and manipulate the playlist.

# Home page
![wireframe](readme-images/Homepage.jpg)

# User page
![wireframe](readme-images/Userpage.jpg)

The app is comprised of a back-end and a front-end, 'server' and 'client' folders, respectively.
The back-end was developed with Node Express, and the front-end in React.
The Spotify Web API was used to receive information on the playlist and the playback, and to send commands.
To enable playing the songs in the browser, we used the Spotify Web Player.
Through the framework Socket.io it is possible to send information on playback and playlists modifications and status from one client to the other (through the server).


## Running the app

# Installing dependencies

Run ```npm install``` to install dependencies.

# Configurations

Both server and client need configuration files .env in its corresponding folders. An example.env configuration file is available in each folder with instructions of the required variables (they should be renamed to .env).

# Starting server

To start the server go to './server' folder and run ```npm start```

# Starting client

To start the client go to './client' folder and run ```npm start```. A browser should open with the app.


## Important

A Spotify Premium account is necessary in order to use the app's features.