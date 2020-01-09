const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'IPaddress',
            describe: 'IP Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var geocodeUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=YourAPIKeyHere&ip=${argv.IPaddress}`;

axios.get(geocodeUrl).then((response) => {
    if(response.data.message){
        throw new Error('Unable to find the given address.');
    }

    var lat = response.data.latitude;
    var long = response.data.longitude;
    var weatherUrl = `https://api.darksky.net/forecast/YourAPIKeyHere/${lat},${long}`;

    console.log(`Fetching weather data for IP address: ${argv.IPaddress}`);
    console.log(`Showing weather results for ${response.data.city}, ${response.data.state_prov}, ${response.data.country_name}, zip: ${response.data.zipcode}`);

    return axios.get(weatherUrl);
}).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`Its currently ${temperature}*F. It feels like ${apparentTemperature}*F. Current weather: ${response.data.currently.summary}`);
}).catch((e) => {
    if(e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers.');
    }
    else{
        console.log(e.message);
    }
});