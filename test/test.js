var assert = require('assert'),
    setup = require('./setup'),
    sinon = require('sinon');

describe('Favis CI', function () {

  beforeEach(function (done) {
    setup(function (errors) {
      if (errors) throw new Error('Could not set up test environment.');
      done();
    });
  });

  afterEach(function (done) {
    done();
  });

  describe('#init()', function () {

    it('should be called when doing new Favis()', function (done) {
      var init = sinon.spy(Favis.prototype, 'init');
      new Favis('dummy/repository');
      assert(init.called);
      done();
    });

    it('should throw an error when missing repository path parameter', function (done) {
      var favis = function () { return new Favis(); };
      var spy = sinon.spy(favis);
      assert(spy.threw);
      done();
    });

    it('should get the existing favicon from the DOM', function (done) {
      var favis = new Favis('dummy/repository');
      assert(favis._orig);
      done();
    });

    it('should call getBuildStatus(path)', function (done) {
      var getBuildStatus = sinon.spy(Favis.prototype, 'getBuildStatus');
      var favis = new Favis('dummy/repository');
      $(favis._img).load(); // Fire the image load event programmatically
      assert(getBuildStatus.called);
      done();
    });

  });

  describe('#getLink()', function () {

    it('should return the <link> tag of the favicon', function (done) {
      var getLink = sinon.spy(Favis.prototype, 'getLink');
      var favis = new Favis('dummy/repository');
      var favicon = getLink.returnValues[0];
      assert.equal(favicon.nodeName.toLowerCase(), 'link');
      assert.notEqual(getLink.returnValues[0], false);
      done();
    });

    it('should return false if there are no <link> tags found', function (done) {
      // Remove the favicon first
      $('head > link:first').remove();
      var getLink = sinon.spy(Favis.prototype, 'getLink');
      var favis = new Favis('dummy/repository');
      assert.equal(getLink.returnValues[0], false);
      done();
    });

  });

  describe('#getIcon()', function () {

    it('should return the original favicon', function (done) {
      var $favicon = $('head > link:first').attr('href');
      var getIcon = sinon.spy(Favis.prototype, 'getIcon');
      var favis = new Favis('dummy/repository');
      assert.equal($favicon, getIcon.returnValues[0].getAttribute('href'));
      assert.notEqual(getIcon.returnValues[0], false);
      done();
    });

    it('should assign type="image/png" to the <link> tag', function (done) {
      var getIcon = sinon.spy(Favis.prototype, 'getIcon');
      var favis = new Favis('dummy/repository');
      var favicon = getIcon.returnValues[0];
      assert.equal(favicon.getAttribute('type'), 'image/png');
      done();
    });

    it('should create a <link> tag if a favicon is not found', function (done) {
      // Remove the favicon first
      $('head > link:first').remove();
      var getIcon = sinon.spy(Favis.prototype, 'getIcon');
      var favis = new Favis('dummy/repository');
      var favicon = getIcon.returnValues[0];
      assert.equal(favicon.nodeName.toLowerCase(), 'link');
      done();
    });

  });


  /**
   * TODO: Pending tests because of jsdom's lack of support for img.onload
   */

  describe('#setIcon()', function () {

    it('should set the favicon to the given canvas image data');

  });

  describe('#renderIcon()', function () {

    it('should render a green badge if renderIcon(false)');

    it('should render a red badge if renderIcon(true)');

  });

  describe('#getBuildStatus()', function () {

    it('should fire a GET request to http://api.travis-ci.org/repos/[path]/builds');

    it('should call parseBuildStatus() when the XHR finishes');

  });

  describe('#parseBuildStatus', function () {

    it('should return true if the latest Travis CI build status is failing');

    it('should return false if the latest Travis CI build status is passing');

  });

});
