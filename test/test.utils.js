const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

const {
  jsonMapper
} = require('../src/jsonmapper');

const noop = ()=>{};

describe('jsonMapper', ()=>{
  it('return the original object', (done)=>{
    const obj = {foo: 'bar'};
    const newObj = jsonMapper(obj, {});
    expect(newObj).to.be.an.object();
    expect(newObj).to.equal(obj);
    done();
  });

  it('should replace deep linked tokenized string', (done) => {
    const config = {
      foo: {
        bar: {
          fun: 'asdf'
        }
      }
    };
    const obj = {
      foo: "${foo.bar.fun}"
    };

    const newObj = jsonMapper(obj, config);

    expect(newObj).to.be.an.object();
    expect(newObj.foo).to.equal('asdf');

    done();
  });

  it('should replace tokenized string with a number', (done) => {
    const config = {
      foo: {
        bar: {
          fun: 10
        }
      }
    };
    const obj = {
      foo: "${foo.bar.fun}"
    };

    const newObj = jsonMapper(obj, config);

    expect(newObj).to.be.an.object();
    expect(newObj.foo).to.be.a.number();
    expect(newObj.foo).to.equal(10);

    done();
  });

  it('should replace tokenized string with a boolean', (done) => {
    const config = {
      foo: {
        bar: {
          fun: false
        }
      }
    };
    const obj = {
      foo: "${foo.bar.fun}"
    };

    const newObj = jsonMapper(obj, config);

    expect(newObj).to.be.an.object();
    expect(newObj.foo).to.be.a.boolean();
    expect(newObj.foo).to.equal(false);

    done();
  });

  it('should replace tokenized string with an object', (done)=>{
    const config = {
      foo: {
        bar: {
          fun: 10
        }
      }
    };
    const obj = {
      foo: "${foo.bar}"
    };

    const newObj = jsonMapper(obj, config);

    expect(newObj).to.be.an.object();
    expect(newObj.foo).to.be.an.object().and.to.equal(config.foo.bar);

    done();
  });

  it('should replace tokenized string with an array', (done)=>{
    const config = {
      foo: {
        bar: [1, 2]
      }
    };
    const obj = {
      foo: "${foo.bar}"
    };

    const newObj = jsonMapper(obj, config);
    expect(newObj.foo).to.be.an.array();
    expect(newObj.foo.length).to.equal(2);
    expect(newObj.foo[0]).to.equal(1);
    expect(newObj.foo[1]).to.equal(2);
    done();
  });

  it('should replace tokens from itself', (done) => {
    const config = {
      foo: {
        bar: {
          fun: 10
        }
      },
      jenkins: {
        "auth": "qwer"
      }
    };
    const obj = {
      foo: "${foo.bar}",
      params: {
        "auth": "asdf"
      },
      jenkins: {
        "auth": "${params.auth}"
      }
    };
    const newObj = jsonMapper(obj, config);
    expect(newObj.jenkins.auth).to.equal(obj.params.auth);
   
    done();
  });

  it('should return the original array and not an object', (done) => {
    const config = {
    };

    const obj = {
      foo: [1, 2]
    };
    const newObj = jsonMapper(obj, config);
    expect(newObj.foo).to.be.an.array();
    expect(newObj.foo.length).to.equal(2);
    expect(newObj.foo[0]).to.equal(1);
    expect(newObj.foo[1]).to.equal(2);
    done();
  });
});
