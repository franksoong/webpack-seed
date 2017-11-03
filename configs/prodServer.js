import path from 'path';
import open from "open";
import express from 'express';
import {outPath} from './env.js';

const app = new express();
const PORT = process.env.PORT;


/**
 * start server
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
const run = (cb) => {
    app.use(express.static(path.join(outPath)));

    debugger;

    app.get('/*', (req, res) => {
        res.sendFile(path.join(outPath, 'index.html'));
    });

    app.listen(PORT, error => {
        /* eslint-disable no-console */
        if (error) {
            console.error(error);
        } else {
            console.info('Listening on port %s. Open up http://localhost:%s/ in your browser.', PORT, PORT);
            open('http://localhost:' + PORT);
        }
        /* eslint-enable no-console */
    });

    if (cb && typeof cb === 'function') {
        cb();
    };
};


// For CLI conveniency
console.log('Starting server ... ' + outPath );
run();



// For API
export default run;