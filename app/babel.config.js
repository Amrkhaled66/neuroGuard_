module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./",
            "@assets": "./assets",
            "@components": "./components",
            "@features": "./features",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
        // "react-native-iconify/plugin"
      ],
    ],
  };
};

