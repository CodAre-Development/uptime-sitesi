const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
  sahibi: {
    type: String,
    required: true
  },
  site_link: {
    type: String,
    required: true
  },
});

const Site = mongoose.model('Site', SiteSchema);

module.exports = Site;
