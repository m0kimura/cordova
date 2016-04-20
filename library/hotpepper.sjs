//#######1#########2#########3#########4#########5#########6#########7#########8#########9#########0
module.exports={
  acc: {
    apiKey: '53cd742a788ffb4b',
    UrlGourmet: 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/',
    UrlAreaL: 'http://webservice.recruit.co.jp/hotpepper/large_area/v1',
    UrlAreaM: 'http://webservice.recruit.co.jp/hotpepper/middle_area/v1',
    UrlAreaS: 'http://webservice.recruit.co.jp/hotpepper/small_area/v1',
    UrlGenre: 'http://webservice.recruit.co.jp/hotpepper/genre/v1',
    UrlFoodGp: 'http://webservice.recruit.co.jp/hotpepper/food_category/v1',
    UrlFood: 'http://webservice.recruit.co.jp/hotpepper/food/v1',
    UrlCard: 'http://webservice.recruit.co.jp/hotpepper/credit_card/v1',
    code: 0
  },
//
  getService: function(op){
    var me=this; var rc, f;
    if(!op){op={}; var pos=me.getGps(); op.lat=pos.latitude; op.lng=pos.longitude;}
    url=me.acc.UrlGourmet+'?key='+me.acc.apiKey;
    for(var i in op){url+="&"+i+"="+op[i];} url+='&count=100&format=json';
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
    }, error: function(res) {
      if(res.readyState==4){
        var dt=JSON.parse(res.responseText);
        rc=dt.results.shop; REC['hotpepper']=rc;
      }else{console.log(res.status+':'+res.statusText);}
    }});
    return rc;
  },
//
  getAreaL: function(){
    var me=this; var rc;
    url=me.acc.UrlAreaL+'?key='+me.acc.apiKey+'&count=100&format=json';
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
    }, error: function(res) {
      if(res.readyState==4){
        var dt=JSON.parse(res.responseText);
        dt=dt.results.large_area; rc=[];
        for(i in dt){
          rc[i]={};
          rc[i]['code']=dt[i]['code'];
          rc[i]['name']=dt[i]['name'];
          rc[i]['lservice']=dt[i]['large_service_area']['name'];
          rc[i]['service']=dt[i]['service_area']['name'];
        }
      }else{console.log(res.status+':'+res.statusText);}
    }});
    REC['hotpepper']=rc;
    return rc;
  },
//
  getAreaM: function(opt){
    if(!opt){opt={};}
    var me=this; var rc;
    url=me.acc.UrlAreaM+'?key='+me.acc.apiKey+'&count=100&format=json';
    if(opt.large){url+='&large_area='+opt.large;}
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
    }, error: function(res) {
      if(res.readyState==4){
        var dt=JSON.parse(res.responseText);
        dt=dt.results.middle_area; rc=[];
        for(i in dt){
          rc[i]={};
          rc[i]['code']=dt[i]['code'];
          rc[i]['name']=dt[i]['name'];
          rc[i]['large']=dt[i]['large_area']['name'];
          rc[i]['lservice']=dt[i]['large_service_area']['name'];
          rc[i]['service']=dt[i]['service_area']['name'];
        }
      }else{console.log(res.status+':'+res.statusText);}
    }});
    REC['hotpepper']=rc;
    return rc;
  },
//
  getAreaS: function(opt){
    if(!opt){opt={};}
    var me=this; var rc;
    url=me.acc.UrlAreaS+'?key='+me.acc.apiKey+'&count=100&format=json';
    if(opt.middle){url+='&middle_area='+opt.middle;}
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
    }, error: function(res) {
      if(res.readyState==4){
        var dt=JSON.parse(res.responseText);
        dt=dt.results.small_area; rc=[];
        for(i in dt){
          rc[i]={};
          rc[i]['code']=dt[i]['code'];
          rc[i]['name']=dt[i]['name'];
          rc[i]['middle']=dt[i]['middle_area']['name'];
          rc[i]['large']=dt[i]['large_area']['name'];
          rc[i]['lservice']=dt[i]['large_service_area']['name'];
          rc[i]['service']=dt[i]['service_area']['name'];
        }
      }else{console.log(res.status+':'+res.statusText);}
    }});
    REC['hotpepper']=rc;
    return rc;
  },
//
  getGenre: function(){
    var me=this; var rc;
    url=me.acc.UrlGenre+'?key='+me.acc.apiKey+'&count=100&format=json';
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
    }, error: function(res) {
      if(res.readyState==4){
        var dt=JSON.parse(res.responseText);
        dt=dt.results.genre; rc=[];
        for(i in dt){
          rc[i]={};
          rc[i]['code']=dt[i]['code'];
          rc[i]['name']=dt[i]['name'];
        }
      }else{console.log(res.status+':'+res.statusText);}
    }});
    REC['hotpepper']=rc;
    return rc;
  },
//
  getFoodGp: function(){
    var me=this; var rc;
    url=me.acc.UrlFoodGp+'?key='+me.acc.apiKey+'&count=100&format=json';
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
    }, error: function(res) {
      if(res.readyState==4){
        var dt=JSON.parse(res.responseText);
        dt=dt.results.food_category; rc=[];
        for(i in dt){
          rc[i]={};
          rc[i]['code']=dt[i]['code'];
          rc[i]['name']=dt[i]['name'];
        }
      }else{console.log(res.status+':'+res.statusText);}
    }});
    return rc;
  },
//
  getFood: function(opt){
    if(!opt){opt={};}
    var me=this; var rc;
    url=me.acc.UrlFood+'?key='+me.acc.apiKey+'&count=100&format=json';
    if(opt.category){url+='&food_category='+opt.category}
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
    }, error: function(res) {
      if(res.readyState==4){
        var dt=JSON.parse(res.responseText);
        dt=dt.results.food; rc=[];
        for(i in dt){
          rc[i]={};
          rc[i]['code']=dt[i]['code'];
          rc[i]['name']=dt[i]['name'];
          rc[i]['category']=dt[i]['food_category']['name'];
        }
      }else{console.log(res.status+':'+res.statusText);}
    }});
    return rc;
  },
//
  getCard: function(opt){
    var me=this; var rc;
    url=me.acc.UrlCard+'?key='+me.acc.apiKey+'&count=100&format=json';
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
    }, error: function(res) {
      if(res.readyState==4){
        var dt=JSON.parse(res.responseText);
        dt=dt.results.credit_card; rc=[];
        for(i in dt){
          rc[i]={};
          rc[i]['code']=dt[i]['code'];
          rc[i]['name']=dt[i]['name'];
        }
      }else{console.log(res.status+':'+res.statusText);}
    }});
    REC['hotpepper']=rc;
    return rc;
  },
// cordova plugin add cordova-plugin-geolocation
  getGps: function(){
    var rc;
    waitfor(){navigator.geolocation.getCurrentPosition(
      function(pos){rc=pos.coords; resume();},
      function(err){rc=false; this.error=err.message; resume();}
    );}
    REC['hotpepper']=rc;
    return rc;
  },
  close: function(){}
}
