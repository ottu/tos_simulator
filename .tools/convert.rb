#! /usr/bin/ruby

require 'json'

json = open('options.json') { |io| JSON.load(io) }

converted = JSON.parse("{\"options\": []}")

json["options"].each { |opt|
    conv = JSON.parse("{}")
    conv["id"] = opt["id"]
    conv["name"] = opt["name"]
    conv["hair"] = {"min" => opt["min"], "max" => opt["max"]}
    converted["options"].push(conv)
}

puts JSON.pretty_generate(converted)
