#RGo#

Build radiator for Thoughtworks Go written in ruby.

## Configuration
   - Set config/pipelines.yml with the path to Go CC XML url
   - Set the pipelines that you wish to monitor
   - Set the project name

Example:

    url: 'http://my-dummy-server.com/go/cctray.xml'
    project_name: 'Dummy project'
    pipelines:
        - name: 'dummy :: build'
        - name: 'still-dummy :: deploy'

## Usage

Checkout the project and run bundle install

    $ bundle install

Run the app

    $ rackup config.ru

## Deployment

The app has the basic configuration for deployment to Cloudfoundry (check example manifest.yml)

Example:

    $ cf login -a http://my-dummy-cf-installation -u dummy -p dummy-password -s dummy-space
    $ cf deploy


## License

This program is distributed under the terms of the GNU General Public License (or the Lesser GPL).