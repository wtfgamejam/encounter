go: clean json

json:
	./bin/convert.py sets/csv/armor.csv > www/data/armor.json
	./bin/convert.py sets/csv/magic.csv > www/data/magic.json
	./bin/convert.py sets/csv/weapons.csv > www/data/weapons.json
	./bin/convert.py sets/csv/monsters.csv > www/data/monsters.json

clean:
	rm -f www/data/*

run:
	python -M
