# biome-plugin-no-type-assertion

A Biome linter plugin that disallows type assertions in TypeScript code, encouraging the use of type guards and proper typing instead.

## Installation

Install the plugin as a dev dependency:

```sh
npm install --save-dev biome-plugin-no-type-assertion
```

or with your preferred package manager:

```sh
yarn add -D biome-plugin-no-type-assertion
pnpm add -D biome-plugin-no-type-assertion
bun add -D biome-plugin-no-type-assertion
```

## Usage

Add the plugin to your Biome configuration file (biome.json or biome.jsonc):

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "plugins": ["node_modules/biome-plugin-no-type-assertion/no-type-assertion.grit"]
}
```

The plugin will now check your TypeScript code and report errors when it detects type assertions.

### What it catches

The plugin detects only one form of type assertions in TypeScript (the most used):

**`as` syntax**: `expression as Type`
```ts
const a = 5 as number; // ❌ Error
const b = ["nope"] as string[]; // ❌ Error
```

Unfortunately, due to limitations in the Grit pattern language, the plugin cannot currently detect type assertions using the angle-bracket syntax. Examples of unsupported cases include:
```typescript
// These are "uncommon" type assertions that the plugin at the moment cannot catch
const b = <number>5;
console.log(<string>(<unknown>b));
```

## Why avoid type assertions?

Type assertions bypass TypeScript's type checker and can hide potential bugs. Instead, consider:

- **Type guards**: Use runtime checks with type predicates
- **Proper typing**: Define correct types at the source
- **Type narrowing**: Let TypeScript infer types through control flow analysis

## Contributing

Contributions are welcome! Here's how to get started:

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/albertodeago/biome-plugin-no-type-assertion.git
   cd biome-plugin-no-type-assertion
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Development

The plugin is defined in `no-type-assertion.grit` using the Grit pattern language.

#### Testing

Run the test suite:

```sh
npm test
```

Tests are located in the `test` directory and use Vitest. Test fixtures can be found in `test/fixtures`.

#### Publishing

To publish a new version of the plugin:

1. Update the version in `package.json`.
2. Publish to npm:
   ```sh
   npm publish
   ```
3. Tag the release in GitHub creating a Release with the changes.

## License

MIT © Alberto De Agostini
