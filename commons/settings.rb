require 'yaml'
require 'active_support/hash_with_indifferent_access'

module Settings
  extend self

  @_settings = {}
  attr_reader :_settings

  def load!(filename = File.dirname(__FILE__) + '/../config/pipelines.yml', options = {})
    @_settings = {}
    newsets = YAML::load_file(filename)
    recursive_symbolize_keys!(newsets)
    newsets = newsets[options[:env].to_sym] if \
                                               options[:env] && \
                                               newsets[options[:env].to_sym]

    deep_merge!(@_settings, newsets)
  end

  def deep_merge!(target, data)
    merger = proc{|key, v1, v2|
      Hash === v1 && Hash === v2 ? v1.merge(v2, &merger) : v2 }
    target.merge! data, &merger
  end

  def method_missing(name, *args, &block)
    @_settings[name.to_s] ||
        fail(NoMethodError, "unknown configuration root #{name}", caller)
  end

  def recursive_symbolize_keys! hash
    hash.symbolize_keys!
    hash.values.select{|v| v.is_a? Hash}.each{|h| recursive_symbolize_keys!(h)}
  end
end