const assert = require("chai").assert;
const loginSystem = require("../helpers/loginSystem");

describe("loginSystem", () => {
    it("loginSystem should return an object", () => {
        assert.typeOf(loginSystem, "object");
    })
})