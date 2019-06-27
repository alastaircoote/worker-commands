const gobble = require("gobble");
const path = require("path");
const typescript = require("typescript");

const rollupConfig = require("../rollup.config.js");

const mocha = gobble("../node_modules/mocha").include("mocha.*");
const static = gobble("src/static");
const tests = gobble("src").transform(
    "rollup",
    Object.assign(
        {
            entry: "tests.ts",
            dest: "tests.js",
            format: "es"
        },
        rollupConfig
    )
);

const worker = gobble("src").transform(
    "rollup",
    Object.assign(
        {
            entry: "test-worker.ts",
            dest: "test-worker.js",
            format: "es"
        },
        rollupConfig
    )
);

module.exports = gobble([mocha, static, tests, worker]);
