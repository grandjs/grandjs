const assert = require("chai").assert;
const helpers = require("../helpers/helpers");


describe("helpers", () => {
    it("helpers should return an object", () => {
        assert.typeOf(helpers, "object");
    })
})