module.exports={Scenario: [], Syn: {},
// cordova plugin add cordova-plugin-whitelist
// cordova plugin add cordova-plugin-device
// cordova plugin add cordova-plugin-splashscreen
// cordova plugin add cordova-plugin-console
  open: function(){
    console.log("BOA:", this.today(), this.now());
  },
//
// date 日付編集 YMD ymd HIS his W w
//      (編集文字列)==>編集日付
  date: function(t, time){
    if(time){var d=new Date(time);}else{var d=new Date();}
    t=t.replace(/Y/, d.getYear()-100); t=t.replace(/y/, d.getYear()+1900);
    t=t.replace(/M/, (d.getMonth()+101+' ').substr(1, 2)); t=t.replace(/m/, d.getMonth()+1);
    t=t.replace(/D/, (d.getDate()+100+' ').substr(1, 2)); t=t.replace(/d/, d.getDate());
    t=t.replace(/H/, (d.getHours()+100+' ').substr(1, 2)); t=t.replace(/h/, d.getHours());
    t=t.replace(/I/, (d.getMinutes()+100+' ').substr(1, 2)); t=t.replace(/i/, d.getMinutes());
    t=t.replace(/S/, (d.getSeconds()+100+' ').substr(1, 2)); t=t.replace(/s/, d.getSeconds());
    t=t.replace(/W/, ['日', '月', '火', '水', '木' ,'金' , '土'][d.getDay()]);
    t=t.replace(/w/, ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()]);
    return t;
  },
  today: function(){return this.date('Y/M/D');},
  now:  function(){return this.date('H:I:S');},
//
// vibrate
// cordova plugin add org.apache.cordova.vibration
  vibrate: function(op){
    var me=this; op=op||{}; op.time=op.time||3000;
    navigator.notification.vibrate(op.time);
  },
//
// sound
// cordova plugin add cordova-plugin-media
  sound: function(op){
    var me=this; op=op||{}; op.url=op.url||"library/ring1.mp3"; op.cmd=op.cmd||'play';
    op.repeat=op.repeat||true;
    me.Play=false;
    var media=function(me, op){
      me.Media=new Media("/android_asset/www/"+op.url,
        function(){
          if(me.Play){if(!me.Media){media(me, op);} me.Media.play();}
        },
        function(err){console.log("error:", err.code);}
      );
      if(me.Media){me.Media.play();}
    };
    switch(op.cmd){
      case 'play': if(!me.Media){media(me, op); me.Play=op.repeat;} break;
      case 'stop': me.Play=false; if(me.Media){me.Media.stop(); me.Media=null;} break;
    }
  },
//
//BarcodeScanner
// cordova plugin add phonegap-plugin-barcodescanner
  barscan: function(){
    var me=this; var rc;
    waitfor(){cordova.plugins.barcodeScanner.scan(
      function(result){REC.barcode=[result]; rc=result; resume();}, 
      function(error){rc=false; me.error=error; resume();}
    );}
    return rc;
  },
  barencode: function(txt){
    var me=this; var rc;
    waitfor(){cordova.plugins.barcodeScanner.encode(
      cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, txt,
      function(result){rc=result; resume();}, 
      function(err){rc=false; me.error=err; resume();}
    );}
    return rc;
  },
  bartag: function(op){
    op=op||{}; op.size=op.size||"150x150"; op.type=op.type||"qr"; op.data=op.data||"http://google.com"; 
    var out='<img src="http://chart.googleapis.com/chart?choe=UTF-8';
    out+='&chs='+op.size; out+='&cht='+op.type; out+='&chd='+op.data; out+='" />';
    REC.barcode=[{tag: out}];
    return out;
  },
//
// BluetoothLowEnergy
// cordova plugin add cordova-plugin-ble-central
  onBle: function(proc, op){
    var me=this, rc; op=op||{}; op.list=op.list||[];
    op.period=op.period||5; op.interval=op.interval||300;
    proc=proc||function(){}; me.bleproc=proc;
    var cycle=op.period*1000+op.interval;
    setInterval(function(){me.blescan(op); me.sleep(op.period*1000); proc(me.sort(me.BleTable));}, cycle);
  },
  sleep: function(t){
    t=t||1000; waitfor(){setTimeout(function(){resume();}, t);}
  },  
  blescan: function(op){
    var me=this, a={}; me.BleTable=[];
    ble.scan(op.list, op.period,
      function(res){
        a={}; for(var k in res){
          if(k=="advertising"){a.advertising=me.bts(res[k]);}else{a[k]=res[k];}
        }
        a.advertising=a.name;
        var i=me.BleTable.length; me.BleTable[i]=a;
        REC.ble=me.BleTable;
      },
      function(err){me.error=err;}
    );
  },
  bts: function(buffer){
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  },
  sort: function(tb){
    var f, t, h, out=tb;
    for(var i=0; i<out.length-1; i++){for(var j=i+1; j<out.length; j++){
      f=out[i].rssi-0; t=out[j].rssi-0;
      if(t>f){h=out[i]; out[i]=out[j]; out[j]=h;}
    }}
    return out;
  },
//
// NfcReader
// cordova plugin add phonegap-nfc
  nfcscan: function(){
    var me=this; var rc;
    waitfor(){nfc.addNdefListener(
      function(nfcEvent){
        rc={};
        rc.tag=nfcEvent.tag; rc.message=rc.tag.ndefMessage;
        rc.cond=true;
        REC.nfc=[rc]; resume();
      }, 
      function(){},
      function (error){rc=false; me.error=error; resume();}
    );}
    nfc.removeNdefListener(function(){});
    return rc;
  },
//
// TTS
// cordova plugin add io.cordova.plugins.TTS
  ttsBegin: function(op){
    var me=this;
    op=op||{}; op.locale=op.locale||"ja-JP"; op.rate=op.rate||1; op.txt=op.txt||'';
    me.Syn.locale=op.locale; me.Syn.rate=op.rate; me.Syn.text=op.txt;
    me.Msg=op.message||{};
  },
//
  talk: function(txt){
    var me=this;
    var argv=me.talk.arguments; txt=me.ttsedit(txt, me.talk.arguments);
    if(me.Scenario.length==0){me.Scenario.push(txt); me.speak();}else{me.Scenario.push(txt);}
  },
//
  talkFix: function(key){
    var me=this;
    var argv=me.talkFix.arguments; var txt=me.ttsedit(me.Msg[key], me.talkFix.arguments);
    if(me.Scenario.length==0){me.Scenario.push(txt); me.speak();}else{me.Scenario.push(txt);}
  },
//
  talkHash: function(){
    var me=this;
    var txt=ocation.hash.substr(1);
    if(me.Scenario.length==0){me.Scenario.push(txt); me.speak();}else{me.Scenario.push(txt);}
  },
//
  speak: function(){
    var me=this;
    while(me.Scenario.length>0){
      waitfor(){
        me.Syn.text=me.Scenario[0];
        TTS.speak(me.Syn, function(){resume();}, function(e){alert(reason); resume();});
      }
      me.Scenario.shift();
    }
  },
//
  ttsedit: function(txt, argv){
    var me=this; txt=txt||''; argv=argv||{};
    var out='', i, j;
    for(i=0; i<txt.length; i++){
      if(txt[i]=='$'){i++; j=txt[i]-0; out+=argv[j];}else{out+=txt[i];}
    }
    return out;
  },
//
// STT
// cordova plugin add cordova-plugin-speechrecognizer
  recognize: function(op){
    var me=this; op=op||{}; op.maches=op.matches||5; op.language=op.language||'ja-JP';
    op.prompt=op.prompt||'お話しください。';
    var out; waitfor(){
      window.plugins.speechrecognizer.startRecognize(
        function(res){out=res; resume();},
        function(e){this.error=e; out=false; resume();},
        op.maches, op.prompt, op.language
      );
    }
    return out;
  },
//
  recognizeCheck: function(){
    var me=this;
    var rc; waitfor(){
      window.plugins.speechrecognizer.checkSpeechRecognition(
        function(){rc='OK'; resume();},
        function(){rc='NG'; resume();}
      );
    }
    return rc;
  },
//
// InappBrowser
// cordova plugin add cordova-plugin-inappbrowser
  webshow: function(url, op){
    url=url||"http://www.google.com/"; op=op||{};
    op.target=op.target||""; op.location=op.location||"no";
    var opt="location="+op.location;
    this.Browser=cordova.InAppBrowser.open(url, op.target, opt);
    return this.Browser;
  },
//
  webclose: function(){
    this.Browser.close();
  },
//
// GPS
// cordova plugin add cordova-plugin-geolocation
  getGps: function(){
    var rc;
    waitfor(){navigator.geolocation.getCurrentPosition(
      function(pos){rc=pos.coords; REC.gps[0]=rc; resume();},
      function(err){rc=false; this.error=err.message; resume();}
    );}
    return rc;
  },
//
  onGpsCycle: function(proc, op){
    var me=this, dt; op=op||{}; op.interval=op.interval||10000;
    while(true){dt=me.getGps(); proc(dt); me.sleep(op.interval);}
  },
//
  onGps: function(proc, eproc){
    var me=this, rc; proc=proc||function(){}; eproc=eproc||{};
    me.WatchId=navigator.geolocation.watchPosition(
      function(pos){REC.gps=[pos.coords]; proc(pos.coords);}, function(err){eproc(err.message);}
    );
  },
  clearGps: function(){
    var me=this; navigator.geolocation.clearWatch(me.WatchId);
  },
//
//Socket.io
// 
//
  onSocket: function(proc, op){ // 
    var me=this; op=op||{}; op.host=op.host||"http://aws.kmrweb.net"; op.port=op.port||"8084";
    me.proc=proc||function(){};
    me.Soc=io.connect(op.host+':'+op.port);
    console.log('socket connect:'+op.host+':'+op.port);
    me.Soc.on('message', function(obj){
      switch(obj.cmd){
       case 'Hello':
        console.log("Hello from server");
        me.Soc.emit('message', {cmd: "Hi", id: op.id, uuid: window.device.uuid, name: op.name});
        break;
       default:
        var rc=me.proc(obj, me.socket); if(rc){me.sendSocket(rc);}
      }
    });
    me.Soc.on("disconnect", function(){
      me.proc({cmd: "disconnect"}, me.socket);
      console.log('disconnect');
    });
  },
  sendSocket: function(msg){
    var me=this; msg=msg||{}; msg.cmd=msg.cmd||'fummy';
    msg.date=me.today(); msg.time=me.now(); msg.uuid=window.device.uuid;
    msg.uniq=Math.floor(Math.random()*1000000);
    me.Soc.emit("message", msg);
  },
//
// launch App
// cordova plugin add com.lampa.startapp
  launch: function(app){
    var rc;
    waitfor(){navigator.startApp.start(app,
      function(message){rc=ture; resume();}, 
      function(err){rc=false; me.error=err; resume();}
    );}
  },
//
// Get Heading
// cordova plugin add cordova-plugin-device-orientation
  getHeading: function(){
    var me=this, rc;
    waitfor(){navigator.compass.getCurrentHeading(
      function(head){REC.heading=[head]; rc=head; resume();},
      function(){rc=false; me.error="no message"; resume();}
    );}
    return rc;
  },
// statusbar
// cordova plugin add cordova-plugin-statusbar
  statusbar: function(op){
    op=op||{}; op.cmd=op.cmd||'hide';
    if(op.cmd=='show'){statusBar.show();}else{statusBar.hide();}
  },
// Watch Heading
  onHeading: function(proc, op){
    var me=this; op=op||{}; op.frequency=op.frequency||3000;
    me.WatchPasId=navigator.compass.watchHeading(
      function(head){REC.heading=[head]; proc(true, head);},
      function(){proc(false, {});},
    op);
  },
  stopHeading: function(){
    navigator.compass.clearWatch(me.WatchPasId); me.WatchPasId=null;
  },
//
// Get Motion
// cordova plugin add cordova-plugin-device-motion
  getMotion: function(){
    var me=this, rc;
    waitfor(){navigator.accelerometer.getCurrentAcceleration(
      function(acc){REC.motion=[acc]; rc=acc; resume();},
      function(){rc=false; me.error="no message"; resume();}
    );}
    return rc;
  },
// Watch Motion
  onMotion: function(proc, op){
    var me=this; op=op||{}; op.frequency=op.frequency||3000;
    me.WatchMotId=navigator.accelerometer.watchAcceleration(
      function(acc){REC.motion=[acc]; proc(true, acc);},
      function(){proc(false, {});},
    op);
  },
  stopMotion: function(){
    navigator.accelerometer.clearWatch(me.WatchMotId); me.WatchMotId=null;
  },
//
// Get Gyro
// cordova plugin add org.dartlang.phonegap.gyroscope
  getGyro: function(){
    var me=this, rc;
    waitfor(){navigator.gyroscope.getCurrentAngularSpeed(
      function(speed){REC.gyro=[speed]; rc=speed; resume();},
      function(){rc=false; me.error="no message"; resume();}
    );}
    return rc;
  },
// Watch Gyroscope
  onGyro: function(proc, op){
    var me=this; op=op||{}; op.frequency=op.frequency||3000;
    me.WatchAngId=navigator.gyroscope.watchAngularSpeed(
      function(speed){proc(true, speed);},
      function(){proc(false, {});},
    op);
  },
  stopGyro: function(){
    navigator.navigator.clearWatch(me.WatchAngId); me.WatchAngId=null;
  },
//
// Get Sensor
// above all
  getSensor: function(op){
    op=op||{}; op.type=op.type||"flat";
    var me=this, rc={}, x, i, out=[];
    x=me.getMotion(); for(i in x){rc['acce-'+i]=x[i]; out.push({key: "acce-i"+i, value: x[i]});}
//    x=me.getGyro(); for(i in x){rc['gyro-'+i]=x[i]; out.push({key: "gyro-i"+i, value: x[i]});}
    x=me.getHeading(); for(i in x){rc['head-'+i]=x[i]; out.push({key: "head-i"+i, value: x[i]});}
    if(op.type=="flat"){REC['sensor']=out;}else{REC['sensor'].unshift(rc);} 
    return rc;
  },
// Watch Sensor
  onSensor: function(proc, op){
    var me=this, rc; op=op||{}; op.frequency=op.frequency||3000;
    rc=me.getSensor(); proc(true, rc);
    me.WatchId=setInterval(function(){
      rc=me.getSensor(); proc(true, rc);
    }, op.frequency);
  },
  stopSensor: function(){
    this.clearInterval(this.WatchId); this.WatchId=null;
  },
//
// Watch Battery
//cordova plugin add cordova-plugin-battery-status
  onBattery: function(proc, op){
    window.addEventListener("batterystatus", function(info){proc("status", info);}, false);
    window.addEventListener("batterycritical", function(info){proc("critical", info);}, false);
    window.addEventListener("batterylow", function(info){proc("low", info);}, false);
  },
//
//
  callPhone: function(op){
    op=op||{}; op.number=op.number||"117"; window.open("tel:"+op.number, "_system");
  },
//
// copy cordova-plugin-pmanager
  getApplist: function(op){
    op=op||{}; op.parm=op.parm||"";
    waitfor(){pm.list(function(obj){REC.app=obj; resume();}, op.parm);}
    return REC.app;
  },
//
  close: {}
};
