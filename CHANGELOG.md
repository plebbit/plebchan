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



