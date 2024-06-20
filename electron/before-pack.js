// download the ipfs binaries before building the electron clients

import fs from 'fs-extra';
import ProgressBar from 'progress';
import https from 'https';
import decompress from 'decompress';
import path from 'path';
import { fileURLToPath } from 'url';
const ipfsClientsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin');
const ipfsClientWindowsPath = path.join(ipfsClientsPath, 'win');
const ipfsClientMacPath = path.join(ipfsClientsPath, 'mac');
const ipfsClientLinuxPath = path.join(ipfsClientsPath, 'linux');

// plebbit kubu download links https://github.com/plebbit/kubo/releases
// const ipfsClientVersion = '0.20.0'
// const ipfsClientWindowsUrl = `https://github.com/plebbit/kubo/releases/download/v${ipfsClientVersion}/ipfs-windows-amd64`
// const ipfsClientMacUrl = `https://github.com/plebbit/kubo/releases/download/v${ipfsClientVersion}/ipfs-darwin-amd64`
// const ipfsClientLinuxPUrl = `https://github.com/plebbit/kubo/releases/download/v${ipfsClientVersion}/ipfs-linux-amd64`

// official kubo download links https://docs.ipfs.tech/install/command-line/#install-official-binary-distributions
const ipfsClientVersion = '0.28.0';
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
      // handle redirects
      if (res.statusCode == 302) {
        resolve(downloadWithProgress(res.headers.location));
        return;
      }

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

// plebbit kubo downloads dont need to be extracted
const download = async (url, destinationPath) => {
  let binName = 'ipfs';
  if (destinationPath.endsWith('win')) {
    binName += '.exe';
  }
  const binPath = path.join(destinationPath, binName);
  // already downloaded, don't download again
  if (fs.pathExistsSync(binPath)) {
    return;
  }
  const split = url.split('/');
  const fileName = split[split.length - 1];
  const dowloadPath = path.join(destinationPath, fileName);
  const file = await downloadWithProgress(url);
  fs.ensureDirSync(destinationPath);
  await fs.writeFile(binPath, file);
};

// official kubo downloads need to be extracted
const downloadAndExtract = async (url, destinationPath) => {
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

export const downloadIpfsClients = async () => {
  await downloadAndExtract(ipfsClientWindowsUrl, ipfsClientWindowsPath);
  await downloadAndExtract(ipfsClientMacUrl, ipfsClientMacPath);
  await downloadAndExtract(ipfsClientLinuxPUrl, ipfsClientLinuxPath);
};

export default async (context) => {
  await downloadIpfsClients();
};
