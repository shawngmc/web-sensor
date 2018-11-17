const rp = require('request-promise');

module.exports = {
  async getResults(config) {
    let key = config.apikey
    let units = config.units
    let unitAbbr = ""
    switch (units) {
      case "imperial":
        unitAbbr = "F"
        break;
      case "metric":
        unitAbbr = "C"
        break
      case "kelvin":
      default:
        unitAbbr = "K"
    }
    let zipcode = config.zip
    let url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipcode + ",us&APPID=" + key + "&units=" + units

    return rp(url)
      .then(function(res) {
        console.log(res)
        var response = JSON.parse(res)
        var results = {};
        if (config.values.temperature === true) {
          results["temperature"] = response.main.temp
        }
        if (config.values.humidity === true) {
          results["humidity"] = response.main.humidity
        }
        if (config.values.windspeed === true) {
          results["windspeed"] = response.wind.speed
        }
        if (config.values.conditions === true) {
          results["conditions"] = response.weather.main
        }

        return results
      })
      .catch(function(err) {
        console.log(err)
      })
  }
}