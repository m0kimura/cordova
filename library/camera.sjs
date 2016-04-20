//#######1#########2#########3#########4#########5#########6#########7#########8#########9#########0
module.exports={Option: {}, Canvas: {}, iv: 30,
//
//
  canvas: function(op){
    var me=this; op=op||{};
    op.width=op.width||600; op.height=op.height||400; op.area=op.area||"photo";
    me.Canvas=document.getElementById(op.area); me.Canvas.setAttribute('width', op.width);
    me.Canvas.setAttribute('height', op.height);
    if (!me.Canvas||!me.Canvas.getContext){return false;}
  },
//
// setOption
  setOption: function(op){
    var me=this, rc; op=op||{};
    me.Option.quality=op.quality||50; me.Option.allowEdit=op.allowEdit||false;
    switch(op.store){
      case "direct": me.Option.destinationType=0; break;
      case "file": me.Option.destinationType=1; break;
      case "native": me.Option.destinationType=2; break;
      default:  me.Option.destinationType=1;
    }
    switch(op.source){
      case "camera": me.Option.sourceType=1; break;
      case "library": me.Option.sourceType=0; break;
      case "save": me.Option.sourceType=2; break;
      default: me.Option.sourceType=1;
    }
    switch(op.format){
      case "png": me.Option.encodingType=1; break;
      case "jpeg": me.Option.encodingType=0; break;
      default: me.Option.encodingType=0;
    }
    switch(op.device){
      case "camera": me.Option.mediaType=0; break;
      case "video": me.Option.mediType=1; break;
      case "all": me.Option.mediType=2; break;
      default: me.Option.encodingType=0;
    }
    me.AreaId=op.area||"photo";
  ),
// getPicture
  getPicture: function(){
    var me=this;
    if(!me.Option){me.setOption();}
    waitfor(){navigator.camera.getPicture(
      function(res){rc=true; var image=document.getElementById(me.AreaId); image.src=res; resume();},
      function(err){rc=false; me.error=err; resume();},
    me.Option);}
    return rc;
  },
// getFile
  getFile: function(op){
    var me=this; op=op||{}; op.x=op.x|0; op.y=op.y|0; if(!op.fn){return false;}
    var ctx=me.Canvas.getContext('2d');
    me.img=new Image(); me.img.src=fn; me.ra=0;
    me.img.onload=function(){ctx.drawImage(me.img, op.x, op.y);}
    return {ctx: ctx, img: me.img, x: op.x, y: op.y};
  },
//
  rotate: function(pht, n, ms, sw, ra){
    var me=this; op=op||{};
    if(sw=='go'){
      if(me.sw==1){return;}
      sw='cont'; me.sw=1; me.acc=0; me.cnt=Math.floor(Math.random()*n);
      ra=360/n;
      ms=ms+me.cnt*me.iv;
    }
    var px=pht.img.width/2+pht.x; var py=pht.img.height/2+pht.y;
    pht.ctx.clearRect(0, 0, pht.x, pht.y);
    pht.ctx.translate(px, py);
    pht.ctx.rotate(ra*Math.PI/180); pht.ctx.translate(px*-1, py*-1);
    pht.ctx.drawImage(pht.img, pht.x, pht.y); ms=ms-me.iv;
    me.cnt--; if(me.cnt<0){ra=ra*(ms/me.iv-1)/(ms/me.iv); if(ra<1){ra=1;}}
    if(me.sw==1 && ms>0){
      setTimeout(function(){me.rotate(pht, n, ms, 'cont', ra);}, me.iv);
      me.acc=me.acc+ra;
    }else{
      me.sw=0; var w=Math.floor(me.acc)%360; alert(Math.floor(w*n/360));
    }
  },
  off: function(){var me=this; me.sw=0;},
//
//
  close: {}
};
