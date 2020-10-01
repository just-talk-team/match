const {
  obtainAgeOfBirthday,
  compareMatches,
} = require("../app/util/user.util");

var assert = require("assert");

describe("user.util", function () {
  describe("#obtainAgeOfBirthday()", function () {
    it("Escenario: Cuando el valor de birthday sea 05/08/1998", function () {
      assert.equal(obtainAgeOfBirthday("08/05/1998"), 22);
    });
  });
});
