# VSVIZ [![Build Status](https://travis-ci.org/purpose233/vsviz.svg?branch=master)](https://travis-ci.org/purpose233/vsviz) [![Coverage Status](https://coveralls.io/repos/github/purpose233/vsviz/badge.svg?branch=dev)](https://coveralls.io/github/purpose233/vsviz?branch=dev)
VSVIZ is a framework for auto collecting & visualizing data based on Web.

~~Learn more in the Docs~~ (coming soon).

## Tools
VSVIZ contains the several submodules:
 - @vsviz/builder: handling with the binary package data;
 - @vsviz/server: running on the server, collecting meta data and delivering to clients;
 - @vsviz/ui: providing several OOTB react components and some react components whose features could be expanded;
 - @vsviz/cli: providing with several useful tools(still developing).

## Quick Start
For now, VSVIZ provides with one demo to show the basic functions.
And you need npm & node to run them.

**basic demo**: 

Basic demo shows how to collect video data from camera and display it on client.

```bash
$ cd example/basic

# build
$ npm install
$ npm run buildServer
$ npm run buildClient

# run server, it will listen on port 8080
$ npm run runServer

# send data from source
$ python3 ./src/dataSrc00.py meta
$ python3 ./src/dataSrc00.py data
```
