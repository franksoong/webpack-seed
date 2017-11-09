import path from 'path';
import express from 'express';

const app = new express();
const port= process.env.PORT || 3000;


app.use(express.static(path.join(__dirname)));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, error => {
    /* eslint-disable no-console */
    if (error) {
        console.error(error);
    } else {
        console.info('  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
    }
    /* eslint-enable no-console */
});