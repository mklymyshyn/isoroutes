
.PHONY: build

MAIN_FILES=hello.js

run:
	cd app && NODE_PATH=../node_modules node --harmony server

dev:
	webpack -d

watch:
	webpack --watch

build:
	webpack -p -d

