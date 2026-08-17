# Changelog

## 1.0.0 (2026-08-17)


### Features

* add Classic, Timed, and Limited Moves game modes ([b045e45](https://github.com/remarkablegames/number-bumper/commit/b045e45044e52ee204da67cbff52c2785c0012bf))
* add floating symbols, UI pop-in tweens, and tile grid reveal animation ([1fa909d](https://github.com/remarkablegames/number-bumper/commit/1fa909df68901fc68337cb5c1223241d805b6c58))
* add grid math puzzle game ([ebd5869](https://github.com/remarkablegames/number-bumper/commit/ebd5869d05d07c04d868d6d29ac71e40d63ea878))
* add per-level empty tile config with min/max bounds for 4x4 levels ([5107ebd](https://github.com/remarkablegames/number-bumper/commit/5107ebd9cbd2ea8690a510e52333f5ed4f0079f4))
* add random hints for levels beyond configs and hide hint on mobile with wide grid ([a09d311](https://github.com/remarkablegames/number-bumper/commit/a09d311fb027f0056e09611bc554d4619edba74a))
* allow levels 4+ to have random empty tiles ([a45e55e](https://github.com/remarkablegames/number-bumper/commit/a45e55e717519b6e17a9324a336a2da3d1bb4739))
* allow player to move to blank tiles ([58187cd](https://github.com/remarkablegames/number-bumper/commit/58187cd222e4fa649c17c7f59b45830d0607a175))
* **audio:** add sound effects, background music, mute toggle, and title screen ([8ccfc69](https://github.com/remarkablegames/number-bumper/commit/8ccfc690352617d5ef4785e55b33e0644f157868))
* change colors from dark to light ([3d854e1](https://github.com/remarkablegames/number-bumper/commit/3d854e1d7efd85d02e0b521e3c5bdb5ac6110af9))
* differentiate mode button colors and reduce padding ([b279b12](https://github.com/remarkablegames/number-bumper/commit/b279b1244fc610e201b0bb1b1f783b5b05bc57b5))
* **game:** add blocker tiles and whitish player tile ([a708242](https://github.com/remarkablegames/number-bumper/commit/a70824255ba4468121f124f7f15205f709704ef3))
* **game:** add level hints and improve win screen UI ([8f7b30d](https://github.com/remarkablegames/number-bumper/commit/8f7b30d422b4ecc18f61d139dd412b9ab33607ea))
* **game:** add lose/retry modal when all tiles consumed without reaching target ([3b8e619](https://github.com/remarkablegames/number-bumper/commit/3b8e619cda5333413e214e1869f64d2075106c0a))
* **game:** allow negative targets from level 15+ ([a295082](https://github.com/remarkablegames/number-bumper/commit/a295082bc039e70f1c06e5bb4e0d2b1eb9493021))
* **game:** allow Space/Enter to advance to next level on win ([add2abb](https://github.com/remarkablegames/number-bumper/commit/add2abb7f3060884f2a7b2baad2311e77a453d54))
* **game:** allow Space/Enter to restart level on lose modal ([419e666](https://github.com/remarkablegames/number-bumper/commit/419e666941353f9b56242dee41717dad7f679c58))
* **game:** disable restart in timed and limited moves modes ([10b1a75](https://github.com/remarkablegames/number-bumper/commit/10b1a750253855947b4f4b9666a387ca238cee52))
* **game:** make restart button color muted ([e1cfb8a](https://github.com/remarkablegames/number-bumper/commit/e1cfb8a276f74d1dac42e051f81be87a7b65cc4b))
* **game:** show operation equation on win screen ([ba06967](https://github.com/remarkablegames/number-bumper/commit/ba06967b07ffe2ef526e82829ed07b8b7558c301))
* **level:** scale difficulty for later levels ([8963423](https://github.com/remarkablegames/number-bumper/commit/89634239cf77a38d7c3a4149f7768c44a868a228))
* move consume animation from tile to player tile pop ([511c4a6](https://github.com/remarkablegames/number-bumper/commit/511c4a60e82923a1d675d95e0a414b5b83e60d2a))
* replace emoji with styled text entities and add color constants ([8abe9ab](https://github.com/remarkablegames/number-bumper/commit/8abe9aba7e66b4f413d8b55ba8c59c5d6abae2df))
* replace logo and render in title scene ([9ba0725](https://github.com/remarkablegames/number-bumper/commit/9ba072514902d7a5c07b1a8049977c42e3efc885))
* **ui:** add pointer cursor on hover for tiles and buttons ([2d01911](https://github.com/remarkablegames/number-bumper/commit/2d01911eb0fbe75499f0f73ee75c0e795f04b60a))
* **ui:** add scale hover effect on tiles, buttons, and mute icon ([db23bf3](https://github.com/remarkablegames/number-bumper/commit/db23bf37490789d9acdd79ee781497c3fc068314))
* **ui:** load Nunito font as default ([33b3fe6](https://github.com/remarkablegames/number-bumper/commit/33b3fe612db0ff36eb5604ff32da10e03bafe103))
* use diminishing time limit formula for timed mode ([728c462](https://github.com/remarkablegames/number-bumper/commit/728c462656bf1d744479a08f4a78c7bf6413a6a6))


### Bug Fixes

* allow player value to become negative ([75ed2b9](https://github.com/remarkablegames/number-bumper/commit/75ed2b9e2cfc22ff4b6e767861a22366311c327b))
* **audio:** suppress tile hover sounds during level win modal ([e4b8599](https://github.com/remarkablegames/number-bumper/commit/e4b8599fcba779a07bb4ea8e70e9960da6c435ff))
* cap equation panel width on desktop and measure natural text width ([7bfc2f9](https://github.com/remarkablegames/number-bumper/commit/7bfc2f9fd1630229fd04f4b6ce8bd7f225eb7f39))
* **game:** add tappable restart button ([7a46038](https://github.com/remarkablegames/number-bumper/commit/7a4603863be606684a345cbcfadcfc9a047ba4f3))
* **game:** last move reaching target shows win instead of lose ([3502414](https://github.com/remarkablegames/number-bumper/commit/3502414a1a27b48c22d5fa2639282aed4676e206))
* **level:** cap multiply and divide tiles to prevent huge targets ([dd37f3d](https://github.com/remarkablegames/number-bumper/commit/dd37f3df5baad177afa63b1377d00000645434b2))
* **level:** reduce tile value scaling and shrink 3+ digit text ([b938e84](https://github.com/remarkablegames/number-bumper/commit/b938e84915c63ae869989c68ec750303df771381))
* **preload:** ensure font is loaded ([112428a](https://github.com/remarkablegames/number-bumper/commit/112428ac98338e16f2f176fba35772806edef8df))
* **tile:** scale font size down for longer tile labels ([9a1ab7d](https://github.com/remarkablegames/number-bumper/commit/9a1ab7d87f9de06a40235fdcf5cbb16d3725cc7e))
* **ui:** only show tile hover effect when tile is clickable ([62dc794](https://github.com/remarkablegames/number-bumper/commit/62dc79478e1e62d15f0ba68c6e2ed5ce22bd7f87))
* wrap hint text for mobile ([a1fb7bb](https://github.com/remarkablegames/number-bumper/commit/a1fb7bbe615ff343d21bb578fe6e80a095f01169))
* wrap long equation text in win modal for mobile ([25b45d2](https://github.com/remarkablegames/number-bumper/commit/25b45d2802770a957a675509c4b6c56208363d1e))
