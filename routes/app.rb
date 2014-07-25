require_relative '../lib/radiator'

class RGO < Sinatra::Application
  Settings.load!

  get '/' do
    @radiator_data = Radiator.render_radiator
    @project_name = Settings._settings[:project_name]
    erb :radiator
  end
end