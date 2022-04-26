const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const BDSRouter = require('./src/routes/bds.route');
const config = require('./src/configs/general.config')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
})

app.use('/bds', BDSRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});

    return;
});

app.listen(config.app.port, '0.0.0.0', () => {
    console.log(`BDS app listening at http://localhost:${config.app.port}`)
});