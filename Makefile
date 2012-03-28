PATH := node_modules/.bin:${PATH}
VPATH = src

.PHONY : test
test: 
	@node test/test.js
