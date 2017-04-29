import 'should';
import fs from 'fs';
import nock from 'nock';
import wiki from '../src/wiki';

describe('Dublin page integration', () => {

  let dublin;
  before(done => {
    nock('http://en.wikipedia.org')
      .get('/w/api.php?prop=info%7Cpageprops&inprop=url&ppprop=disambiguation'
         + '&titles=Dublin&format=json&action=query&origin=*&redirects=')
      .once()
      .reply(200, JSON.parse(fs.readFileSync('./test/data/dublin-page.json')));

    wiki().page('Dublin')
    .then((page) => {
      dublin = page
      done()
    })
    .catch(done)
  })

  it('should get Dublins info', () => {
    nock('http://en.wikipedia.org')
      .get('/w/api.php?prop=revisions&rvprop=content&rvsection=0'
         + '&titles=Dublin&format=json&action=query&origin=*&redirects=')
      .once()
      .reply(200, JSON.parse(fs.readFileSync('./test/data/dublin-info.json')));

    return dublin.info({simplifyDataValues: false}).then((info) => {
      info.name.should.equal('Dublin');
      info.gdp.should.equal('US$ 90.1 billion');
      //TODO fix infobox parser to activate this test
      //info.populationTotal.should.equal(553165)
    });
  });

});

