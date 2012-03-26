(function() {
  var Backbone, Ribs;

  Backbone = this.Backbone || require('backbone');

  Ribs = exports || (this.Ribs = {});

  Ribs.FilteredCollection = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.collection = options.collection;
      return this.collection.on('all', this.update, this);
    },
    update: function() {
      return this.reset(this.collection.select(this.filter));
    }
  });

}).call(this);
