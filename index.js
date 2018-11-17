const fs = require('fs');
const MQTT = require('async-mqtt');
const _ = require('lodash');

let configString = fs.readFileSync("config.json");
let config = JSON.parse(configString);

let runSensors = async function (sensor) {
  let moduleName = './built-ins/' + sensor.module + '.js'
  try {
    let webModule = require(moduleName)
    let results = await webModule.getResults(sensor.config)
    return results;
  } catch (ex) {
    console.log(ex)
  }
}

let buildConnection = function () {
  // Build MQTT connection
  let brokerURL = config.broker.protocol + "://" + config.broker.host + ":" + config.broker.port;
  console.log(brokerURL)
  let client = MQTT.connect(brokerURL, {
    username: config.broker.username,
    password: config.broker.password
  });
  return client;
}

let waitForConnection = function (client) {
  let connectedPromise = new Promise(
      function (resolve, reject) {
        try {
          client.on('connect', () => { resolve() });
        } catch (ex) {
          reject(ex);
        }
      });
  return connectedPromise;
}

let main = async function () {
  let client = buildConnection();
  await waitForConnection(client);

  for (var sensor of config.sensors) {
    let results = await runSensors(sensor);
    _.forOwn(results, async function(value, key) {
      let topic = "websensor/" + sensor.name + "/" + key;
      await client.publish(topic, value.toString());
    })
  }
  await client.end();
}

main();