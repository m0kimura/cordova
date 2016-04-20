module.exports={
  Low: "", High: "", Mark: "", Maker: "", Head: "", Foot: "", Frame: 0, Repaet: "", Host: {},
//
//
  exec: function(cmd, op, host){
    var me=this; op=op||{}; host=host||0;
    var rc, a, i, p, s="";
    if(cmd=="get"){
      rc=me.command("read", {id: op.id}, host);
      if(rc.cd==0){localStorage.setItem(op.id, JSON.stringify(rc.data));}
      return rc.data;
    }else{
      p=op.id.split("+");
      for(i in p){
        if(isNaN(p[i])){
          a=p[i].split("_");
          switch(a[0]){
           case "on": case "off": rc=me.command(a[0], {number: a[1]}, host); break;
           case "nop": s=me.command(a[0], {}, host); break;
           case "sony.": rc=me.command("sony.", {code: a[1]}, host); break;
           default: s=me.gen(a[0], a[1]); rc=me.command("write", {signal: s}, host);
          }
        }else{
          waitfor(){setTimeout(function(){resume();}, p[i]*100);}
        }
      }
      return s;
    }
  },
//
//
  download: function(cmd, op){
    var me=this; op=op||{}; op.server=op.server||INFOJ.server; op.url=op.url||"/table/";
    op.code=op.code||"menu"; op.to=op.to||op.code;

    var url, rc, dt;

    switch(cmd){
     case "keep":
      url=op.server+op.url+op.code;
      rc=$.ajax({async: false, type: "get", url: url}).responseText;
      if(rc){localStorage.setItem(op.to, rc);}
      break;
     case "every":
      url=op.server+op.url+op.code;
      rc=$.ajax({async: false, type: "get", url: url}).responseText;
      if(rc){
        dt=JSON.parse(rc);
        for(i in dt){localStorage.setItem(dt[i].key, dt[i].value);}
      }
      break;
    }
  },
//
//
  loadStation: function(){
    var me=this; var s, t, k;
    
    s=localStorage.getItem("station");
    if(!s){return false;}

    if(s.length>0){t=JSON.parse(s); for(k in t){me.Host[t[k].no]=t[k].ip;}; return true;}
    else{return false;}
  },
//
//
  loadRec: function(key){
    var me=this; var s, t, k;
    s=localStorage.getItem(key); if(!s){return false;}
    if(s.length>0){
      t=JSON.parse(s);
      for(k in t){
        if(!REC[t[k].recid]){REC[t[k].recid]=[];} REC[t[k].recid].push(t[k]);
      };
      return true;
    }else{
      return false;
    }
  },
//
//
  command: function(cmd, op, host){
    var me=this; op=op||{}; cmd=cmd||"nop"; op.id=op.id||"001"; host=host||0;
    var url, rc;
    url="http://"+me.Host[host]+"/"+cmd+"/";
    switch(cmd){
     case "nop": break;
     case "on": case "off": url+=op.number+ "/"; break;
     case "sony.": url+=op.code+ "/"; break;
     case "read": url+=op.id+"/"; break;
     case "write": url+=op.signal+"/"; break;
    }
    try{
      rc=$.ajax({async: false, type: "get", url: url}).responseText;
      return JSON.parse(rc);
    }catch(e){
      console.log("error:"+e);
      return {cd: 90, data: "error", source: rc};
    }
  },
//
//
  gen: function(type, data){
    var me=this; var i, d, l, x, y, p, frame="", r=0, s="";
    me.set(type);
    if(type=="sony"){
      if(data.length==3){me.Bit=12; me.Frame=500;}else{me.Bit=15; me.Frame=500;}
    }
    var edit=function(){
      frame=me.Mark; d=me.convert(me.Maker+data); d=d.substr(0, me.Bit); r=me.Frame-me.Tmark;
      for(i=0; i<d.length; i++){
        if(d.substr(i, 1)=="1"){frame+=me.High; r=r-me.Thigh;}else{frame+=me.Low; r=r-me.Tlow;}
      }
    };
    switch(type){
     case "sony":
      edit();
      frame+=","+r;
      return frame+","+frame+","+frame+","+frame+","+frame;
     case "bose":
      edit();
      frame+=","+r;
      return frame+","+frame+","+frame;
     case "oyama":
      edit();
      y="";
      for(i=frame.length-1; i> -1; i--){
        x=frame.substr(i, 1); if(x==","){l=i+1; break;} y=x+y;
      }
      y=y-0; r=104+y; frame=frame.substr(0, l)+r;
      return me.Head+frame+","+frame+","+frame;
     case "toshiba": case "buffalo":
      edit();
      frame+=me.Foot+","+r;
      return me.Head+frame+me.Repeat;
     default:
      s=localStorage.getItem(type+"_"+data);
      if(s.length>1){s=s.substr(1, s.length-2);}
      return s;
    }
  },
//
//
  set: function(type){
    var me=this; me.Maker=""; me.Foot="";
    switch(type){
     case "sony":
      me.Low=",6,5"; me.High=",6,11"; me.Mark="23"; me.Head=""; me.Frame=434;
      me.Tlow=11; me.Thigh=17; me.Tmark=23; me.Bit=15;
      break;
     case "nec":
      me.Low=",6,6"; me.High=",6,17"; me.Mark="90,45"; me.Head=""; me.Frame=1080;
      me.Repeat=",90,22"; me.Tlow=12; me.Thigh=23; me.Tmark=135; me.Bit=32;
      break;
     case "toshiba":
      me.Low=",6,6"; me.High=",6,17"; me.Mark="90,45"; me.Head=""; me.Frame=1080;
      me.Repeat=",90,22,5,194,90,22,5,194,90,22,5"; me.Foot=",6";
      me.Tlow=12; me.Thigh=23; me.Tmark=135; me.Bit=32; me.Maker="a23d";
      break;
     case "buffalo":
      me.Low=",6,6"; me.High=",6,17"; me.Mark="90,45"; me.Head=""; me.Frame=1080;
      me.Repeat=",90,22,5"; me.Foot=",6";
      me.Tlow=12; me.Thigh=23; me.Tmark=135; me.Bit=32; me.Maker="30ee";
      break;
     case "aeha":
      me.Low=",4,4"; me.High=",4,13"; me.Mark="34,17"; me.Head=""; me.Frame=1300;
      me.Repeat=",34,34"; me.Bit=32;
      break;
     case "oyama":
      me.Low=",5,4"; me.High=",15,4"; me.Head="";
      me.Mark="20,9,55,9,15,4,15,4,5,4,5,4,5,4,5,4,5,4,5,4,15,4"; me.Frame=690;
      me.Tlow=9; me.Thigh=19; me.Tmark=204; me.Bit=32;
      me.Repeat=""; me.Bit=32;
      break;
     case "bose":
      me.Low=",5,4"; me.High=",15,4"; me.Head=""; me.Mark="10,15,4"; me.Frame=502;
      me.Tlow=9; me.Thigh=19; me.Tmark=29; 
      me.Repeat=""; me.Bit=16;
      break;
    }
  },
//
//
  convert: function(x){
    var i, x, out="";
    for(i=0; i<x.length; i++){
      switch(x.substr(i,1)){
        case "0": out+="0000"; break; case "1": out+="0001"; break;
        case "2": out+="0010"; break; case "3": out+="0011"; break;
        case "4": out+="0100"; break; case "5": out+="0101"; break;
        case "6": out+="0110"; break; case "7": out+="0111"; break;
        case "8": out+="1000"; break; case "9": out+="1001"; break;
        case "a": out+="1010"; break; case "b": out+="1011"; break;
        case "c": out+="1100"; break; case "d": out+="1101"; break;
        case "e": out+="1110"; break; case "f": out+="1111"; break;
      }
    }
    return out;
  },
//
//
  pull: function(){
    var i, k, out={};
    for(i=0; i<localStorage.length; i++){k=localStorage.key(i); out[k]=localStorage.getItem(k);}
    return out;
  },
//
//
  push: function(data){
    var i; for(i in data){localStorage.setItem(i, data[i]);}
  },
//
//
  close: {}
};
