var Ks={
// cordova plugin add cordova-plugin-file
  server: 'http://pnq.kmrweb.net',
//
  open: function(){document.addEventListener('deviceready', PENQf.fready1, PENQf.fail);},
  fready1: function(){
    var me=Ks;
    me.error={}; me.response={};
    document.addEventListener('pause', me.gosleep, false);
    document.addEventListener('resume', me.aweak, false);
    document.addEventListener('online', me.online, false);
    document.addEventListener('offline', me.offline, false);
    Ks.error.pos='fready1';
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, Ks.fready2, Ks.fail);
  },
  fready2: function(fsys){Ks.Fsys=fsys;},
  gosleep: function(){}, aweak: function(){}, online: function(){}, offline: function(){},
  
//
  get: function(fname){
    var me=this;
    waitfor(){
      me.Fsys.root.getFile(fname, null, function(f){me.fentry=f; resume();}, me.failf);
    }
    waitfor(){
      me.fentry.file(function(f){me.file=f; resume();}, me.failf);
    }
    me.reader=new FileReader();
    waitfor(){
      me.reader.onloadend=function(evt){me.rec=evt.target.result; resume();};
      me.reader.readAsText(Ks.file);
    }
    return me.rec;
  },
//
  put: function(fname, rec){
    var me=this;
    waitfor(){me.Fsys.root.getFile(fname, {create: true, exclusive: false},
      function(f){me.fentry=f; resume();},
      function(error){alert(error.code); return false;}
    );}
    waitfor(){me.fentry.file(function(f){me.file=f; resume();}, me.failf);}
    var rc;
    waitfor(){
      me.fentry.createWriter(
        function(writer){
          writer.onwrite=function(evt){rc=true; resume();};
          writer.write(rec);
        },
        function(error){alert(error.code); rc=false; resume();}
      );
    }
    return rc;
  },
//
  remove: function(fname){
    var me=this;
    waitfor(){me.Fsys.root.getFile(fname, null, function(f){me.fentry=f; resume();}, me.failf);}
    waitfor(){me.fentry.remove(function(){resume();}, me.failf);}
    return true;
  },
//
  dir: function(dname){
    var me=this;
    waitfor(){me.Fsys.root.getDirectory(dname, null, function(f){me.fentry=f; resume();}, me.failf);}
    me.reader=me.fentry.createReader();
    var rt=[];
    waitfor(){me.reader.readEntries(
      function(entries){
        var i;
        for(i=0; i < entries.length; i++){
          rt[i]={}; rt[i].name=entries[i].name;
          if(entries[i].isFile){rt[i].type='file';}else{rt[i].type='dir';}
          rt[i].fullPath=entries[i].fullPath;
          rt[i].object=entries[i];
        }
        resume();
      },
      me.fail
    );}
    return rt;
  },
//
  upload: function(path, opt){
    var me=this;
    if(!opt){opt=[];} opt.uploader=opt.uploader||'/cms/uploader.php'; opt.server=opt.server||me.server;
    var options=new FileUploadOptions();
    options.fileKey="file";
    options.fileName=path.substr(path.lastIndexOf('/')+1);
    options.mimeType="text/plain";
    var params = new Object();
    params.value1="test";
    params.value2="param";
    options.params=params;
    var ft=new FileTransfer();
    var rc={};
    waitfor(){ft.upload(path, encodeURI(opt.server+opt.uploader),
      function(r){
        var rt=JSON.parse(r.response.substr(r.response.indexOf('{')));
        if(rt.success){
          rc.file=rt.file; rc.message=rt.message; rc.bytes=r.bytesSent;
        }else{
          rc=false; me.error=rt;
        }
        resume();
      },
      function(error){
        alert("アップロードできませんでした。/" + error.code);
        me.error.code=error.code; me.error.source=error.source; me.error.target=error.target;
        rc=false; resume();
      },
    options);}
    return rc;
  },
//
  download: function(file, opt){
    var me=this;
    if(!opt){opt={};} opt.server=opt.server||me.server;
    var ft=new FileTransfer(); var rc;
    url=encodeURI(opt.server+opt.folder+file);
    waitfor(){
      ft.download(url, opt.path+file,
        function(entry){
          me.response.message="ダウンロードが完了しました。";
          me.response.file=entry.fullPath;
          rc=true; resume();
        },
        function(error) {
          me.error.source=error.source; Ks.error.target=error.target;
          me.error.code=error.code;
          me.error.message='ダウンロードに失敗しました。';
          rc=false; resume();
        }
      );
    }
    return rc;
  },
//
  fail: function(evt){
    alert('処理できませんでした。/'+evt.target.error.code);
    Ks.error.code=evt.target.error.code;
    return false;
  },
  failf: function(error){
    switch(error.code){
      case 1: var msg='ファイルがみつかりません。/'+error.code; break;
      case 2: var msg='ファイルが保護されています。/'+error.code; break;
      case 5: var msg='読めないファイルです。/'+error.code; break;
      case 6: var msg='書き込みが禁止されています。/'+error.code; break;
      default: var msg='処理できませんでした。/'+error.code; break;
    }
    Ks.error.code=error.code; Ks.error.message=msg;
    alert(msg); return false;
  },
  lg: function(x){console.log(x);},
  call: function(){
    var rc=Ks.get('/mnt/sdcard/readme.txt');
    alert(rc);
    console.log(Ks.error.code+'/'+Ks.error.source+'/'+Ks.error.target);
  },
//
  dbase: function(dbname, opt){
    if(!opt){opt={};} opt.version=opt.version||'1.0'; opt.name=opt.name||dbname; opt.size=opt.size||1000000;
    Ks.db=window.openDatabase(dbname, opt.version, opt.name, opt.size);
    return Ks.db;
  },
//
  sql: function(sql){
    waitfor(){
      var rc=0;
      Ks.db.transaction(
        function(tx){
          tx.executeSql(sql, [], function(tx, rs){
            if(rs){if(rs.rows){
              Ks.rec=[];
              for(var i=0; i<rs.rows.length; i++){
                var x=rs.rows.item(i); Ks.rec[i]=[];
                for(var j in x){Ks.rec[i][j]=x[j];}
              }
              rc=rs.rows.length;
            }}
            resume();
          }, function(err){alert(err.message); rc=false; resume();});
        },
        function(err){alert(err.message); rc=false; resume();}
      )
    }
    return rc;
  },
//
  read: function(tbl, keys, items){
    var a=' '; Ks.tbl=tbl; Ks.keys=[]; var item=[]; var i, j, k; var ln='';
    for(k in keys)
      {ln+=" "+a+" "+k+" = '"+keys[k]+"'"; a='and'; Ks.keys[k]=keys[k];}
    if(items){item=items.split(',');}else{item[0]='*';}
    var y=''; var c=''; for(i in item){y+=c+" "+item[i]; c=',';}
    Ks.rec=[]; i=0; var sql="select "+y+" from "+tbl+" where "+ln+";"; Ks.save=sql;
    return Ks.sql(sql);
  },
//
  rewrite: function(){
    var dt=Ks.rec[0]; var sql="update "+Ks.tbl+" set "; var c=''; var k;
    for(k in dt){sql+=c+" "+k+" = '"+dt[k]+"'"; c=',';} var a='';
    var ln=''; for(k in Ks.keys){ln+=" "+a+" "+k+" = '"+Ks.keys[k]+"'"; a='and';}
    sql+=" where "+ln+";"; Ks.save=sql;
    alert(sql);
    return Ks.sql(sql);
  },
//
  insert: function(){
    var dt=Ks.rec[0]; var sql="insert into "+Ks.tbl+" ("; var c='';
    for(k in dt){sql+=c+" "+k+" "; c=',';}
    sql+=") values ("; c='';
    for(k in dt){sql+=c+" '"+dt[k]+"' "; c=',';}
    sql+=") ;"; Ks.save=sql;
    return Ks.sql(sql);
  },
//
  dberror: function(err){
    alert('db error '+err['message']); resume();
  },
//
  wait: function(ms){
    waitfor(){setTimeout(function(){resume();}, ms);}
  },
//
  close: function(){}
};
module.exports=Ks;
