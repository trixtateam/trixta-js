# [5.1.0](https://github.com/trixtateam/trixta-js/compare/v5.0.0...v5.1.0) (2022-07-12)


### Features

* update RSJF and make use of submitButtonOptions ([15d6682](https://github.com/trixtateam/trixta-js/commit/15d6682c77acbacdfffae494c3c0f790a3b765e1))

# [5.0.0](https://github.com/trixtateam/trixta-js/compare/v4.14.1...v5.0.0) (2022-07-04)


### Features

* trixta auth refactored ([1f24138](https://github.com/trixtateam/trixta-js/commit/1f2413829d91d130e140b66389284487990723d7))


### BREAKING CHANGES

* useTrixtaAccess and useTrixtaAuth no longer use roles prop but roleName

## [4.14.1](https://github.com/trixtateam/trixta-js/compare/v4.14.0...v4.14.1) (2022-06-28)


### Bug Fixes

* null check before destructuring data ([c623aac](https://github.com/trixtateam/trixta-js/commit/c623aac91b3337ea2211f71273e572268a8f49eb))

# [4.14.0](https://github.com/trixtateam/trixta-js/compare/v4.13.0...v4.14.0) (2022-06-03)


### Features

* useTrixtaAccess hook ([11578bd](https://github.com/trixtateam/trixta-js/commit/11578bda81f012124749c34d110d4e921dee2faf))

# [4.13.0](https://github.com/trixtateam/trixta-js/compare/v4.12.0...v4.13.0) (2022-04-22)


### Features

* breaking change, selectors have been renamed.

* implemented phoenix-to-redux package service update ([8b44e00](https://github.com/trixtateam/trixta-js/commit/8b44e009a8dea79af0758e6ad4752dc860d62c15))

# [4.12.0](https://github.com/trixtateam/trixta-js/compare/v4.11.0...v4.12.0) (2022-03-25)


### Features

* should role access change, autosubmit for useTrixtaAction will resubmit ([7ae3d59](https://github.com/trixtateam/trixta-js/commit/7ae3d59dbab169842c46723af44d69f5b2260b88))

# [4.11.0](https://github.com/trixtateam/trixta-js/compare/v4.10.1...v4.11.0) (2022-03-11)


### Features

* added trixta auth component ([e9e8e68](https://github.com/trixtateam/trixta-js/commit/e9e8e68e0440118401d47a6e28b7ac8bf9d981d2))

## [4.10.1](https://github.com/trixtateam/trixta-js/compare/v4.10.0...v4.10.1) (2022-03-08)


### Bug Fixes

* use correct types for onError and onSuccess callbacks for hooks ([c3e3a64](https://github.com/trixtateam/trixta-js/commit/c3e3a64de28c0c0b2dbed2738ecc36d959d08d5d))

# [4.10.0](https://github.com/trixtateam/trixta-js/compare/v4.9.1...v4.10.0) (2022-01-02)


### Features

* implement react json schema form ([6fa4954](https://github.com/trixtateam/trixta-js/commit/6fa4954f2d72589164f78558e83d81f27095b397)), closes [#24](https://github.com/trixtateam/trixta-js/issues/24)

## [4.9.1](https://github.com/trixtateam/trixta-js/compare/v4.9.0...v4.9.1) (2021-12-22)


### Bug Fixes

* multiple on success and error callbacks when using loadingStatusRef prop ([78c6b68](https://github.com/trixtateam/trixta-js/commit/78c6b68e5b2fe02f16210839ef7205c75842272b))

# [4.9.0](https://github.com/trixtateam/trixta-js/compare/v4.8.0...v4.9.0) (2021-11-30)


### Features

* check for existing role data and not replace on reconnect of socket ([5d6a480](https://github.com/trixtateam/trixta-js/commit/5d6a480df6b45a3b921dc1d38171f6b7e90cc75d))

# [4.8.0](https://github.com/trixtateam/trixta-js/compare/v4.7.0...v4.8.0) (2021-11-26)


### Features

* callback function for use-respond-to-reaction-effect ([4ffa280](https://github.com/trixtateam/trixta-js/commit/4ffa280856655ba545ccc1fdc600511871c3ead0))

# [4.7.0](https://github.com/trixtateam/trixta-js/compare/v4.6.0...v4.7.0) (2021-11-25)


### Features

* response instances with timeStamp ([e9536d7](https://github.com/trixtateam/trixta-js/commit/e9536d7d96155d14f3086e27dc67ffb2693adfc3))

# [4.6.0](https://github.com/trixtateam/trixta-js/compare/v4.5.0...v4.6.0) (2021-11-17)


### Features

* extraData parameter to pass onto response ([626c092](https://github.com/trixtateam/trixta-js/commit/626c092738c0b619ca7c14b3ef54779ceb96e9ed))

# [4.5.0](https://github.com/trixtateam/trixta-js/compare/v4.4.2...v4.5.0) (2021-11-10)


### Features

* document redux store ([39e0751](https://github.com/trixtateam/trixta-js/commit/39e0751492f417d6088a7a0377dc4278280884f2))

## [4.4.2](https://github.com/trixtateam/trixta-js/compare/v4.4.1...v4.4.2) (2021-10-26)


### Bug Fixes

* trixta hooks use ref for callbacks ([e26e999](https://github.com/trixtateam/trixta-js/commit/e26e999e442292c26d656e46f79805ba2113519c))

## [4.4.1](https://github.com/trixtateam/trixta-js/compare/v4.4.0...v4.4.1) (2021-10-26)


### Bug Fixes

* hook callbacks submit only once ([94d963f](https://github.com/trixtateam/trixta-js/commit/94d963fe588823e52ecff29f6b6d6996e46d40d8))

# [4.4.0](https://github.com/trixtateam/trixta-js/compare/v4.3.1...v4.4.0) (2021-10-20)


### Features

* useTrixtaData hook ([ae5a0d4](https://github.com/trixtateam/trixta-js/commit/ae5a0d47926840bb6582beca0efd3d997b19a779))

## [4.3.1](https://github.com/trixtateam/trixta-js/compare/v4.3.0...v4.3.1) (2021-09-29)


### Bug Fixes

* loadingStatusRef for hooks ([c360efd](https://github.com/trixtateam/trixta-js/commit/c360efdbb05ad2ddbb2cb3588ef2475c1b12bf8d))

# [4.3.0](https://github.com/trixtateam/trixta-js/compare/v4.2.0...v4.3.0) (2021-09-28)


### Features

* loading status ref ([0e51829](https://github.com/trixtateam/trixta-js/commit/0e51829e0df23704cb68275045474091ec2afb99))

# [4.2.0](https://github.com/trixtateam/trixta-js/compare/v4.1.3...v4.2.0) (2021-09-20)


### Features

* timeout events for trixta actions and reactions ([82d9dcc](https://github.com/trixtateam/trixta-js/commit/82d9dcc7aa4c4975a58350ba24a76022f9f7de37))

# 1.0.0 (2021-04-28)


### Bug Fixes

* add role when successfully joined to channel ([0c067c5](https://github.com/trixtateam/trixta-js/commit/0c067c5c1cf835850330a755de583dd5ced52a7b))
* check for action and reaction key name exists ([7057752](https://github.com/trixtateam/trixta-js/commit/7057752cd3272d21a1355ed538cca0d5f9d5414c))
* check for actions keyName ([463712b](https://github.com/trixtateam/trixta-js/commit/463712b662647a2b8b61e2d9807ffce750ecf457))
* check for mode on actions and reactions ([7795de9](https://github.com/trixtateam/trixta-js/commit/7795de9fb2a24baa813f916eaafda638e4d9f811))
* check for non exising role in state ([5c2d596](https://github.com/trixtateam/trixta-js/commit/5c2d5966abe9e962856dc6905b807aee6b1bcfde))
* ci ([b6ba88d](https://github.com/trixtateam/trixta-js/commit/b6ba88d6a4e5fb5bc34afc726ebc6fbea25b697a))
* export saga function ([370dce1](https://github.com/trixtateam/trixta-js/commit/370dce190f6d60392edbf10ac8dff239e71a8f55))
* joinTrixtaRole even if no response ([92b8aa6](https://github.com/trixtateam/trixta-js/commit/92b8aa65062d64518c0f03a8ceaf895a4a940f2d))
* joinTrixtaRole even if no response ([59a96c7](https://github.com/trixtateam/trixta-js/commit/59a96c78c0322ef699567b8f67b61cb2fad55b14))
* joinTrixtaRole even if no resposne ([96fbde3](https://github.com/trixtateam/trixta-js/commit/96fbde3c5d21e2d0a6bb4c54cc2df1b6a148d38a))
* keep passed reaction response events ([37addaf](https://github.com/trixtateam/trixta-js/commit/37addaff5343079e6c83b194f5d631e88836bb1d))
* linting ([3ffaf25](https://github.com/trixtateam/trixta-js/commit/3ffaf258ea98f8fa8d45e051c57c155cbda3eabb))
* on channel join error clear authorizingStatus ([b5a5f77](https://github.com/trixtateam/trixta-js/commit/b5a5f77c3b8044a42c8943f73fd9d13c70daac5f))
* refactor export and rollup.config ([706671e](https://github.com/trixtateam/trixta-js/commit/706671ec2e9909a49c0e0f23cd8fad04d4e581ba))
* remove check for existing role when joining to channel ([456b71f](https://github.com/trixtateam/trixta-js/commit/456b71fa67f57210ea4cbad30e1712f58a085336))
* use selector props ([0b17df6](https://github.com/trixtateam/trixta-js/commit/0b17df6ba8bc759d33b0904749844e35c59e7fb3))


### Features

* "@rjsf/core" is optional ([147ecea](https://github.com/trixtateam/trixta-js/commit/147ecea6e71bce24c63f0fa24778aaa662846f80))
* clear response option ([87fc79d](https://github.com/trixtateam/trixta-js/commit/87fc79d00ea41164899aa8dfc8e51432e54119f4))
* dispatch before submitting to trixta ([69cbbc7](https://github.com/trixtateam/trixta-js/commit/69cbbc782153c7ee09c4f46c900ef71546047bb5))
* docs updated ([e5d04d5](https://github.com/trixtateam/trixta-js/commit/e5d04d51d7ae9f8af633091193ef938b98c61e26))
* docs updated and root state removed ([9f1d8fc](https://github.com/trixtateam/trixta-js/commit/9f1d8fc04209049aec5532652b9a2bc6b391033b))
* include clear response option ([761e2cf](https://github.com/trixtateam/trixta-js/commit/761e2cfe20f4c57ccd707e0da8101a653915b6ba))
* include response and error event for submit ([6287c98](https://github.com/trixtateam/trixta-js/commit/6287c98ea9bfe2ed057d0b89260598d61f70854a))
* include state and props ([74a2bd3](https://github.com/trixtateam/trixta-js/commit/74a2bd326630ba0238f54326a2b2f7c5ae3d6854))
* index file to ts ([e0a7164](https://github.com/trixtateam/trixta-js/commit/e0a71643ae8632806c15afeab1d5269c22dfab1d))
* loading status for actions and reactions refactored ([95a29f2](https://github.com/trixtateam/trixta-js/commit/95a29f23e842a548b0681c9dc4e9044f4af75269))
* React components and hooks ([fbd30ad](https://github.com/trixtateam/trixta-js/commit/fbd30ad1ad06a9c5c43a9864b6108c879fb6533e))
* reaction saga listener ([88671a5](https://github.com/trixtateam/trixta-js/commit/88671a5def1ab689d841ac4d74993cd786451b0d))
* reaction tests ([6abb3c1](https://github.com/trixtateam/trixta-js/commit/6abb3c151131ee9510be109aa161f10858c0770b))
* remove lodash ([dba258b](https://github.com/trixtateam/trixta-js/commit/dba258b6ebe41d67fcadc87dd5f2ac82d58cb56f))
* request_event for actions and reactions ([3d60d18](https://github.com/trixtateam/trixta-js/commit/3d60d185dc4ea111075b92dc104d09c3a880c82d))
* Trixta components types and props typed ([ed6e260](https://github.com/trixtateam/trixta-js/commit/ed6e260ca5d22abd810251bd3672f096e59ba698))
* trixta reducer and actions typed ([94cef88](https://github.com/trixtateam/trixta-js/commit/94cef8827fed983e89f6dd545d5ba379a72234ca))
* types cleaned up ([d2c0c6f](https://github.com/trixtateam/trixta-js/commit/d2c0c6f3acb48eea6cf81f645efdccca45252511))
* types for components refactored ([5de0ba7](https://github.com/trixtateam/trixta-js/commit/5de0ba7c553aa0c6c02dddc01fc51a5473411acf))
* types for selectors and hooks and components WIP ([d7e502e](https://github.com/trixtateam/trixta-js/commit/d7e502ec005adfe4d516f0dbb4800af6895dfe1e))
* Types refactored for hooks and components ([5f48852](https://github.com/trixtateam/trixta-js/commit/5f48852dff90895c270150f0beb9dd6d566c436a))
* typescript setup ([75e067c](https://github.com/trixtateam/trixta-js/commit/75e067c301057b21afcfe14379fa010bce7ade65))
* version updated ([c6368af](https://github.com/trixtateam/trixta-js/commit/c6368afedb0274b1fe68f23ada66c2cce6676322))
* WIP selectors ([e845541](https://github.com/trixtateam/trixta-js/commit/e845541a307c6da70823e92a08aeb7443841448b))
