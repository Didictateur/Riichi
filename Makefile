DISPLAY = $(wildcard src/display/*.ts)
OUTFILES = $(patsubst src/display/%.ts,build/%.js,$(DISPLAY))

all:
	npx webpack --mode development

clean:
	rm -rf build/
