const User = require('../model/user');

module.exports.createUser = async ({ username, email, password }) => {
    if(!username || !email || !password) {
        throw new Error('All fields are required');
    }
    const user = await User.create({ 
        username, 
        email, 
        password
     });
    return user;
}