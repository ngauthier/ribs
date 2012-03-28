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
  error: function() {
    return !this.passed() && !this.failure()
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
    console.time('Suite')
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
      process.stdout.write(this.green('.'))
    } else {
      if (result.failure()) {
        process.stdout.write(this.yellow('F'))
      } else {
        process.stdout.write(this.red('E'))
      }
    }
  },
  finalReport: function() {
    var passed = _(this.results).select(function(r) {
      return r.passed()
    })
    var failed = _(this.results).select(function(r) {
      return r.failure()
    })
    var errored = _(this.results).select(function(r) {
      return r.error()
    })

    process.stdout.write("\n")
    console.timeEnd('Suite')
    _(this.results).each(this.reportError, this)

    process.stdout.write("\n")
    process.stdout.write(this.green(passed.length+" Pass  "))
    process.stdout.write(this.yellow(failed.length+" Fail  "))
    process.stdout.write(this.red(errored.length+" Error  "))
    process.stdout.write(this.results.length+" Total")
    process.stdout.write("\n")
  },
  reportError: function(result) {
    if (!result.passed()) {
      var method = result.failure() ? this.yellow : this.red
      process.stdout.write(method("\n" + result.file() + ": " + result.stack() + "\n"))
    }
  },
  green: function(s) {
    return "\033[0;32m"+s+"\033[0m"
  },
  yellow: function(s) {
    return "\033[0;33m"+s+"\033[0m"
  },
  red: function(s) {
    return "\033[0;31m"+s+"\033[0m"
  }
}

var suite = new TestSuite(files)
process.exit(suite.run())
