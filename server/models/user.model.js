import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const saltRounds = 10;
const UserSchema = new mongoose.Schema({
    //facebook: String,
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    updated: Date,
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    about: {
        type: String,
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String
    }
});

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

UserSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

UserSchema.methods = {
    authenticate: function (plainText) {
        return bcrypt.compareSync(plainText, this.hashed_password);
    },
    encryptPassword: function (password) {
        if (!password) return ''
        return bcrypt.hashSync(password, this.salt)
    },
    makeSalt: function () {
        return bcrypt.genSaltSync(saltRounds);
    }
}

export default mongoose.model('User', UserSchema)
