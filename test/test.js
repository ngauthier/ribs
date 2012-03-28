var fs = require('fs'),
    _ = require('underscore')

var files = _(fs.readdirSync('test')).select(function(file) { return file.match(/_test.js$/) })

var TestResult = function(attributes) {
  this._file = attributes.file
  this._passed = attributes.passed
  this._exception = attributes.exception
}
TestResult.prototype = {
  report: function() {
    console.error("["+this.file()+"]:", this.stack())
  },
  file: function() {
    return this._file
  },
  stack: function() {
    return this._exception.stack
  },
  failure: function() {
    return this._exception && this._exception.name === 'AssertionError'
  },
  passed: function() {
    return this._passed
  }
}

var TestCase = function(file) {
  this.file = file
}
TestCase.prototype = {
  run: function() {
    var results = {file: this.file};
    try {
      require('./'+this.file)
      results.passed = true
    } catch(e) {
      results.passed = false
      results.exception = e
    }
    return new TestResult(results)
  }
}

var TestSuite = function(files) {
  this.files = files
  this.results = []
}
TestSuite.prototype = {
  run: function() {
    _(this.files).chain().map(function(file) {
      return new TestCase(file)
    }).each(this.runTestCase, this)
    this.finalReport()
  },
  runTestCase: function(testCase) {
    result = testCase.run()
    this.results.push(result)
    this.statusReport(result)
  },
  statusReport: function(result) {
    if (result.passed()) {
      process.stdout.write('.')
    } else {
      if (result.failure()) {
        process.stdout.write('F')
      } else {
        process.stdout.write('E')
      }
    }
  },
  finalReport: function() {
    process.stdout.write("\n")
    _(this.results).each(this.reportError, this)
  },
  reportError: function(result) {
    if (!result.passed()) {
      process.stdout.write("\n" + result.file() + ": " + result.stack() + "\n")
    }
  }
}

var suite = new TestSuite(files)
process.exit(suite.run())
