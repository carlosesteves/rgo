require 'net/http'
require 'uri'
require 'json'

def open(url)
  Net::HTTP.get(URI.parse(url))
end