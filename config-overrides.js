const path = require('path');
const { readFileSync } = require('fs');

module.exports = function override(config) {
  const json = JSON.parse(readFileSync(path.resolve(__dirname, './tsconfig.paths.json')));
  const paths = json.compilerOptions.paths;

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
    },
  };
  for (const key in paths) {
    if (Object.hasOwnProperty.call(paths, key)) {
      const pathArr = paths[key];
      config.resolve.alias[key] = path.resolve(__dirname, pathArr[0]);
    }
  }
  return config;
};