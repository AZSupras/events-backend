/* global sails */

var request = require('request');
var GoogleMaps = require('googlemaps');
var gm = new GoogleMaps(sails.config.connections.googleMaps);

var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


var EventModel;
EventModel = {
  schema: true,
  attributes: {

    /**
     * Event Name
     *
     * @type {string}
     * @required true
     */
    name: {
      type: 'string',
      required: true
    },


    /**
     * Text based event description.
     *
     * @type {string}
     * @required true
     */
    description: {
      type: 'string',
      required: true
    },


    /**
     * Start datetime of the event
     *
     * @type {datetime}
     * @required true
     */
    startDate: {
      type: 'datetime',
      required: true
    },


    /**
     * End datetime of the event
     *
     * @type {datetime}
     * @required true
     */
    endDate: {
      type: 'datetime',
      required: true
    },

    /**
     * Raw markdown content provided via event creation
     * form.
     *
     * @type {string}
     */
    markdownContent: {
      type: 'string',
      required: false
    },

    /**
     * HTML Content that was auto-generated from the markdownContent
     * during beforeCreate().
     *
     * @type {string}
     */
    content: {
      type: 'string'
    },

    /**
     * Expects json object of address data
     *
     * @property name {string}     - Descriptive name of location
     * @property address {string}  - first line of the address
     * @property address2 {string} - second line of the address, usually suite #s and such
     * @property city {string}     - spelled out city name
     * @property state {string}    - 2 letter uppercase state designation
     * @property zipCode {integer} - 5 digit US ZipCode
     * @property country {string}  - 3 letter country designation
     */
    location: {
      type: 'json',
      required: true
    },

    /**
     * Expects array of json objects with pricing information
     *
     * @property name {string}   - descriptive name of the price
     * @property price {integer} - cost in cents of the price
     * @property tax {float}     - null if no tax, otherwise % in decimal form of tax rate
     */
    pricing: {
      type: 'json'
    },

    /**
     * base64 hashed static map of the location.
     * Auto generated in beforeCreate() using googleMaps
     *
     * @type {string}
     */
    staticMap: {
      type: 'string'
    },


    /**
     * Facebook Event URL
     *
     * @type {string}
     * @todo provide some integration to events, this will eventually be the event id via fb
     */
    facebookEvent: {
      type: 'string'
    },

    /**
     * URL to the forum thread for the event
     *
     * @type {string}
     */
    forumLink: {
      type: 'string'
    },

    /**
      Associations
    */
    attendees: {
      collection: 'customer',
      via: 'events'
    },
    coverImage: {
      model: 'image'
    },
    images: {
      collection: 'image',
      via: 'events'
    }
  },
  beforeCreate: function (values, cb){

    /**
     * Parse out the markdown content into HTML
     **/
    if (values.markdownContent) {
      var content = marked(values.markdownContent);
      values.content = content;
    }
    /**
     * Create the static map image
     **/

    var fullAddress = values.location.address;

    if (values.location.address2){
      fullAddress = fullAddress + ', ' + values.location.address2;
    }

    fullAddress = fullAddress + ' ' + values.location.city + ', ' + values.location.state + ' ' + values.location.zipCode;

    var staticMap = gm.staticMap({
      location: fullAddress,
      markers: [
        {
          location: fullAddress,
          color: 'red',
          shadow: true
        }
      ],
      center: fullAddress,
      zoom: 13,
      size: '340x300',
      maptype: 'roadmap'
    });

    request({ url: staticMap, encoding: null }, function (err, res, body){
      if (err) {
        return cb(err);
      }

      var base64prefix = 'data:' + res.headers['content-type'] + ';base64,';
      var image = body.toString('base64');
      values.staticMap = base64prefix + image;

      cb();
    });
  }
};
module.exports = EventModel;
