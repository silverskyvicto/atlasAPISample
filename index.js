const request = require('request');
const marketplaceBaseURL = "https://marketplace.atlassian.com";
const getAddonSearchAPI = "/rest/2/addons/search/brief";
const getAddonInfoAPI = "/rest/2/addons/";
const pricingInfoPart = "/pricing/server/live"
let toString = Object.prototype.toString

// HTTP header
let headers = {
  'Content-Type': 'application/json'
};

let addonSearchOption = {
  url: marketplaceBaseURL + getAddonSearchAPI,
  method: 'GET',
  header: headers,
  qs: {
    "q": "*gantt*"
  }
};

request(addonSearchOption, function(error, response, body) {
  if (body) {
    const bodyParse = JSON.parse(body);
    const addons = bodyParse.addons;
    addons.forEach(function(addon, i, addons) {

      let addonKey = addon._links.alternate.href.split("/")[2];
      request({
          url: marketplaceBaseURL + getAddonInfoAPI + addonKey + pricingInfoPart,
          method: 'GET',
          header: headers,
        },
        function (err, res, infoBody) {
          if (infoBody) {
            const infoParse = JSON.parse(infoBody);
            console.log(addon.name);
            console.log("最終更新日：" + infoParse.lastModified);
            infoParse.items.forEach(function (info, j, infos) {
              console.log("ユーザ数：" + info.editionDescription);
              console.log("新規：$ " + info.amount);
              console.log("更新：$ " + info.renewalAmount);
            });
          }
          if (err) {
            console.log(err);
          }
        }
      );
    });
  }
  if (error) {
    console.log(error);
  }
});
