require("dotenv").config();
const { register } = require("../services/users/register")

const test1 = async () => {
    const response = await register("Bob", "TestPassword12346&", "good@gmail.com");
    console.log(response);
}

module.exports = { test1 };