let mongoose = require('mongoose');
const {User} = require('./user');
let RecordSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        index: true
    },
    openId: {
        type: String
    },
    content: {
        text: String,
        pictures: []
    },
    address: {
        district: {
            type: String,
        },
        province: {
            type: String,
        },
        city: {
            type: String,
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    verbs: [{
        fromId: String,
        isVerb: Boolean,
        updatedAt: Date
    }], // 点赞
    reviews: [{
        fromId: String,
        fromName: String,
        content: String,
        updatedAt: Date
    }],
    createdAt: {
        type: Date,
        default: +new Date()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

RecordSchema.pre('save', function (next) {
    let doc = this;
    if (doc.isNew) {
        Record.findOne({}, 'id',{sort: {id: -1}}).then(d => {
            doc.id = (d ? d.id : 0) + 1;
            doc.createdAt = +new Date();
            doc.updatedAt = +new Date();
            next();
        });
    } else {
        next();
    }
});

RecordSchema.methods.toJSON = function () {
    let obj = this.toObject();
    obj.id = parseInt(obj.id);
    obj.createdAt = +obj.createdAt;
    obj.updatedAt = +obj.updatedAt;
    (obj.verbs || []).map(ve => {
        delete ve._id;
        ve.updatedAt = +ve.updatedAt;
        return ve;
    });
    delete obj.__v;
    delete obj._id;

    return obj;
};

RecordSchema.methods.insertUserInfo = async function () {
    let obj = this;
    const user = await User.findOne({openId: obj.openId});
    if (user) {
        obj._doc.userInfo = {
            openId: user.openId,
            nickName: user.nickName,
            avatarUrl: user.avatarUrl
        };
    }
    delete obj.openId;
    return obj;
};

const Record = mongoose.model('Record', RecordSchema);

module.exports = {Record};