DISPLAY = $(wildcard src/display/*.ts)
OUTFILES = $(patsubst src/display/%.ts,build/%.js,$(DISPLAY))

all:
	npx webpack --mode development

zip:
	npx webpack --mode production
	@rm -rf riichi_zip
	mkdir riichi_zip
	cp -r build riichi_zip
	cp index.html riichi_zip
	cp -r img riichi_zip
	zip -r riichi.zip riichi_zip
	@rm -r riichi_zip

clean:
	rm -rf build/
	rm -f riichi.zip

hard-clean:
	rm -rf build/
	rm -rf node_modules/
	rm -f package-lock.json
	rm -f richi.zip
