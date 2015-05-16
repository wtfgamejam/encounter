#!/usr/bin/env python
import csv
import json
import sys
import os

group = sys.argv[1]
group = os.path.basename(group)
group = group.split('.csv')[0]

csvfile = open(sys.argv[1], 'r')

reader = csv.DictReader(csvfile, delimiter=',')
out = json.dumps([row for row in reader])

print out
