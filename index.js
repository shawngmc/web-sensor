const fs = require('fs');

var configString = fs.readFileSync("config.json");
var config = JSON.parse(configString);

let runSensors = async function () {
  for (var sensor of config.sensors) {
    let moduleName = './built-ins/' + sensor.module + '.js'
    try {
      let webModule = require(moduleName)
      let results = await webModule.getResults(sensor.config)
      console.log(results)
      // TODO: Sent over MQTT
    } catch (ex) {
      console.log(ex)
    }
  }
}

runSensors();