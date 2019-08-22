const path = require('path');
const {glob} = require('@now/build-utils');
const fs = require('fs-extra');

function runAnalyze(wrapper, context) {
  if (wrapper.analyze) {
    return wrapper.analyze(context);
  }

  return 'this-is-a-fake-analyze-result-from-default-analyze';
}

it('Should build', async () => {
  const inputPath = path.join(__dirname, 'fixture');
  const inputFiles = await glob('**', inputPath)

  // console.log(inputFiles);

  const nowJsonRef = inputFiles['now.json'];
  const nowJson = require(nowJsonRef.fsPath);
  const build = nowJson.builds[0];
  const entrypoint = build.src.replace(/^\//, '');

  inputFiles[entrypoint].digest = 'ep-default';

  const wrapper = require(build.use);

  const analyzeResult = runAnalyze(wrapper, {
    files: inputFiles,
    entrypoint,
    config: build.config
  })

  const workPath = path.join(__dirname, '../../.tmp', path.basename(inputPath));
  await fs.remove(workPath);
  await fs.mkdirs(workPath);

  const buildResult = await wrapper.build({
    files: inputFiles,
    entrypoint,
    workPath,
    config: build.config
  });

  const cacheResult = await wrapper.prepareCache({
    cachePath: path.join(workPath, '.cache'),
    workPath,
    entrypoint
  });

  expect(1).toEqual(1)
})
