async function get(req, res, next) {
    try {
        res.json('GET IS CALLED')
    } catch(e) {
        console.log("GET ERROR");
        next(e);
    }
}

async function post(req, res, next) {
    try {
        console.log(req.body)
        res.json('POST IS CALLED')
    } catch(e) {
        console.log("POST ERROR");
        next(e);
    }
}

module.exports = {
    get,
    post
};