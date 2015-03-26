# Instagramm Real-time Map

Uses the Instagramm Real-time API, Node.js with an Express Server, Backbone JS in the Frontend.

Demo: http://instagram-real-time-map.herokuapp.com

## Installation (Local)

    $ npm install

## Run

### Start Server
    $ node server

### Start Client Asset Building
    $ grunt serve

### Start ngrok
    $ ngrok localhost:5000

Then, update the URLs in the __server.js__ file and in online in the __Instagramm Client Manager__ with the public URL provided by ngrok i.e. http://19f17d32.ngrok.com

Instagram Client Manager: https://instagram.com/developer/clients/manage


## Ressources

### Instagram API
- https://instagram.com/developer/realtime/

### Backbone JS with Google Maps
- http://natehunzaker.com/javascript/backbone/2011/02/11/learning-backbonejs-chapter-1-a-quick-overview.html

## Real Time Example using Istagram and Node
- http://www.bymichaellancaster.com/blog/how-i-built-lollagram-lollapalooza-instagram-real-time-api/
- https://github.com/weblancaster/instagram-real-time

## Similar projects
- http://www.jamietsao.com/blog/2011/3/23/mapstagram-mapping-instagram-photos-in-real-time.html


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

### Set the following config vars

    NODE_ENV: production
    BUILDPACK_URL: https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git

### Debugging

     $ heroku logs --app instagram-real-time-map
