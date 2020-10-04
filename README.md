# Screeps storage 

This is a module for Screeps standalone server. This module provides a lokijs solution for the screeps game server.

## Preparing working environments

Since the modules needed for most of the development environments are quite large, they are not included in the git repository. Please run
	```npm install```
to install the necissary components

## Building

To build the application for use, run 
	```npm run-script build```
and the built js files will reside in the local dist folder

## Publishing to NPM

To publish to NPM, run the build script, then run:
	```npm run-script publish```
to publish the output js and ts definition files to npm