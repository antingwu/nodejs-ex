var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var fs1 = require("fs");
var MyDate = new Date();
var MyDateString;

MyDateString = MyDate.getFullYear()+'/'+(MyDate.getMonth()+1)+'/'+MyDate.getDate();

var pm25 = function() {
  request({
    url: "http://taqm.epa.gov.tw/taqm/tw/Pm25Index.aspx",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {return;}
    // 爬完網頁後要做的事情
    var $ = cheerio.load(body);
    var result = [];
    var titles = $("area.jTip");
    var location;
    for (var i = 0; i < titles.length; i++) {
      result.push(titles.eq(i).attr('jtitle'));
    }
    fs.writeFile("result.json", result, function() {
      var varTime = new Date();
      for (var j = 0; j < result.length; j++) {
        var data = JSON.parse(result[j]);
        if(data.SiteName=='鳳山'){
          console.log(data.SiteName + ', PM2.5: '+ data.FPMI +'   時間 '+ MyDateString + ' ' + varTime.toLocaleTimeString());
		  fs1.writeFile("鳳山區空氣品質記錄.txt",data.SiteName + ', PM2.5: '+ data.FPMI +' 時間 ' + MyDateString + ' ' + varTime.toLocaleTimeString()+'\r\n',{flag:'a'});
		if (data.FPMI <=3 && data.FPMI >=1) {
			console.log("即時細懸浮微粒(PM2.5)指標「低」,正常戶外活動。。\r\n");
		} else if (data.FPMI <=6 && data.FPMI >=4) {
			console.log("即時細懸浮微粒(PM2.5)指標「中」,有心臟、呼吸道及心血管疾病的成人與孩童感受到癥狀時，應考慮減少體力消耗，特別是減少戶外活動。。\r\n");
		} else if (data.FPMI <=9 && data.FPMI >=7) {
			console.log("即時細懸浮微粒(PM2.5)指標「高」,避免在戶外劇烈活動。\r\n");
		} else if (data.FPMI >=10) {
			console.log("即時細懸浮微粒(PM2.5)指標「非常高」,任何人如果有不適，如眼痛，咳嗽或喉嚨痛等，應減少體力消耗，特別是減少戶外活動。。\r\n");
		}		
	}
  }

});
  });
};
pm25();
setInterval(pm25,300*60*1000);
