//const { get } = require("mongoose");
const jwt = require("jsonwebtoken")
const secret = "Deep@2004"

const sessionIdToUserMap = new Map();

function setUser(user){
    //sessionIdToUserMap.set(id , user);
    const payload = {
        _id: user._id,
        email: user.email
    }
    return jwt.sign(payload , secret);
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token , secret)
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser
};