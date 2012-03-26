{Collection} = require 'backbone'

class FilteredCollection extends Collection
  initialize: (models, options)->
    this.collection = options.collection
    this.collection.on 'all', this.update

  update: =>
    this.reset(this.collection.select(this.filter))

module.exports = FilteredCollection
