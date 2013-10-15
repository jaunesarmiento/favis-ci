(function () {

  var Favis = function (path) {
    this.init(path);
  };

  Favis.prototype = {

    /**
     * Container for the original favicon
     */

    _orig: null,


    /**
     * Canvas for drawing the new favicon
     */

    _canvas: null,


    /**
     * 2d context of the canvas
     */

    _context: null,


    /**
     * Container for the image
     */

    _img: null,


    /**
     * Container for the original favicon's width
     */

    _w: null,


    /**
     * Container for the original favicon's height
     */

    _h: null,


    /**
     * Container for the XHR
     */

    _xhr: null,


    /**
     * Travis CI API endpoint URL
     */

    _travisApiUrl: 'https://api.travis-ci.org',


    /**
     * Array of latest builds
     */

    _builds: null,


    /**
     * The latest build from Travis
     */

    _latestBuild: null,


    /**
     * Browsers
     */

    _browser: {
      ff: (/firefox/i.test(navigator.userAgent.toLowerCase())),
      chrome: (/chrome/i.test(navigator.userAgent.toLowerCase())),
      opera: (/opera/i.test(navigator.userAgent.toLowerCase())),
      ie: (/msie/i.test(navigator.userAgent.toLowerCase())) || (/trident/i.test(navigator.userAgent.toLowerCase())),
    },


    /**
     * Initialize Favis-CI
     *
     * @param {String} path
     *
     * @api private
     */

    init: function (path) {

      if (typeof path === 'undefined') throw new Error('Please indicate the path of the repository that you want to track e.g username/repository');

      try {
        // Get the current favicon from the DOM
        this._orig = this.getIcon();

        // Set up a canvas where we draw the new favicon
        this._canvas = document.createElement('canvas');

        // Create a temporary image
        this._img = document.createElement('img');

        if (this._orig.hasAttribute('href')) {
          this._img.setAttribute('src', this._orig.getAttribute('href'));

          // Get the width and height of the original favicon
          this._img.onload = (function () {
            this._w = (this._img.width > 0) ? this._img.width : 32;
            this._h = (this._img.height > 0) ? this._img.height : 32;
            this._canvas.width = this._w;
            this._canvas.height = this._h;
            this._context = this._canvas.getContext('2d');
            this.getBuildStatus(path);
          }).bind(this);
        }
        else {
          this._canvas.width = 32;
          this._canvas.height = 32;
          this._context = this._canvas.getContext('2d');
          this.getBuildStatus(path);
        }
      }
      catch (e) {
        // Don't bother
        throw new Error('Error initializing Favis CI. Message: ' + e.message);
      }

    },


    /**
     * Check if user's browser is supported
     *
     * NOTE: this might come in handy in the future
     *
     * @api private
     */

    isSupported: function () {
      return (this._browser.chrome || this._browser.ff || this._browser.opera);
    },


    /**
     * Get the link tag where the favicon is
     *
     * @api private
     *
     * @return {HTMLElement/Boolean}
     */

    getLink: function () {
      // Get all link tags under <head></head>
      var links = document.getElementsByTagName('head')[0].getElementsByTagName('link');

      for (var l = links.length, i = (l - 1); i >= 0; i--) {
        if (/icon/i.test(links[i].getAttribute('rel'))) {
          return links[i];
        }
      }

      return false;
    },


    /**
     * Get the original favicon from the DOM
     *
     * @api private
     *
     * @return {HTMLElement}
     */

    getIcon: function () {
      var el = false;
      el = this.getLink();

      if (el === false) {
        el = document.createElement('link');
        el.setAttribute('rel', 'icon');
        document.getElementsByTagName('head')[0].appendChild(el);
      }

      el.setAttribute('type', 'image/png');
      return el;
    },


    /**
     * Render the new icon based on the latest build status from Travis CI
     *
     * @param {Boolean} isPassing
     *
     * @api private
     */

    renderIcon: function (isFailing) {
      var icon = {
        x: 5,
        y: 11,
        w: 10,
        h: 5,
        r: 1
      };

      this._context.clearRect(0, 0, this._w, this._h);
      this._context.drawImage(this._img, 0, 0, this._w, this._h);
      this._context.beginPath();

      // Begin stroking the outline
      this._context.moveTo(icon.x, icon.y);
      this._context.lineTo(icon.x + icon.w - icon.r, icon.y);
      this._context.arcTo(icon.x + icon.w, icon.y, icon.x + icon.w + icon.r, icon.y + icon.r, icon.r);
      this._context.lineTo(icon.x + icon.w, icon.y + icon.h - icon.r);
      this._context.arcTo(icon.x + icon.w, icon.y + icon.h - icon.r, icon.x + icon.w, icon.y + icon.h + icon.r, icon.r);
      this._context.lineTo(icon.x, icon.y + icon.h - icon.r);
      this._context.lineTo(icon.x, icon.y);
      this._context.stroke();

      // Begin filling the background of the badge
      var bg = this._context.createLinearGradient(icon.x + 3, 0, icon.w, 0);
      bg.addColorStop(0, '#444444');
      bg.addColorStop(0.3, '#444444');

      if (isFailing) {
        // Fill with red
        bg.addColorStop(0.3, '#bd4f39');
        bg.addColorStop(1, '#bd4f39');
      }
      else {
        // Fill with green
        bg.addColorStop(0.3, '#4ad115');
        bg.addColorStop(1, '#4ad115');
      }

      this._context.fillStyle = bg;
      this._context.fill();

      this._context.closePath();

      // Set this as the new favicon
      this.setIcon(this._canvas);
    },


    /**
     * Set the image data in the canvas as the new favicon
     *
     * @param {HTMLElement} canvas
     *
     * @api private
     */

    setIcon: function (canvas) {
      var url = canvas.toDataURL('image/png');

      // For FireFox, we need to recreate the element, attach the element, and
      // remove the old link.
      if (this._browser.ff || this._browser.opera) {
        var old = this._orig;
        this._orig = document.createElement('link');

        this._orig.setAttribute('rel', 'icon');
        this._orig.setAttribute('type', 'image/png');

        document.getElementsByTagName('head')[0].appendChild(this._orig);
        this._orig.setAttribute('href', url);

        // Remove the old link
        if (old.parentNode) {
          old.parentNode.removeChild(old);
        }
      }
      else {
        this._orig.setAttribute('href', url);
      }
    },


    /**
     * Performs a GET request to Travis CI to get the latest builds for the
     * given repository path.
     *
     * @param {String} path
     * @param {Function} cb
     *
     * @api private
     */

    getBuildStatus: function (path) {
      var url = this._travisApiUrl + '/repos/' + path + '/builds';

      this._xhr = new XMLHttpRequest();

      this._xhr.open('GET', url, true);
      this._xhr.setRequestHeader('Content-Type', 'application/json');

      this._xhr.onreadystatechange = (function () {
        if (this._xhr.readyState === 4) {
          if ((this._xhr.status === 200 || this._xhr.status === 0) && typeof this._xhr.response !== 'undefined') {
            this.renderIcon(this.parseBuildStatus(this._xhr.response));
          }
          else {
            this.renderIcon(this.parseBuildStatus('[]'));
          }
        }
      }).bind(this);

      this._xhr.send();
    },


    /**
     * Parses the build status and returns true or false whether the latest
     * build from Travis CI is failing.
     *
     * @param {Array} builds
     * @return {Boolean}
     *
     * @api private
     */

    parseBuildStatus: function (builds) {
      this._builds = JSON.parse(builds);

      if (this._builds.length > 0) {
        this._latestBuild = this._builds[0];

        if (this._latestBuild.result === 0) return false;
      }

      return true;
    }

  };


  // AMD / RequireJS
  if (typeof define !== 'undefined' && define.amd) {
    define([], function () {
      return Favis;
    });
  }
  // CommonJS / NodeKS
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Favis;
  }
  else {
    this.Favis = Favis;
  }

}());