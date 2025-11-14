const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8082/',
    specPattern: 'tests/e2e/**/*.spec.js',
    supportFile: 'tests/e2e/support/index.js',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents (on, config) {
      // implement node event listeners here
    }
  }
})
