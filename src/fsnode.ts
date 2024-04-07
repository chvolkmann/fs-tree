import { lstat, readdir } from "node:fs/promises";
import { resolve, basename, sep } from "node:path";

export const PATH_SEP = sep;

export type AbsPath = string & { __brand: "AbsPath" };
export const createFsLoc = (loc: string): AbsPath => resolve(loc) as AbsPath;

export const listEntryNames = async (loc: AbsPath): Promise<string[]> => {
  const stat = await lstat(loc);
  if (!stat.isDirectory()) return [];

  const entries = await readdir(loc);
  return entries.toSorted();
};

export type FsNodeShape<T extends string> = {
  type: T;
  name: string;
  loc: AbsPath;
};
export type FileFsNode = FsNodeShape<"file"> & { hidden?: boolean };
export type DirFsNode = FsNodeShape<"dir"> & { hidden?: boolean };
export type LinkFsNode = FsNodeShape<"link"> & { hidden?: boolean };
export type ErrorFsNode = FsNodeShape<"error"> & { error: Error };

export type FsNode = FileFsNode | DirFsNode | LinkFsNode | ErrorFsNode;
export type FsNodeType = FsNode["type"];

export const createErrorNode = (loc: AbsPath, error: Error): ErrorFsNode => ({
  type: "error",
  name: error.message,
  loc,
  error,
});
export const createFsNode = async (loc: AbsPath): Promise<FsNode> => {
  let stat;
  try {
    stat = await lstat(loc);
  } catch (err: any) {
    return createErrorNode(loc, err);
  }

  const name = basename(loc);
  const hidden = name.startsWith(".");

  if (stat.isDirectory()) {
    return { type: "dir", name, loc, hidden };
  } else if (stat.isFile()) {
    return { type: "file", name, loc, hidden };
  } else if (stat.isSymbolicLink()) {
    return { type: "link", name, loc, hidden };
  } else {
    return createErrorNode(loc, new Error("Unknown file type"));
  }
};
