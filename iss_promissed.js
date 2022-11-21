const request = require('request-promise-native');

const fetchMyIp = () => {
  return request('https://api64.ipify.org/?format=json');
};

const fetchCoordsByIp = (body) => {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

const fetchISSFlyOverTimes = (body) => {
  const { latitude, longitude } = JSON.parse(body);
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${ latitude }&lon=${ longitude }`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIp()
    .then(fetchCoordsByIp)
    .then(fetchISSFlyOverTimes)
    .then(data => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };