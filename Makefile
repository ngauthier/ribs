PATH := node_modules/.bin:${PATH}
VPATH = src

ribs.js: ribs.coffee
	@find src -name '*.coffee' | xargs coffee -c -o .

.PHONY : test
test: npm
	@find test -name '*_test.coffee' | xargs -n 1 -t coffee

.PHONY : clean
clean:
	@rm ribs.js

npm: package.json
	npm install
