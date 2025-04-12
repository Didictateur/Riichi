TESTS = $(wildcard build/test*)

all:
	npx webpack --mode production

dev:
	npx webpack --mode development

zip:
	npx webpack --mode production
	@rm -rf riichi
	mkdir riichi
	cp -r build riichi
	cp index.html riichi
	cp -r img riichi
	zip -r riichi.zip riichi
	@rm -r riichi

clean:
	rm -rf build/
	rm -f riichi.zip

hard-clean:
	rm -rf build/
	rm -rf node_modules/
	rm -f package-lock.json
	rm -f richi.zip
