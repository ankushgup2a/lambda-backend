const request = require("request");

exports.handler = function(event, context, callback) {
  const key = "10hYYvgVfLorAlOkA6yUIQJf6NKny57Xcm-bpwbp6s28";
  const url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json";

  request({
    json: true,
    url: url
  }, function (error, response, body) {
    if (error || response.statusCode !== 200) return

    let parsed = body.feed.entry.map( (entry) => {
      let columns = {
        "updated": entry.updated["$t"]
      }

      // Dynamically add all relevant columns from the Sheets to the response
      Object.keys( entry ).forEach( (key) => {
        if ( /gsx\$/.test(key) ) {
          let newKey = key.replace("gsx$", "");
          columns[newKey] = entry[key]["$t"];
        }
      });

      return columns;
    });
    
    let res = {
        "statusCode": 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "https://master.d2p0aou5cieuf7.amplifyapp.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body": JSON.stringify(parsed),
        "isBase64Encoded": false
    };

    callback(null, res);
  });
};
