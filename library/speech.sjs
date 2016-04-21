module.exports={Syn: {}, Msg: {},
//
// begin : 初期処理
//
  begin: function(op){
    var me=this;
    op=op||{}; op.lang=op.lang||"ja-JP"; op.pitch=op.pitch||2; op.rate=op.rate||1; op.txt=op.txt||'';
    me.Syn=new SpeechSynthesisUtterance();
    me.Syn.lang=op.lang; me.Syn.pitch=op.pitch; me.Syn.rate=op.rate; me.Syn.text=op.txt;
    me.Msg=op.message||{};
  },
//
  talk: function(txt){
    var me=this;
    var argv=me.edit.arguments; txt=me.edit(txt, me.talk.arguments);
    if(me.Scenario.length==0){me.Senario.push(txt); me.speak();}else{me.Senario.push(txt);}
  },
//
  talkFix: function(key){
    var me=this;
    var argv=me.edit.arguments; var txt=me.edit(me.Msg[key], me.talk.arguments);
    if(me.Scenario.length==0){me.Senario.push(txt); me.speak();}else{me.Senario.push(txt);}
  },
//
  talkHash: function(){
    var syn=this.voice({txt: location.hash.substr(1)}); speechSynthesis.speak(syn);
  },
//
  speak: function(){
    while(me.Scenario.length>0){
      me.Syn.txt=me.Scenario[0]; speechSynthesis.speak(me.Syn); me.Scenario.shift();
    }
  },
//
  edit: function(txt, argv){
    var me=this; txt=txt||''; argv=argv||{};
    var out='', i, j;
    for(i=0; i<txt.length; i++){
      if(txt[i]=='$'){i++; j=txt[i]-0; out+=argv[j];}else{out+=txt[i];}
    }
    if(Screen){return Screen.parm(out, '');}else{return out;}
  }
}
