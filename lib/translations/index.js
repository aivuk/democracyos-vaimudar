/**
 * Module dependencies.
 */

var en = require('./lib/en');
var es = require('./lib/es');
var ca = require('./lib/ca');
var fr = require('./lib/fr');
var fi = require('./lib/fi');
var it = require('./lib/it');
var pt_br = require('./lib/pt_br');

module.exports.help = function(t) {
  // English
  t.en = en;

  // Spanish
  t.es = es;

  // Català
  t.ca = ca;

  // French
  t.fr = fr;

  // Finnish
  t.fi = fi;

  // Italian
  t.it = it;

  // Brazilian Portuguese
  t.pt_br = pt_br;
}
