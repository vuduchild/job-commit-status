#!/bin/bash
set -x
rm -rf dist
npx ncc build src/on-main.js -o dist/main --license licenses.txt
npx ncc build src/on-post.js -o dist/post --license licenses.txt
git add dist