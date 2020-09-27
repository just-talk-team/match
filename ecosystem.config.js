module.exports = {
  apps: [
    {
      name: "matched-betting-tracker",
      script: "./index.js",
      instances: "1",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
