const resExtend = (req, res, next) => {
    // console.log(res);
    res.sendSuccess = function (data) {
        // console.log(data);
        if ((!data) ||
            ((!Array.isArray(data)) && Object.keys(data).length === 0) ||
            (Object.keys(data).length === 1 && (data[Object.keys(data)[0]] === null || data[Object.keys(data)[0]] === undefined))) {
            res.sendError('not found');
        } else {
            const result = {
                success: true
            };
            res.send({data, result});
        }
    };
    res.sendError = function (error, status) {
        // console.error(error);
        // const result = {
        //     success: false,
        //     displayMsg: error
        // };
        if (error === 'invalid token') {
            status = 401;
        } else if (error === 'not found') {
            status = 404;
        }
        // result.code = result.code || status;
        // res.send({result});
        res.status(status || 500).send({
           result: {
               success: false,
               displayMsg: error,
               code: status || 1001
           }
        })
    };
    next();
};
module.exports = resExtend;