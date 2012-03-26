{ok, equal, deepEqual} = require 'assert'
{Model, Collection} = require 'backbone'
{FilteredCollection} = require '../src/ribs'

class Document extends Model

book = new Document
  length : 350

article = new Document
  length : 2

class Documents extends Collection
  model: Document

documents = new Documents

class LongDocuments extends FilteredCollection
  filter: (model) ->
    model.get('length') > 100

longDocuments = new LongDocuments null, collection: documents

ok documents.size() is 0
ok longDocuments.size() is 0

documents.add article

ok documents.size() is 1
ok longDocuments.size() is 0

documents.add book

ok documents.size() is 2

ok longDocuments.size() is 1

equal book, longDocuments.first()

console.info 'PASSED', __filename
