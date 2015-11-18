module.exports = {
  models: {
    connection: 'mongodb',
    migrate: 'alter'
  },
  connections: {
    mongodb: {
      adapter: 'sails-mongo',
      host: process.env.MONGO_PORT_27017_TCP_ADDR,
      port: process.env.MONGO_PORT_27017_TCP_PORT
    },
    googleMaps: {
      key: process.env.GOOGLEMAPS_KEY
    },
    s3: {
      key: process.env.AWS_S3_KEY,
      secret: process.env.AWS_S3_SECRET
    },
    mandrill: {
      apiKey: process.env.MANDRILL_APIKEY
    },
    stripe: {
      keys: {
        secret: process.env.STRIPE_SECRET
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET
    }
  }
};
