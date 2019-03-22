const { send, json } = require('micro')
const { router, get, post, put, del } = require('microrouter')
const cors = require('micro-cors')()

const db = require('monk')('mongodb://Laura:helio1@helio-shard-00-00-fphgm.mongodb.net:27017,helio-shard-00-01-fphgm.mongodb.net:27017,helio-shard-00-02-fphgm.mongodb.net:27017/ShoppingCart?ssl=true&replicaSet=Helio-shard-0&authSource=admin&retryWrites=true');
const products = db.get('Products');

const getProducts = async (req, res) => {
    let results = await products.find({});
    console.log('results', results);
    return send(res, 200, results);
};

const getProductBySKU = async (req, res) => {
    let skuToFind = req.params.sku;
    let result = await products.findOne({sku: skuToFind});
    if (result){
        send(res, 200, result);
    }else {
        send(res, 404);
    }
};

const createProduct = async (req, res) => {
    const data = await json(req)
    console.log(data) 
    const results = await products.insert(data);
    return send(res, 201, results)
};

const updateProduct = async (req, res) => {
    const data = await json(req)
    console.log(data) // Validation might go here
    const results = await products.update({ sku: req.params.sku }, data);
    return send(res, 200, results)
};
const deleteProduct = async (req, res) => {
    // console.log(req)
    const results = await products.remove({ sku: req.params.sku });
    return send(res, 200, results)
}

const notfound = (req, res) => send(res, 404, 'Not found route')

module.exports = cors(
    router(
        get('/products', getProducts),
        get('/product/:sku', getProductBySKU),
        post('/product', createProduct),
        put('/product/:sku', updateProduct),
        del('/product/:sku', deleteProduct),
        get('/*', notfound)
    )
)
