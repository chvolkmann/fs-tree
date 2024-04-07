# fs-tree

A utility for printing a directory tree, similar to the Unix [`tree` command](<https://en.wikipedia.org/wiki/Tree_(command)>).

**Example**

```bash
❯ tree .
/fs-tree/
├── .gitignore
├── README.md
├── bin/
├── bun.lockb
├── dist/
├── package.json
├── src/
└── tsconfig.json
```

```bash
❯ tree . 2
/fs-tree/
├── .gitignore
├── README.md
├── bun.lockb
├── package.json
├── src/
│   ├── constants.ts
│   ├── fsnode.ts
│   ├── index.ts
│   ├── main.ts
│   ├── styles.ts
│   ├── tree.ts
│   ├── tree_formatter.ts
│   └── utils.ts
└── tsconfig.json
```

## Development

Using [bun](https://bun.sh/)

```bash
npm i -g bun # if not yet installed

# install dependencies
bun install

# run the CLI
bun dev

bun format
```

### Building

```bash
# build:lib - compile TS to JS, bundle npm library to dist/main.js
# build:cli - output a self-contained executable to bin/tree
bun compile

# delete bin/ and dist/
bun clean
```

### Publishing

```bash
npm whoami
npm adduser # if not yet authorized

# bump patch version and upload to npm
bun release
```
