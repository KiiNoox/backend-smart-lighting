const mongoose = require('mongoose');

//mongoose.connect('mongodb://SmartLight:123456789@localhost/SmartLight',

mongoose.connect('mongodb://localhost:27017/SmartLight2',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () =>
        console.log('connected to DB!')
)
