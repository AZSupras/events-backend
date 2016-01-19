module.exports.routes = {
  'POST /v1/payment/process': {
    controller: 'PaymentController',
    action: 'process'
  },
  'POST /v1/image/upload': {
    controller: 'ImageController',
    action: 'upload'
  },
  'GET /v1/version': {
    controller: 'VersionController',
    action: 'version'
  }
};
