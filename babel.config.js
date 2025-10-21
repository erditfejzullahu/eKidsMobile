module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo", // Ensure you're using the right Expo preset
      ["nativewind/babel", { jsxImportSource: "nativewind" }] // NativeWind support for JSX
    ],
  };
};
