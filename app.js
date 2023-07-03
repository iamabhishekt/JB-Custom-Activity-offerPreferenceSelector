// app.js

var express = require( 'express' );
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

// support json encoded bodies
app.use(bodyParser.json()); 

app.use( express.static('public') );

app.post( '/execute', (req, res) => {
    console.log('Execute route called');
    console.log(req.body);
    const inArguments = req.body.inArguments;
    let foundOfferPreference = "offerPreference not found"; // Default value

    if (inArguments && inArguments.length > 0) {
        console.log('inArguments found');
        const offerPreference = inArguments[0].offerPreference;
        if (offerPreference) {
            console.log('offerPreference found');
            foundOfferPreference = offerPreference;
        } else {
            console.log('offerPreference not found');
        }
    } else {
        console.log('inArguments not found');
    }

    const response = {
        outArguments: [
            {
                foundOfferPreference: foundOfferPreference
            }
        ]
    };

    res.status(200).json(response);
});

app.post( '/save', (req, res) => {
    // Save logic here
    console.log('Save route called');
    console.log(req.body);
    res.status(200).end();
});

app.post( '/publish', (req, res) => {
    // Publish logic here
    console.log('Publish route called');
    console.log(req.body);
    res.status(200).end();
});

app.post( '/validate', (req, res) => {
    // Validation logic here
    console.log('Validate route called');
    console.log(req.body);
    res.status(200).end();
});

app.post( '/stop', (req, res) => {
    // Stop logic here
    console.log('Stop route called');
    console.log(req.body);
    res.status(200).end();
});

app.listen( port, () => console.log( `App listening on port ${port}!`) );
