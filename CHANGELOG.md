## [0.5.2](https://github.com/plebbit/plebchan/compare/v0.5.1...v0.5.2) (2025-06-04)


### Bug Fixes

* **board header:** subplebbit address could be too long ([bc80533](https://github.com/plebbit/plebchan/commit/bc805337400c5233e829c823606d8a0401bedf94))
* **catalog search:** use query parameter so users can share searches and link to them ([6075b2e](https://github.com/plebbit/plebchan/commit/6075b2ebf7b7bcfc6e3bcb57dec4bb53988f658f))
* **challenge modal:** on mobile the modal was incorrectly positioned on top left ([bb0fcb9](https://github.com/plebbit/plebchan/commit/bb0fcb9c1a97d2dac7ed08544bb406d3d99f0bba))
* **mod multisub:** mod page was missing post form ([339a9bc](https://github.com/plebbit/plebchan/commit/339a9bc18a6ca4414a9b80f85b5d12799f68cf94))


### Features

* **board:** add search bar to board page, redirect to catalog view ([53e0482](https://github.com/plebbit/plebchan/commit/53e04823df833bb376770892d1f51b0ecbdaa8c8))
* **markdown:** render plebchan links as internal links, so the user doesn't have to leave the app ([b3bcd58](https://github.com/plebbit/plebchan/commit/b3bcd5896c8880fdcb99423baaf3bab9be705921))



## [0.5.1](https://github.com/plebbit/plebchan/compare/v0.5.0...v0.5.1) (2025-06-03)


### Bug Fixes

* **android:** resolve fullscreen overlay preventing user interaction ([c3ca0c3](https://github.com/plebbit/plebchan/commit/c3ca0c330dd55db7c33733ecf48616db3fe35822))
* **electron:** app couldn't copy share links to clipboard ([104c9c0](https://github.com/plebbit/plebchan/commit/104c9c0eba2b4e3668911d49ae66a51c516fe0b5))
* errors could be displayed unnecessarily ([9fbfcb3](https://github.com/plebbit/plebchan/commit/9fbfcb3630a4231d240a6582cf3645184d8e1e19))
* **reply:** no need to render deleted replies that have no children ([f233da9](https://github.com/plebbit/plebchan/commit/f233da98069ea1b6f38543cca0ebbeefa43dc19a))



# [0.5.0](https://github.com/plebbit/plebchan/compare/v0.4.0...v0.5.0) (2025-05-22)


### Bug Fixes

* **electron:** catch stream errors (e.g. ECONNRESET) in IPFS downloader and add retry logic ([694b01b](https://github.com/plebbit/plebchan/commit/694b01b8e3d73a7a9e7fb6799c1221546e2183a2))
* **markdown:** use rehype-raw for spoiler tag parsing instead of string replacement ([45e9482](https://github.com/plebbit/plebchan/commit/45e94822417c75c87c6a09e11cdb2a971f5c5807))
* **pending post:** page could redirect to "not found" if pending post failed ([b50df69](https://github.com/plebbit/plebchan/commit/b50df69cf3499eb8facea1475b99b85362468681))



# [0.4.0](https://github.com/plebbit/plebchan/compare/v0.3.6...v0.4.0) (2025-03-07)


### Bug Fixes

* **board header:** banner could change while subplebbit is loading ([2df9a96](https://github.com/plebbit/plebchan/commit/2df9a964e65cf7d8968ba28d470dcf7aba58b979))
* **board:** loading state wasn't showing in description page ([319d374](https://github.com/plebbit/plebchan/commit/319d37481044e2c7d99ac48ed94962c440558bd5))
* **catalog:** embedded images that 404'd could overflow ([9013cb0](https://github.com/plebbit/plebchan/commit/9013cb02fe58655f164eb5862b1a8d3e4121d78a))
* **css:** floating-ui portal could override app color scheme ([fc674f4](https://github.com/plebbit/plebchan/commit/fc674f4caf755bb3667a70f6735ae39003e17932))
* **reply modal:** dragging modal could select text behind it ([2d1fb69](https://github.com/plebbit/plebchan/commit/2d1fb69f02fcb05d9906c0f37a1766df489f8cff))


### Features

* add p/mod feed for all subs the user moderates ([ba5753d](https://github.com/plebbit/plebchan/commit/ba5753d85e347b248df962bdcd6f4231f44716a7))
* **catalog filter:** add filtering with complex patterns, including regex, help modal ([d7a9c16](https://github.com/plebbit/plebchan/commit/d7a9c1640babd5b468e7551ead4280a6f4819390))
* **catalog filters:** add color highlighting of threads matching pattern ([22b828b](https://github.com/plebbit/plebchan/commit/22b828b3e834fdd6ce5658af1457792403793394))
* **catalog filters:** add filter by user address, display name or anonymous, mod role ([70f640e](https://github.com/plebbit/plebchan/commit/70f640ecca6440ffcc7239f2c9da105adcf1640a))
* **catalog:** add catalog filters ([b127876](https://github.com/plebbit/plebchan/commit/b127876ce4798d34448940ad14e82f2b161a0db7))
* **catalog:** add search ([a8f7de7](https://github.com/plebbit/plebchan/commit/a8f7de7d85dcf33adec0b0a4e8f17a42949b5f4a))
* **edit menu:** alert "you cannot edit this thread/reply" if without permission ([377d8cd](https://github.com/plebbit/plebchan/commit/377d8cdffaec7b0efbbb1dfa77b2944b34498ed5))
* **embeds:** add support to youtube shorts ([306e7b0](https://github.com/plebbit/plebchan/commit/306e7b081ff72a2acfbe629e1f7ebc0f7ba432de))
* **post:** when attempting to reply, alert reply or thread was deleted or removed ([0a7cda3](https://github.com/plebbit/plebchan/commit/0a7cda31bfe64986fb34788e71868ccd59bc1fad))
* **settings:** auto-subscribe imported accounts to default subs and moderated subplebbits ([0f38fb3](https://github.com/plebbit/plebchan/commit/0f38fb3ae711dcea1ec317aae2fe93231e85c9e3))


### Performance Improvements

* **app:** optimize loading times by using stored values of subplebbits and comments instead of fetching them multiple times ([8557ebb](https://github.com/plebbit/plebchan/commit/8557ebb3a73b2c62965f9f48473f5903d15425cd))
* **catalog:** each post in the feed was loading a comment needlessly ([64f984d](https://github.com/plebbit/plebchan/commit/64f984d2d0d85fbb8bc6b20672723c1b45a590cf))
* **feed:** optimize posts rendering via props refactoring, memoizations ([797a1f2](https://github.com/plebbit/plebchan/commit/797a1f23c69374ce09b7a1ed7914e40e29acc4ca))
* prioritize cached data from API, improving navigation speed and memory consumption ([dcb05ed](https://github.com/plebbit/plebchan/commit/dcb05ed3a04212b5e140ed42fa0e4bbed810781e))
* **reply-modal:** fix laggy dragging during post loading with GPU-accelerated gestures ([0caa8f9](https://github.com/plebbit/plebchan/commit/0caa8f9e70cdaea6769dbb4e7bb52f7046479b61))



## [0.3.6](https://github.com/plebbit/plebchan/compare/v0.3.5...v0.3.6) (2025-02-23)


### Bug Fixes

* **feed:** "no posts" could appear in an empty board after the user published to it ([588d9fb](https://github.com/plebbit/plebchan/commit/588d9fbdb09966730b9999c2556a792156b8d976))
* **post:** image marked as spoiler was visible ([6e60360](https://github.com/plebbit/plebchan/commit/6e60360033355877b02a61e691d1f4f89f1de0f1))
* **post:** loading string could appear in floating posts from out-of-view quotes ([9d454b4](https://github.com/plebbit/plebchan/commit/9d454b489c655c3e3575b83e98435c470503aeb5))


### Features

* **catalog:** show posts published by account instantly in feed ([628115f](https://github.com/plebbit/plebchan/commit/628115f19871fa8e381e4a1fcd6eed82f24ed252))



## [0.3.5](https://github.com/plebbit/plebchan/compare/v0.3.4...v0.3.5) (2025-02-20)


### Bug Fixes

* **markdown:** lists could overflow next to thumbnail ([7172be4](https://github.com/plebbit/plebchan/commit/7172be4960553307350d2a5d41d6b7d54f814010))
* **offline indicator:** increase offline check by 1 hour ([23ce86c](https://github.com/plebbit/plebchan/commit/23ce86c08f5146d3d00ac07ded5201ea3565aacb))
* **pending post:** invalid pending post index would break the view, redirect to not found instead ([92e742a](https://github.com/plebbit/plebchan/commit/92e742a7570ba6db47b34550270538c69c2548a2))


### Features

* auto subscribe new accounts to specific default subplebbits ([882703b](https://github.com/plebbit/plebchan/commit/882703b00d67b782d1329ee1135dda27113e9aae))
* **topbar:** add temporary links to "create board" and "vote" buttons ([57fc2bb](https://github.com/plebbit/plebchan/commit/57fc2bbfc282bf754e16f5caba2679279e00296b))


### Performance Improvements

* **topbar:** optimize scroll up/down animation with GPU acceleration ([31c3482](https://github.com/plebbit/plebchan/commit/31c3482831751da49bcbea1f0bbb0d2cac48fa8d))



## [0.3.4](https://github.com/plebbit/plebchan/compare/v0.3.3...v0.3.4) (2025-02-05)


### Bug Fixes

* **account settings:** creating new account didn't automatically switch to it ([382e069](https://github.com/plebbit/plebchan/commit/382e0692c16b65eb4f3758a095d0a83fbc60b1e1))
* **board:** some subplebbit avatars could overflow ([4f2308f](https://github.com/plebbit/plebchan/commit/4f2308fa94fb113b33f39e435e1d324b5adb8f54))
* **challenge modal:** user could submit empty answer ([a7beb3a](https://github.com/plebbit/plebchan/commit/a7beb3aebb3997ec5d0ce1d6b6270d560cd93927))
* emptying fields could fail when publishing reply ([7ffb3ce](https://github.com/plebbit/plebchan/commit/7ffb3ce8c5ef5f898c615292a74e50bfb97989e0))
* **interface setting:** improve wording ([88a5782](https://github.com/plebbit/plebchan/commit/88a5782118759039577cb647b0a880c7787f3b8f))
* **post:** an hr element written in markdown could get rendered as a UI hr ([165b950](https://github.com/plebbit/plebchan/commit/165b9504225b252d7de0d1a8608be471bdd2f12a))
* **post:** content could bypass max character count if posted from other plebbit client ([b9210dc](https://github.com/plebbit/plebchan/commit/b9210dc835fa7dcbdf0d31b7173bf7c675b25655))
* **post:** prevent edit menu checkbox from being interactable while post is loading ([96794a0](https://github.com/plebbit/plebchan/commit/96794a0c1e1d5bd8278b6c321a9ae24a5761210b))
* **post:** title would wrap incorrectly in posts with no image/thumbnail ([0e67960](https://github.com/plebbit/plebchan/commit/0e6796002c27af53fd3b8d9bfe4a9e94a62801da))
* **reply modal:** changing anon mode before publishing reply didn't work ([2a20716](https://github.com/plebbit/plebchan/commit/2a20716212708e0ddd7cb3a036a34f223c2c9159))
* **reply:** media thumbnail wasn't showing ([be2b65b](https://github.com/plebbit/plebchan/commit/be2b65b5856e463dc9e770125118472b960a3a93))
* **subplebbit:** subplebbit could erroneously appear offline while publishing a post ([48a8046](https://github.com/plebbit/plebchan/commit/48a80464862f618d86d57bd3e8859077499b994a))
* **theme:** christmas theme should only run on dec 24 and 25 ([cbed83c](https://github.com/plebbit/plebchan/commit/cbed83cd1098031113009db4fa41f522f0536584))
* **theme:** prevent special theme from persisting outside holiday period ([65ed3df](https://github.com/plebbit/plebchan/commit/65ed3dffd5ac3af227d736d686f410692ce31e53))
* **topbar:** only display the top 15 subs in the default list ([0488a6c](https://github.com/plebbit/plebchan/commit/0488a6c629402f0c6acff09f2a9090abe07b2c4d))


### Features

* **account settings:** add hash-based routing for settings categories ([c21d512](https://github.com/plebbit/plebchan/commit/c21d512958fbda8bac95c9ed3f6f2850bcbd3f7b))
* **boards list:** add filter by tag ([0716aac](https://github.com/plebbit/plebchan/commit/0716aac9e2ecdfb1de709c411b1f952012ae1f37))
* **boards list:** add PPH column ([d858b53](https://github.com/plebbit/plebchan/commit/d858b5398d7c4bd4810662bf42d4fc4d87c433b1))
* **boards list:** show 15 boards at a time + p/all, add load more button ([cf849ba](https://github.com/plebbit/plebchan/commit/cf849bab7047cb224b928dcce2217833312c5363))
* **challenge modal:** close with escape key ([515007c](https://github.com/plebbit/plebchan/commit/515007cbf61feb33b7c7720a972c9c08a6fc9835))
* **home:** add boards list more similar to vichan, which is better than 4chan's boards box for a potentially infinite number of boards ([cadfc69](https://github.com/plebbit/plebchan/commit/cadfc699fcf5b9370bdddd04f6e7261703923cca))
* **markdown:** add spoiler text ([9a08b95](https://github.com/plebbit/plebchan/commit/9a08b9572b80dd16998422fbf3246b61c86b8d4b))
* **post form:** add content length check ([1b359f9](https://github.com/plebbit/plebchan/commit/1b359f9d7b1c095c73690aec736cd6928c251e53))
* **post:** support youtube links from Invidious instances ([9d9ba61](https://github.com/plebbit/plebchan/commit/9d9ba61a919ab9ecc2186a144dd4a4e411939bcb))
* **reply modal:** add content length check, better error display ([d861f89](https://github.com/plebbit/plebchan/commit/d861f894f1dea9d2b532985e74370617b03a56ac))
* **reply modal:** close with escape key ([63cb5b6](https://github.com/plebbit/plebchan/commit/63cb5b6591ed846ec0c87ea312109a5b325c3e52))
* **settings modal:** close with escape key ([01e467d](https://github.com/plebbit/plebchan/commit/01e467d0699dfc14f68dacf0f843f5c71755220e))
* **settings:** add subscriptions setting ([85d2cb6](https://github.com/plebbit/plebchan/commit/85d2cb67a97efd3d32ab9bcfd5ad7a052e0d14ba))



## [0.3.3](https://github.com/plebbit/plebchan/compare/v0.3.2...v0.3.3) (2024-12-25)


### Bug Fixes

* snow effect shouldn't show on mobile ([5284b3d](https://github.com/plebbit/plebchan/commit/5284b3da1be0807ef86ab0d97627e58c8e4784ae))



## [0.3.2](https://github.com/plebbit/plebchan/compare/v0.3.1...v0.3.2) (2024-12-24)


### Bug Fixes

* **avatar settings:** add timestamp field to let users add existing signature ([16c8f39](https://github.com/plebbit/plebchan/commit/16c8f39add8231df00c261891ee80ca312fc66a2))
* **board stats:** while stats load, show ? as values instead of showing nothing (causing displacement) ([c40c9e4](https://github.com/plebbit/plebchan/commit/c40c9e4df559bda5528e415e066940388e798005))
* **electron:** auto restart script more reliable ([b05c6ed](https://github.com/plebbit/plebchan/commit/b05c6ed94f61fa94fd233033c4be056a55bc1e23))
* **electron:** ipfs proxy should have error status code ([d608a46](https://github.com/plebbit/plebchan/commit/d608a46b00303dc2a5f0b7c9a4e40f62f6beaf1d))
* **ellipsis animation:** dots could appear cut off and cause displacement changing width of string ([09505a6](https://github.com/plebbit/plebchan/commit/09505a62313fcf26de4a1e84d7f705eee714bd33))
* **feed post:** gif thumbnail could break persistently ([e3cf507](https://github.com/plebbit/plebchan/commit/e3cf5076be0488a70473c1902902bf22170c9305))
* **feed:** posts could change position causing displacement ([309f766](https://github.com/plebbit/plebchan/commit/309f76689f3672436bc790894af4580006a4c60f))
* **home:** stats should load regardless of the total number of online subs ([8b7730b](https://github.com/plebbit/plebchan/commit/8b7730b6c4f074edff602d645647d3854171a4f2))
* **markdown:** invalid urls in content could crash the app ([73bab13](https://github.com/plebbit/plebchan/commit/73bab13e34302e97b3288f9e06cee681546ab417))
* **plebbit options:** schema error prevented to save ([db8c51f](https://github.com/plebbit/plebchan/commit/db8c51fa72404b00bc1bc90d4e92b2e3ad5887c5))
* **post:** deleted or removed post could show reply form ([0043e2b](https://github.com/plebbit/plebchan/commit/0043e2bdb6f86ac82278889ee18a290abd5f24fa))
* **post:** error was displayed incorrectly ([fd8b3ea](https://github.com/plebbit/plebchan/commit/fd8b3ea2e9d16aeb81d08e73a2d7d6394568c555))
* **post:** image could flicker when clicking it to expand it ([077b3bc](https://github.com/plebbit/plebchan/commit/077b3bc9efe25938bb3798424fe7156ba840b9b0))
* **post:** long text content wouldn't wrap around images ([0944094](https://github.com/plebbit/plebchan/commit/094409439215f7b42ab7b9eef704e96375149cb0))
* **reply:** don't show backlink for deleted or removed reply ([d6d2831](https://github.com/plebbit/plebchan/commit/d6d2831b465ffbedb08294f4d894feb69ac0391a))
* **settings:** crypto address setting would show error for an already set address ([cc660e9](https://github.com/plebbit/plebchan/commit/cc660e9527468de04c1b826c9d97b863ebd2f2eb))
* **time filter:** last visit time filter could be a duplicate in dropdown ([9ee6966](https://github.com/plebbit/plebchan/commit/9ee6966c26c848ad8c6bab4117f6316b90e29e9c))


### Features

* add christmas theme ([eb3a630](https://github.com/plebbit/plebchan/commit/eb3a630cc360a650e178eee6e8d5aad85ee93197))
* **electron:** add http routers to electron ([521d26b](https://github.com/plebbit/plebchan/commit/521d26bbe387794008a5309b9e30eadb418c9299))
* **p/all:** improve design of "show more posts" button in feed footer ([1cc8d9a](https://github.com/plebbit/plebchan/commit/1cc8d9acbe86d059564622a8908f61bbc1abdb53))
* **post:** enable highlighting an already highlighted post by using a different color ([5a498cb](https://github.com/plebbit/plebchan/commit/5a498cbcb656704c2147c08ab942b45636498165))
* **reply modal:** add spellcheck for the content, excluding the c/cid at the top ([9ec308b](https://github.com/plebbit/plebchan/commit/9ec308bcc28215ce8346dee55892337da79e16db))


### Performance Improvements

* **index.html:** preload UI assets ([73f9d9e](https://github.com/plebbit/plebchan/commit/73f9d9eb53221183f1d058b0f4a4b748322e37c9))



## [0.3.1](https://github.com/plebbit/plebchan/compare/v0.3.0...v0.3.1) (2024-11-10)


### Bug Fixes

* **moderation:** update to use new API schema ([e9fc47b](https://github.com/plebbit/plebchan/commit/e9fc47be201772a1f1fc55e7ce0dd567bc5deb81))
* **post:** some quotes to replies wouldn't show quoted posts on hover ([965c6f8](https://github.com/plebbit/plebchan/commit/965c6f846a27b22f86254ceb43ec0e18d6fecaf7))



# [0.3.0](https://github.com/plebbit/plebchan/compare/v0.2.9...v0.3.0) (2024-11-08)


### Bug Fixes

* **board:** account comments couldn't appear instantly in feed ([0b92c60](https://github.com/plebbit/plebchan/commit/0b92c60f3453f1b2541f352aad2378dd4afdc9b4))
* **board:** virtuoso footer would overflow ([8d35e09](https://github.com/plebbit/plebchan/commit/8d35e0942f65553052c421c79f37d26b4da2a0ca))
* **p/all:** empty 24h feed would not show 'show more posts since last week' ([82217a7](https://github.com/plebbit/plebchan/commit/82217a726c787323a42ac04978624a3f72251d67))
* **post menu:** link to other clients was broken on description post ([c2363fe](https://github.com/plebbit/plebchan/commit/c2363fe03b86fafe2d5cfc6da14fecaa458cce80))
* **post:** hidden post showed its content ([a2dd3ef](https://github.com/plebbit/plebchan/commit/a2dd3efe087637e8dfd5b3fda3cba11605add1c2))
* **reply:** hidden reply was too big and showed edit menu checkbox ([a927f3a](https://github.com/plebbit/plebchan/commit/a927f3aa0070afd63f8540c231ed79252692c16b))


### Features

* **android app:** add 'choose file' button to auto upload media to catbox in the background ([f40c2c2](https://github.com/plebbit/plebchan/commit/f40c2c2f8816f6d12c320da36ad71ac5f76fcbef))
* **interface settings:** add 'Fit expanded images to screen' setting ([ba54d70](https://github.com/plebbit/plebchan/commit/ba54d70421ad257f0ba31cbc2d5d5a5a72030d02))
* **reply modal:** add 'choose file' button on android ([5c09b66](https://github.com/plebbit/plebchan/commit/5c09b66338417db0ad448fc3a164951bc7cb29d3))
* **reply modal:** display errors in modal ([5768443](https://github.com/plebbit/plebchan/commit/57684438a5fd7941c6974711c627e372aa564c5e))



## [0.2.9](https://github.com/plebbit/plebchan/compare/v0.2.8...v0.2.9) (2024-10-29)


### Bug Fixes

* **catalog:** if time filter is 'bump order', it should say 'last bumped' instead of 'newer than' ([71ba306](https://github.com/plebbit/plebchan/commit/71ba306ec12cc9a31f1a52b26348f52c620fae2f))
* **embed:** reddit links have to include '/comments/' to be embeddable ([5e6c9fb](https://github.com/plebbit/plebchan/commit/5e6c9fba7e4ee14d80d041327dff12def20d4b87))
* **p/all:** auto time filter didn't show posts from last visit ([0b5aa7d](https://github.com/plebbit/plebchan/commit/0b5aa7dc31afdd49ff8a5470e2d1312d9f2f3d8b))
* **release.yml:** wrong java version prevented apk build ([f280f33](https://github.com/plebbit/plebchan/commit/f280f33556c1fccfddb018c6ded53df492c67488))
* **router:** a link could include '%23' instead of '#' ([360dfb4](https://github.com/plebbit/plebchan/commit/360dfb4604bde8c4dc5459f849a40a063c1c58ec))



## [0.2.8](https://github.com/plebbit/plebchan/compare/v0.2.7...v0.2.8) (2024-10-19)


### Bug Fixes

* **android:** update app logo ([4ef3f9d](https://github.com/plebbit/plebchan/commit/4ef3f9de7d19c2a86dd8d0e50c349472f1da19aa))
* color missing, translation missing ([0705bd9](https://github.com/plebbit/plebchan/commit/0705bd9dbd7784ea3d57d2f5903225985e9a210a))
* **crypto address setting:** default description didn't appear, clicking 'check' with address already set would result in error ([ff3f5f6](https://github.com/plebbit/plebchan/commit/ff3f5f618d67845373b7cc1337ea0a796c331265))
* **electron:** empty error message would appear after closing app ([83fdd8e](https://github.com/plebbit/plebchan/commit/83fdd8eb09be8acf7e422abd4b7aa0d1c4452fc2))
* **electron:** missing isElectron flag ([3720ed2](https://github.com/plebbit/plebchan/commit/3720ed2d2ee03742926a21521add06e38e271d1a))
* **feed:** old account comments could appear at the top of the feed ([c2aa9ca](https://github.com/plebbit/plebchan/commit/c2aa9cad49f5c78da535c7cd3e7e5cc135737377))
* **post:** a non-direct link could be marked as media instead of webpage ([e9280ac](https://github.com/plebbit/plebchan/commit/e9280ac84c5151fcb8d76b04b746d80e6850e0a8))
* **post:** some links to images could be embedded as videos ([46e1189](https://github.com/plebbit/plebchan/commit/46e1189711c1e345afd7f85b8026017fd2550c2b))
* **publish reply:** error "content is an empty string" could appear ([af7505c](https://github.com/plebbit/plebchan/commit/af7505c45f3196ee21b3fdd5d70411538a05bcea))
* **topbar:** mobile animation on scroll was too slow ([8e245a4](https://github.com/plebbit/plebchan/commit/8e245a47598913ad816b84af71572236688d9497))


### Features

* **account settings:** alert user account is stored locally and specify location ([89d37dc](https://github.com/plebbit/plebchan/commit/89d37dc029120cdacf2b68eeddf247049e379164))
* **android:** fetch thumbnail image from any webpage link ([6f8a6e3](https://github.com/plebbit/plebchan/commit/6f8a6e38d49adff7252287268db512d792e448be))
* **board:** suggest user to switch time filter on p/all and p/subscription if there aren't enough posts ([eac0a01](https://github.com/plebbit/plebchan/commit/eac0a0150ca45412990660498cfc08ac961631f5))
* **catalog post:** add thumbnail fetching for sites with cors access ([3556a04](https://github.com/plebbit/plebchan/commit/3556a042803ecf9a580ea16bf9e69dd03be526b6))
* **catalog:** add warning to switch filter if there aren't enough posts in p/all and p/subscriptions ([ba9496c](https://github.com/plebbit/plebchan/commit/ba9496ca4210d5e86277ea4dbf801a1614371294))
* **embed:** add support to music.youtube.com ([03dbf95](https://github.com/plebbit/plebchan/commit/03dbf958f61df005b0556a680551ed359f467e34))
* **embed:** add support to youtube playlists ([492d979](https://github.com/plebbit/plebchan/commit/492d979cf9746ab032230c832756516170693744))
* **post:** add client-side thumbnail fetching for websites with CORS access ([561e395](https://github.com/plebbit/plebchan/commit/561e395256fa178af1ac28011132f7dc8b39f189))
* **post:** support thumbnails from non-direct imgbb links ([9e24ae0](https://github.com/plebbit/plebchan/commit/9e24ae0aed435d1aeec8d9f7ba6e4b5c268e77b4))


### Performance Improvements

* **gifs:** cache first frame so gifs don't reload all the time when navigating ([73e12cc](https://github.com/plebbit/plebchan/commit/73e12ccbae85595ea81d06a73db0055319e841bf))



## [0.2.7](https://github.com/plebbit/plebchan/compare/v0.2.6...v0.2.7) (2024-09-21)


### Bug Fixes

* **post:** deleted or removed posts appeared collapsed like replies ([d3af6c2](https://github.com/plebbit/plebchan/commit/d3af6c2a44f0a868a07e57822369af62bf015d1e))
* **post:** deleted or removed replies should not be collapsed if edit reason is provided ([994c667](https://github.com/plebbit/plebchan/commit/994c667819266c14c4bcdba5c3738665245e9f09))



## [0.2.6](https://github.com/plebbit/plebchan/compare/v0.2.5...v0.2.6) (2024-09-20)


### Bug Fixes

* **anon mode:** refreshing page could generate a new anon address for thread ([f247f0e](https://github.com/plebbit/plebchan/commit/f247f0e995e1c3a3daadd0ba8528ee1fea209f62))
* **anon mode:** user id could change for pending post, name field could bug out ([bb97640](https://github.com/plebbit/plebchan/commit/bb976409ff425097187db3a9679a0b80464aa0c9))
* **banner:** border was missing in some themes ([9a4e62b](https://github.com/plebbit/plebchan/commit/9a4e62bd19d27a410f0210231572f482ae1a2ab1))
* **board:** show description even if there are no posts ([72f0c79](https://github.com/plebbit/plebchan/commit/72f0c79922b2e1dec60de8e236d2094685561b9f))
* **catalog filters:** clicking "save" button didn't close the modal ([ea42d5d](https://github.com/plebbit/plebchan/commit/ea42d5d46c0633168a9556a13555151a2b28ab05))
* **catalog:** greentext and markdown styling shouldn't appear ([7742e1c](https://github.com/plebbit/plebchan/commit/7742e1c9b03f09912162a84d6caf26fb7ae4db88))
* **edit menu:** modal could appear opaque ([b18c1bc](https://github.com/plebbit/plebchan/commit/b18c1bc4914c1371bc07ac5c48a06e6f05858b2c))
* p/all description showed "undefined" in window title ([d5dcedf](https://github.com/plebbit/plebchan/commit/d5dcedf3bdb109547097851d4717cc1853b1fd4b))
* **popular threads box:** don't display markdown syntax, remove white space ([2db5009](https://github.com/plebbit/plebchan/commit/2db5009911982482fadbbb2381db23192ae15452))
* **post form:** emptying out the fields and posting could result in "empty string" error ([f80f636](https://github.com/plebbit/plebchan/commit/f80f6369a5d8a57b239dfadf91abc5da219d7abb))
* **post menu mobile:** "view on" links were broken ([2390238](https://github.com/plebbit/plebchan/commit/2390238a10ba1d21e5bdd473627c837b13d6a31b))
* **post:** "(You)" wasn't appearing for comments published in anon mode by user ([7d2bd38](https://github.com/plebbit/plebchan/commit/7d2bd38f58d45e615a28b2fbd5a7ba6f58247d01))
* **post:** anon ID could be wrong while post is pending ([e068db9](https://github.com/plebbit/plebchan/commit/e068db97438a73eadee83a87c20b3552e08fb0f2))
* **post:** incorrect spacing on enlarged images ([5bcfda6](https://github.com/plebbit/plebchan/commit/5bcfda6908301a06a1518a9d51f27648dc8f31dd))
* **post:** special characters in content could overflow ([c1910c9](https://github.com/plebbit/plebchan/commit/c1910c97888df4616cb765f7a00497796b2e03df))
* **theme:** changing theme wouldn't work in pending post page ([5f55ade](https://github.com/plebbit/plebchan/commit/5f55adef07895371fa63c44376061dcaa9b067d7))


### Features

* **catalog filters:** add "filtered threads" count ([b38948b](https://github.com/plebbit/plebchan/commit/b38948bbc9c1cd1cc1b4f76b93031a4b7576c954))
* **post form:** alert user when submitting a post without media ([3c27fd6](https://github.com/plebbit/plebchan/commit/3c27fd6c3131c0a1d624bc9c9d34bc583d4345db))
* **post:** add support for next.js image links ([5a9bf5b](https://github.com/plebbit/plebchan/commit/5a9bf5b88bd805e9b729b70d5fd4d69c39ff99fb))
* **post:** show media dimensions if available ([4664206](https://github.com/plebbit/plebchan/commit/4664206e77c0331cd827a4cfa1e400d4e2922105))
* **reply modal:** add autofocus on mobile ([c58a6bc](https://github.com/plebbit/plebchan/commit/c58a6bceec0285710e1348f11eadcef98f0e41b8))


### Performance Improvements

* **catalog:** optimize filtered feed ([6e472b2](https://github.com/plebbit/plebchan/commit/6e472b2b17fb7b94790388567eb061e8f164a8e7))


### Reverts

* **catalog:** disable catalog filters temporarily, they don't perform well with api ([cadf416](https://github.com/plebbit/plebchan/commit/cadf4160587712cdec5d63212c53f8dd2d698c41))



## [0.2.5](https://github.com/plebbit/plebchan/compare/v0.2.4...v0.2.5) (2024-09-06)


### Bug Fixes

* **board buttons:** buttons would wrap incorrectly on small window width ([385acb0](https://github.com/plebbit/plebchan/commit/385acb08fd24eff3dac4d1f029817ceb28597f4e))
* **catalog post preview:** special characters were able to overflow ([48b55ed](https://github.com/plebbit/plebchan/commit/48b55ed972e8d20d108086175b7838f43d2983a6))
* **catalog:** p/all description would show while filter to hide threads without images is turned on ([5d2e28e](https://github.com/plebbit/plebchan/commit/5d2e28eb5b7dd508597dfd83ee4d9f2b464864a1))
* **edit menu:** checkbox would appear dark in floating post from quote ([c354d72](https://github.com/plebbit/plebchan/commit/c354d72e0ac561291a44822ad9f84e7d8c02059b))
* **edit menu:** couldn't edit post content if post was just published ([9543f16](https://github.com/plebbit/plebchan/commit/9543f16f683d2d90041edab895a571d30a30baae))
* **edit menu:** modal position would bug out when resizing textarea to edit post content ([4858cea](https://github.com/plebbit/plebchan/commit/4858ceadc98ee367c1d81a59dce67a4c78b3df10))
* **edit menu:** remove autofocus, it caused auto scroll ([e9c7e86](https://github.com/plebbit/plebchan/commit/e9c7e868f245ec803823ca372d848debf96d9376))
* **edit menu:** textarea to edit content was too small ([d52c29f](https://github.com/plebbit/plebchan/commit/d52c29f78148fa2641c5abadd3856a10e4ae492d))
* **home:** "use catalog" button didn't work for some addresses ([5c846fc](https://github.com/plebbit/plebchan/commit/5c846fcdc8a23ead278868c92bc6c9443ea231c8))
* **home:** options modal flickered when clicked twice ([30b9152](https://github.com/plebbit/plebchan/commit/30b91521b9a3e4daef86f696b18addb7149bcff8))
* **markdown:** don't allow horizontal lines, they look confusing inside of post content ([1eb64ed](https://github.com/plebbit/plebchan/commit/1eb64ede3dfba50b9e77d47c9c4dd7f8d3db4c5d))
* **markdown:** single returns would be rendered as spaces ([495e9e2](https://github.com/plebbit/plebchan/commit/495e9e25b5f5cdb19661318f552d1b2908fba987))
* **markdown:** users couldn't include empty lines in the post content ([38790a2](https://github.com/plebbit/plebchan/commit/38790a25966aea4217550d76ef1766bd2c5abefd))
* **pending post page:** opening settings would change theme ([5095e0e](https://github.com/plebbit/plebchan/commit/5095e0e3b9cc27b0a998a4bd646a613e69f6a0e5))
* **pending post:** "[Reply]" button and post menu shouldn't be clickable ([0cb386c](https://github.com/plebbit/plebchan/commit/0cb386cf662a570c3dd5772ec50bdbba56243618))
* **popular threads box:** in each post content, one return would appear as two returns (empty lines) ([cfe8686](https://github.com/plebbit/plebchan/commit/cfe8686d94c6ad0df05fe6a240ef25b1840429be))
* **post form:** opening settings would close post form ([17f57a1](https://github.com/plebbit/plebchan/commit/17f57a1d7d0fa47aa6f5fa97c803063734615173))
* **post form:** user could post empty comment using spaces ([3d2d510](https://github.com/plebbit/plebchan/commit/3d2d510259b0e7ac4bcfecdff872d928a550709c))
* **post menu:** 'hide post' button wasn't appearing in thread page on desktop ([f7bab7c](https://github.com/plebbit/plebchan/commit/f7bab7c83e92b24220c8244f4e1f7d0754ebb1a7))
* **post menu:** 'view on (client)' link was broken on multisubs ([25722d7](https://github.com/plebbit/plebchan/commit/25722d74a3e048c03d69d924a644886fdb70310f))
* **post mobile:** tooltip for title wasn't centered ([ca0020f](https://github.com/plebbit/plebchan/commit/ca0020f2c5d360d1e77a4bfcc716bf162a1c9174))
* **post:** 'comment too long' link was broken for description and rules ([2ab7197](https://github.com/plebbit/plebchan/commit/2ab71978a7329fd0d58e0ce028332cd25b65c931))
* **post:** "c/" was clickable while post is pending ([74ddae0](https://github.com/plebbit/plebchan/commit/74ddae0ed7a9fc9b1724355d076dbdb13107c861))
* **post:** "c/Pending" could appear on first render ([2590a9c](https://github.com/plebbit/plebchan/commit/2590a9c096657ce53d016f3570189a2bc7085930))
* **post:** clicking the quotelink or backlink to a reply wouldn't scroll to the reply more than once in a row ([e1422d0](https://github.com/plebbit/plebchan/commit/e1422d005419f21ddf039c76021156679146dc91))
* **post:** content could overflow on mobile, causing horizontal scroll ([1122eb4](https://github.com/plebbit/plebchan/commit/1122eb4f714dcb709a2d24e0f3a8096ff4029906))
* **post:** deleted or removed comments still showed display name, avatar, role and ID ([b7e443d](https://github.com/plebbit/plebchan/commit/b7e443d7d3d1e7c9e79b5996e34ae856057253fc))
* **post:** don't show link if comment is removed or deleted ([068c30a](https://github.com/plebbit/plebchan/commit/068c30a3222877c816b22601920c0d03a18b7c18))
* **post:** edited timestamp showed html on mobile ([ba49060](https://github.com/plebbit/plebchan/commit/ba4906058db17c474308c501ea756ee504140f6d))
* **post:** reply backlink didn't appear in post info immediately after replying to it ([0f6b922](https://github.com/plebbit/plebchan/commit/0f6b9225165983986771a712787c30f5a5215c8d))
* **post:** some gifs would appear animated before expanded ([5a56016](https://github.com/plebbit/plebchan/commit/5a56016c85bf5f7ac78af8ce3783e71c1eb8181b))
* **replymodal:** replying didn't work from multiboard feeds (p/all, p/subscriptions) ([f6548cc](https://github.com/plebbit/plebchan/commit/f6548cc2b826ba4b80d9d7511df17891408e016a))
* **settings:** closing modal could close app ([b8fc7fb](https://github.com/plebbit/plebchan/commit/b8fc7fbe2c7b389a1315e099249db35de6e8ba7e))
* **theme:** changing theme in sfw sub wouldn't change it for p/all and p/subscriptions. it should because sfw is the default ([f06c50e](https://github.com/plebbit/plebchan/commit/f06c50ef33a3b5fc82c8532c144fd87e7be291d4))
* **theme:** theme changed incorrectly in pending post page ([4e390a9](https://github.com/plebbit/plebchan/commit/4e390a9fc573610ae76249b9126a42d85b442a87))
* **use-replies:** a reply to a newly-published reply wouldn't render until propagated ([a698b22](https://github.com/plebbit/plebchan/commit/a698b222f8a22bf3a4e5850cd5328b81cebbbdfa))


### Features

* **board stats:** remember hide/show choice per subplebbit ([d482d32](https://github.com/plebbit/plebchan/commit/d482d3246744b0d7701888fa0ce18433d7798381))
* **catalog:** add text pattern filters ([da33358](https://github.com/plebbit/plebchan/commit/da33358ca418db4cd3840b96996bed43d7825c57))
* **feed:** show account comments instantly in the feed once published, instead of waiting for the feed to update ([8598d10](https://github.com/plebbit/plebchan/commit/8598d1056ee9b08cb146b129356c28c14a8ec79a))
* **markdown:** when the user is publishing a comment, automatically format it to follow markdown rules ([c521ccb](https://github.com/plebbit/plebchan/commit/c521ccbc2ebf2d4d67889a28733d07eab4b8fa7b))
* **pending post:** show board navigation, stats and post form ([cdee29e](https://github.com/plebbit/plebchan/commit/cdee29e94ffa7cb616aacd34719114d384e60278))
* **post form:** add link media info for static or animated gifs ([4103fab](https://github.com/plebbit/plebchan/commit/4103fabb12c2b7f57c6c07808af4b7c213408852))
* **post:** add button to show full comment when it's too long ([99a2197](https://github.com/plebbit/plebchan/commit/99a219733c65138616976fd3f3f71a6b90199909))
* **post:** add user ID with color specific to user address ([8dfe209](https://github.com/plebbit/plebchan/commit/8dfe2098ce14e77898805093b5ce28c610f1b098))
* **post:** show embed of link in post content even if it doesn't have a thumbnail ([09a1441](https://github.com/plebbit/plebchan/commit/09a14416c8bcbd722ebeb3bbc0b158bf12c1190b))
* **settings:** add anon mode - automatically use a different user ID in each thread ([db67a94](https://github.com/plebbit/plebchan/commit/db67a9452c048c5abc954cbae345269495ab6c65))
* **settings:** add option to hide avatars ([5b7acbc](https://github.com/plebbit/plebchan/commit/5b7acbc5689d9cebee10d0ba8661227c9996b3cf))


### Reverts

* Revert "chore(package.json): v0.2.5" ([1d86267](https://github.com/plebbit/plebchan/commit/1d8626757b77093f5c57c7c92452d7bb1de3a916))



## [0.2.4](https://github.com/plebbit/plebchan/compare/v0.2.3...v0.2.4) (2024-07-23)


### Bug Fixes

* "this thread is closed" didn't appear instantly after mod edit ([84abe90](https://github.com/plebbit/plebchan/commit/84abe902c455f1e9516ac7f6cda944ec532c9921))
* **board title:** offline icon would appear in p/all and p/subscriptions ([38e60fd](https://github.com/plebbit/plebchan/commit/38e60fd797812756480c84d46fb81a4223efec9a))
* **catalog post:** it was not possible to scroll past the floating post preview ([9960e40](https://github.com/plebbit/plebchan/commit/9960e400e822214377842cf43789a20c5324caf8))
* **edit menu:** reason field would reset at menu close ([15462f1](https://github.com/plebbit/plebchan/commit/15462f14ede7b0b3920ae62305b2bc3b112476da))
* **electron:** download url redirect status code changed ([c63b950](https://github.com/plebbit/plebchan/commit/c63b9507dec80626d22dbeb7d5663ea647b0358f))
* **iframe:** background was white in tomorrow theme ([8d766cc](https://github.com/plebbit/plebchan/commit/8d766cc9e3b1bf668b02fcaa651678b4cb125b38))
* **markdown:** bullet point lists were bugged ([9552938](https://github.com/plebbit/plebchan/commit/9552938b6de5fd3d860cca8c9335ce6f1487adbb))
* **post menu:** block button was visible for description and rules ([4ffd750](https://github.com/plebbit/plebchan/commit/4ffd75010d53dbf068fd6e4040954a6902163d10))
* **post:** failed replies would link to op ([44e518a](https://github.com/plebbit/plebchan/commit/44e518a3ad449bb2e6857634d0fffe04b622d919))
* **post:** include pending replies in "x replies omitted" count ([01dacc8](https://github.com/plebbit/plebchan/commit/01dacc82705f0c9a6ef20fe53673de3c06c220e5))
* **post:** pending reply to op would show quote link to op ([ec4ba55](https://github.com/plebbit/plebchan/commit/ec4ba550aa0950afd9374e9a6c17b26553682dff))
* **post:** permalink (c/) of pending reply shouldn't link to anything ([3ddf26c](https://github.com/plebbit/plebchan/commit/3ddf26c93029cc60452d2aa3e13a752e3c4284fc))
* **post:** remove "user was banned for this post" because it's only visible to mods at the moment ([89e19ad](https://github.com/plebbit/plebchan/commit/89e19adb5c4d3717fe4a785047aca2f790be4643))
* **post:** reply quote link couldn't render in posts with link and no content ([ddb462b](https://github.com/plebbit/plebchan/commit/ddb462b95e7c00fc81f28234d12ce3909ede7dc8))
* **replies:** a reply would not appear immediately if published to a reply that was just published ([3950f7b](https://github.com/plebbit/plebchan/commit/3950f7b8647df971e4e1bb4147838ae60e3166ac))
* reply count was bugged ([6d6187e](https://github.com/plebbit/plebchan/commit/6d6187e531065f744dde8a16f14977112c418407))
* **reply modal:** cursor would move to end of text while replying ([6430607](https://github.com/plebbit/plebchan/commit/6430607363419b695487942ec31ea071f4205912))
* **spoiler:** spoiler image wasn't showing for iframes ([85aeb86](https://github.com/plebbit/plebchan/commit/85aeb860475a6efa223ec0e8b931671ca91a5edb))
* **subplebbit stats:** stats box appeared even if stats are undefined ([811405d](https://github.com/plebbit/plebchan/commit/811405dea9d72ef41a115d7a0e110c57b1040f89))
* **themes:** inherit selected theme in pending post page ([d66a0b8](https://github.com/plebbit/plebchan/commit/d66a0b8efe49f0401e04155e177f60d4493e289a))
* **topbar:** empty brackets would show for sub category if empty ([a31beee](https://github.com/plebbit/plebchan/commit/a31beee6318047e3bed5f02820468360e6b3db5c))


### Features

* **board header:** add yellow offline icon for loading online status, red icon for offline status ([fe434cb](https://github.com/plebbit/plebchan/commit/fe434cb6343a6a00da1467c4b9094cb507a1fbef))
* **post page:** add error line above post ([a234776](https://github.com/plebbit/plebchan/commit/a2347769e27145677388d01a462b2d93ab76be51))
* **post page:** add reply count and link count in top row ([8d05db8](https://github.com/plebbit/plebchan/commit/8d05db8843748c297c1dbb4573e1547b51eb7d4a))
* **post:** add 'loading comments' indicator ([a6a551a](https://github.com/plebbit/plebchan/commit/a6a551a25f4b0f14b3650ec13d016ec60146f636))
* **post:** add avatars ([1e16068](https://github.com/plebbit/plebchan/commit/1e16068c3a18693dbf7bbd91e9c11f409d9673f1))
* **post:** add loading state string ([954b158](https://github.com/plebbit/plebchan/commit/954b158704eced583cae4f689c74721d47e53081))
* **post:** add support for static GIFs ([7253e4d](https://github.com/plebbit/plebchan/commit/7253e4d1a0edb20eed576826e1ce80d8169d9abf))
* **post:** add tooltip to comment edit timestamp ([e716a45](https://github.com/plebbit/plebchan/commit/e716a45a3130bcfa8877a2b347012e6b63b4d261))
* **post:** show loading state info ([7ff8af7](https://github.com/plebbit/plebchan/commit/7ff8af7fcd78f044d352fc74b67f7d3a712e5a7d))
* **settings:** add avatar setting ([f2e4f14](https://github.com/plebbit/plebchan/commit/f2e4f14a33ac2d41e029f54ae05000f31468f8f8))
* use red offline icon for subplebbits that are most likely offline (ipns record fails to update) ([9f75449](https://github.com/plebbit/plebchan/commit/9f7544936e9418ce99f562d6ccdd1a043adf2602))


### Performance Improvements

* **offline indicator:** improve reliability ([bd7c5ae](https://github.com/plebbit/plebchan/commit/bd7c5ae57912e54b7cf996952a291d7de2467cc6))



## [0.2.3](https://github.com/plebbit/plebchan/compare/v0.2.2...v0.2.3) (2024-07-03)


### Bug Fixes

* **board:** description and rules weren't visible on feed view ([4f312f6](https://github.com/plebbit/plebchan/commit/4f312f67c0354737d2fa37ee19e531990e880410))
* **catalog filters:** filters changed their opposite value ([b3bfc7f](https://github.com/plebbit/plebchan/commit/b3bfc7fccc9f90dfd88d51a85629684c5caa58b0))
* **catalog post:** floating post preview was not visible on mobile ([38e1c78](https://github.com/plebbit/plebchan/commit/38e1c7865417943329956e960a33b4fd50315692))
* **edit menu:** banning wasn't working properly ([9ee2c6c](https://github.com/plebbit/plebchan/commit/9ee2c6c00e6ddff5da84f349cccbaf60208c3cd1))
* **post mobile:** backlinks position was bugged ([6647f25](https://github.com/plebbit/plebchan/commit/6647f25bf88b54a11dfe64af2a56b2819e6c4d5a))
* **post:** '0 replies omitted' appeared if all replies are removed or deleted ([76fc1dd](https://github.com/plebbit/plebchan/commit/76fc1dd2f19eb9046ffd9c93dc03e9e244f50104))
* **post:** author edit reason was missing ([0783374](https://github.com/plebbit/plebchan/commit/0783374a30315d012aa0fffe76403f3658fbf98e))
* **tooltip:** position could change from top to side ([7fce789](https://github.com/plebbit/plebchan/commit/7fce78909602b43c17fd60cab5c45d15a6179af4))
* **topbar:** time filter would redirect to board home on mobile ([a662bb6](https://github.com/plebbit/plebchan/commit/a662bb6718e094022d4c3fa8fe222064bda697ae))


### Features

* 'tomorrow' theme applies the browser's dark color scheme ([387851d](https://github.com/plebbit/plebchan/commit/387851d74352281c6f75f71f0c46ea552eaf4e57))
* add FAQ page ([66cc23c](https://github.com/plebbit/plebchan/commit/66cc23c404f158c839bc1382aab2f0db3181a78a))
* **board header:** add sub online status info to offline icon title ([5276f0a](https://github.com/plebbit/plebchan/commit/5276f0ad43a38afc90b0341c5e91c904efb8348b))
* **catalog:** add 'you have blocked this board' message and unblock button ([d3c29fd](https://github.com/plebbit/plebchan/commit/d3c29fd6ece80c0293d5d757158373edec0912e6))
* **catalog:** display error from subplebbit in feed (such as, 'address is incorrect') ([9495e98](https://github.com/plebbit/plebchan/commit/9495e98183e9852d6c3ca1b172150d247c4b18e9))
* **homepage:** offline icons give info about the board online status ([c81c7b8](https://github.com/plebbit/plebchan/commit/c81c7b85f099c837a1bcb9f5cbf51e018c0bbd16))
* **post:** add 'user was banned for this post' if user was banned by board to post in it ([f6c1fb4](https://github.com/plebbit/plebchan/commit/f6c1fb400b4950ec38c0414e993929ecc78e8bdf))
* **post:** add post count and highlight functionality to u/address ([a6a41ed](https://github.com/plebbit/plebchan/commit/a6a41edd760a9b5f41302bd8008695f290a5c9e7))
* **post:** add tooltips for title and display names that are too long ([505aed4](https://github.com/plebbit/plebchan/commit/505aed4c2467bc90e44a6f300c45af8af1f51525))
* **post:** clicking "+" button next to "omitted replies" message shows all replies ([713739b](https://github.com/plebbit/plebchan/commit/713739b02f1572164f1923b48b4e4d19b0c48ebe))
* **post:** clicking "+" button next to "omitted replies" message shows all replies ([d78ce84](https://github.com/plebbit/plebchan/commit/d78ce84db407cbb364e447fec7ec74e4741e08d7))
* **post:** show edit reason as tooltip over red text ([1bccf87](https://github.com/plebbit/plebchan/commit/1bccf87750ceb32c8bcc016d6a92e2cba1fee438))
* **reply modal:** greentext by selecting text ([972964d](https://github.com/plebbit/plebchan/commit/972964dedafea109f2674a0fffff58e461b59912))
* **styles:** remember style selection per sfw or nsfw category, instead of single board ([06e1828](https://github.com/plebbit/plebchan/commit/06e18289a4d8b46f9b6e41d98d87aa16b02ceb68))



## [0.2.2](https://github.com/plebbit/plebchan/compare/v0.2.1...v0.2.2) (2024-06-22)


### Bug Fixes

* **catalog filters:** clarify label ([677fe64](https://github.com/plebbit/plebchan/commit/677fe641a3ad6aa33449ed4bf92bb31ede27dc4a))
* **catalog:** large image size was incorrect ([b5b5c5c](https://github.com/plebbit/plebchan/commit/b5b5c5ca467e2b1c1695a37d43b0a9ad9adcd9ce))
* **not found page:** only show 'back to p/...' button if subplebbitAddress is in valid format; limit img size ([1900d1c](https://github.com/plebbit/plebchan/commit/1900d1cdf2a9869ad3af8e9a7a2a563f9850c868))
* **post:** don't show c/quote in content if reply is removed or deleted ([533fc2f](https://github.com/plebbit/plebchan/commit/533fc2ffa3123519d4f0cee8c7766610a9434c44))
* **post:** mod and author edits weren't instant ([cb745ff](https://github.com/plebbit/plebchan/commit/cb745ffce62e63f6721f4024f1b843c549def548))
* **reply:** edit menu checkbox was displaced on mobile ([9052b0f](https://github.com/plebbit/plebchan/commit/9052b0f4f626fa70181b28986b8a3a76ae44f348))
* **themes:** changing theme would bug out ([032ba62](https://github.com/plebbit/plebchan/commit/032ba62cbefc41df328d8a3f1a767e6115736da5))



## [0.2.1](https://github.com/plebbit/plebchan/compare/v0.2.0...v0.2.1) (2024-06-20)


### Bug Fixes

* incorrect assets path ([4cca4a5](https://github.com/plebbit/plebchan/commit/4cca4a58dd0a8e4913cb10e7ab7bd19b46b57146))



# [0.2.0](https://github.com/plebbit/plebchan/compare/v0.1.17...v0.2.0) (2024-06-20)


### Bug Fixes

* **app:** prevent scrollbar glitch on board layout routes, also hiding unnecessary scrollbar in home ([61f2344](https://github.com/plebbit/plebchan/commit/61f23443ca6c2d48b9fdddce7e78ef948bb5ca6a))
* audio elements were displaced in catalog ([9090c18](https://github.com/plebbit/plebchan/commit/9090c186528ce79cb3da1d14ec48bb6a054997ba))
* **board banner:** subplebbit short address was wrong ([c491b07](https://github.com/plebbit/plebchan/commit/c491b0729588cc6f58094bea269c945fc0429de6))
* **board buttons:** don't show subscribe button in multiboards ([22657ff](https://github.com/plebbit/plebchan/commit/22657ff90a709349597cf6fbc01ef58ba0da76db))
* **board buttons:** link for return button was broken ([7086d6b](https://github.com/plebbit/plebchan/commit/7086d6b77711b3f45f707fead2f89d2d6ae17c4f))
* **board buttons:** return button was broken, subscribe button shouldn't render in p/all and p/subscriptions ([6f003f9](https://github.com/plebbit/plebchan/commit/6f003f9c11bac3579b8cdab0e1d6fbfa7924550e))
* **board stats:** table warning, margin ([b6f38b5](https://github.com/plebbit/plebchan/commit/b6f38b532a5ed51e74c6b3a623b208a1f2efa0cc))
* **board:** don't show description and rules until feed loads ([0f07e1e](https://github.com/plebbit/plebchan/commit/0f07e1eedeb3ea9f23657739a410755ea71a07c0))
* **catalog filter:** force show op comment for text-only threads ([da86c2f](https://github.com/plebbit/plebchan/commit/da86c2f17f37068cc0cf026a486dd2266c6237c2))
* **catalog post:** display title inline ([9ebf3b7](https://github.com/plebbit/plebchan/commit/9ebf3b79b69cdd0a0947bc5fc26a182cdefab7f5))
* **catalog post:** don't render markdown embeds and hr ([05f7977](https://github.com/plebbit/plebchan/commit/05f79774671a5d681182572fdb95ab1a95323464))
* **catalog:** don't show description or rules if they are defined but empty ([e191e40](https://github.com/plebbit/plebchan/commit/e191e403dbfd0e81dd6e80252255e3226b30b2ce))
* **challenge modal:** disable draggable on mobile ([9c2036a](https://github.com/plebbit/plebchan/commit/9c2036a6a17534b00198a2c2eda1e46b5a6ed580))
* **challenge modal:** react-draggable requires nodeRef in React StrictMode ([ef1580e](https://github.com/plebbit/plebchan/commit/ef1580e8c0c269363f52fc23013359637bf134f7))
* **comment media:** only show link if valid, show webpage links on mobile ([b778b88](https://github.com/plebbit/plebchan/commit/b778b887081772d4e468146d08e814b4f287388a))
* **comment media:** rename, refactor, fix performance ([e8c60fc](https://github.com/plebbit/plebchan/commit/e8c60fc5bec7ce7ee2afa809b1192a979e129027))
* **crypto wallets:** update translation ([40a95fd](https://github.com/plebbit/plebchan/commit/40a95fd6d83640967d2569addce4ed34fafb0517))
* **description:** escape character wasn't excluded from translation ([7648ef1](https://github.com/plebbit/plebchan/commit/7648ef1432e0bb2ce4c9aa18e68f6987314f9779))
* don't consider 'anti' tag as nsfw tag ([62b4c71](https://github.com/plebbit/plebchan/commit/62b4c71eb5b2077f82b86d1496accd1211ec8e45))
* don't show 'sub might be offline' alert in multisubs ([937abf8](https://github.com/plebbit/plebchan/commit/937abf8dcac03c1f6c5134449c5552f043a779cb))
* don't show subplebbit stats in multiboard feeds ([c83169e](https://github.com/plebbit/plebchan/commit/c83169ea1276c58d26dff33c32f24642c61b1464))
* **edit menu:** fix input value warning ([f20a5f2](https://github.com/plebbit/plebchan/commit/f20a5f21f9d76ea8735dd22385b112a36b359a92))
* **edit menu:** mod and author edits were conflicting ([efc9a98](https://github.com/plebbit/plebchan/commit/efc9a98f47777c45f7ea54b2b2821aa6c6709714))
* **embed:** detect uppercase extension in link ([86738de](https://github.com/plebbit/plebchan/commit/86738de226a57ae0b85601fbf0eef4dc591a82df))
* **embeds:** pass origin to youtube or popular videos won't load ([e91bb58](https://github.com/plebbit/plebchan/commit/e91bb587a1cbfa20fcaa6dd9e180157b35cbf806))
* **feed:** show last 5 replies of thread in feed, not first 5 replies ([608aa63](https://github.com/plebbit/plebchan/commit/608aa632d4c6ac19b4065b18e2215b07ff5e9984))
* hiding/blocking comments wouldn't work because useBlock takes cid, not address ([743bd9b](https://github.com/plebbit/plebchan/commit/743bd9b4c8312da4897297d297b95eb1a7bec6e7))
* **home:** allow button and search bar to resize for other languages ([b13734a](https://github.com/plebbit/plebchan/commit/b13734aedf8a285e05a0dfe419c7dcd0b6fee301))
* **home:** update twitter link ([019972a](https://github.com/plebbit/plebchan/commit/019972a7ffb86de82ee74a131b1b304d83da9ca7))
* incorrect pathname check would scroll to reply unexpectedly ([81972c9](https://github.com/plebbit/plebchan/commit/81972c9c8551ee6e6bf4f8fe50c3957fd2cd83bf))
* **index.html:** add no-referrer meta tag to resolve CORP-related media access issues ([f25978f](https://github.com/plebbit/plebchan/commit/f25978f180a39054ec118b662a74f6c9b758fd3b))
* **index.html:** disable auto zoom on some mobile browsers ([c042611](https://github.com/plebbit/plebchan/commit/c0426116e2e9ffb594c9f4b4144ebd59ba347cdb))
* link type in post form should be next to link field ([a048887](https://github.com/plebbit/plebchan/commit/a048887a58bfcd312b5ad3bb052dbd0f4d17db64))
* **markdown:** remove spoiler text, there's no syntax for it yet ([3108107](https://github.com/plebbit/plebchan/commit/31081079bca4d490c094ea1999c0842252c170e1))
* **markdown:** show single break ([967f781](https://github.com/plebbit/plebchan/commit/967f781cfd43841582b26eaff00205dfa1adc302))
* **multisubs:** don't show subscribe button ([07af318](https://github.com/plebbit/plebchan/commit/07af3187c69bc0357a58d4bfef15525eef87a609))
* **not found:** check if subplebbitAddress is valid before displaying 'back to' buttton ([f7ce689](https://github.com/plebbit/plebchan/commit/f7ce6890ec183cc6d287f34dc2d7fc8c5d914ed1))
* **not found:** force yotsuba theme with ref, not with params in app because they can't be detected in app ([5e8d743](https://github.com/plebbit/plebchan/commit/5e8d7436f9b09b39d1a5b5e8e1e2d03292a2d6c8))
* only show catalog post preview on mouse over thumbnail ([a8e3ce8](https://github.com/plebbit/plebchan/commit/a8e3ce8429f4d119e74649577a18ce9b7639b12d))
* **pending post:** settings were not shown correctly ([ddd063f](https://github.com/plebbit/plebchan/commit/ddd063fdef245d6a76637ce7de83f56f753aca81))
* performance, logic ([3eb9c5c](https://github.com/plebbit/plebchan/commit/3eb9c5c20f604f8081b913e2577d84992fbfbd60))
* **popular threads box:** default to worksafe content and show 8 posts for single subplebbit ([c6a1283](https://github.com/plebbit/plebchan/commit/c6a1283b56b0953d9513d7aa32d0d8c59a5cdfee))
* position floating catalog post preview relative to thumbnail dimensions ([2a5ecf9](https://github.com/plebbit/plebchan/commit/2a5ecf90ee7372cc8aeb7d59ee14b29b3e8bb749))
* **post form:** close after publish, reset fields ([359031c](https://github.com/plebbit/plebchan/commit/359031c1df344a2eea81c571b1fceb60bca453e1))
* **post menu mobile:** close after hiding reply ([bbc3f30](https://github.com/plebbit/plebchan/commit/bbc3f30e18903b1fbfe076e2ed50b18976a68713))
* **post menu:** use floating ui to dynamically position dropdowns based on available space ([d964590](https://github.com/plebbit/plebchan/commit/d964590f544029ae126a5e0dd4fec9f44ee86845))
* **post mobile:** clearfix for floating media ([84dae0a](https://github.com/plebbit/plebchan/commit/84dae0a19bfc46205091b2b0677308b0ac6c0caa))
* **post:** break words on mobile to prevent overflow ([8e6aca6](https://github.com/plebbit/plebchan/commit/8e6aca6e324889bc7ef05e02de9c27c235d5b441))
* **post:** don't show replies in pending post page ([b785d00](https://github.com/plebbit/plebchan/commit/b785d00ec429214d6ca805941367b8e5b1c3c25d))
* **post:** limit displayName length ([607aad9](https://github.com/plebbit/plebchan/commit/607aad93796b567824ed38c8f1da7187f4e58393))
* **post:** post menu position was wrong on some browsers ([cc06d54](https://github.com/plebbit/plebchan/commit/cc06d54c81e89bf2b2a565e9dfd5bff67a08eb00))
* **post:** prioritize 'failed' state over 'pending' ([fc459d9](https://github.com/plebbit/plebchan/commit/fc459d9533505cd911760fb36e92a70e42d45c1d))
* **post:** remove margin to fix virtuoso glitch on desktop ([af75215](https://github.com/plebbit/plebchan/commit/af752159383b94d7c228e6e16f2518744b5ee6a8))
* **reply modal:** add minimal timeout to allow rerender when already opened ([05cc3c4](https://github.com/plebbit/plebchan/commit/05cc3c41740a96c64bd7b30e9c09a98c76cff3b5))
* **reply modal:** autofocus caused auto scroll to top on mobile ([952d446](https://github.com/plebbit/plebchan/commit/952d446c4d41a742139c543fdfc21fb32f4f26a9))
* **reply modal:** do nothing when clicking another cid while modal is opened ([4fa6f60](https://github.com/plebbit/plebchan/commit/4fa6f6079216b6e74c9fd1cf0616ea243bb91c75))
* **reply modal:** get mobile scroll position from hook before render ([1e91119](https://github.com/plebbit/plebchan/commit/1e9111968730f05adac0267cf4efdbd146042485))
* **reply modal:** improve c/parentCid styling in textarea ([148e6f1](https://github.com/plebbit/plebchan/commit/148e6f1989586db81222d80cb2cbf1d04e8932fd))
* **settings:** decode subplebbit address with emoji to fix pathname ([2ecedcc](https://github.com/plebbit/plebchan/commit/2ecedcc956b456b84966b8e1a148a878af8a083b))
* spoiler text wasn't rendering on mobile ([656c31c](https://github.com/plebbit/plebchan/commit/656c31c0132559cd23da09c3641cfaf1451b3c88))
* **subplebbit description:** prevent escaping characters in translation ([aac20c4](https://github.com/plebbit/plebchan/commit/aac20c4671bbd07cd6756217ff270510bbf2464c))
* **subscriptions:** show info if no subs found ([b07a06f](https://github.com/plebbit/plebchan/commit/b07a06fa129fd926201f3e6cb2310c40d38c3226))
* time filter appeared twice on mobile ([ae1b860](https://github.com/plebbit/plebchan/commit/ae1b860f3b4a9248399ec9bbf4d34cd5329af788))
* **topbar:** settings link would 404 ([1aff0d3](https://github.com/plebbit/plebchan/commit/1aff0d3adaec753e23a00276382b34641a88979b))
* **use-replies.ts:** flatten and display replies of replies not yet published ([6e20b86](https://github.com/plebbit/plebchan/commit/6e20b86b7bb0bdabd524154bce01152662ee9c9a))
* **use-replies.ts:** flatten comment pages ([087d4ab](https://github.com/plebbit/plebchan/commit/087d4ab738967d460e392daee291c220759bc473))
* **use-replies:** sort by timestamp and move pinned replies to the top ([8b000a0](https://github.com/plebbit/plebchan/commit/8b000a0bdb225040319829b8ae92d77aa1501b83))
* **use-subplebbits-stats:** hook would fetch the same stats if pending fetching ([79b660e](https://github.com/plebbit/plebchan/commit/79b660eaa02e3dac9923064b36013965be560844))
* **use-theme:** body css would bug out on navigation ([73f4136](https://github.com/plebbit/plebchan/commit/73f4136f535bc221c8f29abd2d29e991c09d6287))
* video thumbnails stuck on loading, post page overflow ([0036508](https://github.com/plebbit/plebchan/commit/00365086623dd05ea5a81be04790a68fba45bb25))
* wrong document titles ([19164db](https://github.com/plebbit/plebchan/commit/19164db606a71ea9dc2e293586d7b6c9ea52c444))
* wrong mobile value ([3a6d2f1](https://github.com/plebbit/plebchan/commit/3a6d2f16b0023607680c70929eb12dfaf888bb90))
* wrong route check, default time filter value, missing translation ([0831e75](https://github.com/plebbit/plebchan/commit/0831e757bb13aecf0ff3039b077fcf5f7b2fbae1))


### Features

* **account settings:** improve UI ([c31c0a4](https://github.com/plebbit/plebchan/commit/c31c0a4482943be76d2c372fcb919a64153da521))
* add '(You)' in quote links ([5f792f4](https://github.com/plebbit/plebchan/commit/5f792f40f059dc6dbfa1c572c4a3c6d56f9a2429))
* add 'not found' view ([5d124d2](https://github.com/plebbit/plebchan/commit/5d124d21211bec05cf0380bb58334871d6720fe9))
* add "hidden threads" counter and button in catalog and board view, store and hook ([fd092f1](https://github.com/plebbit/plebchan/commit/fd092f1bee9899a25167e156f7f82c40bfa9ba7e))
* add backlink highlight and scroll ([1911b62](https://github.com/plebbit/plebchan/commit/1911b623d9cbe56e9684ef4cef002f495ac1dd57))
* add board-banner ([b99e9f1](https://github.com/plebbit/plebchan/commit/b99e9f143b40c71d04147aec5634235a5704384a))
* add challenge modal ([cc5d042](https://github.com/plebbit/plebchan/commit/cc5d04288981ecbe2fec851d4669fcf874ddc216))
* add edit menu on mobile ([1d84526](https://github.com/plebbit/plebchan/commit/1d8452684b45f6ac4391591d49af6301ce385d9c))
* add floating quote preview to mobile replies ([84c0490](https://github.com/plebbit/plebchan/commit/84c04904f3ae370810a6ee66dd28ff6c1da6b928))
* add mod menu ([daaba0f](https://github.com/plebbit/plebchan/commit/daaba0f006b9b8f639775c1e6ff32f25485adb95))
* add new banner image ([a269e10](https://github.com/plebbit/plebchan/commit/a269e102e4c01aad8e4fbde27042dfde944d6ff7))
* add offline icon to board title, show alert before posting if sub appears offline ([a2c1ec4](https://github.com/plebbit/plebchan/commit/a2c1ec441f005562792185195b3a2d53bdfd6c54))
* add post-menu-mobile ([475d9ae](https://github.com/plebbit/plebchan/commit/475d9ae4166e887748e0211776dff7cb23e4db8a))
* add reply modal ([0962c10](https://github.com/plebbit/plebchan/commit/0962c10685e914162796526419ab315fa439bd5e))
* add spoiler image ([9f5f92f](https://github.com/plebbit/plebchan/commit/9f5f92f714a1305ce71fab78be5d962c3918d0d4))
* add spoiler text ([70a2045](https://github.com/plebbit/plebchan/commit/70a20450bbf37943038cc310d894c32fac8798af))
* add time filter to p/all and p/subscriptions ([15bffe8](https://github.com/plebbit/plebchan/commit/15bffe89bf7a82ef7d9d7b4c125136bd7bdeb87e))
* **android:** update icon ([0391b24](https://github.com/plebbit/plebchan/commit/0391b249df9b7b6ea882b13eff7ffecd369319de))
* **app:** add description and rules views ([a508059](https://github.com/plebbit/plebchan/commit/a508059af1dca5ab1c1d9c53c6c10522f44335e3))
* **app:** add pending post view ([394c7d8](https://github.com/plebbit/plebchan/commit/394c7d8a810fe8c2b95db4c656cd3f574d00b691))
* **app:** add post page ([dcd29a4](https://github.com/plebbit/plebchan/commit/dcd29a46bb4032a3de934f3409a643a5dd5b3e5c))
* **board buttons:** improve layout, increase dimensions of post form on mobile, add refresh buttons ([bc74a9f](https://github.com/plebbit/plebchan/commit/bc74a9ff77aa3dda194ac966a6d3cac505c100c1))
* **board nav:** add home and settings buttons ([9096eca](https://github.com/plebbit/plebchan/commit/9096eca4fbb8994a92fa5af087f9f63599af7f5f))
* **board nav:** add sticky header animation to mobile ([bb9d53f](https://github.com/plebbit/plebchan/commit/bb9d53f47c847159c2b25b2c5bbd2f64ca0c6cac))
* **board nav:** if in catalog view, navigate to select sub's catalog view ([32e95dd](https://github.com/plebbit/plebchan/commit/32e95dda525bb9d2b11b3ca43455027e3858660c))
* **board nav:** order board list by multisub category ([474dede](https://github.com/plebbit/plebchan/commit/474dede5db55c5e9ce2dec41518f1c544af5db57))
* **board nav:** update mobile navbar animation on scroll ([6a386fa](https://github.com/plebbit/plebchan/commit/6a386fa1747af83aedae72d85d0dd7a22bec7bcb))
* **board nav:** use titles from multisub ([6aa5f38](https://github.com/plebbit/plebchan/commit/6aa5f3806379eae435ab275e2446d937666048ff))
* **board:** add p/all and p/subscriptions ([86223bb](https://github.com/plebbit/plebchan/commit/86223bb249685d9147dd9b99229d62de95910ba8))
* **board:** add post form UI on desktop with link type previewer ([a5a7a97](https://github.com/plebbit/plebchan/commit/a5a7a97e4712c6f27fe028d604fd508b23728593))
* **board:** show error in feed near loading string ([4b2a602](https://github.com/plebbit/plebchan/commit/4b2a6025d39d70987dea62346ee40b8e7003f706))
* **catalog post:** add hidden style ([8959945](https://github.com/plebbit/plebchan/commit/89599457228a8835575ff9a18f1a755c2910396d))
* **catalog post:** add loading skeleton for image, "file deleted" fallback img ([2aa5dc0](https://github.com/plebbit/plebchan/commit/2aa5dc01eb0955af5829e426a1c4a9481f4b442e))
* **catalog post:** add spoiler styling and text, add markdown to content ([914a7de](https://github.com/plebbit/plebchan/commit/914a7dee185826fa1e77e1457af764ba186e7854))
* **catalog post:** allow selecting text in posts with media thumbnails ([a7c7464](https://github.com/plebbit/plebchan/commit/a7c74640779dbd729560b58644192cc31e5fb373))
* **catalog post:** close menu button with second click ([38e958b](https://github.com/plebbit/plebchan/commit/38e958bed8ba6b2c3943b7f5b0ecf2f29345e2fa))
* **catalog row:** add post menu button ([a6ae543](https://github.com/plebbit/plebchan/commit/a6ae543b4a589d8664f596a09a0e4c2c5a0d5fdc))
* **catalog:** add 'image size' and 'show OP comment' options ([7f3630e](https://github.com/plebbit/plebchan/commit/7f3630e28907c9dbd75d593f6b02910d6d128175))
* **catalog:** add catalog post previews ([88dcfca](https://github.com/plebbit/plebchan/commit/88dcfcaca8cdfb38d3bc3f25863451abefb0d1d2))
* **catalog:** add filter to hide text-only threads, turned on by default ([ce93915](https://github.com/plebbit/plebchan/commit/ce93915919041e00de43426a1fd08ef75b45834a))
* **catalog:** add filters modal for text-only posts, nsfw boards in p/all ([aa63ab0](https://github.com/plebbit/plebchan/commit/aa63ab0f1b69e0e4a6f7a2d685dd1ade9f53586d))
* **catalog:** add filters to mobile ([e860593](https://github.com/plebbit/plebchan/commit/e860593650715838b48ddc1170adab0808e70733))
* **catalog:** add media, styling ([65c99ab](https://github.com/plebbit/plebchan/commit/65c99ab1887a99d3bdaf04a7641c7883699a574a))
* **catalog:** add post menu ([572eb3b](https://github.com/plebbit/plebchan/commit/572eb3b4e203b870469543af37261d434bf7cf82))
* **catalog:** add refresh button ([9c9249d](https://github.com/plebbit/plebchan/commit/9c9249da94c9d6ca4b253aa7a49961f5509d5f62))
* **catalog:** add sorting option ([1ecb2ba](https://github.com/plebbit/plebchan/commit/1ecb2ba13dcf5b379b578a88c5efb5294de9b336))
* **catalog:** add sticky and closed icons ([2fc12bb](https://github.com/plebbit/plebchan/commit/2fc12bbafeba0d3802c0421ddac5912683c92b95))
* **catalog:** apply filter for text-only threads to rules and description ([d9234c4](https://github.com/plebbit/plebchan/commit/d9234c4e2a926c13fba62c78527896994b79c535))
* **crypto wallets setting:** improve UI ([65b3b99](https://github.com/plebbit/plebchan/commit/65b3b997fb7d44e11852fe12d36be3b9b625fa29))
* **edit menu:** add comment edit and delete for authors ([2fabd3c](https://github.com/plebbit/plebchan/commit/2fabd3cf549f53da890bb30557fcaa734d8de92a))
* **embed:** add support for soundcloud embeds, show webpage links on mobile, adjust audio embeds ([7dba08c](https://github.com/plebbit/plebchan/commit/7dba08ca00befd82d6a103f1cc36e03e55b3e495))
* **feed:** add description and rules ([dcf0dd9](https://github.com/plebbit/plebchan/commit/dcf0dd98e4b4857a0bba33a23c2b33ef4fec3e60))
* hide button for posts soft hides them persistently without blocking the cid ([67e3bc8](https://github.com/plebbit/plebchan/commit/67e3bc8d685711e042cb76f28e49e0ed7b88c07f))
* hide media if spoiler ([052476a](https://github.com/plebbit/plebchan/commit/052476ad1ad839cb56c17bfe271b6fbe82f5df1e))
* highlight reply if visible, render it as floating preview if not visible ([fc21d87](https://github.com/plebbit/plebchan/commit/fc21d876ff253a0dd14a5ba37683bfa854bc4230))
* **home:** add custom hook for stats functionality ([798dfc4](https://github.com/plebbit/plebchan/commit/798dfc424ff48823a19b4e978b1a7f67070d09af))
* **home:** add filter options to boards box ([8d4c440](https://github.com/plebbit/plebchan/commit/8d4c4404c3a66bf6d4f950b7e1f0c61009915e5d))
* **home:** add multisub boards with categories, subscriptions list, moderating boards list ([de81073](https://github.com/plebbit/plebchan/commit/de8107372f92082f891ce8e41fe7654ca491e4bb))
* **home:** add offline icon for subs in board list ([6b71d90](https://github.com/plebbit/plebchan/commit/6b71d9009af580b19cc813af6259d33ca6fc32fe))
* **home:** add options to popular threads box ([fabcc1d](https://github.com/plebbit/plebchan/commit/fabcc1d2e1448223bcb29434e613c8bf5707e349))
* **home:** add popular threads box ([02b287f](https://github.com/plebbit/plebchan/commit/02b287fc12a17ab4228c2fd140b630bee8f0941d))
* **home:** add version in footer ([4614e5d](https://github.com/plebbit/plebchan/commit/4614e5dbc49e794c3dba55816f38969f47da341b))
* **home:** in popular threads box, show more posts per sub depending on available subs ([98c52e6](https://github.com/plebbit/plebchan/commit/98c52e65daf8feba38a4c82b1f14fac62c5fc02f))
* **home:** mark board as nsfw if it has at least one of nsfw tags in multisub ([c33c546](https://github.com/plebbit/plebchan/commit/c33c54613dcf0f055fcd95fc33069d526922535a))
* **home:** user can connect to a sub with search bar ([568189b](https://github.com/plebbit/plebchan/commit/568189bfea9848fcaf5555157bf7309055f7e249))
* **home:** user can download desktop client from footer button ([e59a229](https://github.com/plebbit/plebchan/commit/e59a2290ab8c37db054e1a687d4019bc8789aa6c))
* **loading ellipsis:** improve animation ([eddc098](https://github.com/plebbit/plebchan/commit/eddc0982bb5c8cf1f086af4ca96b011de9146c3b))
* **media:** add support for audio links ([0a52944](https://github.com/plebbit/plebchan/commit/0a52944a07d0dff523f4e35704e4bd235e284e73))
* **multisubs:** add catalog view ([cc2a640](https://github.com/plebbit/plebchan/commit/cc2a640ae247845b2ee3bf9a4d94da513dd08b91))
* **multisubs:** add settings modal ([970c726](https://github.com/plebbit/plebchan/commit/970c726720f065c2c5790f42dde5c79b5817751b))
* **multisubs:** add subplebbit address in post info ([82fe238](https://github.com/plebbit/plebchan/commit/82fe23897992f31eb28848bb2831c01d02a33912))
* **p/all:** add description view ([09f05ac](https://github.com/plebbit/plebchan/commit/09f05ac8a0eb5b655e31f21e45c83e6e7ef8b57d))
* **p/all:** use multisub title, description and createdAt in mock description and board header ([11d1424](https://github.com/plebbit/plebchan/commit/11d1424c0a890b43a5fecb048d894d3c81b7340f))
* **post desktop:** add hide/unhide replies ([8b60172](https://github.com/plebbit/plebchan/commit/8b601726aeaffdabc6a55d129794e24aec96411e))
* **post form:** add on mobile ([3573b65](https://github.com/plebbit/plebchan/commit/3573b65ffa8f2f96df1c1a6c6e72e6194a939bed))
* **post form:** add reply publishing in post page ([cf7d59c](https://github.com/plebbit/plebchan/commit/cf7d59c9b86a2e33370b2a56d6821a1b0a0a4799))
* **post form:** add row for link type, add spoiler option ([6223cb0](https://github.com/plebbit/plebchan/commit/6223cb0b24fc2b74c42695e458ad768e8aaf7bcc))
* **post form:** enable posting from p/all or p/subscriptions ([797d665](https://github.com/plebbit/plebchan/commit/797d66515021a181ba7b8bc9ca92aab0bda6c4cd))
* **post form:** replace single return with double return on submit, because markdown is mandatory on plebbit, but a user from 4chan won't know that ([ccb75fc](https://github.com/plebbit/plebchan/commit/ccb75fcf3a6057a0a09e1fcd0456654a1af1bc00))
* **post menu:** add copy link button (share link) ([caacd77](https://github.com/plebbit/plebchan/commit/caacd77bbabc26aada1845c68791144797105e86))
* **post menu:** add reverse image search ([677407c](https://github.com/plebbit/plebchan/commit/677407cd52f5f25be24b56c20d500dda9692df81))
* **post mobile:** add hide and unhide posts and replies ([0c02a6b](https://github.com/plebbit/plebchan/commit/0c02a6b9b68e5f525a784b68cc294a8c6ac91948))
* **post page:** add view specific buttons ([f5fefd5](https://github.com/plebbit/plebchan/commit/f5fefd51cf537b41ae7bf14b085505824185f7ef))
* **post page:** scroll to top, show full content, no hide thread ([e960f79](https://github.com/plebbit/plebchan/commit/e960f791b98063da7f2b3bde40df41f5e8b80712))
* **post:** add 'this thread is closed" alert for locked, removed, deleted comments ([84f5555](https://github.com/plebbit/plebchan/commit/84f55557c1cd5c5b477990e8e1ba62801cbebc8f))
* **post:** add "file deleted" img on error ([1882446](https://github.com/plebbit/plebchan/commit/18824468d403d68e313d2223bd6083067d0c0ba4))
* **post:** add "show original" button to content edit ([e4febb9](https://github.com/plebbit/plebchan/commit/e4febb9df087cacbc495de235687e68d078d8194))
* **post:** add "time ago" tooltip to dates ([19222a6](https://github.com/plebbit/plebchan/commit/19222a66fe6a98160bf0c28be265a3411e15d160))
* **post:** add block options to mobile menu ([3206631](https://github.com/plebbit/plebchan/commit/3206631e897218b84e41fd6c33028c2760668e3a))
* **post:** add content, links, buttons, optimize for feed scroll ([67f9334](https://github.com/plebbit/plebchan/commit/67f93349dd137d27c0e361855a7117aba52b3e2a))
* **post:** add deleted and removed styling, mod reason, file deleted ([05a8e91](https://github.com/plebbit/plebchan/commit/05a8e913313b40c40f64ca737b57abf2f12af384))
* **post:** add embed button and media to links in post content detected as valid embed links ([6bfa899](https://github.com/plebbit/plebchan/commit/6bfa899722f7f2e627d823a11edcbb0a8b288d28))
* **post:** add floating preview of media from link in post content ([39a48c9](https://github.com/plebbit/plebchan/commit/39a48c95159b259b95e11c4ed3144633bcf29cb4))
* **post:** add links and media info, including embed ([d0a3e95](https://github.com/plebbit/plebchan/commit/d0a3e959fcc1f76a067b6f726a39ddf8796e5dc7))
* **post:** add mod role to display name ([ebf1e42](https://github.com/plebbit/plebchan/commit/ebf1e426f596dc6a4004c73982a8fe444fab6d91))
* **post:** add post info row, update themes ([992ed5d](https://github.com/plebbit/plebchan/commit/992ed5dbb02f15af6d2841c25333c0e3494b709d))
* **post:** add post menu component with links to other clients ([08cb073](https://github.com/plebbit/plebchan/commit/08cb0736daee6dabbc9f5e3ec0e6165ed008c04b))
* **post:** block posts via the minus button (to collapse) or via the post menu ([32f5220](https://github.com/plebbit/plebchan/commit/32f52200b74d7160a6fbd94e080cd4483c0ddb52))
* **post:** choose date/time format from translations locale ([d9ac34e](https://github.com/plebbit/plebchan/commit/d9ac34ef0f2400b3d1aa7088aa38d17dfc926b6c))
* **post:** don't show link if it's not a valid url ([3524803](https://github.com/plebbit/plebchan/commit/3524803196e49dc12e578c5d8c0b059f8fbba634))
* **replies:** add backlinks ([cbc99f4](https://github.com/plebbit/plebchan/commit/cbc99f42b04e0170d2f441624cdf3fe13d84965a))
* **replies:** sort by timestamp ([35572de](https://github.com/plebbit/plebchan/commit/35572ded55bc0736b4559afde480300b1ad426cb))
* **reply modal:** add c/parentCid above textarea, fix tomorrow theme ([5f3ff17](https://github.com/plebbit/plebchan/commit/5f3ff17eccf3bf875493d1b1a0f4d4723f046f32))
* **reply modal:** add link type previewer, spoiler option ([c5d55a9](https://github.com/plebbit/plebchan/commit/c5d55a9dd5e6b0d9072f34e9abe636ad1a121c50))
* **reply modal:** change displayName from name field, style focused inputs, translate title ([1e5c675](https://github.com/plebbit/plebchan/commit/1e5c675e95f9c7a9eb5f96204a4e4788cc32ab3b))
* **reply modal:** disable draggable on mobile and calculate absolute top position ([d6179d0](https://github.com/plebbit/plebchan/commit/d6179d0fdca562a376cf0fd8bb18f1fa9cc7144c))
* **reply modal:** show alert before posting if subplebbit might be offline ([d71889a](https://github.com/plebbit/plebchan/commit/d71889a3de40de6a0347c82cc7ece2b178e6be54))
* **reply:** add floating quote preview ([b44fb15](https://github.com/plebbit/plebchan/commit/b44fb150785ac7f04e73fb1e251eb25a635087b9))
* **settings:** add 'check for updates' button ([ca22841](https://github.com/plebbit/plebchan/commit/ca22841ea48114e5fbf143587911d0ae608da0c9))
* **settings:** add account data settings ([b2bfc24](https://github.com/plebbit/plebchan/commit/b2bfc2440da171e967fb3bc883df50c00fb32b80))
* **settings:** add blocked addresses setting ([42a6fb4](https://github.com/plebbit/plebchan/commit/42a6fb4a701898aae89657a98744290a423bad61))
* **settings:** add crypto wallets ([ae02eba](https://github.com/plebbit/plebchan/commit/ae02eba4df7253e4a01deb4a9a6065e71bc74e9d))
* **settings:** add expand all button ([91d2a5a](https://github.com/plebbit/plebchan/commit/91d2a5ae014dd8498cb9d3284904db333fb2bf5d))
* **settings:** add interface settings category ([d78924f](https://github.com/plebbit/plebchan/commit/d78924facbd6c86995ee5c21075a0416b555a799))
* **settings:** add plebbit options ([bf09de9](https://github.com/plebbit/plebchan/commit/bf09de98f9ddf68965252d975c3fad72a097428a))
* **subplebbit:** add automatic theme based on nsfw or sfw tags ([22c1acd](https://github.com/plebbit/plebchan/commit/22c1acdd3dbe29cab05626018538dd4361b28933))
* **subplebbit:** add feed, posts ([f1af55e](https://github.com/plebbit/plebchan/commit/f1af55edf0069da7c3f016d93b2a67b7b68ab4dc))
* **topbar:** add search bar ([e39c171](https://github.com/plebbit/plebchan/commit/e39c171eac566daa447153e8bb6f3a71b494dcc6))


### Performance Improvements

* abstract reply modal logic into hook for post page and board page ([ff8882c](https://github.com/plebbit/plebchan/commit/ff8882ce9c32aac0034a6b09b18979eca0d26d1b))
* **app:** limit load of subplebbit with preload of layout ([9626c6c](https://github.com/plebbit/plebchan/commit/9626c6c9d8a24859ea9a206c41c3cdb0785f5750))
* apply cachebuster to not found img and board banners ([1f4213a](https://github.com/plebbit/plebchan/commit/1f4213ae0bc7279b6ba3cf441611b3fb3f3d9ad6))
* **app:** memoize board layout, update subplebbit view ([f4dba57](https://github.com/plebbit/plebchan/commit/f4dba57945cc70e624d57cf770f06a5fb9294e4d))
* **app:** optimize subs loading as much as possible ([311896d](https://github.com/plebbit/plebchan/commit/311896d1220477e2979b9bb8bd09afb0688d1639))
* **board nav:** reduce animation rerenders with useRef ([3eabe70](https://github.com/plebbit/plebchan/commit/3eabe70e1cf4e393be551dccc2367f04542d3974))
* **catalog:** optimize feed row rendering ([34f79bf](https://github.com/plebbit/plebchan/commit/34f79bf67d2e0c92c9e9967ac805fadea7d819de))
* **feed:** optimize postsPerPage ([b1e3400](https://github.com/plebbit/plebchan/commit/b1e3400d4424e5a0314077df6bdc32ef87ec099a))
* improve responsiveness ([62b83bf](https://github.com/plebbit/plebchan/commit/62b83bf7ea236404fe5d4b421ad084560eb88574))
* **markdown:** memoize ([af5a544](https://github.com/plebbit/plebchan/commit/af5a5443a717755f94a4819909fd0ae280485ac3))
* **post:** load post components conditionally ([50df786](https://github.com/plebbit/plebchan/commit/50df786a86e5efa8baa21afd89464a30ced1a78b))
* rewrite plebchan completely ([c4a5cfe](https://github.com/plebbit/plebchan/commit/c4a5cfec49c54f00f13599dd082b1b7140b0ce87))
* **use-theme:** refactor for performance, fix initial theme load after refresh ([3bb1b2f](https://github.com/plebbit/plebchan/commit/3bb1b2f8c1895349d6685cb73b5ef7aa213a7795))



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



