var Assert = require('assert'),
    ok = Assert.ok,
    eq = Assert.equal,
    Backbone = require('backbone'),
    Ribs = require('../ribs')

var Document = Backbone.Model.extend()

var book = new Document({
  length: 350
})

var article = new Document({
  length: 2
})

var Documents = Backbone.Collection.extend({
  model: Document
})

var documents = new Documents()

var LongDocuments = Ribs.FilteredCollection.extend({
  filter: function(model) { return model.get('length') > 100 }
})

var longDocuments = new LongDocuments(null, {collection: documents})

eq(0, documents.size())
eq(0, longDocuments.size())

documents.add(article)

eq(1, documents.size())
eq(0, longDocuments.size())

documents.add(book)

eq(2, documents.size())
eq(1, longDocuments.size())

eq(book, longDocuments.first())
