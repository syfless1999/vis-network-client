const path = require('path');
const { readFileSync } = require('fs');
const { override, fixBabelImports, addWebpackAlias, addLessLoader } = require('customize-cra');

const theme = require("./src/config/antd-theme.json");
const webpackAliasConfig = parseAliasPath();

module.exports = override(
  // add alias path config
  addWebpackAlias(webpackAliasConfig),
  // DIY antd theme color
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: theme,
    },
  }),
  // antd demand loading
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
);


function parseAliasPath() {
  const json = JSON.parse(readFileSync(path.resolve(__dirname, './tsconfig.paths.json')));
  const paths = json.compilerOptions.paths;

  for (const key in paths) {
    if (Object.hasOwnProperty.call(paths, key)) {
      const pathArr = paths[key];
      paths[key] = path.resolve(__dirname, pathArr[0]);
    }
  }
  return paths;
}