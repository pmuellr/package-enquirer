#!/usr/bin/env bash

rm -rf build
mkdir -p build
make build-`node -p process.platform`-x64
