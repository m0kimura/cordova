//#######1#########2#########3#########4#########5#########6#########7#########8#########9#########0
module.exports={
  acc: {
    urlNews: 'http://news.yahooapis.jp/NewsWebService/V2/topics?',
    urlPower: 'http://setsuden.yahooapis.jp/v1/Setsuden/latestPowerUsage?',
    urlPforecast: 'http://setsuden.yahooapis.jp/v1/Setsuden/electricPowerForecast?',
    urlItem: 'http://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?',
    appid: 'dj0zaiZpPU1XbnBYemFiNklPRyZzPWNvbnN1bWVyc2VjcmV0Jng9MmE-',
    code: 0
  },
// ニュース
//
  getNews: function(op){ // パラメタオブジェクト==>JSON Object
    op=op||{};
    var me=this; var rc=''; var i; var wk='';
    for(i in op){wk+='&'+i+'='+op[i];}
    url=me.acc.urlNews+'appid='+me.acc.appid+wk;
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
      var x=data.getElementsByTagName('Result'); var k, v, y; rc=[];
      for(i=0; i<x.length; i++){
        rc[i]={};
        y=x[i].firstChild;
        while(y){
          k=y.tagName; if(k){v=y.textContent; rc[i][k]=v;}
          y=y.nextSibling;
        }
      }
    }, error: function(res) {
      var dt=JSON.parse(res.responseText);
      rc=dt.results; return rc;
    }});
    return rc;
  },
//
//電力供給状況
  getPower: function(op){
    if(!op){op={};}
    var me=this; var rc=''; var i; var wk='';
    for(i in op){wk+='&'+i+'='+op[i];}
    url=me.acc.urlPower+'appid='+me.acc.appid+'&output=json'+wk;
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
      if(data.error){rc=false; me.error.message=data.error.message}
      else{
        var dt=data.ElectricPowerUsage;
        rc={};
        rc['Area']=dt.Area;
        rc['Usage']=dt['Usage']['$'];
        rc['Capacity']=dt['Capacity']['$'];
        rc['Date']=dt['Date'];
        rc['Hour']=dt['Hour'];
        rc['Min']=dt['Min'];
      }
    }, error: function(res) {
      var dt=JSON.parse(res.responseText);
      rc=dt.results;
    }});
    return rc;
  },
//
//電力供給予想
  getPforecast: function(op){
    if(!op){op={};}
    var me=this; var rc=''; var i; var wk='';
    for(i in op){wk+='&'+i+'='+op[i];}
    url=me.acc.urlPforecast+'appid='+me.acc.appid+'&output=json'+wk;
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
      if(data.error){rc=false; me.error.message=data.error.message}
      else{
        var dt=data.ElectricPowerForecasts; rc=[];
        var du=dt.Forecast;
        for(i in du){
          rc[i]={};
          rc[i]['Area']=du[i].Area;
          rc[i]['Usage']=du[i].Usage.$;
          rc[i]['Capacity']=du[i].Capacity.$;
          rc[i]['Date']=du[i].Date;
          rc[i]['Hour']=du[i].Hour;
        }
      }
    }, error: function(res) {
      var dt=JSON.parse(res.responseText);
      rc=dt.results;
    }});
    return rc;
  },
//
// 商品アイテム
  getItem: function(op){
    if(!op){op={};}
    var me=this; var rc=''; var i; var wk='';
    for(i in op){wk+='&'+i+'='+op[i];}
    url=me.acc.urlItem+'appid='+me.acc.appid+wk;
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
      if(data.error){rc=false; me.error.message=data.error.message}
      else{
        var dt=data.ResultSet[0]; rc={};
        var du=dt.Result[0];
        rc.code=du.Code;
        rc.name=du.Name;
        rc.url=du.Url;
        rc.description=du.Description;
        rc.copy=du.Headline;
        rc.image=du.Image.Medium;
        rc.price=du.PriceLabel.FixedPrice;
        rc.brand=du.Brands.Name;
      }
    }, error: function(res) {
      var dt=JSON.parse(res.responseText);
      rc=dt.results;
    }});
    return rc;
  },
//
  setValue: function(key, val){localStorage.setItem(key, val);},
  getValue: function(key){return localStorage.getItem(key);},
  setJson: function(key, obj){this.setValue(key, JSON.stringify(obj));},
  getJson: function(key){
    var x=localStorage.getItem(key); if(!x){return {};}
    x=JSON.parse(x); if(!x){x={}; console.log('no data key='+key);} return x;
  },
  close: function(){}
};
