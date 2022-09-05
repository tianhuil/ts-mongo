#!/usr/bin/sh

for filename in ./src/**/*assert.ts
do
  echo "a ${filename}"
  yarn ts-node "${filename}"
done
