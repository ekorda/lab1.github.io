const dns = require('dns');
const website = 'www.miu.edu';

dns.lookup(website, (err, adress, family) => {
    console.log("the adress is of the website %s is %j IPV%s", website, adress, family);
});



