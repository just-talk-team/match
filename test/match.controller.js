let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url= 'http://localhost:3000';

let user = {
  "id": "d96ea303eec7acf1ea5265202448b1e3",
  "birthday": "05/21/1993",
  "gender": "man",
  "user_type": "premium",
  "segments": [
      "upc.edu.pe",
      "cibertec.edu.pe"
  ],
  "badges": [
      "good_listener",
      "good_talker",
      "funny"
  ],
  "preferences": {
      "ages": [
          18,
          24
      ],
      "genders": [
          "man",
          "woman"
      ],
      "badges": [
          "good_listener",
          "good_talker",
          "funny"
      ],
      "segments": [
          "upc.edu.pe",
          "cibertec.edu.pe"
      ]
  },
  "topics_hear": [
      "Clasicas de Cachimbo",
      "Viajes baratos"
  ],
  "topics_talk": [
      "Clasicas de Cachimbo"
  ]
}

describe('Realizar un match',()=>{
    describe("#matchController(app)match()", ()=>{
        it("Escenario: Cuando se envía un usuario con el formato adecuado", (done) => {
            chai.request(url)
            .post('/matches')
            .send(user)
            .end(function(err,res){
            console.log(res.body)
            expect(res).to.have.status(200);
            done();
            });
        });
    });
});