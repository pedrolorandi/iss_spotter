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
  const url = `http://ipwho.is/${ip}`;

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

const fetchISSFlyOverTimes = (coords, callback) => {
  const { latitude, longitude } = coords;
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${ latitude }&lon=${ longitude }`;

  request(url, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const message = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      return callback(Error(message), null);
    }

    const passes = JSON.parse(body).response;

    return callback(null, passes);
  });
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIp(ip, (error, coordinates) =>{
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coordinates, (error, passTimes) =>{
        if (error) {
          return callback(error, null);
        }
      
        return callback(null, passTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };