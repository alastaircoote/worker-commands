const nodeResolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
const commonjs = require("rollup-plugin-commonjs");

module.exports = [
    {
        input: "src/index.ts",
        plugins: [
            commonjs({
                namedExports: { chai: ["expect"] }
            }),
            nodeResolve(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: true
                    }
                }
            })
            // uglify()
        ],
        output: [
            {
                file: "lib/worker-commands.es6.js",
                format: "es",
                sourcemap: true
            },
            {
                file: "lib/worker-commands.js",
                format: "umd",
                name: "worker-commands",
                sourcemap: true
            }
        ]
    },
    {
        input: "src/bridge/client-side.ts",

        plugins: [
            commonjs({
                namedExports: { chai: ["expect"] }
            }),
            nodeResolve(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false
                    }
                }
            })
        ],
        output: {
            file: "send-command.js",
            format: "umd",
            name: "sendcommand",
            sourcemap: true
        }
    }
];
