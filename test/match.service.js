const {
    match,
    rateUser
  } = require("../app/services/match.service");
  
  var assert = require("assert");
  
  var user = {
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

  var matches = [{
    "id": "d96ea303eec7acf1ea5265202448b1e4",
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
  }]

  describe("match.service", function () {
    describe("#rateUser(matches, user)", function () {
      it("Escenario: Cuando coinciden", function () {
        assert.equal(rateUser(matches, user), matches);
      });
    });
  });