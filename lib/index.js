const minify = require('html-minifier').minify;
const { FileBlob } = require('@now/build-utils');
const fs = require('fs-extra');

exports.version = 2;

exports.analyze = ({files, entrypoint}) => {
  return files[entrypoint].digest
}

exports.build = async ({files, entrypoint, config}) => {
  const data = await fs.readFile(files[entrypoint].fsPath);
  const options = Object.assign({}, config || {});
  const minified = minify(data.toString(), options);
  const result = new FileBlob({ data: minified });

  return {
    output: {
      [entrypoint]: result
    },
    watch: [],
    routes: {}
  }
}
