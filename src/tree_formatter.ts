import { join } from "node:path";
import { type PadSymbol, Pad } from "./constants";
import { applyUpdates, replaceLast, enumerate } from "./utils";
import {
  type FsNode,
  type AbsPath,
  listEntryNames,
  PATH_SEP,
  createErrorNode,
  createFsNode,
} from "./fsnode";
import { defaultStyle, type StyleFn } from "./styles";

export const getSuffix = (entry: FsNode) => {
  if (entry.type === "dir") return PATH_SEP;
  else if (entry.type === "link") return "@";
  else return "";
};
export type FsNodeSuffix = ReturnType<typeof getSuffix>;

export type PresentationContext = {
  padLevels: PadSymbol[];
  isLast: boolean;
  isRoot: boolean;
};
export type FsNodeWithPresentationContext = {
  node: FsNode;
  ctx: PresentationContext;
};

export const formatNode = (
  { node, ctx }: FsNodeWithPresentationContext,
  styled: StyleFn
): string => {
  if (ctx.isRoot)
    return styled("first", [PATH_SEP, node.name, getSuffix(node)].join(""));

  const padding = styled("padding", ctx.padLevels.join(""));
  if (node.type === "error") {
    return `${padding}${styled("error", node.name)}`;
  }

  const suffix = getSuffix(node);
  let formatted;
  switch (node.type) {
    case "file":
      formatted = styled("file", node.name + suffix);
      break;
    case "dir":
      formatted = styled("dir", node.name + suffix);
      break;
    case "link":
      formatted = styled("symlink", node.name + suffix);
      break;
    default:
      formatted = node;
      break;
  }
  formatted = node.hidden ? styled("hidden", formatted) : formatted;
  return `${padding}${formatted}`;
};

const attachContext = (
  node: FsNode,
  ctx: PresentationContext,
  ...updates: Partial<PresentationContext>[]
): FsNodeWithPresentationContext => ({
  node,
  ctx: applyUpdates(ctx, ...updates),
});

export const generatePaddedFsTree = async function* (
  loc: AbsPath,
  maxDepth: number = 1,
  ctx?: PresentationContext
): AsyncIterable<FsNodeWithPresentationContext> {
  ctx ??= { padLevels: [], isLast: false, isRoot: false };
  ctx.isRoot = ctx.padLevels.length === 0;

  const node = await createFsNode(loc);

  // yield current node
  yield attachContext(node, ctx, {
    padLevels: replaceLast(ctx.padLevels, ctx.isLast ? Pad.End : Pad.Tee),
  });

  const currDepth = ctx.padLevels.length;

  // stop if we've reached max depth
  if (currDepth >= maxDepth) return;

  // try listing children
  // which may fail on failing permissions
  let childEntryNames: string[];
  try {
    childEntryNames = await listEntryNames(loc);
  } catch (err: any) {
    yield {
      node: createErrorNode(loc, err),
      ctx: {
        ...ctx,
        padLevels: ctx.padLevels.concat(Pad.Error),
      },
    };
    return;
  }

  // traverse children and yield their results
  for (const [i, entryName] of enumerate(childEntryNames)) {
    const isLast = i === childEntryNames.length - 1;
    const childLoc = join(loc, entryName) as AbsPath;
    const childCtx = {
      padLevels: ctx.padLevels.concat(isLast ? Pad.Blank : Pad.Line),
      isLast,
      isRoot: false,
    };
    yield* generatePaddedFsTree(childLoc, maxDepth, childCtx);
  }
};

export type FormatFn<T> = (x: T, style: StyleFn) => string;
export const visitTreeNodesUsing = async function* <T>(
  items: AsyncIterable<T>,
  {
    format,
    style,
  }: {
    format: FormatFn<T>;
    style: StyleFn;
  }
): AsyncIterable<string> {
  for await (const item of items) {
    yield format(item, style);
  }
};
