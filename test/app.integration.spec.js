// test/app.integration.spec.js
const request = require('supertest');
const app = require('../app');

describe('Test routes', () => {
    it('GET / sends "Hello World" as json', (done) => {
        request(app)
            .get('/')
            //on enchaine les assertions avec expect
            //là on attend un message json et un code 200
            .expect(200)
            .expect('Content-Type', /json/)
            //si les deux assertions sont un succes on execute ce then
            //dans lequel on indique ce qu'on attend avoir et on le compare avec 
            //ce qu'on recoit: le body de la reponse
            .then(response => {
                const expected = { message: 'Hello World!' };
                expect(response.body).toEqual(expected);
                done();
            });
    });
    //si on envoie un objet vide ça doit nous envoyer un message d'erreur
    it('POST / url and title missing', (done) => {
        request(app)
            .post('/bookmarks')
            //objet à envoyer au back ici un objet vide
            .send({})
            .expect(422)
            .expect('Content-Type', /json/)
            .then(response => {
                const expected = { "error": "required field(s) missing" };
                expect(response.body).toEqual(expected);
                done();
            });
    });
    //si on envoie un objet plein ça doit nous envoyer un message avec l'objet enregistré

    //on s'attend à recevoir en réponse { "id": 1, "url": "https://jestjs.io", "title": "Jest" }.
    it('POST / url and title not missing', (done) => {
        request(app)
            .post('/bookmarks')
            //objet à envoyer au back
            .send({ url: 'https://jestjs.io', title: 'Jest' })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                //Si tu as lancé le test plusieurs fois ton Id peut changer
                const expected = { id: expect.any(Number), url: "https://jestjs.io", title: "Jest" };
                expect(response.body).toEqual(expected);
                done();
            })
            .catch(done);
    });

});
describe('GET /bookmarks/:id', () => {
    const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
    beforeEach((done) => connection.query(
        'TRUNCATE bookmark', () => connection.query(
            'INSERT INTO bookmark SET ?', testBookmark, done
        )
    ));
    it('URL ID not found', (done) => {
        request(app)
            .get('/bookmarks/:id')
            .send({ id: 5 })
            .expect(404)
            .expect('Content-Type', /json/)
            .then(response => {
                const expected = { error: 'Bookmark not found' };
                expect(response.body).toEqual(expected);
                done();
            });
    });
    it('URL ID exists', (done) => {
        request(app)
            .get('/bookmarks/:id')
            .send({ id: 1 })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                const expected = { id: 1, url: "https://jestjs.io", title: "Jest" };
                expect(response.body).toEqual(expected);
                done();
            });
    });

});


