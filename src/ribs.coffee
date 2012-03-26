Backbone = this.Backbone or require 'backbone'
Ribs     = exports       or this.Ribs = {}

###
A FilteredCollection takes a collection and
presents only the models in that collection
that pass the filter given.
###
Ribs.FilteredCollection = Backbone.Collection.extend(
  initialize: (models, options)->
    this.collection = options.collection
    this.collection.on 'all', this.update, this

  update: ->
    this.reset(this.collection.select(this.filter))
)

