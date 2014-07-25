require_relative '../commons/commons'
require 'nokogiri'
require File.dirname(__FILE__) + '/../commons/settings.rb'

module Radiator
  include Settings

  def self.render_radiator
    url = Settings._settings[:url]
    page_content = open(url)
    html_doc = Nokogiri::HTML(page_content)
    arr_projects_in_settings = Settings._settings[:pipelines].map { |pipeline| pipeline['name'] unless pipeline['name'].nil? }

    return html_doc.xpath('//project').map { |node| node if(arr_projects_in_settings.include?(node.attr('name'))) }.compact
  end
end