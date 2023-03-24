#!/usr/bin/sh

for filename in $(find ./src -name '*assert.ts')
do
  echo "a ${filename}"
  yarn ts-node "${filename}"
done
