import {
  type FormatFn,
  type FsNodeWithPresentationContext,
  formatNode,
  visitTreeNodesUsing,
  generatePaddedFsTree,
} from "./tree_formatter";
import { createFsLoc, type AbsPath } from "./fsnode";
import { defaultStyle, type StyleFn } from "./styles";

export const tree_lines = async function* (
  loc: AbsPath,
  maxDepth: number = 1,
  format?: FormatFn<FsNodeWithPresentationContext>,
  style?: StyleFn
): AsyncIterable<string> {
  const formattedLines = visitTreeNodesUsing(
    generatePaddedFsTree(loc, maxDepth),
    {
      format: format ?? formatNode,
      style: style ?? defaultStyle,
    }
  );
  for await (const formattedLine of formattedLines) {
    yield formattedLine;
  }
};

export const tree = async (
  path: string,
  maxDepth: number = 1
): Promise<void> => {
  const loc = createFsLoc(path);
  for await (const line of tree_lines(loc, maxDepth)) {
    console.log(line);
  }
};
