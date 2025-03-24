DISPLAY = $(wildcard src/display/*.ts)
OUTFILES = $(patsubst src/display/%.ts,build/%.js,$(DISPLAY))

all:
	npx webpack --mode development

clean:
	rm -rf build/

hard-clean:
	rm -rf build/
	rm -rf node_modules/
	rm -f package-lock.json
