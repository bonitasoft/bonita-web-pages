const { defineConfig } = require('cypress');
const path = require('path');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    // specPattern and fixturesFolder are relative to --project directory
    specPattern: 'test/specs/**/*.feature',
    fixturesFolder: 'test/mockServer',
    // supportFile uses absolute path since it's in config's directory, not project's
    supportFile: path.resolve(__dirname, 'cypress/support/e2e.js'),
    screenshotsFolder: 'build-gradle/tests/screenshots',
    videosFolder: 'build-gradle/tests/videos',
    video: false,
    numTestsKeptInMemory: 20,
    viewportHeight: 768,
    viewportWidth: 1366,
    chromeWebSecurity: false,
    retries: 3,

    // Reporter configuration - use require.resolve to get absolute path from config's node_modules
    reporter: require.resolve('cypress-multi-reporters'),
    reporterOptions: {
      configFile: path.resolve(__dirname, 'reporter-config.json')
    },

    async setupNodeEvents(on, config) {
      // Cucumber preprocessor setup
      await addCucumberPreprocessorPlugin(on, config);

      on('file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)]
        })
      );

      // Browser launch configuration (migrated from plugins/index.js)
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.args.push('--lang=en');
        return launchOptions;
      });

      return config;
    },
  },
});
