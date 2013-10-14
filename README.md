# Favis CI [![Build
Status](https://travis-ci.org/jaunesarmiento/favis-ci.png)](https://travis-ci.org/jaunesarmiento/favis-ci)

Continuous Integration in your Favicon.


# Introduction

Favis CI is a JavaScript plugin that modifies your favicon to include the latest
build status of your project in [Travis CI].

![](https://raw.github.com/jaunesarmiento/favis-ci/master/docs/buildstatus.png)


# Usage

To use Favis-CI on your pages, just do:

```javascript
var favis = new Favis('<username>/<repository>');
```

For example, to generate a Favis CI favicon for the Ember.js project, do:

```javascript
var favis = new Favis('emberjs/ember.js');
```


# Running Tests

What good is this plugin if it doesn't support tests right? To run the tests,
you must first install [Cairo] which is a dependency of [node-canvas]. You'll be
needing that because [jsdom] doesn't fully support the Canvas API (yet). Take
note: Cairo is around ~100mb in size.

Follow [these instructions](https://github.com/LearnBoost/node-canvas/wiki) on how to install node-canvas properly.

If libpng fails, try [installing this
binary](http://ethan.tira-thompson.com/Mac_OS_X_Ports.html).

If you got error `error: mandatory image surface backend feature could not be
enabled` or `Package cairo was not found in the pkg-config search path.`, the
following command can resolve it:

```bash
$ export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
```

If you encounter errors regarding `glib`, it probably means you need to install
it. To do this, run:

```bash
$ brew install glib
```

After the installation, run:

```bash
$ cd favis-ci # cd to Favis CI's root directory
$ npm install # then install dependencies
```

Then run:

```bash
$ npm test
```


# Special Thanks

A warm thank you goes to [Miroslav Magda] for his [favico.js] where this idea
came from. Also, Favis-CI based some of its code-base from it. Thanks a lot!


# License

Favis CI is licensed under the [MIT License]. Copyright &copy; and proudly
crafted by Jaune Sarmiento, 2013.


[Travis CI]: https://travis-ci.org/
[Ember.js]: https://github.com/emberjs/ember.js
[Miroslav Magda]: https://github.com/ejci
[favico.js]: https://github.com/ejci/favico.js
[Cairo]: http://cairographics.org/
[node-canvas]: https://github.com/LearnBoost/node-canvas/
[jsdom]: https://github.com/tmpvar/jsdom
[MIT License]: http://opensource.org/licenses/MIT
