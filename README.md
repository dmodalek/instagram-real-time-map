# Instagramm Real-time Map

Show Instagrams of a certain #Hashtag on a Map, using the Instagramm Real-time API, Node.js with an Express Server and Backbone JS in the Frontend.

Demo: http://instagram-real-time-map.herokuapp.com

### Features
- Real-Time Instagram API with Socket.io
- Express 4 Server
- Heroku Deployment

## Installation

Install node modules

	$ npm install

Create .env file and set values

	$ cp .env-sample .env


## Run

### Start ngrok
	$ ngrok localhost:3000

### Start Server
	$ npm start

### Start Client Asset Building
	$ grunt start

Then, update the URLs in the __.env__ file and in online in the __Instagramm Client Manager__ with the public URL provided by ngrok i.e. http://19f17d32.ngrok.com

Instagram Client Manager: https://instagram.com/developer/clients/manage

Open your Browser at http://localhost:3000

## Yeoman Generator

Based on https://github.com/yeoman/generator-backbone

	$ yo backbone:router <router>
	$ yo backbone:collection <collection>
	$ yo backbone:model <model>
	$ yo backbone:view <view>


## Heroku Deployment

### Process

1. Heroku runs __npm install__ which installs the node modules. 
2. After that, the __postinstall__ from the package.json file hook is called, which installs bower components.
3. A custom Heroku Build Pack is run in order to run Grunt

### Hints

- Heroku installs Grunt CLI als local module. Therefore we have to call Grunt with a relative path, see package.json

### Set the Env vars

Create and set the same Env variables that are in your local .env file. Plus, add the following Env var:

	BUILDPACK_URL: https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git

### Debugging

	 $ heroku logs --app instagram-real-time-map


## Ressources

Cats of Instagram
- https://github.com/rethinkdb/cats-of-instagram

Backbone Module Architecture 
- http://bocoup.com/weblog/organizing-your-backbone-js-application-with-modules/

Socket.io Docs
- http://socket.io/docs/#using-with-express-3/4

Instagram API
- https://instagram.com/developer/realtime/

Backbone JS with Google Maps
- http://natehunzaker.com/javascript/backbone/2011/02/11/learning-backbonejs-chapter-1-a-quick-overview.html

Real Time Example using Istagram and Node
- http://www.bymichaellancaster.com/blog/how-i-built-lollagram-lollapalooza-instagram-real-time-api/
- https://github.com/weblancaster/instagram-real-time

Leaflet Project and Plugins
- Leaflet: http://leafletjs.com/
- Cluster Plugin: https://github.com/Leaflet/Leaflet.markercluster
- Instagram and Cluster Plugin: http://blog.thematicmapping.org/2014/06/showing-instagram-photos-and-videos-on.html
