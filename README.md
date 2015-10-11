### Angular Bootstrap Toggle - [AngularJS](http://angularjs.org/) version of [Bootstrap Toggle](http://www.bootstraptoggle.com/)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ziscloud/angular-bootstrap-toggle?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://secure.travis-ci.org/ziscloud/angular-bootstrap-toggle.svg)](http://travis-ci.org/ziscloud/angular-bootstrap-toggle)
[![devDependency Status](https://david-dm.org/ziscloud/angular-bootstrap-toggle/dev-status.svg?branch=master)](https://david-dm.org/ziscloud/angular-bootstrap-toggle#info=devDependencies)

### Quick links
- [Demo](#demo)
- [Installation](#installation)
    - [Bower](#install-with-bower)
    - [Manual](#manual-download)
- [Support](#support)
    - [FAQ](#faq)
    - [Supported browsers](#supported-browsers)
    - [Need help?](#need-help)
    - [Found a bug?](#found-a-bug)
- [Contributing to the project](#contributing-to-the-project)

# Demo

Do you want to see directive in action? Visit http://ziscloud.github.io/angular-bootstrap-toggle/!

# Installation

Installation is easy as UI Bootstrap has minimal dependencies - only the AngularJS and Twitter Bootstrap's CSS are required.
It is strongly recommended you use Angular 1.3+ or higher due to 'Bind Once'. 

#### Install with Bower
```sh
$ bower install angular-bootstrap-toggle --save
```

### Adding dependency to your project

When you are done downloading all the dependencies and project files the only remaining part is to add dependencies on the `ui.toggle` AngularJS module:

```js
angular.module('myApp', ['ui.toggle']);
```

If you're a Browserify or Webpack user, you can do:

```js
var abt = require('angular-bootstrap-toggle');

angular.module('myApp', [abt]);
```

# Support

## FAQ

https://github.com/ziscloud/angular-bootstrap-toggle/wiki/FAQ

## Supported browsers

Directives from this repository are automatically tested with the following browsers:
* Chrome (stable and canary channel)
* Firefox
* IE 9 and 10
* Opera
* Safari

Modern mobile browsers should work without problems.


## Need help?
Need help using this directive?

* https://gitter.im/ziscloud/angular-bootstrap-toggle/~chat#share.
* Ask a question in [StackOverflow](http://stackoverflow.com/) under the [angular-bootstrap-toggle](http://stackoverflow.com/questions/tagged/angular-bootstrap-toggle) tag.

**Please do not create new issues in this repository to ask questions about using UI Bootstrap**

## Found a bug?
Please take a look at [CONTRIBUTING.md](CONTRIBUTING.md#you-think-you've-found-a-bug) and submit your issue [here](https://github.com/ziscloud/angular-bootstrap-toggle/issues/new).


----


# Contributing to the project

We are always looking for the quality contributions! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution guidelines.
