/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = (callback) => {
  const url = 'https://api64.ipify.org/?format=json';

  request(url, (error, response, body) => {
    if (error) return callback(error, null);
    
    if (response.statusCode !== 200) {
      return callback(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`, null);
    }

    const ip = JSON.parse(body).ip;
    return callback(null, ip);
  });
};
 
const fetchCoordsByIp = (ip, callback) => {
  const url = 'http://ipwho.is/';
  // const url = 'https://ipwho.is/42';

  request(url, (error, response, body) => {
    if (error) return callback(error, null);

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      return callback(Error(message), null);
    }

    const { latitude, longitude } = parsedBody;
    return callback(null, {latitude, longitude});
  });
};


module.exports = { fetchMyIP, fetchCoordsByIp };