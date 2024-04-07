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
