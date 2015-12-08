/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'localdisk',
    migrate: 'alter'
  },
  connections: {

    googleMaps: {
      key: 'AIzaSyDfkvPmJAAXn759s-qohYB8ADMhPm5Hd5k'
    },
    jwt: {
      secret: 'ZsknTB%^i^eyZzsUI(&gj(u!'
    },
    s3: {
      bucket: 'azsupras-events',
      region: 'us-west-1',
      key: 'AKIAIVYYS7FBUAMC27NQ',
      secret: 'PIVpO9+Whj2rfBC3t2Ecd9zBGmBr3yPkFHr6uTwh'
    },
    mandrill: {
      fromEmail: 'noreply@example.com',
      fromName: 'Some Name',
      subject: 'Subject Here',
      apiKey: '123456'
    },
    localdisk: {
      adapter: 'sails-disk'
    },
    stripe: {
      currency: 'usd',
      description: 'Arizona Supras',
      keys: {
        secret: 'sk_test_ZYHWa9cCO9dWxps9IDDvosmA'
      }
    }
  },
  contactForm: {
    toEmail: 'someemail@email.com'
  },
  jwt: {
    options: {}
  }

};
