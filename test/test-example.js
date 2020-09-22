var assert = require("assert");

describe("Array", function () {
  describe("#indexOf()", function () {
    it("Escenario: Cuando el valor no esta presente entonces retorna -1", function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
