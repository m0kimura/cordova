//#######1#########2#########3#########4#########5#########6#########7#########8#########9#########0
module.exports={
  map: {}, pos: {}, seq: {}, center: {},
//
  open: function(op){
    var me=this; op=op||{};
    op.id=op.id||'map'; op.zoom=op.zoom||18;
    op.width=op.width||document.width; op.height=op.height||document.height;
//
    $('#'+op.id).css({widht: op.width, height: op.height}); me.id=op.id;
    var o={};
//zoom
    if(op.zoom<0){o.zoomControl=false; o.zoom=op.zoom*-1;}else{o.zoom=op.zoom;}
//center
    if(!op.lat){op=me.getGps(op);}
    o.center=new google.maps.LatLng(op.lat, op.lon);
//type
    switch(op.type){
      case "nouse": o.mapTypeControl=false; break;
      case "roadmap": o.mapTypeId=google.maps.MapTypeId.ROADMAP; break;
      case "satellite": o.mapTypeId=google.maps.MapTypeId.SATELLITE; break;
      case "hybrid": o.mapTypeId=google.maps.MapTypeId.HYBRID; break;
      case "terrain": o.mapTypeId=google.maps.MapTypeId.TERRAIN; break;
    }
    if(op.type=="satelite"){if(op.heading){o.heading=op.heading;} if(op.tilt){o.tilt=op.tilt;}}
//overView
    switch(op.overView){
      case "use": o.overviewMapControl=true; break;
      case "open": o.overviewMapControl=true; o.overviewMapControlOptions={opened: true}; break;
    }
//streetView 
    switch(op.streetView){
      case "nouse": o.streetViewControl=false; break;
      case "rt": o.streetViewControlOptions={position: google.maps.ControlPosition.RIGHT_TOP}; break;
      case "rb": o.streetViewControlOptions={position: google.maps.ControlPosition.RIGHT_BOTTOM}; break;
      case "lt": o.streetViewControlOptions={position: google.maps.ControlPosition.LEFT_TOP}; break;
      case "lb": o.streetViewControlOptions={position: google.maps.ControlPosition.LEFT_BOTTOM}; break;
    }
//pan
    if(op.pan){o.panControl=true;}
    switch(op.pan){
      case "rt": o.panControlOptions={position: google.maps.ControlPosition.RIGHT_TOP}; break;
      case "rb": o.panControlOptions={position: google.maps.ControlPosition.RIGHT_BOTTOM}; break;
      case "lt": o.panControlOptions={position: google.maps.ControlPosition.LEFT_TOP}; break;
      case "lb": o.panControlOptions={position: google.maps.ControlPosition.LEFT_BOTTOM}; break;
    }
//rotate
    if(op.rotate){o.rotateControl=true;}
    switch(op.rotate){
      case "rt": o.rotateControlOptions={position: google.maps.ControlPosition.RIGHT_TOP}; break;
      case "rb": o.rotateControlOptions={position: google.maps.ControlPosition.RIGHT_BOTTOM}; break;
      case "lt": o.rotateControlOptions={position: google.maps.ControlPosition.LEFT_TOP}; break;
      case "lb": o.rotateControlOptions={position: google.maps.ControlPosition.LEFT_BOTTOM}; break;
    }
//scale, dblclick, wheel, drag
    if(op.scale=="use"){o.scaleControl=true;}
    if(op.dblclick=="nouse"){o.disableDoubleClickZoom=true;}
    if(op.wheel=="nouse"){o.wheelControl=false;}
    if(op.drag=="nouse"){o.draggable=false;}
//
    var x=document.getElementById(op.id);
    me.map=new google.maps.Map(x, o);
    console.log('map option:', o);
    $('#'+op.id).css('display', 'block');
  },
// cordova plugin add cordova-plugin-geolocation
  getGps: function(op){
    var rc; op=op||{};
    waitfor(){navigator.geolocation.getCurrentPosition(
      function(pos){rc=pos.coords; resume();},
      function(err){rc=false; this.error=err.message; resume();}
    );}
    op.lat=rc.latitude; op.lon=rc.longitude;
    return op;
  },
//
  listen: function(){
    var me=this;
    $('.recstart').click(function(){record.on();});
    $('.recstop').click(function(){record.off();});
    $('a.geocoding').click(function(){
      var id=$(this).attr('href'); me.geocoding(a); return false;
    });
    $('a.getjson').click(function(){
      var url=$(this).attr('href'); var pm=$(this).attr('rel'); me.json(url, pm); return false;
    });    
    $('a.getjsonp').click(function(){
      var url=$(this).attr('href'); var pm=$(this).attr('rel'); me.json(url, pm); return false;
    });
  },
//
  setPosition: function(def){
    var me=this;
    for(var i in def){
      me.position(def[i].id, def[i].title, def[i].lat, def[i].lon, def[i].icon);
    }
  },
  position: function(id, title, lat, lon, icon){
    var me=this;
    if(id.substr(0,1)=='#'){if(me.seq[id]){me.seq[id]++;}else{me.seq[id]=1;} id+=me.seq[id];}
    me.pos[id]={}; me.pos[id]['title']=title; me.pos[id]['lat']=lat; me.pos[id]['lon']=lon; me.pos[id]['icon']=icon;
    me.pos[id]['pos']=new google.maps.LatLng(lon, lat);
  },
//
  marker: function(id){
    var me=this;
    if(id){var a=id.split(';');}
    else{var i=0; var a=[]; for(x in me.pos){if(x.substr(0,1)!='#'){a[i]=x; i++;}}}
    for(i in a){
     me.pos[a[i]].mark=new google.maps.Marker({position: me.pos[a[i]].pos, map: me.map,
       title: me.pos[a[i]].title, icon: me.pos[a[i]].icon});
    }
  },
//
  clickZoom: function(id, size){
    var me=this;
    if(id){var a=id.split(';');}else{var i=0; var a=[]; for(x in me.pos){if(x.substr(0,1)!='#'){a[i]=x; i++;}}}
    for(i in a){
     google.maps.event.addListener(me.pos[a[i]]['mark'], 'click', function(e){
       if(!size){size=15;} me.map.setZoom(size); me.map.setCenter(me.pos[a[i]]['pos']);
     });
    }
  },
//南西、北東を指定した地図上の矩形領域
  bounds: function(sw, ne){
    var me=this;
    me.bounds=new google.maps.LatLngBounds(me.pos[sw]['pos'], me.pos[ne]['pos']); return me.bounds;
  },
//
  line: function(id, color, opacity, weight){
    var me=this; var ps=[]; var i=0;
    if(id){var a=id.split(';');}else{i=0; var a=[]; for(x in me.pos){if(x.substr(0,1)!='#'){a[i]=x; i++;}}}
    for(i in a){ps[i]=me.pos[a[i]]['pos'];}
    if(!color){color="#FF0000";} if(!opacity){opacity=1.0;} if(!weight){weight=2;}
    me.line=new google.maps.Polyline({
      path: ps, strokeColor: color, strokeOpacity: opacity, strokeWeight: weight
    });
    me.line.setMap(me.map); return me.line;
  },
//
  polygon: function(id, color, opacity, weight, fillcolor, fillopacity){
    var me=this; var ps=[]; var i=0;
    if(id){var a=id.split(';');}else{i=0; var a=[]; for(x in me.pos){if(x.substr(0,1)!='#'){a[i]=x; i++;}}}
    for(i in a){ps[i]=me.pos[a[i]]['pos'];}
    if(!color){color="#FF0000";} if(!opacity){opacity=1.0;} if(!weight){weight=2;}
    if(!fillcolor){fillcolor='#FF0000';} if(!fillopacity){fillopacity=0.8;}
    me.polygon=new google.maps.Polygon({
      path: ps, strokeColor: color, strokeOpacity: opacity, strokeWeight: weight,
      fillColor: fillcolor, fillOpacity: fillopacity
    });
    me.polygon.setMap(me.map); return me.polygon;
  },
//
  overlay: function(fpath, tl, rb){
    var me=this;
    var bd=new google.maps.LatLngBounds(me.pos[tl]['pos'], me.pos[rb]['pos']);
    me.over=new google.maps.GroundOverlay(fpath, bd); me.over.setMap(me.map); return me.over;
  },
//
  info: function(id, content){
    var me=this;
    var w=new google.maps.InfoWindow({content: content});
    google.maps.event.addListener(me.pos[id].mark, 'click', function(){
      w.open(me.map, me.pos[id].mark);
    });
  },
//
  setInfo: function(def){
    var me=this;
    for(var i in def){if(def[i].content){me.info(def[i].id, def[i].content);}}
  },
//
  kml: function(url){
    var me=this;
    me.kmllayer=new google.maps.KmlLayer(url); me.kmllayer.setMap(me.map);
  },
//
  geocoding: function(field){
    var me=this; var geo=new google.maps.Geocoder();
    if(!field){field='address';}
    var adr=document.getElementById(field).value;
    if(geo){geo.geocode({'address': adr}, function(results, status){
     if(status==google.maps.GeocoderStatus.OK){
       var pos=results[0].geometry.location; me.map.setCenter(pos);
       var map=new google.maps.Marker({map: me.map, position: pos});
     }else{
       alert("住所の変換に失敗しました。("+status+')');
     }
    });}
 },
//
  record: function(op){
    var me=this;
    switch(op){
    case 'on':
      me.stack=[];
      me.recordobj=google.maps.event.addListener(me.map, 'click', function(e){
        var mrk=new google.maps.Marker({position: e.latLng, map: me.map, draggable: true});
        var lat=e.latLng.lat(); var lon=e.latLng.lng();
        me.map.setCenter(e.latLng); me.stack.push({lat: lat, lon: lon}); mrk.ix=me.stack.length;
        var obj1=google.maps.event.addListener(mrk, 'dblclick', function(e){
          mrk.setMap(null); me.stack[mrk.ix]=null;
        });
        var obj2=google.maps.event.addListener(mrk, 'dragstart', function(e){
          mrk.setPosition(e.latLng);
        });
        var obj3=google.maps.event.addListener(mrk, 'drag', function(e){
          mrk.setPosition(e.latLng);
        });
        var obj4=google.maps.event.addListener(mrk, 'dragend', function(e){
          mrk.setPosition(e.latLng);
          var lat=e.latLng.lat(); var lon=e.latLng.lng();
          me.map.setCenter(e.latLng); me.stack[mrk.ix]={lat: lat, lon: lon};
        });
      });
      break;
    case 'off':
      google.maps.event.removeListener(me.recordobj);
      break;
    case 'out':
      var out='';
      for(i in me.stack){if(me.stack[i]){
        out+='lat:'+me.stack[i].lat+' lon:'+me.stack[i].lon+'\n';
      }}
      alert(out);
    }
  },
//
  json: function(url, pm){
    var me=this;
    $.ajax({url: url, data: pm, dataType: "json",
      success : function(json){me.setPosition(json.rec); me.marker(''); me.setInfo(json.rec);},
      error : function(a, b, c){alert("ERROR: "+b);}
    });
  },
//
  jsonp: function(url, pm){
    var me=this;
    $.ajax({url: url, data: pm, dataType: "jsonp",
      success : function(json){json},
      error : function(){}
    });
  },
//
 test: function(){
    var me=this;
    google.maps.event.addListener(me.map, 'zoom_changed', function(){
     setTimeout(moveToDarwin, 3000);
    });
 },
//
 close: {}
};
