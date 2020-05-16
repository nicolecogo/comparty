# Comparty

Comparty is an app that allows people to listen to songs together. Through the app's web player, every user can control the shared playback (playing, pausing and skipping songs), while listening on their own devices. The shared playlist can also be modified by all users.

## Screenshots
#### Homepage
![wireframe](readme-images/Userpage.JPG)

#### Create/join party page
![wireframe](readme-images/Homepage.JPG)

## Getting started

A few things you have to take in consideration before using Comparty.

The repository contains both Comparty's [server](https://github.com/nicolecogo/comparty/tree/master/server) and [client](https://github.com/nicolecogo/comparty/tree/master/client). You'll need to install Comparty server first, and then set up Comparty client.

### Installation

#### Clone the repo
```
git clone https://github.com/nicolecogo/comparty
cd comparty
```

#### Setup server
1. Install dependencies
```
cd server
npm install
```
2. Setup configuration file
```
cp example.env .env
```
Comparty app is based on Spotify for accessing and playing songs. Since the server handles the authentication requests for logging into Spotify, you'll need to provide a Spotify Client ID aswell as a Client secret in the ```.env``` file.

<details><summary><b>Show instructions for getting Spotify credentials</b></summary>

1. Login to Spotify account and access your [developer's dashboard](https://developer.spotify.com/dashboard)
2. Click on <b>CREATE A CLIENT ID</b>
3. Enter Application Name and Application Description and then click <b>CREATE</b>. Your application is registered, and the app view opens.
4. Copy your <b>Client ID</b> and <b>Client Secret</b> and paste them to the ```.env``` file.
5. On the app view, click <b>Edit Settings</b> to update your <b>Redirect URIs</b>. Here you'll want to add the following URIs (unless you changed them in the ```.env``` file)
```
http://localhost/3001
http://localhost/3001/login
http://localhost/3001/login/callback
```

</details>
<br>

3. And you are set with the server! You can now run it with ```npm run```

#### Setup client
1. Install dependencies
```
cd client
npm install
```

2. Setup configuration file
```
cp example.env .env
```
For the client you'll also need to provide a Spotify Client ID aswell as a Client secret in the ```.env``` file. If you didn't follow these instructions for getting Spotify credentials, please do so now (this time, copy your <b>Client ID</b> and <b>Client Secret</b> and paste them to the ```.env``` file on the client).

3. You are set with the client and good to go! Just run ```npm run``` and a browser should open with the app. Since the idea here is to synchronize playbacks between at least two clients, just copy the URI in another browser and have fun!


## Built with

<b>Front-end</b>
* [React](https://reactjs.org/) - Javascript library for building user interfaces.

<b>Back-end</b>
* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment that executes JavaScript code outside of a web browser. Used to create the server.
* [Express](https://expressjs.com/) - Web Framework for Node.js.
* [Socket.io](https://socket.io/) - Javascript library that enables real-time, bidirectional and event-based communication. Applied for sending information on playback and playlists modifications and status from one client to the other (through the server).

<b>Services</b>
* [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - REST API that returns JSON metadata about music artists, albums, and tracks, directly from the Spotify Data Catalogue. Used to receive information on the playlist and the playback, and to send commands.
* [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/) - Client-side JavaScript library which allows the creation of a new player in Spotify Connect and play any audio track from Spotify in the browser via Encrypted Media Extensions.

<b>Important note:</b> A Spotify Premium account is required in order to use the app's features.

## Observations
It is a work in progress, there are still a lot of room for improvement and features that would be awesome to have implemented.


