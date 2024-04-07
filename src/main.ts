import { tree } from ".";

export const main = async () => {
  const args = process.argv.slice(2);
  const path = args[0] ?? ".";
  const depth = parseInt(args[1]) || 1;
  return await tree(path, depth);
};

await main();
