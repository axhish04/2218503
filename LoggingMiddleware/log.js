const axios = require('axios');
require('dotenv').config(); 

const token = process.env.ACCESS_TOKEN; 

async function Log(stack, level, packageName, message) {
    const payload = {
        stack,
        level,
        package: packageName,
        message
    };

    try {
        const res = await axios.post('http://20.244.56.144/evaluation-service/log', payload, {
            headers: {
                Authorization: token
            }
        });
        console.log("Log sent successfully");
    } catch (err) {
        console.error("Logging failed:", err.response ? err.response.data : err.message);
    }
}

module.exports = Log;
