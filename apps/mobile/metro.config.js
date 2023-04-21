const { getDefaultConfig } = require("@expo/metro-config");
const { resolve } = require("path");

const projectRoot = __dirname;
const workspaceRoot = resolve(projectRoot, "..", "..");

const config = getDefaultConfig(projectRoot);

config.resolver.alias = {
  "~": resolve(projectRoot, "src"),
};

config.resolver.sourceExts.push("cjs");

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPath = [
  resolve(projectRoot, "node_modules"),
  resolve(workspaceRoot, "node_modules"),
];
config.resolver.disableHierarchiacalLookup = true;

module.exports = config;

// Created according to https://docs.expo.dev/guides/monorepos
