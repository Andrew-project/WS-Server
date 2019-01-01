let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    openId: {
        type: String,
        unique: true,
        required: true
    },
    avatarUrl: {
        type: String
    },
    nickName: {
        type: String,
        minlength: 1,
        required: true
    },
    gender: {
        type: Number
    },
    age: {
        type: Number
    },
    address: {
        district: {
            type: String,
            default: '朝阳区'
        },
        province: {
            type: String,
            default: '北京市'
        },
        city: {
            type: String,
            default: '北京市'
        }
    },
    description: {
        type: String
    },
    suggestionList: [
        {
            text: String,
            createdAt: {
                type: Date,
                default: Date.now()
            }
        }
    ]
});

UserSchema.pre('save', function (next) {
    let doc = this;
    if (doc.isNew) {
        Group.findOne({}, 'openId').then(d => {
            next();
        });
    } else {
        next();
    }
});

UserSchema.statics.authenticate = async function (openid) {
    const User = this;
    return await User.findOne({'openId': openid})
};

UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    (obj.suggestionList || []).forEach(s => {
        delete s._id;
        s.createdAt = new Date(s.createdAt).getTime();
    });
    delete obj.__v;
    delete obj._id;
    return obj;
};


const User = mongoose.model('User', UserSchema);

module.exports = {User};