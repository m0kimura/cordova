module.exports={Senario: [],
// cordova plugin add https://github.com/texh/cordova-plugin-stepcounter.git
//
//
  isAvailable: function(){
    var rc;
    waitfor(){stepcounter.deviceCanCountSteps(
      function(){rc=true; resume();}, function(){rc=false; resume();}
    );}
    return rc;
  },
//
  start: function(op){
    var me=this, rc; op=op||{}; op.offset=op.offset||0;
console.log("start");
    waitfor(){stepcounter.start(op.offset,
      function(){rc=true; resume();}, function(){rc=false; resume();}
    );}
    return rc;
  },
//
  stop: function(op){
console.log("stop");
    var me=this, rc; op=op||{}; op.offset=op.offset||0;
    waitfor(){stepcounter.stop(
      function(){rc=true; resume();}, function(){rc=false; resume();}
    );}
    return rc;
  },
//
  now: function(){
    var rc;
    waitfor(){stepcounter.getStepCount(
      function(c){rc=c; resume();}, function(){rc=false; resume();}
    );}
    return rc;
  },
//
  today: function(){
    var rc;
    waitfor(){stepcounter.getTodayStepCount(
      function(c){rc=c; resume();}, function(){rc=false; resume();}
    );}
    return rc;
  },
//
  history: function(){
    var rc;
    waitfor(){stepcounter.getHistory(
      function(dt){rc=dt; resume();}, function(){rc=false; resume();}
    );}
    return rc;
  },
//
  close: {}
};
