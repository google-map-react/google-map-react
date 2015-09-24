#!/bin/sh
babel=`npm bin`/babel
webpack=`npm bin`/webpack
build_dir=lib

rm -rf $build_dir

$babel ./src -d $build_dir --ignore "__tests__" --loose all

NODE_ENV=production $webpack src/index.js $build_dir/umd/GoogleMapReact.js
NODE_ENV=production $webpack -p src/index.js $build_dir/umd/GoogleMapReact.min.js

#echo "gzipped, the global build is `gzip -c $build_dir/umd/GoogleMapReact.min.js | wc -c | sed -e 's/^[[:space:]]*//'` bytes"
