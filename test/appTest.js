const assert = require("chai").assert;
const app = require("../Grand");

describe("App", () => {
    it("app should return an object", () => {
        assert.typeOf(app, "object");
    })
})