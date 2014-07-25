#RGo#

Build radiator for Thoughtworks Go written in ruby.

## Configuration
   - Edit config/pipelines.yml with the path to Go CC XML url
   - Set the pipelines that you wish to monitor
   - Set the project name

## Usage

Checkout the project and run bundle install

    $ bundle install

Run the app

    $ rackup config.ru

## Deployment

    The app has the basic configuration for deployment to Cloudfoundry (check manifest.yml)
