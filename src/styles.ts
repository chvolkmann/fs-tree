import chalk from "chalk";

export type StyleFn = (...args: any[]) => string;
export type Styles = Record<string, StyleFn>;

export const STYLE_COLORED = {
  first: chalk.bold,

  padding: chalk.dim,

  hidden: chalk.dim,
  file: chalk.green,
  dir: chalk.bold.blue,
  symlink: chalk.cyan,
  error: chalk.red,
};
export type StyleName = keyof typeof STYLE_COLORED;

export const defaultStyle = (style: StyleName, ...args: any[]) =>
  STYLE_COLORED[style](...args);
