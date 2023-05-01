_Telegram group for this repo https://t.me/plebchanreact_

_Demo https://plebchan.netlify.app and https://plebchan.eth.limo_

### Development:

For development it is recommened to use the [mock content env variables](https://github.com/plebbit/plebbit-react-hooks/blob/master/docs/mock-content.md#add-env-variable-for-mocking) because the demo subplebbits are slow and often offline.

### Scripts:

- Web client: `yarn start`
- Electron client (must start web client first): `yarn electron`
- Electron client and don't delete data: `yarn electron:no-delete-data`
- Web client and electron client: `yarn electron:start`
- Web client and electron client and don't delete data: `yarn electron:start:no-delete-data`

### Build:

The linux/windows/mac/android build scripts are in https://github.com/plebbit/plebchan/blob/master/.github/workflows/release.yml
