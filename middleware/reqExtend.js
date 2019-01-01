const resExtend = (req, res, next) => {

    req.checkBody = function (paramsArray = [], errorMsg = '请检查参数') {
        for (let params of paramsArray) {
            if (req.body[params] === undefined) {
                console.log('err');
                throw new Error(errorMsg);
            }
        }
    };
    req.checkQuery = function (paramsArray = [], errorMsg = '请检查参数') {
        for (let params of paramsArray) {
            if (req.query[params] === undefined) {
                throw new Error(errorMsg);
            }
        }
    };
    next();
};
module.exports = resExtend;