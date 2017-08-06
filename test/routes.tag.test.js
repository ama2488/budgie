process.env.NODE_ENV = 'test';

const knex = require('../db/db');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app');

describe('routes : tags', () => {
  beforeEach((done) => {
    knex.migrate.latest().then(() => {
      knex.seed.run().then(() => {
        done();
      });
    }).catch(err => done(err));
  });

  afterEach((done) => {
    knex.migrate.rollback().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

  describe('GET /tags/users/:user_id', () => {
    it('should return all tags', (done) => {
      chai.request(server).get('/tags/users/1').end((err, res) => {
        res.status.should.equal(200);
        console.log(res.text);
        done();
      });
    });
  });

  describe('POST /tags/users/:user_id', () => {
    it('should respond with 200 and return a new item details', (done) => {
      chai.request(server).post('/tags/users/1').send({ tag: 'cheese', user_id: '1' }).end((err, res) => {
        res.status.should.equal(200);
        console.log(res.text);
        done();
      });
    });
  });

  describe('GET /tags/:id', () => {
    it('should respond with 200 and return single tag', (done) => {
      chai.request(server).get('/tags/3').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('PATCH /tags/:id', () => {
    it('should respond with 200 and return updated data in json', (done) => {
      chai.request(server).patch('/tags/1').send({ tag: 'cheese' }).end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('DELETE /tags/:id', () => {
    it('should respond with 200 and return deleted receipt data', (done) => {
      chai.request(server).delete('/tags/2').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });
});