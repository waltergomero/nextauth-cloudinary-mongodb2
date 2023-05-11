import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();
const User = db.User;

export const repoUsers = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    console.log("user info: ", email, password);
    const user = await User.findOne({ email: email });
    console.log("user info: ", user);
    if (!user) {
        throw new Error('This email address does not exists.');
    }

    if (!(user && bcrypt.compareSync(password, user.password))) {
        throw new Error('Password is incorrect');
    }

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    return {
        ...user.toJSON(),
        token
    };
}

async function getAll() {
    return await User.find({}).sort({last_name: 1, first_name:1})
}

async function getById(id) {
    return await User.findById(id);
}

async function create(params) {
    // validate
    if (await User.findOne({ email: params.email })) {
        throw new Error('Email "' + params.email + '" is already taken');
    }

    const user = new User(params);

    // hash password
    if (params.password) {
        user.password = bcrypt.hashSync(params.password, 10);
    }

    const newUser = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        role: 'user',
      });
    
    await newUser.save();
}

async function update(id, params) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== params.email && await User.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.password = bcrypt.hashSync(params.password, 10);
    }

    // copy params properties to user
    Object.assign(user, params);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
