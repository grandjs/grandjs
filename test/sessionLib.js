const assert = require("chai").assert;
const sessionLib = require("../lib/helpers/sessionLib");

describe("sessionLib", () => {
    it("sessionLib should return an object", () => {
        assert.typeOf(sessionLib, "object");
    })
})