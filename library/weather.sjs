//#######1#########2#########3#########4#########5#########6#########7#########8#########9#########0
module.exports={
  acc: {
    url: 'http://weather.livedoor.com/forecast/webservice/json/v1?',
    xml: 'http://weather.livedoor.com/forecast/rss/primary_area.xml',
    code: 0
  },
//
  query: function(){
    var me=this; var rc;
    url=me.acc.xml;
    $.ajax({type: 'GET', async: false, url: url, success: function(data, dtype){
      var i=0; var j=0; var c=0; var x=true; rc=[]; var y;
      x=data.getElementsByTagName("city");
      while(x[i]){
        rc[i]={};
        rc[i]['name']=x[i].getAttribute('title');
        rc[i]['code']=x[i].getAttribute('id');
        i++;
      }
    }, error: function(error) {
//      if(rc.status==200){alert(rc.responseText);}else{alert(rc.status+':'+rc.statusText);}
      me.error=error; rc=false;
    }});
    return rc;
  },
//
  getSimple: function(op){
    var me=this, rc, i; op=op||{};
    if(op.lon && op.lat){}else{var pos=me.getGps(); op.lon=pos.longitude; op.lat=pos.latitude;}
    url="http://api.openweathermap.org/data/2.5/weather?lat="+op.lat+"&lon="+op.lon;
    $.ajax({type: 'GET', async: false, url: url, success: function(data){
      rc={}; rc.name=data.name; for(i in data.main){rc[i]=data.main[i];}
      for(i in data.sys){rc[i]=data.sys[i];} for(i in data.wind){rc[i]=data.wind[i];}
    }, error: function(error) {
      me.error=error; rc=false;
    }});
    return rc;
  },
//
  getWeather: function(op){
    var me=this; var rc={}; var i;
    op=op||{}; op.city=op.city||me.getCity();
    url=me.acc.url+'city='+op.city;
    $.ajax({type: 'GET', async: false, url: url, success: function(dt, dtype){
      rc[0]={};
      rc[0]['area']=dt['location']['area'];
      rc[0]['pref']=dt['location']['prefecture'];
      rc[0]['city']=dt['location']['city'];
      rc[0]['title']=dt['title'];
      rc[0]['link']=dt['link'];
      rc[0]['publicTime']=dt['publicTime'];
      rc[0]['description']=dt['description']['text'];
      var du=dt['forecasts']; rc[1]={};
      for(i in du){
        rc[1][i]={};
        rc[1][i]['label']=du[i]['dateLabel'];
        rc[1][i]['telop']=du[i]['telop'];
        rc[1][i]['date']=du[i]['date'];
        if(du[i]['temperature']['min']){rc[1][i]['temperatureMin']=du[i]['temperature']['min']['celsius'];}
        if(du[i]['temperature']['max']){rc[1][i]['temperatureMax']=du[i]['temperature']['max']['celsius'];}
        rc[1][i]['image']=du[i]['image']['url'];
      }
      var dv=dt['pinpointLocations']; rc[2]={};
      for(i in dv){
        rc[2][i]={};
        rc[2][i]['name']=dv[i]['name'];
        rc[2][i]['link']=dv[i]['link'];
      }
    }, error: function(res) {
      console.log(res.status+':'+res.statusText); return false;
    }});
    return rc;
  },
//
  getCity: function(){
    var me=this; var pos=me.getGps(); var a, min=99999999, cd;
    for(var i in me.pos){
      a=Math.sqrt(Math.pow((me.pos[i].lat-pos.latitude),2)+Math.pow((me.pos[i].lon-pos.longitude),2));
      if(a<min){min=a; cd=me.pos[i].code;}
    }
    return cd;
  },
// cordova plugin add cordova-plugin-geolocation
  getGps: function(){
    var rc;
    waitfor(){navigator.geolocation.getCurrentPosition(
      function(pos){rc=pos.coords; resume();},
      function(err){rc=false; this.error=err.message; resume();}
    );}
    return rc;
  },
//
  pos: [
      {code: "011000", lat: 45.3836, lon: 141.7079}, 
      {code: "012010", lat: 43.7579, lon: 142.3789}, 
      {code: "012020", lat: 43.5627, lon: 141.3813}, 
      {code: "013010", lat: 44.0206, lon: 144.2733}, 
      {code: "013020", lat: 43.8040, lon: 143.8958}, 
      {code: "013030", lat: 44.3564, lon: 143.3545}, 
      {code: "014010", lat: 43.3300, lon: 145.5827}, 
      {code: "014020", lat: 42.9848, lon: 144.3813}, 
      {code: "014030", lat: 42.9238, lon: 143.1961}, 
      {code: "015010", lat: 42.3152, lon: 140.9737}, 
      {code: "015020", lat: 42.1685, lon: 142.7681}, 
      {code: "016010", lat: 43.0620, lon: 141.3543}, 
      {code: "016020", lat: 43.1962, lon: 141.7759}, 
      {code: "016030", lat: 42.9018, lon: 140.7586},
      {code: "017010", lat: 41.7687, lon: 140.7288}, 
      {code: "017020", lat: 41.8691, lon: 140.1274}, 
      {code: "020010", lat: 40.8220, lon: 140.7473}, 
      {code: "020020", lat: 41.2927, lon: 141.1834}, 
      {code: "020030", lat: 40.5122, lon: 141.4883}, 
      {code: "030010", lat: 39.7020, lon: 141.1544}, 
      {code: "030020", lat: 39.6414, lon: 141.9571}, 
      {code: "030030", lat: 39.0819, lon: 141.7085}, 
      {code: "040010", lat: 39.2682, lon: 140.8693}, 
      {code: "040020", lat: 38.0024, lon: 140.6198}, 
      {code: "050010", lat: 39.7200, lon: 140.1025}, 
      {code: "050020", lat: 39.3137, lon: 140.5664}, 
      {code: "060010", lat: 38.2554, lon: 140.3396}, 
      {code: "060020", lat: 37.9222, lon: 140.1167}, 
      {code: "060030", lat: 38.9144, lon: 139.8365}, 
      {code: "060040", lat: 38.7650, lon: 140.3016}, 
      {code: "070010", lat: 37.7608, lon: 140.4747}, 
      {code: "070020", lat: 36.9490, lon: 140.9055}, 
      {code: "070030", lat: 37.4947, lon: 139.9298}, 
      {code: "080010", lat: 36.3658, lon: 140.4712}, 
      {code: "080020", lat: 36.0718, lon: 140.1960}, 
      {code: "090010", lat: 36.5551, lon: 139.8828}, 
      {code: "090020", lat: 36.8714, lon: 140.0174}, 
      {code: "100010", lat: 36.3894, lon: 139.0634}, 
      {code: "100020", lat: 36.7786, lon: 138.9688}, 
      {code: "110010", lat: 35.8617, lon: 139.6454}, 
      {code: "110020", lat: 36.1473, lon: 139.3886}, 
      {code: "110030", lat: 35.9920, lon: 139.0848}, 
      {code: "120010", lat: 35.6072, lon: 140.1062}, 
      {code: "120020", lat: 35.7346, lon: 140.8266}, 
      {code: "120030", lat: 34.9965, lon: 139.8699}, 
      {code: "130010", lat: 35.6894, lon: 139.6917}, 
      {code: "130020", lat: 34.7370, lon: 139.3993}, 
      {code: "130030", lat: 33.1030, lon: 139.8035}, 
      {code: "130040", lat: 27.0750, lon: 142.2160}, 
      {code: "140010", lat: 35.4437, lon: 139.6380}, 
      {code: "140020", lat: 35.2645, lon: 139.1521}, 
      {code: "150010", lat: 37.9161, lon: 139.0364}, 
      {code: "150020", lat: 37.4462, lon: 138.8512}, 
      {code: "150030", lat: 37.1151, lon: 138.2422}, 
      {code: "150040", lat: 38.0398, lon: 138.2395}, 
      {code: "160010", lat: 36.6959, lon: 137.2136}, 
      {code: "160020", lat: 36.7919, lon: 137.0579}, 
      {code: "170010", lat: 36.5613, lon: 136.6562}, 
      {code: "170020", lat: 37.3905, lon: 136.8991}, 
      {code: "180010", lat: 36.0640, lon: 136.2194}, 
      {code: "180020", lat: 35.6452, lon: 136.0554}, 
      {code: "190010", lat: 35.6622, lon: 138.5682}, 
      {code: "190020", lat: 35.5170, lon: 138.7517}, 
      {code: "200010", lat: 36.6485, lon: 138.1942}, 
      {code: "200020", lat: 36.2380, lon: 137.9720}, 
      {code: "200030", lat: 35.5147, lon: 137.8218}, 
      {code: "210010", lat: 35.4232, lon: 136.7606}, 
      {code: "210020", lat: 36.1461, lon: 137.2521}, 
      {code: "220010", lat: 34.9755, lon: 138.3827}, 
      {code: "220020", lat: 35.0435, lon: 139.0815}, 
      {code: "220030", lat: 35.1184, lon: 138.9185}, 
      {code: "220040", lat: 34.7108, lon: 137.7261}, 
      {code: "230010", lat: 35.1814, lon: 136.9063}, 
      {code: "230020", lat: 34.7692, lon: 137.3914},
      {code: "240010", lat: 34.7185, lon: 136.5056}, 
      {code: "240020", lat: 34.0707, lon: 136.1909}, 
      {code: "250010", lat: 35.0178, lon: 135.8546}, 
      {code: "250020", lat: 35.2744, lon: 136.2596}, 
      {code: "260010", lat: 35.0116, lon: 135.7680}, 
      {code: "260020", lat: 35.4747, lon: 135.3859}, 
      {code: "270000", lat: 34.6937, lon: 135.5021}, 
      {code: "280010", lat: 34.6900, lon: 135.1955}, 
      {code: "280020", lat: 35.5445, lon: 134.8201}, 
      {code: "290010", lat: 34.6850, lon: 135.8050}, 
      {code: "290020", lat: 34.0438, lon: 135.7817}, 
      {code: "300010", lat: 34.2305, lon: 135.1708}, 
      {code: "300020", lat: 33.4479, lon: 135.7614}, 
      {code: "310010", lat: 35.5011, lon: 134.2350}, 
      {code: "310020", lat: 35.4280, lon: 133.3309}, 
      {code: "320010", lat: 35.4680, lon: 133.0483}, 
      {code: "320020", lat: 34.8993, lon: 132.0797}, 
      {code: "320030", lat: 35.4343, lon: 132.8078}, 
      {code: "330010", lat: 34.6551, lon: 133.9195}, 
      {code: "330020", lat: 35.0691, lon: 134.0045}, 
      {code: "340010", lat: 34.3852, lon: 132.4552}, 
      {code: "340020", lat: 34.8577, lon: 133.0172}, 
      {code: "350010", lat: 33.9578, lon: 130.9414}, 
      {code: "350020", lat: 34.1784, lon: 131.4737}, 
      {code: "350030", lat: 33.9638, lon: 132.1015}, 
      {code: "350040", lat: 34.4081, lon: 131.3990}, 
      {code: "360010", lat: 34.0702, lon: 134.5548}, 
      {code: "360020", lat: 33.7288, lon: 134.5306}, 
      {code: "370000", lat: 35.7101, lon: 134.0465}, 
      {code: "380010", lat: 33.8391, lon: 132.7655}, 
      {code: "380020", lat: 33.9602, lon: 133.2833}, 
      {code: "380030", lat: 33.2233, lon: 132.5605}, 
      {code: "390010", lat: 33.5588, lon: 133.5311}, 
      {code: "390020", lat: 33.2680, lon: 134.1641}, 
      {code: "390030", lat: 32.7833, lon: 132.9578}, 
      {code: "400010", lat: 33.5903, lon: 130.4017}, 
      {code: "400020", lat: 33.8689, lon: 130.7953}, 
      {code: "400030", lat: 33.6459, lon: 130.6915}, 
      {code: "400040", lat: 33.3192, lon: 130.5083}, 
      {code: "410010", lat: 33.2634, lon: 130.3008}, 
      {code: "410020", lat: 33.2645, lon: 129.8802}, 
      {code: "420010", lat: 32.7502, lon: 129.8776}, 
      {code: "420020", lat: 33.1799, lon: 129.7151}, 
      {code: "420030", lat: 34.2032, lon: 129.2882}, 
      {code: "420040", lat: 32.6963, lon: 128.8410}, 
      {code: "430010", lat: 32.8031, lon: 130.7078}, 
      {code: "430020", lat: 32.9433, lon: 131.0426}, 
      {code: "430030", lat: 32.1944, lon: 130.0257}, 
      {code: "430040", lat: 32.2100, lon: 130.7625}, 
      {code: "440010", lat: 33.2395, lon: 131.6092}, 
      {code: "440020", lat: 33.5982, lon: 131.1883}, 
      {code: "440030", lat: 33.3213, lon: 130.9409}, 
      {code: "440040", lat: 32.9598, lon: 131.9000}, 
      {code: "450010", lat: 31.9076, lon: 131.4202}, 
      {code: "450020", lat: 32.5819, lon: 131.6650}, 
      {code: "450030", lat: 31.7195, lon: 131.0616}, 
      {code: "450040", lat: 32.7116, lon: 131.3077}, 
      {code: "460010", lat: 31.5965, lon: 130.5571}, 
      {code: "460020", lat: 31.3782, lon: 130.8520}, 
      {code: "460030", lat: 30.6095, lon: 130.9788}, 
      {code: "460040", lat: 28.3961, lon: 129.4665}, 
      {code: "471010", lat: 26.2123, lon: 127.6791}, 
      {code: "471030", lat: 26.3490, lon: 126.7472}, 
      {code: "472000", lat: 25.8487, lon: 131.2507}, 
      {code: "470040", lat: 24.8054, lon: 125.2811}, 
      {code: "474010", lat: 24.4064, lon: 124.1754}, 
      {code: "474020", lat: 24.4616, lon: 123.0085}
  ],
  close: function(){}
}
