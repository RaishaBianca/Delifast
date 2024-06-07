var bs = require("browser-sync").create();

bs.init({
    injectChanges: false,
    files: ['./**/*'],
    proxy: 'localhost:3000' // replace with your server's address and port
});