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
        var response = JSON.parse(res)
        var results = [];
        if (config.values.temperature === true) {
          results.push({"temperature": response.main.temp})
        }

        return results
      })
      .catch(function(err) {
        console.log(err)
      })
  }
}