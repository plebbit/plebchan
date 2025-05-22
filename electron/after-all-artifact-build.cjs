const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('../package.json');
const rootPath = path.resolve(__dirname, '..');
const distFolderPath = path.resolve(rootPath, 'dist');

function addPortableToPortableExecutableFileName() {
  const files = fs.readdirSync(distFolderPath);
  for (const file of files) {
    if (file.endsWith('.exe') && !file.match('Setup')) {
      const filePath = path.resolve(distFolderPath, file);
      const renamedFilePath = path.resolve(distFolderPath, file.replace('plebchan', 'plebchan Portable'));
      fs.moveSync(filePath, renamedFilePath);
    }
  }
}

function createHtmlArchive() {
  if (process.platform !== 'linux') {
    return;
  }
  const zipBinPath = path.resolve(rootPath, 'node_modules', '7zip-bin', 'linux', 'x64', '7za');
  const plebchanHtmlFolderName = `plebchan-html-${packageJson.version}`;
  const outputFile = path.resolve(distFolderPath, `${plebchanHtmlFolderName}.zip`);
  const inputFolder = path.resolve(rootPath, 'build');
  try {
    execSync(`${zipBinPath} a ${outputFile} ${inputFolder}`);
    execSync(`${zipBinPath} rn -r ${outputFile} build ${plebchanHtmlFolderName}`);
  } catch (e) {
    console.error('electron build createHtmlArchive error:', e);
  }
}

module.exports = async function afterAllArtifactBuild(buildResult) {
  addPortableToPortableExecutableFileName();
  createHtmlArchive();
};