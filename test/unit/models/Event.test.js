/* global before, after, fixtures, Event, sails */
var should = require('should');

describe('EventModel', function (){

  it('should not be empty', function (done) {
    Event.find().exec(function (err, events) {
      if (err) {
        sails.log.error(err);
      }
      events.length.should.be.eql(fixtures.event.length);
      done();
    });
  });

  it('should create an event', function (done){
    Event.create({
      'name': '2016 AZSupras BBQ',
      'description': '2016 AZSupras BBQ',
      'startDate': 'Wed Nov 04 2015 13:00:00 GMT-0700 (MST)',
      'endDate': 'Wed Nov 04 2015 18:00:00 GMT-0700 (MST)',
      'markdownContent': '# 2016 AZSupras BBQ',
      'location': {
          'name': 'Pera Club',
          'address': '1 E Continental Dr',
          'city': 'Tempe',
          'state': 'AZ',
          'zipCode': '85281',
          'country': 'USA'
      },
      'pricing': [
          {
              'name': 'Child',
              'price': 5.99
          },
          {
              'name': 'Adult',
              'price': 12.99
          }
      ]
    }, function (err, event){
      should.not.exist(err);
      should.exist(event);
      event.should.have.property('location');
      event.should.have.property('content', '<h1 id=\"2016-azsupras-bbq\">2016 AZSupras BBQ</h1>\n');
      event.should.have.property('staticMap');
      done();
    });
  });
});
