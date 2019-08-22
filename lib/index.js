const htmlMinifier = require('html-minifier');
const { FileBlob } = require('@now/build-utils');

exports.version = 2;

exports.analyze = ({files, entrypoint}) => {
  return files[entrypoint].digest
}

exports.build = async ({files, entrypoint, config}) => {
  const stream = files[entrypoint].toStream();
  const options = Object.assign({}, config || {});
  const { data } = await FileBlob.fromStream({ stream });
  const content = data.toString();
  const minified = htmlMinifier(content, options);
  const result = new FileBlob({ data: minified });

  return {
    output: {
      [entrypoint]: result
    },
    watch: [],
    routes: {}
  }
}
