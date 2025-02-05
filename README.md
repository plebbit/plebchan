<img src="https://github.com/plebeius-eth/assets/blob/main/plebchan-logo.jpg" width="378" height="123">

_Telegram group for this repo https://t.me/plebchanreact_

_Web client https://plebchan.eth.limo_

# Plebchan

Plebchan is a serverless, adminless, decentralized 4chan alternative where any pleb can create and own unlimited boards. All data comes from the Plebbit protocol, it's all text including links from which media is embedded, shared peer-to-peer. Users do not need to register an account before participating in the community.

### How to create a board
In the plebbit protocol, a plebchan board is called a _subplebbit_. To run a subplebbit, you can currently choose between two options:

1. If you prefer to use a **GUI**, download the desktop version of the Seedit client, available for Windows, MacOS and Linux: [latest release](https://github.com/plebbit/seedit/releases/latest). Create a subplebbit using using the familiar old.reddit-like UI, and modify its settings to your liking. The app runs an IPFS node, meaning you have to keep it running to have your board online.
2. If you prefer to use a **command line interface**, install plebbit-cli, available for Windows, MacOS and Linux: [latest release](https://github.com/plebbit/plebbit-cli/releases/latest). Follow the instructions in the readme of the repo. When running the daemon for the first time, it will output WebUI links you can use to manage your subplebbit with the ease of the GUI.

Peers can connect to your subplebbit using any plebbit client, such as Plebchan or Seedit. They only need the subplebbit's address, which is not stored in any central database, as plebbit is a pure peer-to-peer protocol.

### How to add a board to the boards list
The boards list on plebchan is plebbit's [temporary-default-subplebbits](https://github.com/plebbit/temporary-default-subplebbits) list. You can open a pull request in that repo to add your subplebbit to the list, or contact devs via telegram [@plebbit](https://t.me/plebbit). In the future, this process will be automated by submitting proposals to a plebbit DAO, using the [plebbit token](https://etherscan.io/token/0xea81dab2e0ecbc6b5c4172de4c22b6ef6e55bd8f).

## To run locally

1. Install Node v18 (Download from https://nodejs.org)
2. Install Yarn: `npm install -g yarn`
3. `yarn install --frozen-lockfile` to install Plebchan dependencies
4. `yarn start` to run the web client

### Scripts:

- Web client: `yarn start`
- Electron client (must start web client first): `yarn electron`
- Electron client and don't delete data: `yarn electron:no-delete-data`
- Web client and electron client: `yarn electron:start`
- Web client and electron client and don't delete data: `yarn electron:start:no-delete-data`

### Build:

The linux/windows/mac/android build scripts are in https://github.com/plebbit/plebchan/blob/master/.github/workflows/release.yml
