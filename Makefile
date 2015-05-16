go: clean json

json:
	./bin/convert.py sets/csv/armor.csv > sets/json/armor.json
	cat sets/json/armor.json
	./bin/convert.py sets/csv/magic.csv > sets/json/magic.json
	cat sets/json/magic.json
	./bin/convert.py sets/csv/weapons.csv > sets/json/weapons.json
	cat sets/json/weapons.json
	./bin/convert.py sets/csv/monsters.csv > sets/json/monsters.json
	cat sets/json/monsters.json

clean:
	rm -f sets/json/*
