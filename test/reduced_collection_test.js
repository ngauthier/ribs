var Assert = require('assert'),
    ok = Assert.ok,
    eq = Assert.equal,
    deq = Assert.deepEqual,
    Backbone = require('backbone'),
    _ = require('underscore'),
    Ribs = require('../ribs')

var Document = Backbone.Model.extend()
var Documents = Backbone.Collection.extend({
  model: Document
})

var documents = new Documents()

var DocumentTopic = Backbone.Model.extend()
var DocumentTopics = Ribs.ReducedCollection.extend({
  model: DocumentTopic,
  reduce: function(documents) {
    return documents.chain().map(function(doc) {
      return doc.get('topic')
    }, this).uniq().map(function(topic) {
      return new this.model({topic: topic}) 
    }, this).value()
  }
})

var documentTopics = new DocumentTopics(null, {
  collection: documents
})

eq(0, documents.size())
eq(0, documentTopics.size())

_(['sports', 'sports', 'plants', 'science', 'science']).each(function(topic) {
  documents.add({topic: topic})
})

eq(5, documents.size())
eq(3, documentTopics.size())

deq(['sports', 'plants', 'science'], documentTopics.map(function(dt) { return dt.get('topic') }))
