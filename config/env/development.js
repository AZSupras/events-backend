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
    s3: {
      bucket: 'azsupras-events',
      region: 'us-west-1'
    },
    mandrill: {
      fromEmail: 'noreply@example.com',
      fromName: 'Some Name',
      subject: 'Subject Here'
    },
    localdisk: {
      adapter: 'sails-disk'
    },
    stripe: {
      currency: 'usd',
      description: 'Arizona Supras'
    }
  },
  policies: {
    EventController: {
      '*': true
    },
    ImageController: {
      '*': true
    }
  },
  contactForm: {
    toEmail: 'someemail@email.com'
  },
  jwt: {
    options: {}
  }

};
