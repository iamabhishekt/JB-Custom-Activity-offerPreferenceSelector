const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/execute', (req, res) => {

    const { inArguments } = req.body;


    console.log('Execute:', inArguments);

    res.json({
        outArguments: [
            {
                foundOfferPreference: "found",
            },
        ],
        statusCode: "ok",
    });
});

app.post('/save', (req, res) => {

    console.log('Save:', req.body);
    res.sendStatus(200);
});

app.post('/publish', (req, res) => {

    console.log('Publish:', req.body);
    res.sendStatus(200);
});

app.post('/validate', (req, res) => {

    console.log('Validate:', req.body);
    res.sendStatus(200);
});

app.post('/stop', (req, res) => {

    console.log('Stop:', req.body);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
