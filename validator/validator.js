const mongoose = require("mongoose")

const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name)
}
const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
};
const isEmpty = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

module.exports = { isEmpty, isValidName,isValidPassword }