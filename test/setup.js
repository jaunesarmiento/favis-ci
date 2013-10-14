// Setup our environment
module.exports = function (done) {

  /**
   * Module dependencies
   */

  var jsdom = require('jsdom').jsdom,
      fs = require('fs'),
      jquery = require('jQuery');
      favis = fs.readFileSync('./favis-ci.js'),

      // Using a dummy favicon with no badge
      //favicon = '<link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZFJREFUeNpi/P//P8NAAhZ8kpUfD/ADKRUK7bjfzu/wDpckI7YQAFocCKTagVidSh69D8Q1QIcsI+gAoOVRQGopiP33/z+G739+UWQzBzMrAwsTM4ybAnTEXJwOAFoOUvn87c8vog+/vKHYcmRHyPGIMIhy8H4EciWBjvgOk2NCU6v1+sdn0RsfnlHNchD48fc3w62Pzxlefv8ISlO6yHIoDgCGBf/9z69oluLvf37N8O//fzacDvj+5yfD739/aeYAUJr6BrQDZzb8A1SAC6iyCzPkiFoSZdGU18cZbv98i1XuH8N/4ssBZMDDzM5gyCVFtFpiARPDAAMWcjXmP9nCcP7bM4odMOAhMOqAoZsIJ8r4YBUHJUxQAh3+IQAq6b78/YkhfgdHCUh1B4CK29FyYNQBow6gRTnwEZdCUJazuzWLGnb+whcCN4H4HQ09/AWIL+N0wFQRT5DramjogBqgHd/xpoFDamnTgVQQqFSlosWPgDgaaPZEovqGMACMcyEgpUip5UCLX5PUOaUnAAgwAN3gmuzmmqXRAAAAAElFTkSuQmCC" type="image/png" />';
      favicon = '<link rel="shortcut icon" href="../docs/favicon.png" type="image/png">'

  jsdom.env({
    html: '<!DOCTYPE html><html><head>'+favicon+'</head><body></body></html>',
    src: [ favis ],
    features: {
      FetchExternalResources: ['script', 'img']
    },
    done: function (errors, window) {
      window.console = console;
      global.$ = jquery.create(window);
      global.window = window;
      global.document = window.document;
      global.Favis = window.Favis;
      done(errors);
    }
  });

};


