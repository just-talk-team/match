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

describe("user.util", function () {
  describe("#compareMatches()", function () {
    var firstList = ["Clásicas de cachimbos", "Among Us", "Covid19"]
    var secondList = ["Clásicas de cachimbos", "Among Us"]
    it("Escenario: Cuando el valor de count sea 2", function () {
      assert.equal(compareMatches(firstList, secondList), 2);
    });
  });
});
