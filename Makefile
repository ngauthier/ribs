PATH := node_modules/.bin:${PATH}

all: ribs.js

ribs.js: src/ribs.coffee
	@find src -name '*.coffee' | xargs coffee -c -o .

.PHONY : test
test: 
	@find test -name '*_test.coffee' | xargs -n 1 -t coffee

clean:
	@rm ribs.js
