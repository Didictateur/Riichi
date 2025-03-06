DISPLAY = $(wildcard src/display/*.ts)
OUTFILES = $(patsubst src/display/%.ts,build/%.js,$(DISPLAY))

all:
	npx webpack --mode production

clean:
	rm -rf build/*
