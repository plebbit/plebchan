## [0.1.17](https://github.com/plebbit/plebchan/compare/v0.1.16...v0.1.17) (2023-12-20)


### Bug Fixes

* **electron:** don't spam user with ipfs errors ([bc83a75](https://github.com/plebbit/plebchan/commit/bc83a75b04b363270d0d6bdc423bc41e49bbe3a1))
* **SettingsModal:** don't remove signer ([cd03fef](https://github.com/plebbit/plebchan/commit/cd03fefb25a2460724d30d2ff60c22610a1e68c4))



## [0.1.16](https://github.com/plebbit/plebchan/compare/v0.1.15...v0.1.16) (2023-12-18)


### Bug Fixes

* **SettingsModal:** don't show signer in account data preview ([f1f1eaa](https://github.com/plebbit/plebchan/commit/f1f1eaa2fe0a9cc7f7bb333fd8333b00ce6bf4e5))



## [0.1.15](https://github.com/plebbit/plebchan/compare/v0.1.14...v0.1.15) (2023-12-15)


### Bug Fixes

* add multisub.json ([b50dcef](https://github.com/plebbit/plebchan/commit/b50dcef2ab207aa0ded92b6950251c52a461a4eb))
* **share:** copy thread link to clipboard instead of post link when sharing a reply, because reply links aren't implemented yet on plebbit ([e2da7e7](https://github.com/plebbit/plebchan/commit/e2da7e7e9647a8f5feb346066e8212ed1cd76787))


### Features

* add 'view on seedit' links ([83c93c5](https://github.com/plebbit/plebchan/commit/83c93c5861cf96edfa9f0912eafa82f7c4d5ee80))
* **electron:** add plebbit rpc ([03b9b82](https://github.com/plebbit/plebchan/commit/03b9b82a6fbecba4658cc68d43523b9e862da298))
* **SettingsModal:** add export/import full account data ([07daa4e](https://github.com/plebbit/plebchan/commit/07daa4eeb315d13f756e4196253fe02d8a989284))
* **share:** add seedit to share button ([a13fe45](https://github.com/plebbit/plebchan/commit/a13fe45c6446527f52dac9dd25e32c4e23c364e3))



## [0.1.14](https://github.com/plebbit/plebchan/compare/v0.1.13...v0.1.14) (2023-10-22)


### Bug Fixes

* **anon mode:** use a different address also per each thread created by the user ([5747b26](https://github.com/plebbit/plebchan/commit/5747b264bfd1a6110a06e4fd6474a420511b553d))
* **App.js:** remove automatic dark mode, because it's not part of 4chan UX and it's not old school, and the selected style is saved anyway ([e3b577b](https://github.com/plebbit/plebchan/commit/e3b577b6900ba87be0aab85745038dfe40fb6c6a))
* **app:** new version info toast should only appear once ([bdb661b](https://github.com/plebbit/plebchan/commit/bdb661b0dc7317a37232c5a1869610b3efc1cbc0))
* **CaptchaModal:** improve captcha visibility by fixing margin ([a312c64](https://github.com/plebbit/plebchan/commit/a312c64bb047f155bdcfe77f5c1832fb75512479))
* **Catalog:** added missing post menu button to rules and description ([a7a845e](https://github.com/plebbit/plebchan/commit/a7a845eada43174bdf6df8846d7eb96011415474))
* **catalog:** fixed bugged appearance for posts without titles or content ([ac7ea57](https://github.com/plebbit/plebchan/commit/ac7ea57244da960f20c68fe1b7156c8682481d1a))
* **catalog:** key warnings ([87a019e](https://github.com/plebbit/plebchan/commit/87a019ed4f17b85e4770e21249191eeb3d810ac3))
* **EditLabel:** don't show the edit label if comment.original.content is identical to comment.content ([bcbf311](https://github.com/plebbit/plebchan/commit/bcbf311b952cc5b153b75a92f9840595ddd52c3e))
* **embed:** wrong srcdoc class syntax prevented some embeds from loading ([b8e3dcc](https://github.com/plebbit/plebchan/commit/b8e3dccbe222ff05e45611fc779ee269ed15e17f))
* **home:** ensure removed threads don't appear in popular threads box ([fee9e6f](https://github.com/plebbit/plebchan/commit/fee9e6fa08ccc944f386a31a403a95637e8f119c))
* **home:** fix displacement of threads while rendered in popular threads box ([06decd9](https://github.com/plebbit/plebchan/commit/06decd99e2f96c2c6e07e8fb8d5fafe5a8862707))
* **home:** fix rerender with useEffect dep ([c63ade8](https://github.com/plebbit/plebchan/commit/c63ade854b3eec55b4e267a9da8af8f19d15d314))
* **home:** remove fallback image warning ([eec7e5c](https://github.com/plebbit/plebchan/commit/eec7e5cd640ba554f8672ab3718f54b0444abba2))
* **Home:** remove preload of boards because it's resource-intensive and doesn't have concurrency maximum ([8758996](https://github.com/plebbit/plebchan/commit/8758996c970244783f02b9342564209bec146150))
* **hooks:** more accurate state strings ([2230049](https://github.com/plebbit/plebchan/commit/22300490ffb602201f5cccfccee0b0ea3aae9ba1))
* missing keys ([0939d65](https://github.com/plebbit/plebchan/commit/0939d658a5d1181af600f359af284d4cb5124b67))
* **mobile reply:** remove unnecessary width calculation for reply images ([8e4ca88](https://github.com/plebbit/plebchan/commit/8e4ca881ad1ed90b8d9cf3084c01df7a570c6986))
* **multifeed:** wrong feed data ([3964893](https://github.com/plebbit/plebchan/commit/3964893e25b2b227f4c85220d938b47eca722e47))
* **offline indicator:** check for online status every 30 minutes instead of 20 ([4eba8e7](https://github.com/plebbit/plebchan/commit/4eba8e7530516a798396696418e013251740481d))
* **post form:** make subject field optional, not mandatory ([548d491](https://github.com/plebbit/plebchan/commit/548d4914bf1924e4312f5baa2773c98d027d011a))
* **Post Form:** use defaultValue for Name when displayName is defined ([c779c34](https://github.com/plebbit/plebchan/commit/c779c34243dea4c08c527929f4796b7bfe5f199c))
* **post:** fix misplaced pin and lock icons ([3a02990](https://github.com/plebbit/plebchan/commit/3a029906744c6f42d501567389ffa34ccf650b12))
* **post:** fix misplaced user address ([1a4f7ac](https://github.com/plebbit/plebchan/commit/1a4f7ac281d39dc99f0b4759e76611460d7442d8))
* **PostOnHover:** add embed thumbnail ([946606a](https://github.com/plebbit/plebchan/commit/946606ac1f4dbd73aad40a1af19a4b226545dd0b))
* **PostOnHover:** fix eslint warning ([c0fe218](https://github.com/plebbit/plebchan/commit/c0fe21888ecfe7f2e5263aa6693c8eecd1b6de88))
* **Post:** remove markdown links showing them as text ([a5a01a8](https://github.com/plebbit/plebchan/commit/a5a01a8732f9ddcfc46932db23c812c039e9b3fb))
* **Post:** remove unnecessary key property causing warning ([2d8ecaa](https://github.com/plebbit/plebchan/commit/2d8ecaa9a07a0cb0dda7cc30639228d2ee1d570c))
* **scroll:** resolve race condition in onClick scroll-to-top behavior ([d5715e2](https://github.com/plebbit/plebchan/commit/d5715e29eb796b11d5fb98827cc8f44097d63afe))
* **SettingsModal:** add page reload for automatic anon mode change for ENS name ([7f7c9ff](https://github.com/plebbit/plebchan/commit/7f7c9ffaf913d21ef78b8de44e6b1b662d2fc919))
* **settings:** typo bugged success toast ([379f3d0](https://github.com/plebbit/plebchan/commit/379f3d0ec95d4f018ebfa130fab3fc1f4c68de56))
* **Thread:** fix undefined ([fdebe14](https://github.com/plebbit/plebchan/commit/fdebe14cdb8134ece9d5161ce5c572862c4aec89))
* **Thread:** remove useless wrapper for webpage comment.link with no thumbnail ([e4b1fc6](https://github.com/plebbit/plebchan/commit/e4b1fc6d35c34c5c4108f20a0bd211ddb4031497))
* **thread:** replying to a reply didn't show the pending comment ([9f5f2d1](https://github.com/plebbit/plebchan/commit/9f5f2d16638101b3b7d86a15854f4838abcd200d))
* **usestatestring:** don't show updating state if comment/subplebbit is succeeded ([7169366](https://github.com/plebbit/plebchan/commit/7169366d11d433f6e30c4c213a8f9bcf0a02685c))
* **views:** add CSS effect for useAuthorAddress jank ([40a2ff9](https://github.com/plebbit/plebchan/commit/40a2ff94ea1fa80deb9f2384fc05f5e90d14590c))
* **views:** add missing parser for quote links in thread op content ([be8bed7](https://github.com/plebbit/plebchan/commit/be8bed74ef04162fe5824a1c6e9be2e39f356098))
* **views:** fix scrolling jank removing margin between desktop reply cards ([288ae4d](https://github.com/plebbit/plebchan/commit/288ae4d066d310f1e5df8d433124015b1c63c63e))


### Features

* **AdminListModal:** inform the user when a board doesn't have moderators yet ([8a81177](https://github.com/plebbit/plebchan/commit/8a81177dd23a750e70669b8176f00d2969e47069))
* **catalog post preview:** show displayName of last reply with thread.lastChildCid ([a15ad68](https://github.com/plebbit/plebchan/commit/a15ad68adb485b2471b04984a4aefbd8a1b9d827))
* **home:** boards box shows list of boards being moderated by the user ([fabec54](https://github.com/plebbit/plebchan/commit/fabec543bf0be636a63cdcbe693583cd5da215a2))
* **home:** improve popular threads box with much more accurate conditions ([053ec57](https://github.com/plebbit/plebchan/commit/053ec57bc45413d00b196f8b42d59d90178d21bb))
* **home:** recent threads box only shows posts with media ([de2ac49](https://github.com/plebbit/plebchan/commit/de2ac49c1f7ee4d7d2115a8bd438f0f04a9b5ff3))
* **home:** redesigned home to be more similar to 4chan, with boards box listing all boards and thread box showing recent threads ([685cbb3](https://github.com/plebbit/plebchan/commit/685cbb3c170dc343794c316e42693e937b1bbdfd))
* **ImageBanner:** add banner [#20](https://github.com/plebbit/plebchan/issues/20) ([65cd106](https://github.com/plebbit/plebchan/commit/65cd1060101c65bcba7d312a09e641fd9f81b02f))
* **imagebanner:** add new banner ([e9ec981](https://github.com/plebbit/plebchan/commit/e9ec981d652fad5bf431314c64b17694cdfbe98a))
* **SettingsModal:** add button to create an account and automatically switching to it, update setting description and modal width ([57c3f71](https://github.com/plebbit/plebchan/commit/57c3f71a22b151ea2aa04d4427249d2695d487be))
* **SettingsModal:** automatically disable anon mode and tell the user, detecting ENS name when importing account, saving account or saving ENS ([c59bbb6](https://github.com/plebbit/plebchan/commit/c59bbb6f50e8b89e516255b947e23b8bfa6022f9))
* **SettingsModal:** force keep the same account id when saving to allow faster account import ([eab5469](https://github.com/plebbit/plebchan/commit/eab546939d8be5abe599a25e5cad6538bf4d1b0f))
* **Share button:** add success toast for copying share link to clipboard ([f0c0e64](https://github.com/plebbit/plebchan/commit/f0c0e64d750c98e6d2cad80bc721ddff228aa523))
* **views:** show board admin role next to usernames, if any, with capcode colors and admin modal function ([e9cfdac](https://github.com/plebbit/plebchan/commit/e9cfdac18f7111a0fe42900c6f56133ce1819d14))


### Performance Improvements

* **board:** add overscan to virtuoso ([fd4bec0](https://github.com/plebbit/plebchan/commit/fd4bec03d100b11dfbf6b954bc28e7db43ae36f0))
* **board:** improve scroll on mobile ([183294a](https://github.com/plebbit/plebchan/commit/183294a66f69fded67c497f80fc52dddaee6bced))
* **board:** improve scroll removing hr margin glitch ([e33c3fb](https://github.com/plebbit/plebchan/commit/e33c3fbe950660815b788863565429f231e8ecd0))
* **board:** remove redundant margin, might impact virtuoso ([a7398f5](https://github.com/plebbit/plebchan/commit/a7398f5338683ee43d08e2dce6a09c85a7b89cb2))
* **board:** replace margin with padding on mobile ([6eee096](https://github.com/plebbit/plebchan/commit/6eee096934feab60d93b90de202994eac6f2f563))
* **home:** add key to map, remove dep causing a loop ([a53f290](https://github.com/plebbit/plebchan/commit/a53f2905d1348ceb54189565ad0f956ac1923efa))



## [0.1.12](https://github.com/plebbit/plebchan/compare/v0.1.11...v0.1.12) (2023-09-18)


### Bug Fixes

* show new version info toast only once ([3f33dcb](https://github.com/plebbit/plebchan/commit/3f33dcb37a900ec5d0710842d7f0c9b0e4f0cf2e))


### Reverts

* Revert "add support for non-direct imgur links" ([be89323](https://github.com/plebbit/plebchan/commit/be8932343184a96d719cf5fd4a5032ce5162d12a))
* Revert "Update SettingsModal.jsx" ([5c72bc6](https://github.com/plebbit/plebchan/commit/5c72bc69e1c5e125c8c9348b3e2c5a0c877f5bdb))
* Revert "fix conditional useMemo" ([572ce08](https://github.com/plebbit/plebchan/commit/572ce0869adbc51fa5d5855152350fe041bad96f))



## [0.1.10](https://github.com/plebbit/plebchan/compare/v0.1.9...v0.1.10) (2023-08-10)


### Reverts

* Revert "add refresh button" ([f7ae7e7](https://github.com/plebbit/plebchan/commit/f7ae7e78dfb36391f39a28f444b86f90ddc1996e))



## [0.1.8](https://github.com/plebbit/plebchan/compare/v0.1.7...v0.1.8) (2023-06-09)



## [0.1.7](https://github.com/plebbit/plebchan/compare/v0.1.6...v0.1.7) (2023-06-08)


### Reverts

* Revert "refactor toasts" ([37d4966](https://github.com/plebbit/plebchan/commit/37d49668e4f4ae80bc9129a1061a00932bb63abd))



## [0.1.5](https://github.com/plebbit/plebchan/compare/v0.1.4...v0.1.5) (2023-05-12)



## [0.1.4](https://github.com/plebbit/plebchan/compare/v0.1.3...v0.1.4) (2023-05-11)



## [0.1.3](https://github.com/plebbit/plebchan/compare/v0.1.2...v0.1.3) (2023-05-06)



## [0.1.2](https://github.com/plebbit/plebchan/compare/v0.1.1...v0.1.2) (2023-04-29)



## [0.1.1](https://github.com/plebbit/plebchan/compare/v0.1.0...v0.1.1) (2023-04-27)



# [0.1.0](https://github.com/plebbit/plebchan/compare/0acd472a9fce50a66964d11750ee9e1275a49617...v0.1.0) (2023-04-24)


### Bug Fixes

* added png lowercase ([908dcd7](https://github.com/plebbit/plebchan/commit/908dcd77faa313e05d74c1e6865c29ae53ebceac))
* delete uppercase png ([0acd472](https://github.com/plebbit/plebchan/commit/0acd472a9fce50a66964d11750ee9e1275a49617))


### Reverts

* Revert "fix subplebbitAddress in ReplyModal" ([24b2177](https://github.com/plebbit/plebchan/commit/24b2177e8743785591a0947cbdb85bd87a9cdc56))
* Revert "removed markdown" ([33eec76](https://github.com/plebbit/plebchan/commit/33eec7644a564bc8825f48927b3a054858991744))
* Revert "fix touch bug" ([777935e](https://github.com/plebbit/plebchan/commit/777935ecbe1e3d781bc4bbadf8f824323acc8c8d))
* Revert "test InfiniteScroll" ([212a0c1](https://github.com/plebbit/plebchan/commit/212a0c10e8a563b75eb35f8d20ba8b93d0adec45))
* Revert "better lint, added InfiniteScroll, debugUtils" ([af0a4c6](https://github.com/plebbit/plebchan/commit/af0a4c67de33c544f997ec7bd64d94e5a5a41df3))



