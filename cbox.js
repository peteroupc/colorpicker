/* This file is in the public domain. Peter O., 2012. http://upokecenter.dreamhosters.com 
    Public domain dedication: http://creativecommons.org/publicdomain/zero/1.0/  */

(function(window,rootobj){

 var ColorSpace=subclass(Object,{
  initialize:function(info,usealpha){
  this.usealpha=usealpha;
  this.info=info;
  var faster=(navigator.userAgent.indexOf("Gecko/")>=0);
  faster=true;
  this.maxWidth=(faster ? 36 : 60)
  this.maxHeight=(faster ? 36 : 60)
  this.areas=[]
  this.emptyArea=[0,0,0,0]
  this.swatchWidth=Math.floor(this.maxWidth*1/3)
  this.matrixWidth=Math.floor(this.maxWidth*(this.usealpha ? 80 : 85)/100)
  this.matrixHeight=Math.floor(this.maxHeight*80/100)
  this.setupdimensions()
  this.areacache=[]
 },
fromrgbcolor:function(c){
 var ret=(typeof this.info.fromrgbcolor!="undefined" && this.info.fromrgbcolor) ? 
   this.info.fromrgbcolor(c) : [0,0,0]
 if(ret==c){ ret=[c[0],c[1],c[2]] }
 ret[3]=(c[3]==null) ? 255 : c[3]
 return ret
},
torgbcolor:function(c){
 var ret=this.info.torgbcolor(c)
 if(ret==c){ ret=[c[0],c[1],c[2]] }
 ret[3]=(c[3]==null) ? 255 : c[3]
 return ret
},
dimensions:function(){
  return [this.maxWidth,this.maxHeight]
},
areadimensions:function(area){
 var a=this.areas[area]
 if(!a)return this.emptyArea
 return a
},
setupdimensions:function(){
 if(!(typeof this.info.fromrgbcolor!="undefined" && this.info.fromrgbcolor)){
 if(!this.usealpha)this.areas[1]=[0,0,this.maxWidth,this.matrixHeight]
 else this.areas[1]=[0,0,this.matrixWidth+
                Math.floor((this.maxWidth-this.matrixWidth)/2),this.matrixHeight]
 // side bar
 this.areas[2]=[0,0,0,0]
 // alpha bar
  if(this.usealpha)this.areas[6]=[this.matrixWidth+
                Math.floor((this.maxWidth-this.matrixWidth)/2),0,
                Math.floor((this.maxWidth-this.matrixWidth)/2),
               this.matrixHeight]
 } else {
 // color matrix
 this.areas[1]=[0,0,this.matrixWidth,this.matrixHeight]
 // side bar
 if(this.usealpha)this.areas[2]=[this.matrixWidth,0,
               Math.floor((this.maxWidth-this.matrixWidth)/2),
               this.matrixHeight]
 else this.areas[2]=[this.matrixWidth,0,
                this.maxWidth-this.matrixWidth,
               this.matrixHeight]
 // alpha bar
  if(this.usealpha)this.areas[6]=[this.matrixWidth+
                Math.floor((this.maxWidth-this.matrixWidth)/2),0,
                Math.floor((this.maxWidth-this.matrixWidth)/2),
               this.matrixHeight]
  }
 // swatch
 this.areas[3]=[0,this.matrixHeight,this.swatchWidth,
               this.maxHeight-this.matrixHeight] 
 // color value
 this.areas[4]=[this.swatchWidth,
               this.matrixHeight,
               this.maxWidth-this.swatchWidth,
               Math.floor((this.maxHeight-this.matrixHeight)/2)] 
 // reset link
 this.areas[5]=[this.swatchWidth,
               this.matrixHeight+Math.floor((this.maxHeight-this.matrixHeight)/2),
               this.maxWidth-this.swatchWidth,
               Math.floor((this.maxHeight-this.matrixHeight)/2)] 
},
confinetoarea:function(area,xy){
 var nxy=[xy[0],xy[1]]
 var dims=this.areadimensions(area)
 if(nxy[0]<dims[0])nxy[0]=dims[0]
 if(nxy[0]>dims[0]+dims[2]-1)nxy[0]=dims[0]+dims[2]-1
 if(nxy[1]<dims[1])nxy[1]=dims[1]
 if(nxy[1]>dims[1]+dims[3]-1)nxy[1]=dims[1]+dims[3]-1
 return nxy
},
getarea:function(x,y){
 var unrounded=(Math.round(x)==x && Math.round(y)==y)
 if(unrounded){
  var ret=this.areacache[y*this.maxWidth+x]
  if(ret!=null)return ret
 }
 for(var i=1;i<this.areas.length;i++){
  if(!this.areas[i])continue
  var dims=this.areas[i];
  if(x>=dims[0] && x<dims[0]+dims[2] &&
      y>=dims[1] && y<dims[1]+dims[3]){
   if(unrounded)this.areacache[y*this.maxWidth+x]=i;
   return i  
  }
 }
 if(unrounded)this.areacache[y*this.maxWidth+x]=this.areas.length;
 return this.areas.length;
},
rgbatorgb:function(rgba,shade){
 if(rgba[3]<255){
  var bgalpha=255-rgba[3]
  return [
   ((rgba[0]*rgba[3])+(shade*bgalpha))/255,
   ((rgba[1]*rgba[3])+(shade*bgalpha))/255,
   ((rgba[2]*rgba[3])+(shade*bgalpha))/255
  ]
 }
 return rgba
},
getcolor:function(x,y,current){ // for display only
 var area=this.getarea(x,y)
 if(area==1){
    var rgba=this.torgbcolor(this.changecolor(x,y,current))
    rgba[3]=(current[3]==null) ? 255 : current[3]; return rgba
 } else if(area==2){
    var c=this.changecolor(x,y,current);
    var rgba=this.info.torgbcolor(c)
    if(rgba==c){ rgba=[c[0],c[1],c[2],0] }
    rgba[3]=(current[3]==null) ? 255 : current[3]; return rgba
 } else if(area==6){
    var rgba=this.torgbcolor(this.changecolor(x,y,current))     
    if(rgba[3]==255)return rgba
    var dims=this.areadimensions(area)
    var xx=Math.floor((x-dims[0])*2/dims[2])
    var yy=Math.floor((y-dims[1])*2/dims[3])
    return this.rgbatorgb(rgba,xx==yy ? 160 : 220)
 } else if(area==3){ // swatch
    var rgba=this.torgbcolor(current) 
    if(rgba[3]==255)return rgba
    var dims=this.areadimensions(area)
    var xx=Math.floor((x-dims[0])*4/dims[2])
    if(xx<2)
      return [rgba[0],rgba[1],rgba[2],255] // plain color
    else
      xx-=2; // alpha color
    var yy=Math.floor((y-dims[1])*2/dims[3])
    return this.rgbatorgb(rgba,xx==yy ? 160 : 220)
 } else {
    return [255,255,255,255]
 }
},
colortopos:function(current){
 var ret=[]
 var dims=this.areadimensions(1)
 var dimsside=this.areadimensions(2)
 var dimsalpha=this.areadimensions(6)
 for(var i=0;i<this.info.maxes.length;i++){
  var v=current[this.info.indexes[i]]
  if(this.info.reversed[this.info.indexes[i]])v=this.info.maxes[this.info.indexes[i]]-v
  v/=this.info.maxes[this.info.indexes[i]]
  if(i==0)v=dims[0]+v*(dims[2]-1) // matrix X
  if(i==1)v=dims[1]+v*(dims[3]-1) // matrix Y
  if(i==2)v=dimsside[1]+v*(dimsside[3]-1) // side Y
  ret[i]=v
 }
 ret[3]=dimsalpha[1]+(255-current[3])*(dimsalpha[3]-1)/255.0 // alpha side Y
 return ret
},
changecolor:function(x,y,current){
 var ret=[current[0],current[1],current[2],(current[3]==null) ? 255 : current[3]]
 var info=this.info
 var ci0=info.indexes[0]
 var ci1=info.indexes[1]
 var ci2=info.indexes[2]
 var area=this.areas[1] // matrix
 if(x>=area[0] && x<(area[0]+area[2]) &&
    y>=area[1] && y<(area[1]+area[3])){
   var h=((x-area[0])*info.maxes[ci0])/(area[2]-1);
   var s=((y-area[1])*info.maxes[ci1])/(area[3]-1);
   if(info.reversed[ci0])h=info.maxes[ci0]-h
   if(info.reversed[ci1])s=info.maxes[ci1]-s
   ret[ci0]=h
   ret[ci1]=s
   return ret
 }
 area=this.areas[2] // side
 if(x>=area[0] && x<(area[0]+area[2]) &&
    y>=area[1] && y<(area[1]+area[3])){
   var lum=((y-area[1])*info.maxes[ci2]/(area[3]-1))
   if(info.reversed[ci2])lum=info.maxes[ci2]-lum
   ret[ci2]=lum
   return ret
 }
 area=this.areadimensions(6) // alpha side
 if(x>=area[0] && x<(area[0]+area[2]) &&
    y>=area[1] && y<(area[1]+area[3])){
   var lum=((y-area[1])*255.0/(area[3]-1))
   ret[3]=255-lum
   return ret
  }
  return ret
}
})

////////////////

  var _namedColorsDatalist=null;
namedColorsDatalist=function(){
   if(_namedColorsDatalist!=null)return _namedColorsDatalist
 colorToRgba.setUpNamedColors();var b=[]
 var datalist=document.createElement("datalist")
 for(var o in colorToRgba.namedColors){
  var v=colorToRgba.namedColors[o]
  if(typeof v=="string"){
   var op=document.createElement("option")
   op.value=o; datalist.appendChild(op);
   if(o.indexOf("gray")>=0){
     var o2=o.replace("gray","grey")
     var op=document.createElement("option")
     op.value=o2; datalist.appendChild(op);
   }
  }
  }
   var datalistid=""; var dlid=0;
   do{
        datalistid="datalist-colorpicker"+dlid; dlid+=1;
   }while(document.getElementById(datalistid));
   datalist.id=datalistid
      document.body.appendChild(datalist)
    _namedColorsDatalist=datalistid
    return _namedColorsDatalist
}

  var _namedColorsDatalist2=null;
  var namedColorsDatalist2=function(){
   if(_namedColorsDatalist2!=null)return _namedColorsDatalist2
   colorToRgba.setUpNamedColors();var colors=[]
   for(var o in colorToRgba.namedColors){
    var v=colorToRgba.namedColors[o]
    if(typeof v=="string" && o.indexOf("grey")<0){
     var exists=false;
     var c=PDColorPicker.HueLumSat.fromrgbcolor(colorToRgb(v))
     for(var i=0;i<colors.length;i++){
      var d=colors[i];if(d[0]==c[0]&&d[1]==c[1]&&
          d[2]==c[2]){ exists=true;break;}
     }
     if(!exists){colors.push(c) }
    }
   }
   for(var r=0;r<=255;r+=85){
   for(var g=0;g<=255;g+=85){
   for(var b=0;b<=255;b+=85){
     var c=PDColorPicker.HueLumSat.fromrgbcolor([r,g,b])
     for(var i=0;i<colors.length;i++){
      var d=colors[i];if(d[0]==c[0]&&d[1]==c[1]&&
          d[2]==c[2]){ exists=true;break;}
     }
     if(!exists){colors.push(c) }
   }}}
   colors.sort(function(a,b){
     var vividA=Math.floor(((a[2]*(127.5-Math.abs(a[1]-127.5))/127.5)))
     var vividB=Math.floor(((b[2]*(127.5-Math.abs(b[1]-127.5))/127.5)))
     if(vividA==0 && vividB==0)return a[1]-b[1]
     vividA=Math.ceil(vividA/16)
     vividB=Math.ceil(vividB/16)
     return ((vividA==vividB) ? a[0]-b[0] : vividB-vividA)
   })
   var datalist=document.createElement("datalist")
   for(var i=0;i<colors.length;i++){
    var o=document.createElement("option")
    o.value=rgbToColorHtml(PDColorPicker.HueLumSat.torgbcolor(colors[i]))
    datalist.appendChild(o)
   }
   var datalistid=""; var dlid=0;
   do{
        datalistid="datalist-colorpicker"+dlid; dlid+=1;
   }while(document.getElementById(datalistid));
   datalist.id=datalistid
   document.body.appendChild(datalist)
    _namedColorsDatalist2=datalistid
    return _namedColorsDatalist2
  }

var useNativeColorPicker=function(thisInput,usealpha){
     if(!usealpha && supportsColorInput() && (thisInput.type=="text" || thisInput.type=="color")){
      var currentValue=thisInput.value
      var datalistid=("list" in thisInput) ? namedColorsDatalist2() : ""
      var oldtitle=thisInput.getAttribute("title")
      var oldlist=thisInput.getAttribute("list") // list applies to "color" inputs differently from "text" inputs
      thisInput.type="color"
      thisInput.title=""
      thisInput.setAttribute("list",datalistid)
      thisInput.value=rgbToColorHtml(colorToRgb(currentValue))
      // needed because Chrome will align color box to
      // baseline and not to the middle like other input
      // elements
      thisInput.style.verticalAlign="middle"
      var infolink=document.createElement("a")
      infolink.href="javascript:void(null)"
      infolink.innerHTML=thisInput.value
      if(thisInput.nextSibling)thisInput.parentNode.insertBefore(infolink,thisInput.nextSibling)
      else thisInput.parentNode.appendChild(infolink)
      var thisInputBlur=function(){
         if(thisInput.type=="text"){
           infolink.style.display="inline"
           var currentValue=thisInput.value
           thisInput.type="color"
           thisInput.setAttribute("list",datalistid)
           thisInput.title=""
           thisInput.value=rgbToColorHtml(colorToRgb(currentValue))
           removeListener(thisInput,"blur",thisInputBlur)
         }
      }
      addListener(infolink,(window.opera ? "mouseup" : "click"),function(){
         var currentValue=thisInput.value
         infolink.style.display="none"
         thisInput.type="text"
         thisInput.title=oldtitle
         thisInput.setAttribute("list",oldlist)
         // needed because Opera won't save value when changing to text
         thisInput.value=rgbToColorDisplay(colorToRgb(currentValue)) 
         thisInput.focus()
         setTimeout(function(){ 
           addListener(thisInput,"blur",thisInputBlur)
         },200)
      })
      var oldvalue=thisInput.value
      setInterval(function(){
         if(oldvalue!=thisInput.value){
           infolink.innerHTML=thisInput.value; oldvalue=thisInput.value
         }
      },100)
     }  
}

  var _supportsPattern=null;
  var supportsPattern=function(){
    if(_supportsPattern!==null)return _supportsPattern;
    var inp=document.createElement("input")
    inp.style.display="none"
    if(!("pattern" in inp) || typeof inp.validity=="undefined"){
     _supportsPattern=false; return _supportsPattern
    }
    if(navigator.vendor=="Apple Computer, Inc."){
     // Safari doesn't validate forms even though it includes a validation API
     _supportsPattern=false; return _supportsPattern
    }
    _supportsPattern=true; return _supportsPattern
  }
  var validatePattern=function(e){
   e=eventDetails(e)
   for(var i=0;i<e.target.elements.length;i++){
    var inp=e.target.elements[i]
    var a=inp.getAttribute("pattern")
    if(!a || a.length==0)continue
    var inval=false;
    if(inp.getAttribute("required")!==null && inp.value.length==0){
            alert("Please fill in the field: "+inp.title);inval=true;  
    } else if(inp.value.length>0 && !(new RegExp("^(?:"+a+")$").test(inp.value))){
            alert("Please match the requested format: "+inp.title);inval=true;  
    }
    if(inval){
            inp.focus()
            e=eventDetails(e);
            e.preventDefault()
            return false
    }
   }
   return false
  }
  
var namedPattern=null
var setPatternAndTitle=function(thisInput,usealpha){
     if(thisInput.tagName.toLowerCase()=="input" && thisInput.type=="text"){
      var numberOrPercent="\\s*-?(\\d+|\\d+(\\.\\d+)?%)\\s*"
      var number="\\s*-?\\d+(\\.\\d+)?\\s*"
      var percent="\\s*-?\\d+(\\.\\d+)?%\\s*"
      var datalistid=("list" in thisInput) ? namedColorsDatalist() : ""
      thisInput.setAttribute("list",datalistid)
      if(!namedPattern)namedPattern=colorToRgba.namedColorsPattern();
      var pattern=namedPattern
      // Use a faster pattern for Opera because Opera seems to verify the
      // pattern for every suggestion
      if(window.opera)pattern="[Yy][Ee][Ll][Ll][Oo][Ww](?:[Gg][Rr][Ee][Ee][Nn])?|[A-Wa-w][A-Za-z]{1,19}"
      pattern+="|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6}"+
          "|rgb\\("+numberOrPercent+","+numberOrPercent+","+numberOrPercent+"\\)"+
          "|hsl\\("+number+","+percent+","+percent+"\\)"
      if(usealpha){
          pattern+="|rgba\\("+numberOrPercent+","+numberOrPercent+","+numberOrPercent+","+number+"\\)"+
                      "|hsla\\("+number+","+percent+","+percent+","+number+"\\)"
      }
      var n=window.navigator;
      var lang=(("userLanguage" in n) ? n.userLanguage : (("language" in n) ? n.language : ""));
      if((lang=="en" || lang.indexOf("en-")==0)){
       if(usealpha){
         thisInput.setAttribute("title","Enter an RGB/RGBA color, color name, or HSL/HSLA color "+
            "[ ex.: #FF8020 or rgb(200,0,0) or rgba(200,0,0,0.5) or royalblue or hsl(200,100%,50%) or hsla(200,100%,50%,0.5) ].")
       } else {
         thisInput.setAttribute("title","Enter an RGB color, color name, or HSL color [ "+
            "ex.: #FF8020 or rgb(200,0,0) or royalblue or hsl(200,100%,50%) ].")
       }
      }
      thisInput.setAttribute("pattern","("+pattern+")")
      if(!supportsPattern()){
       // Fallback for browsers without "pattern" support
       if(thisInput.form){
        removeListener(thisInput.form,"submit",validatePattern)
        addListener(thisInput.form,"submit",validatePattern)
       }
      }
     }  
}

////////////////
var mycolorpicker=subclass(Object,{
initialize:function(info,parent,startingvalue,usealpha){
  var w=window
  this.binder=new MethodBinder(this)
  this.isoriginal=(info==PDColorPicker.HueSatVal);
  if(ieversionorbelow(6))this.isoriginal=false;
  else if(!(navigator.userAgent.indexOf("MSIE ")>=0 ||
   navigator.userAgent.indexOf("like Mac OS X")>=0 ||
   navigator.userAgent.indexOf("Opera/")>=0 ||
   navigator.userAgent.indexOf("AppleWebKit/")>=0 ||
   navigator.userAgent.indexOf("Gecko/")>=0))this.isoriginal=false;
  this.faster=(navigator.userAgent.indexOf("Gecko/")>=0);
  this.faster=true;
  this.pixelHeight=(this.faster ? 5 : 3)
  this.pixelWidth=(this.faster ? 5 : 3)
  this.p=parent
  this.origvalue=[startingvalue[0],
     startingvalue[1],
     startingvalue[2],
     (startingvalue[3]==null || !usealpha) ? 255 : startingvalue[3]] 
  this.info=info
  this.usealpha=usealpha
  this.colorspace=new ColorSpace(info,usealpha)
  this.overalldims=this.colorspace.dimensions()
  this.current=this.colorspace.fromrgbcolor(this.origvalue)
   var changed=false;
   var pagex=0;
   var pagey=0;
  this.origPageX=getPageX(this.p)
  this.origPageY=getPageY(this.p)
  this.divs=[];
  this.divstyles=[];
  this.areacache=[]
  this.handleclick=false;
  var pxheight=this.pixelHeight+"px";
  var pxwidth=this.pixelWidth+"px";
  this.p=parent;
  this.padding=4
  this.pwidth=(this.padding*2)+(this.overalldims[0]*this.pixelWidth)
  this.pheight=(this.padding*2)+(this.overalldims[1]*this.pixelHeight)
  this.bgcolors=[]
  if(this.p.style.position=="absolute")setPageX(this.p,this.adjustLeft(this.p,this.origPageX))
  this.startx=(this.p.style.position=="absolute") ? 0 : getPageX(this.p)
  this.starty=(this.p.style.position=="absolute") ? 0 : getPageY(this.p)
  this.endx=this.startx+this.pwidth
  this.endy=this.starty+this.pheight
  this.p.style.border="1px solid black"
  this.p.style.zIndex=100
  try { this.p.style.borderRadius=this.padding+"px" }catch(e){}
  this.p.style.backgroundColor="white"
  this.p.style.width=this.pwidth+"px"
  this.p.style.height=this.pheight+"px"
  var tbl=null
    var tbl=document.createElement("div")
    tbl.style.margin=this.padding+"px"
    tbl.style.padding="0px"
    tbl.style.color="transparent"
    tbl.style.fontSize="1px"
    var ihtml="<table cellspacing='0' cellpadding='0' style='border:none;'>"
    var areadims=this.colorspace.areadimensions(1)
    var area1pure=[areadims[0]+areadims[2]-1,areadims[1]]
    for(var y=0;y<this.overalldims[1];y++){
    ihtml+="<tr>"
    for(var x=0;x<this.overalldims[0];x++){
     ihtml+="<td width="+this.pixelWidth+" height="+this.pixelHeight+" style='"
     var area=this.colorspace.getarea(x,y)
     if(area==1 || area==2 || area==6)ihtml+="cursor:crosshair;" 
     ihtml+="padding:0;font-size:1px;border:0"+
        ((this.isoriginal && (area==1||(!this.usealpha && area==3))) ? "" : (";background-color:"+rgbToColorHtml(this.colorspace.getcolor(x,y,this.current))))
     ihtml+="'></td>"
    }
    ihtml+="</tr>"
    }
    ihtml+="</table>"
    this.p.appendChild(tbl)
    // for performance reasons, get pageX and pageY before setting the HTML
    this.pagex=getPageX(tbl) 
    this.pagey=getPageY(tbl)
    tbl.innerHTML=ihtml
    tbl=tbl.getElementsByTagName("table")[0]
    var i=0;
    for(var y=0;y<this.overalldims[1];y++){
    for(var x=0;x<this.overalldims[0];x++){
     this.divs[i]=tbl.rows[y].cells[x]; 
     this.divstyles[i]=this.divs[i].style
     i+=1
    }}
    this.tbl=tbl
   this.hexvalue=document.createElement("div")
   this.hexvalue.style.position="absolute"
   this.hexvalue.style.color="black"
   this.hexvalue.style.whiteSpace="nowrap"
   this.colorbg=document.createElement("div")
   this.swatchbg=document.createElement("div")
   this.overlay=document.createElement("div")
   if(this.isoriginal){
    this.swatchbg.style.position="absolute"
    this.swatchbg.style.cursor="crosshair"
    this.swatchbg.style.whiteSpace="nowrap"
    areadims=this.colorspace.areadimensions(3)
    this.swatchbg.style.width=(this.pixelWidth*areadims[2])+"px"
    this.swatchbg.style.height=(this.pixelHeight*areadims[3])+"px"
    if(this.usealpha)this.swatchbg.style.display="none"
    this.swatchbg.style.backgroundColor=rgbToColorHtml(this.origvalue);
    this.colorbg.style.position="absolute"
    this.colorbg.style.cursor="crosshair"
    this.colorbg.style.whiteSpace="nowrap"
    areadims=this.colorspace.areadimensions(1)
    this.colorbg.style.width=(this.pixelWidth*areadims[2])+"px"
    this.colorbg.style.height=(this.pixelHeight*areadims[3])+"px"
    this.colorbg.style.backgroundColor=rgbToColorHtml(this.colorspace.getcolor(area1pure[0],area1pure[1],this.current));
    this.overlay.style.position="absolute"
    this.overlay.style.cursor="crosshair"
    this.overlay.style.whiteSpace="nowrap"
    var datapng="data:image/png;base64,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"+
"E35nOQAAAABJRU5ErkJggg==";
     this.overlay.innerHTML="<img src='"+datapng+"' width='"+(this.pixelWidth*areadims[2])+
        "' height='"+(this.pixelHeight*areadims[3])+"'>"
   } else {
    this.colorbg.style.display="none"   
    this.overlay.style.display="none"   
   }
   var dims=this.colorspace.areadimensions(4) 
   this.hexvalue.style.height=(dims[3]*this.pixelHeight)+"px"
   this.resetdiv=document.createElement("div")
   this.resetdiv.style.position="absolute"
   dims=this.colorspace.areadimensions(5) 
   this.resetdiv.style.height=(dims[3]*this.pixelHeight)+"px"
   this.resetlink=document.createElement("a")
   this.resetlink.setAttribute("href","javascript:void(null)")
   this.resetlink.innerHTML="Reset"
   this.resetdiv.appendChild(this.resetlink)
   this.p.appendChild(this.swatchbg)
   this.p.appendChild(this.colorbg)
   this.p.appendChild(this.overlay)
   this.p.appendChild(this.resetdiv)
   this.p.appendChild(this.hexvalue)
   this.cursors=[]
   for(var i=0;i<3;i++){
    this.cursors[i]=document.createElement("div")
    this.cursors[i].style.position="absolute"
    this.cursors[i].style.cursor="crosshair"
    this.cursors[i].style.fontSize="1px" // needed for quirks mode
    this.cursors[i].style.backgroundColor="transparent"
    this.cursors[i].style.padding="2px 2px 2px 2px"
    this.cursors[i].style.border=(i==0) ? "2px dotted black" : "2px solid black"
    if(ieversionorbelow(7))this.cursors[i].style.fontSize="1px"
    this.p.appendChild(this.cursors[i])
   }
   if(!this.usealpha)this.cursors[2].style.display="none"
   this.currentArea=0
   if(this.p.style.position=="absolute")setPageX(this.p,this.adjustLeft(this.p,this.origPageX))
   this.pagex=getPageX(tbl) // get page X again since table's x may have changed
   this.startx=(this.p.style.position=="absolute") ? 0 : getPageX(this.p)
   this.starty=(this.p.style.position=="absolute") ? 0 : getPageY(this.p)
   this.endx=this.startx+this.pwidth
   this.endy=this.starty+this.pheight
   this.readjustpos(this.current)
   this.focusedCursor=0
   this.setValueText(rgbToColorDisplay(this.origvalue))
   addListener(this.resetlink,"click",this.binder.bind(this.resetLinkClick))
   addListener(window,"resize",this.binder.bind(this.windowResize))
   addListener(document,"keydown",this.binder.bind(this.documentKeyDown))
   addListener(document,"mousedown",this.binder.bind(this.documentMouseDown))
   addListener(document,"mouseup",this.binder.bind(this.documentMouseUp))
   addListener(document,"mousemove",this.binder.bind(this.documentMouseMove))
},
documentKeyDown:function(e){
  e=eventDetails(e)
  var key=e.key();
  if(key==9){ // tab
   this.focusedCursor++;
   var m=("focus" in this.resetlink) ? 3 : 2;
   var choices=((this.usealpha) ? m+1 : m)
   this.focusedCursor%=choices;
   for(var i=0;i<3;i++){
     this.cursors[i].style.borderStyle=(i==this.focusedCursor) ? "dotted" : "solid"
   }
   if("focus" in this.resetlink){
    if(this.focusedCursor==choices-1)this.resetlink.focus()
    else this.resetlink.blur()
   }
   e.preventDefault();
   return false;
  }
  var focusedArea=[1,2,6][this.focusedCursor]
  var curpos=this.colorspace.colortopos(this.current)
  var dimsmatrix=this.colorspace.areadimensions(focusedArea) // matrix dimensions
  var xy=[dimsmatrix[0]+curpos[0],dimsmatrix[1]+curpos[1]]
  if(focusedArea==2){
   xy=[dimsmatrix[0],dimsmatrix[1]+curpos[2]]
  }
  if(focusedArea==6){
   xy=[dimsmatrix[0],dimsmatrix[1]+curpos[3]]
  }
  if(key==37){ // left
    xy[0]-=1
  } else if(key==38){ //up
    xy[1]-=1
  } else if(key==39){ //right
    xy[0]+=1
  } else if(key==40){ //down
    xy[1]+=1
  }
  if(key>=37 && key<=40){
   xy=this.colorspace.confinetoarea(focusedArea,xy);
   var oldcurrentarea=this.currentArea
   this.respondToMouseDown(e,xy,focusedArea);
   this.currentArea=oldcurrentarea
   return false;
  }
  return true;
},
adjustLeft:function(p,startPos){
   if("clientWidth" in document.body){
      var cw=document.body.clientWidth
      return Math.min(cw-getWidth(p),startPos)
   }
   return startPos
},
windowResize:function(){
  if(this.p.style.position=="absolute")setPageX(this.p,this.adjustLeft(this.p,this.origPageX))
  this.startx=(this.p.style.position=="absolute") ? 0 : getPageX(this.p)
  this.starty=(this.p.style.position=="absolute") ? 0 : getPageY(this.p)
  this.pagex=getPageX(this.tbl) // get page X again since table's x may have changed
  this.endx=this.startx+this.pwidth
  this.endy=this.starty+this.pheight
  this.readjustpos(this.current);
},
setValueText:function(text){
    var size=100;
    var hexarea=this.colorspace.areadimensions(4)
    do {
     this.hexvalue.style.fontSize=size+"%"
     this.hexvalue.innerHTML=text
     size-=10
    } while(size>=50 && (text.length>=8 && (getWidth(this.hexvalue)>(hexarea[2]*this.pixelWidth))));
},
isdifferentcolor:function(c1,c2){
    for(var i=0;i<c1.length;i++){
     if(c1[i]!=c2[i])return true
    }
    return false
},
getxy:function(evt,pagex,pagey,pixelWidth,pixelHeight){
    var px=evt.pageX();
    px=(px-pagex)*1.0/pixelWidth
    var py=evt.pageY();
    py=(py-pagey)*1.0/pixelHeight
    return [px,py]
},
readjustpos:function(current){
    var curpos=this.colorspace.colortopos(current)
    var dimsmatrix=this.colorspace.areadimensions(1) // matrix dimensions
    var dimsswatch=this.colorspace.areadimensions(3) // matrix dimensions
    var dimsside=this.colorspace.areadimensions(2) // side dimensions
    var dimsalpha=this.colorspace.areadimensions(6) // side dimensions
    var dimshex=this.colorspace.areadimensions(4) // color value
    var dimsreset=this.colorspace.areadimensions(5) // reset value
    var suggx;
    var sx=this.startx+this.padding;
    var sy=this.starty+this.padding;
    setPageX(this.swatchbg,sx+(dimsswatch[0]*this.pixelWidth))
    setPageY(this.swatchbg,sy+(dimsswatch[1]*this.pixelHeight))
    setPageX(this.colorbg,sx+(dimsmatrix[0]*this.pixelWidth))
    setPageY(this.colorbg,sy+(dimsmatrix[1]*this.pixelHeight))
    setPageX(this.overlay,sx+(dimsmatrix[0]*this.pixelWidth))
    setPageY(this.overlay,sy+(dimsmatrix[1]*this.pixelHeight))
    setPageX(this.hexvalue,sx+(dimshex[0]*this.pixelWidth))
    setPageY(this.hexvalue,sy+(dimshex[1]*this.pixelHeight))
    setPageX(this.resetdiv,sx+(dimsreset[0]*this.pixelWidth))
    setPageY(this.resetdiv,sy+(dimsreset[1]*this.pixelHeight))
    setPageX(this.cursors[0],sx+dimsmatrix[0]+((curpos[0]*this.pixelWidth)-4))
    setPageY(this.cursors[0],sy+dimsmatrix[1]+((curpos[1]*this.pixelHeight)-4))
    suggx=dimsside[0]+Math.floor(dimsside[2]/2)
    setPageX(this.cursors[1],sx+((suggx*this.pixelWidth)-4))
    setPageY(this.cursors[1],sy+dimsside[1]+((curpos[2]*this.pixelHeight)-4))
    suggx=dimsalpha[0]+Math.floor(dimsalpha[2]/2)
    setPageX(this.cursors[2],sx+((suggx*this.pixelWidth)-4))
    setPageY(this.cursors[2],sy+dimsalpha[1]+((curpos[3]*this.pixelHeight)-4))
    var rgbcurrent=this.colorspace.torgbcolor(current)
    var dark=isRgbDark(rgbcurrent)
    for(var i=0;i<3;i++){
     this.cursors[i].style.borderColor=(dark) ? "white" : "black"    
    }
    this.setValueText(rgbToColorDisplay(rgbcurrent))
},
hide:function(){ // public
    this.p.style.display="none"
    removeListener(this.resetlink,"click",this.binder.bind(this.resetLinkClick))
    removeListener(window,"resize",this.binder.bind(this.windowResize))
    removeListener(document,"keydown",this.binder.bind(this.documentKeyDown))
    removeListener(document,"mousedown",this.binder.bind(this.documentMouseDown))
    removeListener(document,"mouseup",this.binder.bind(this.documentMouseUp))
    removeListener(document,"mousemove",this.binder.bind(this.documentMouseMove))
},
isInAreas3:function(o,x,y){
 var a=o.areacache[y*o.overalldims[0]+x]
 if(a==null){
  a=o.colorspace.getarea(x,y);
  o.areacache[y*o.overalldims[0]+x]=a
 }
 return (a==3)
},
cachedarea:function(o,x,y){
 var a=o.areacache[y*o.overalldims[0]+x]
 if(a==null){
  a=o.colorspace.getarea(x,y);
  o.areacache[y*o.overalldims[0]+x]=a
 }
 return a;
},
isInAreas2:function(o,x,y){
 var a=o.areacache[y*o.overalldims[0]+x]
 if(a==null){
  a=o.colorspace.getarea(x,y);
  o.areacache[y*o.overalldims[0]+x]=a
 }
 return (a==1 || a==3 || a==6)
},
isInAreas1:function(o,x,y){
 var a=o.areacache[y*o.overalldims[0]+x]
 if(a==null){
  a=o.colorspace.getarea(x,y);
  o.areacache[y*o.overalldims[0]+x]=a
 }
 return (a==2 || a==3 || a==6)
},
updatedivs:function(area){
    var i=0;
    var areafunc=null
    var justswatch=false;
    if(area==1)areafunc=this.isInAreas1
    else if(area==2){justswatch=true; areafunc=this.isInAreas2}
    else if(area!=null){justswatch=true; areafunc=this.isInAreas3}
    var maxwidth=this.overalldims[0];
    var maxheight=this.overalldims[1];
    if(this.isoriginal){
     var areadims=this.colorspace.areadimensions(1)
     var area1pure=[areadims[0]+areadims[2]-1,areadims[1]]
     var purecolor=this.colorspace.getcolor(area1pure[0],area1pure[1],this.current);
     this.colorbg.style.backgroundColor=rgbToColorHtml(purecolor)
     this.swatchbg.style.backgroundColor=rgbToColorHtml(this.colorspace.torgbcolor(this.current))
     if(justswatch && !this.usealpha){
      return
     }
    }
    for(var y=0;y<maxheight;y++){
    for(var x=0;x<maxwidth;x++){
     if(this.isoriginal){
      var ca=this.cachedarea(this,x,y);
      if(!this.usealpha && ca==3){i++;continue;}
      if(ca==1){i++;continue;}
     }
     if(!areafunc || areafunc(this,x,y)){
      var bgc=this.bgcolors[i]||""
      var cp=this.colorspace.getcolor(x,y,this.current)
      var c=rgbToColorHtml(cp)
      if(c!=bgc){
       this.divs[i].style.backgroundColor=c
       this.bgcolors[i]=c
      }
     }
     i+=1;
    }}
},
setChangeCallback:function(func){ // public
 this.changeCallback=func
},
triggerChangeCallback:function(c){
 if(this.changeCallback)this.changeCallback(c)
},
resetLinkClick:function(e){
     this.changed=false
     this.current=this.colorspace.fromrgbcolor(this.origvalue)
     this.readjustpos(this.current)
     this.setValueText(rgbToColorDisplay(this.origvalue))
     this.updatedivs(null)
     var rgb=[this.origvalue[0],this.origvalue[1],this.origvalue[2],this.usealpha ? this.origvalue[3] : 255]
     this.triggerChangeCallback(rgb)
},
respondToMouseDown:function(e,xy,area){
     this.currentArea=area
     var oldcolor=this.current
     this.current=this.colorspace.changecolor(xy[0],xy[1],this.current)
     this.readjustpos(this.current)
     this.changed=true
     if(this.isdifferentcolor(oldcolor,this.current)){
      this.updatedivs(area)
      var rgb=this.colorspace.torgbcolor(this.current)
      this.triggerChangeCallback(rgb)
     }
     e.preventDefault();
},
documentMouseDown:function(e){
    this.handleclick=true
    e=eventDetails(e);
    var xy=this.getxy(e,this.pagex,this.pagey,this.pixelWidth,this.pixelHeight);
    var area=this.colorspace.getarea(xy[0],xy[1])
    if(area==1 || area==2 || area==6){
       this.respondToMouseDown(e,xy,area)
    }
},
documentMouseUp:function(e){
    this.handleclick=true
    this.currentArea=0
},
documentMouseMove:function(e){
    this.handleclick=true
    if(this.currentArea==1 || this.currentArea==2 || this.currentArea==6){
     e=eventDetails(e);
     var xy=this.getxy(e,this.pagex,this.pagey,this.pixelWidth,this.pixelHeight);
     xy=this.colorspace.confinetoarea(this.currentArea,xy);
     this.respondToMouseDown(e,xy,this.currentArea);
    } 
}
})
  
  var defaultModel=null;
  var EventHandlers=subclass(Object,{
  initialize:function(){ this.handlers=[]; },
  add:function(func){ if(func)this.handlers.push(func) },
  remove:function(func){
   var newhandlers=[]; removed=false;
   for(var i=0;i<this.handlers.length;i++){
    if(this.handlers[i]==func && !removed){
     newhandlers[newhandlers.length]=this.handlers[i]
    }
   }
   return newhandlers;
  },
  clear:function(){ this.handlers=[] },
  trigger:function(){
   for(var i=0;i<this.handlers.length;i++){
    if(this.handlers[i])this.handlers[i].apply(this,arguments)
   }
  }
  })
  var PublicEventHandlers=subclass(Object,{
   initialize:function(o){ this.o=o; },
   add:function(f){ this.o.add(f); },
   remove:function(f){ this.o.remove(f); },
   clear:function(f){ this.o.clear(f); }
  });
  var colorChangeEvent=new EventHandlers();
  var colorPreviewEvent=new EventHandlers();
  var colorPickerAdapters=[];
  rootobj.doColorChange=function(input,usealpha,button){
    var c=((usealpha ? colorToRgba : colorToRgb)(input.value))||[0,0,0,255]
    coloredInput(input,button)
    colorChangeEvent.trigger(c,thisInput)
  }
  rootobj.doColorPreview=function(input,usealpha,button){
    var c=((usealpha ? colorToRgba : colorToRgb)(thisInput.value))||[0,0,0,255]
    coloredInput(input,button)
    colorPreviewEvent.trigger(c,thisInput)
  }
  rootobj.getColorChangeEvent=function(){
    return new PublicEventHandlers(colorChangeEvent);
  }
  rootobj.getColorPreviewEvent=function(){
    return new PublicEventHandlers(colorPreviewEvent);
  }
  rootobj.getDefaultColorModel=function(){
    return defaultModel;
  }
  rootobj.setDefaultColorModel=function(model){
    defaultModel=model;
  }
  rootobj.addColorPickerAdapter=function(adapter){
    if(adapter){
     colorPickerAdapters[colorPickerAdapters.length]=adapter
    }
  }
  var _supportsColorInput=null
  var supportsColorInput=function(){
    if(_supportsColorInput!==null)return _supportsColorInput;
    var f=document.createElement("form")
    var inp=document.createElement("input")
    try { inp.type="color" } catch(e){ 
      _supportsColorInput=false; return _supportsColorInput; }
    inp.style.display="none"
    f.style.display="none"
    f.appendChild(inp)
    document.body.appendChild(f)
    var val=(inp.value||"")
    _supportsColorInput=(val.indexOf("#")==0)
    document.body.removeChild(f)
    return _supportsColorInput;
  }
  var removeFilter=function(o,filter){
   if("filter" in o.style){
    filter=filter.toLowerCase();
    var f=(o.style.filter||"").split(/\)\s*,\s*/);
    var ff=[];
    for(var i=0;i<f.length;i++){
     if((f[i]||"").length>0 && !(f[i].match(new RegExp("^progid\\:dximagetransform\\.microsoft\\."+filter+"\\s*\\(","i")))){
      ff[ff.length]=f[i]+")";
     }
    }
    o.style.filter=ff.join(",");
   }
  }
  var coloredInput=function(input,button){
   var c=(colorToRgba(input.value)||[0,0,0,255])
   input.style.backgroundColor=rgbToColorHtml(c)
   input.style.backgroundImage="none"
   removeFilter(input,"gradient")//IE's filter takes precedence over background, so remove
   input.style.color=(isRgbDark(c)) ? "white" : "black"
   if(button){
    button.style.backgroundImage="none"
    removeFilter(button,"gradient")//IE's filter takes precedence over background, so remove
    try {
     button.style.backgroundColor=rgbToColor(c)
    } catch(e){
     button.style.backgroundColor=rgbToColorHtml(c) // RGBA not supported
    }
    button.style.color=(isRgbDark(c)) ? "white" : "black"  
   }
  }
  function onNewInputClickFunction(newInput,thisInput,info,usealpha){
   return function(){
       var o=document.createElement("div")
       var cj=null
       o.style.position="absolute"
       document.body.appendChild(o)
       var currentValue=((usealpha ? colorToRgba : colorToRgb)(thisInput.value))||[0,0,0,255]
       o.style.left=getPageX(newInput)+"px"
       o.style.top=(getPageY(newInput)+getHeight(newInput))+"px"
       o.style.margin="0px"
       var cp=new mycolorpicker(info,o,currentValue,usealpha)
       cp.setChangeCallback(function(cc){
         thisInput.value=rgbToColorDisplay(cc);
         coloredInput(thisInput,newInput);
         colorPreviewEvent.trigger(cc,thisInput)         
       })
       var checkclick=false
       var binder=new MethodBinder({})
       var endColorBox=function(){
           cp.hide();
           o.parentNode.removeChild(o)
           removeListener(document,"keydown",binder.bind(keydown))
           removeListener(document,"click",binder.bind(docclick))
           removeListener(document,"mousedown",binder.bind(docdown))
           var cc=((usealpha ? colorToRgba : colorToRgb)(thisInput.value))||[0,0,0,255]
           colorChangeEvent.trigger(cc,thisInput)
       }
       var keydown=function(e){
         e=eventDetails(e)
         if(e.key()==27 || e.key()==13){ // escape or enter
           e.preventDefault();
           e.stopPropagation();
           endColorBox();
         }
       }
       var docclick=function(e){
         e=eventDetails(e)
         var cx=e.pageX(); var cy=e.pageY();
         if(checkclick && !(cx>=getPageX(o) && cy>=getPageY(o) && 
            cx<getPageX(o)+getWidth(o) &&
            cy<getPageY(o)+getHeight(o))){
           e.stopPropagation();
           endColorBox();
         }
       }
       var docdown=function(){ checkclick=true }
       addListener(document,"click",binder.bind(docclick))
       addListener(document,"mousedown",binder.bind(docdown))
       addListener(document,"keydown",binder.bind(keydown))
   }
  }
  rootobj.createColorPickerButton=function(thisInput,usealpha){
     var newInput=document.createElement("input")
     newInput.type="button"
     newInput.value="..."
     coloredInput(thisInput,newInput)
     try { newInput.style.textShadow="none" }catch(e){}
     var bid=0; var bidstring=""; do {
      bidstring="colorpickerbuttonid"+bid; bid+=1
     } while(document.getElementById(bidstring))
     newInput.id=bidstring; 
     thisInput.parentNode.insertBefore(newInput,thisInput)
     var chgfunc=function(newInput,thisInput,useAlpha){
      return function(){
          var c=((usealpha ? colorToRgba : colorToRgb)(thisInput.value))||[0,0,0,255]
          oldvalue=thisInput.value
          coloredInput(thisInput,newInput)
          colorChangeEvent.trigger(c,thisInput)
     }}
     var oldvalue=thisInput.value
     var changefunc=chgfunc(newInput,thisInput,usealpha)
     // because of suggestions, use "input" instead of "keyup" if
     // supported by the browser (IE9 supports input only partially;
     // backspace doesn't trigger the input event)
     addListener(thisInput,("oninput" in thisInput && !ieversionorbelow(9)) ? "input" : "keyup",changefunc)
     addListener(thisInput,"change",changefunc)   
     return newInput;     
  }
  window.setColorPicker=function(thisInput,usealpha,info){
     if(!info)info=(defaultModel || rootobj.HueSatVal);
     try { thisInput.style.textShadow="none" }catch(e){}
     setPatternAndTitle(thisInput,usealpha);
     for(var i=0;i<colorPickerAdapters.length;i++){
       if((colorPickerAdapters[i])(thisInput,usealpha,info)){return;}
     }
     useNativeColorPicker(thisInput,usealpha);
     var newInput=rootobj.createColorPickerButton(thisInput,usealpha);
     addListener(newInput,"click",onNewInputClickFunction(newInput,thisInput,info,usealpha))
  }
  addReadyListener(function(){ // set up color pickers
   var inputs=document.getElementsByTagName("input")
   var inputsArray=[];
   // convert to array because contents may change
   for(var i=0;i<inputs.length;i++){ inputsArray[inputsArray.length]=inputs[i] }
   for(var i=0;i<inputsArray.length;i++){
    var thisInput=inputsArray[i]
    if((thisInput.type=="text" || thisInput.type=="color") && thisInput.id.indexOf("color_")==0){
     setColorPicker(thisInput,false)
    }
    if((thisInput.type=="text" || thisInput.type=="color") && thisInput.id.indexOf("acolor_")==0){
     setColorPicker(thisInput,true)
    }
   }
  })
rootobj.HueLumSat={
 fromrgbcolor:function(rgb){ 
  var r=rgb[0];
  var g=rgb[1];
  var b=rgb[2];
  var vmax=r;
  if (g > vmax) vmax=g;
  if (b > vmax) vmax=b;
  var vmin=r;
  if (g<vmin) vmin=g;
  if (b<vmin) vmin=b;
  var lt=((vmax+vmin)/2.0);
  if (vmax==vmin){
   return [0,(lt<0 ? 0 : (lt>255 ? 255 : lt)),0]
  }
  var h=0;
  var vd=(vmax-vmin);
  var vadd=(vmax+vmin);
   var hvd=vd/2;
   var divisor=(lt<=127.5)?vadd:510-vadd;
   var s=((vd*255)/divisor);
   if (r == vmax){
    h=(((vmax-b)*60)+hvd)/vd;
    h-=(((vmax-g)*60)+hvd)/vd;
   } else if (b == vmax){
    h=240+(((vmax-g)*60)+hvd)/vd ;
    h-=(((vmax-r)*60)+hvd)/vd ;
   } else {
    h=120+(((vmax-r)*60)+hvd)/vd;
    h-=(((vmax-b)*60)+hvd)/vd;
   }
   if(h<0||h>=360)h=(((h%360)+360)%360);
  return [h,(lt<0 ? 0 : (lt>255 ? 255 : lt)),(s<0 ? 0 : (s>255 ? 255 : s))]
 },
 torgbcolor:function(hls){ 
 var hueval=hls[0]*1.0;//[0-360)
 var lum=hls[1]*1.0;//[0-255]
 var sat=hls[2]*1.0;//[0-255]
 lum=(lum<0 ? 0 : (lum>255 ? 255 : lum));
 sat=(sat<0 ? 0 : (sat>255 ? 255 : sat));
 if(sat==0){
  return [lum,lum,lum];
 }
 var b=0;
 if (lum<=127.5){ 
  b=(lum*(255.0+sat))/255.0;
 } else {
  b=lum*sat;
  b=b/255.0;
  b=lum+sat-b;
 }
 var a=(lum*2)-b;
 var r,g,bl;
 if(hueval<0||hueval>=360)hueval=(((hueval%360)+360)%360);
 var hue=hueval+120;
 if(hue>=360)hue-=360;
 if (hue<60) r=(a+(b-a)*hue/60);
 else if (hue<180) r=b;
 else if (hue<240) r=(a+(b-a)*(240-hue)/60);
 else r=a; 
 hue=hueval;
 if (hue<60) g=(a+(b-a)*hue/60);
 else if (hue<180) g=b;
 else if (hue<240) g=(a+(b-a)*(240-hue)/60);
 else g=a;
 hue=hueval-120;
 if(hue<0)hue+=360;
 if (hue<60) bl=(a+(b-a)*hue/60);
 else if (hue<180) bl=b;
 else if (hue<240) bl=(a+(b-a)*(240-hue)/60);
 else bl=a;
 return [(r<0 ? 0 : (r>255 ? 255 : r)),
   (g<0 ? 0 : (g>255 ? 255 : g)),
   (bl<0 ? 0 : (bl>255 ? 255 : bl))]
 },
 maxes:[360,255,255], // Hue, Lum, Sat
 reversed:[true,false,false], // Hue, Lum, Sat
 indexes:[1,2,0] // SatxLum, and Hue on the side
};
rootobj.HueSatVal={
 fromrgbcolor:function(rgb){
  var r=rgb[0]/255.0;
  var g=rgb[1]/255.0;
  var b=rgb[2]/255.0;
  var max=r;
  if (g > max) max=g;
  if (b > max) max=b;
  var min=r;
  if (g<min) min=g;
  if (b<min) min=b;
  if (max == 0 || max == min){
   var v=(max<0 ? 0 : (max>1 ? 1 : max));
   return [0, 0, v*255.0];
  }
  var s=((max - min)/max)*255.0;
  var h;
  if (r == max){
   h=(g - b)/(max - min)*60;
  } else if (g == max){
   h=(2+(b - r)/(max - min))*60;
  } else {
   h=(4+(r - g)/(max - min))*60;
  }
  if (h<0||h>=360)h=(((h%360)+360)%360);
  var v=max*255.0;
  return [
    (h<0 ? 0 : (h>360 ? 360 : h)),
    (s<0 ? 0 : (s>255 ? 255 : s)),
    (v<0 ? 0 : (v>255 ? 255 : v))]
},
torgbcolor:function(hsv){
  var hue=hsv[0];
  var sat=hsv[1];
  var val=hsv[2];
  if(hue<0||hue>=360)hue=(((hue%360)+360)%360);
  sat/=255.0;
  val/=255.0;
  var hi=Math.floor(hue/60);
  var f=(hue/60)-hi;
  var c=val*(1-sat);
  var a=val*(1-sat*f);
  var e=val*(1-sat*(1- f));
  var r, g, b;
  if (hi == 0){
   r=val;g=e;b=c;
  } else if (hi == 1){
   r=a;g=val;b=c;
  } else if (hi == 2){
   r=c;g=val;b=e;
  } else if (hi == 3){
   r=c;g=a;b=val;
  } else if (hi == 4){
   r=e;g=c;b=val;
  } else {
   r=val;g=c;b=a;
  }
  r*=255;g*=255;b*=255
  return [
    (r<0 ? 0 : (r>255 ? 255 : r)),
    (g<0 ? 0 : (g>255 ? 255 : g)),
    (b<0 ? 0 : (b>255 ? 255 : b))]
},
maxes:[360,255,255],
  reversed:[true,false,true],
  indexes:[1,2,0]
 };
})(window,window.PDColorPicker={});
/////////////////////////////////////////


