// download the ipfs binaries before building the electron clients

const fs = require('fs-extra');
const ProgressBar = require('progress');
const https = require('https');
const decompress = require('decompress');
const path = require('path');
const ipfsClientsPath = path.join(__dirname, '..', 'bin');
const ipfsClientWindowsPath = path.join(ipfsClientsPath, 'win');
const ipfsClientMacPath = path.join(ipfsClientsPath, 'mac');
const ipfsClientLinuxPath = path.join(ipfsClientsPath, 'linux');

// download links https://docs.ipfs.io/install/command-line/#official-distributions
const ipfsClientVersion = '0.18.1';
const ipfsClientWindowsUrl = `https://dist.ipfs.io/kubo/v${ipfsClientVersion}/kubo_v${ipfsClientVersion}_windows-amd64.zip`;
const ipfsClientMacUrl = `https://dist.ipfs.io/kubo/v${ipfsClientVersion}/kubo_v${ipfsClientVersion}_darwin-amd64.tar.gz`;
const ipfsClientLinuxPUrl = `https://dist.ipfs.io/kubo/v${ipfsClientVersion}/kubo_v${ipfsClientVersion}_linux-amd64.tar.gz`;

const downloadWithProgress = (url) =>
  new Promise((resolve) => {
    const split = url.split('/');
    const fileName = split[split.length - 1];
    const chunks = [];
    const req = https.request(url);
    req.on('response', (res) => {
      const len = parseInt(res.headers['content-length'], 10);
      console.log();
      const bar = new ProgressBar(`  ${fileName} [:bar] :rate/bps :percent :etas`, {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: len,
      });
      res.on('data', (chunk) => {
        chunks.push(chunk);
        bar.tick(chunk.length);
      });
      res.on('end', () => {
        console.log('\n');
        resolve(Buffer.concat(chunks));
      });
    });
    req.end();
  });

const download = async (url, destinationPath) => {
  let binName = 'ipfs';
  if (destinationPath.endsWith('win')) {
    binName += '.exe';
  }
  const binPath = path.join(destinationPath, binName);
  if (fs.pathExistsSync(binPath)) {
    return;
  }
  const split = url.split('/');
  const fileName = split[split.length - 1];
  const dowloadPath = path.join(destinationPath, fileName);
  const file = await downloadWithProgress(url);
  fs.ensureDirSync(destinationPath);
  await fs.writeFile(dowloadPath, file);
  await decompress(dowloadPath, destinationPath);
  const extractedPath = path.join(destinationPath, 'kubo');
  const extractedBinPath = path.join(extractedPath, binName);
  fs.moveSync(extractedBinPath, binPath);
  fs.removeSync(extractedPath);
  fs.removeSync(dowloadPath);
};

const downloadIpfsClients = async () => {
  await download(ipfsClientWindowsUrl, ipfsClientWindowsPath);
  await download(ipfsClientMacUrl, ipfsClientMacPath);
  await download(ipfsClientLinuxPUrl, ipfsClientLinuxPath);
};

exports.default = async (context) => {
  await downloadIpfsClients();
};
