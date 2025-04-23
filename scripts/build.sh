#!/bin/bash
export PATH="$(npm bin):$PATH"
set -x
rm -rf dist
ncc build -m src/on-main.js -o dist/main --license licenses.txt
ncc build -m src/on-post.js -o dist/post --license licenses.txt
git add dist