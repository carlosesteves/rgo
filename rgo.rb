require 'sinatra'
require 'json'
require 'sinatra/jsonp'
require 'erb'
require File.dirname(__FILE__) + '/commons/commons.rb'
require File.dirname(__FILE__) + '/commons/settings.rb'
require 'sinatra/base'
require 'sinatra/assetpack'

def load_config
  Settings.load!
  puts "Load config file"
end

class RGO < Sinatra::Application
  set :root, File.dirname(__FILE__) # You must set app root

  register Sinatra::AssetPack

  assets do

    # The second parameter defines where the compressed version will be served.
    # (Note: that parameter is optional, AssetPack will figure it out.)
    js :app, [
        '/js/*.js'
    ]

    css :application, [
        '/css/style.css'
    ]

    js_compression  :jsmin    # :jsmin | :yui | :closure | :uglify
    css_compression :simple   # :simple | :sass | :yui | :sqwish
  end

  load_config
end

require_relative 'routes/init'
