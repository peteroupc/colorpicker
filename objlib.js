/* This file is in the public domain. Peter O., 2012. http://upokecenter.dreamhosters.com 
    Public domain dedication: http://creativecommons.org/publicdomain/zero/1.0/  */

// Calculates the actual style of an HTML element.
// getComputedValue(elem,prop) 
// elem - An HTML element.
// prop - A CSS property (such as 'background-color')
function getComputedValue(elem,prop){ // expects syntax like 'background-color'
 if(!elem)return null
 if(!("gcs" in getComputedValue) && document.defaultView && document.defaultView.getComputedStyle){
  // expects syntax like 'background-color'
  // cache value, since function may be slow if called many times
  getComputedValue.gcs=document.defaultView
 } else if(!("gcs" in getComputedValue) && window.getComputedStyle){
  // expects syntax like 'background-color'
  getComputedValue.gcs=window
 } else if(!("gcs" in getComputedValue)){
  getComputedValue.gcs=null
 }
 if("gcs" in getComputedValue && getComputedValue.gcs!=null)
  return getComputedValue.gcs.getComputedStyle(elem,null).getPropertyValue(prop);
 if(elem){
  try {
   if("currentStyle" in elem){
    // expects syntax like 'backgroundColor'
    if(prop=="float"){
     prop=("cssFloat" in elem.currentStyle) ? "cssFloat" : "styleFloat";
    } else {
     prop=prop.replace(/-([a-z])/g,function(a,b){return b.toUpperCase();})
    }
    return elem.currentStyle[prop];
   }
  } catch(e){}
  // Just get regular style
  if("style" in elem){
   // expects syntax like 'backgroundColor'
    if(prop=="float"){
     prop=("cssFloat" in elem.style) ? "cssFloat" : "styleFloat";
    } else {
     prop=prop.replace(/-([a-z])/g,function(a,b){return b.toUpperCase();})
    }
   return elem.style[prop];
  }
 }
 return(null);
}

function getHeight(o) { 
  if(!o)return 0;
  if(document.layers)return ((o.height)?o.height:o.clip.height)
  var x=(
    (window.opera&&typeof o.style.pixelHeight!='undefined')?
    o.style.pixelHeight:
    o.offsetHeight
   );
  if(x===0){
   x=parseFloat(getComputedValue(o,"height"));
   if(isNaN(x))x=0;
  }
  return x
}
function setHeight(o,h) { 
  if(!o)return 0;if(o.clip) 
   o.clip.height=h; 
  else if(window.opera && typeof o.style.pixelHeight != 'undefined') 
   o.style.pixelHeight=h; 
  else 
   o.style.height=h+"px"; 
}
function getWidth(o) { 
  if(!o)return 0;
  if(document.layers)return ((o.width)?o.width:o.clip.width);
  var x=(window.opera && typeof o.style.pixelWidth!='undefined')?
    o.style.pixelWidth:
    o.offsetWidth;
  if(x===0){
   x=parseFloat(getComputedValue(o,"width"))
   if(isNaN(x))x=0
  }
  return x
}
function setWidth(o,w) {
  if(!o)return 0;if(o.clip) 
   o.clip.width=w;
  else if(window.opera && typeof o.style.pixelWidth != 'undefined') 
   o.style.pixelWidth=w; 
  else
   o.style.width=w+"px"; 
}
function setPageX(e,x){
 if(!e||isNaN(x))return
 var estyle=e.style
 if (estyle){
   if("left" in estyle)estyle.left=x+'px';
   else if("pixelLeft" in estyle)estyle.pixelLeft=x+'px';
 } else if(typeof e.left!="undefined") {
    e.left=x;
 }
}

function setPageY(e,x){
 if(!e||isNaN(x))return
 var estyle=e.style
 if (estyle){
   if("top" in estyle)estyle.top=x+'px';
   else if("pixelTop" in estyle)estyle.pixelTop=x+'px';
 } else if(typeof e.top!="undefined") {
    e.top=x;
 }
}

function getPageX(o) { 
 var x=0;
 if(!o)return 0
 if(document.layers) 
  x=o.pageX;
 else {
  while(o!=null && typeof o!="undefined") { 
   if(typeof o.offsetLeft!="undefined")
    x+=o.offsetLeft; 
   o=o.offsetParent; 
  } 
 } 
 return x; 
}
function getPageY(o) { 
 var x=0;
 if(!o)return 0
 if(document.layers) 
  x=o.pageY; 
 else {
  while(o!=null && typeof o!="undefined") { 
   if(typeof o.offsetTop!="undefined")
    x+=o.offsetTop; 
   o=o.offsetParent; 
  } 
 } 
 return x; 
}
function ieversionorbelow(version){
 if(navigator.appName=="Microsoft Internet Explorer"){
  if(window.opera)return false;
  var e=/MSIE\s+(\d+\.?\d*)/.exec(navigator.userAgent)
  if(e){
   return parseFloat(e[1])<=version
  }
  return true
 }
 return false
}

function addListener(o,e,f){
  if(!o)return
  if(e=="mousewheel" && navigator.userAgent.indexOf("Gecko/")>=0)
   e="DOMMouseScroll"
  if("addEventListener" in o)
   o.addEventListener(e,f,false);
  else if(o.attachEvent)
   o.attachEvent("on"+e,addListener.bind(o,"on"+e,f));
}
addListener.bind=function(o,e,f){ return f }
function removeListener(o,e,f){
  if(!o)return
  if(e=="mousewheel" && navigator.userAgent.indexOf("Gecko/")>=0)
   e="DOMMouseScroll"
  try {
   if("removeEventListener" in o){
    o.removeEventListener(e,f,false);
    return
   }
   else if(o.detachEvent){
    o.detachEvent("on"+e,addListener.bind(o,"on"+e,f));
    return
   }
  } catch(e){
   return
  }
}





function extendObject(o,values){
 if(!o||!values)return
 for(var i in values){
  o[i]=values[i]
 }
}

// Allows the definition of classes.
// 'otherClass' specifies the class's superclass
// (top level classes should specify Object as the superclass).
// 'newMembers' identifies the class's member methods.
// The method 'initialize' in 'newMembers' specifies the object's
// constructor.  Members with the same name in the subclass
// are overridden.
function subclass(otherClass,newMembers){
 var func=function(){
  // call the initialize method (constructor)
  this.initialize.apply(this,arguments)
 }
 // Existing members
 extendObject(func.prototype,otherClass.prototype)
 // Overridden or new members
 extendObject(func.prototype,newMembers)
 // Add empty initialize if doesn't exist
 if(!func.prototype.initialize){
  extendObject(func.prototype,{
   initialize:function(){}
  })
 }
 func.prototype.constructor=func
 return func
}

// A class that binds a method to a specific instance of
// an object.  The bound method is unique to that instance
// and multiple calls to the 'bind' method passing the same
// method will return the same bound method each time.
// _obj_ refers to the object to bind methods to. Example:
// Bound methods and method binders hold a reference to
// the object.
/*
function MyClass(name){
 // Create a method binder for this instance
 this.binder=new MethodBinder(this)
 this.name=name
 this.intervalMethod=function(){
  // Use the name passed to this object
  alert("Hello "+this.name)
 }
 // Display message in 3 seconds.  Note that the
 // intervalMethod is now bound to this instance
 setTimeout(this.binder.bind(this.intervalMethod),3000)
}
*/
function MethodBinder(obj){
 this.methods={}
 this.obj=obj
 // Returns a method in which the method's arguments
 // are called for a specific instance of an object.
 this.bind=function(method){
  if(this.methods[method]){
   return this.methods[method]
  } else {
   var thisObject=this.obj
   var m=function(){ 
     var args=[];
     for(var i=0;i<arguments.length;i++){
      args[i]=arguments[i];
     }
     return method.apply(thisObject,args);
   }
   this.methods[method]=m
   return m
  }
 }
}

(function(window){

var __isMouse=function(eventType){
     return (/(click|mouse|menu)/.test(eventType) || eventType=="DOMMouseScroll");
}
var eventDetailsFunc={
   rightClick:function(){
    return (this.event.which==3)||(this.event.button==2)
   },
   relatedTarget:function(){
    return this.event.relatedTarget || ((this.type=="mouseover") ? this.event.fromElement : this.event.toElement)
   },
   wheel:function(){
      return (eventType=="mousewheel" || eventType=="DOMMouseScroll") ? 
         ((this.event.wheelDelta) ? this.event.wheelDelta/120 : -(this.event.detail||0)/3) : 0
   },
   // Mouse coordinates relative to page's top left corner
   pageX:function(){
      return (!__isMouse(this.type)) ? 0 : (this.event.pageX || ((this.event.clientX||0)+
         ((document.documentElement || document.body).scrollLeft||0)))
   },
   pageY:function(){
      return (!__isMouse(this.type)) ? 0 : (this.event.pageY || ((this.event.clientY||0)+
         ((document.documentElement || document.body).scrollTop||0)))
   },
   // Mouse coordinates relative to client area's top left corner
   clientX:function(){
      return (!__isMouse(this.type)) ? 0 : (this.event.pageX ? this.event.pageX-window.pageXOffset : this.event.clientX);
   },
   clientY:function(){
      return (!__isMouse(this.type)) ? 0 : (this.event.pageY ? this.event.pageY-window.pageYOffset : this.event.clientY);
   },
   key:function(){ return (this.event.which || this.event.keyCode || this.event.charCode || 0) },
  shiftKey: function(){ return typeof this.event.shiftKey=="undefined" ? this.event.shiftKey : this.key()==16},
  ctrlKey: function(){ return typeof this.event.ctrlKey=="undefined" ? this.event.ctrlKey : this.key()==17},
  altKey: function(){ return typeof this.event.altKey=="undefined" ? this.event.altKey : this.key()==18},
  metaKey: function(){ return typeof this.event.metaKey=="undefined" ? this.event.metaKey : false},
  objectX:function(){
   return this.pageX()-getPageX(this.target)
  },
  objectY:function(){
   return this.pageY()-getPageY(this.target)
  },
  cancel:function(){
   this.preventDefault()
   this.stopPropagation()
   return false
  },
 preventDefault:function(){
  if(this.event.cancelable && this.event.preventDefault){
    this.event.preventDefault();
  } else if(window.event){
   window.event.returnValue=false
   try{ window.event.keyCode=-1 }catch(e){}
  }
  return false
 },
 stopPropagation:function(){
  if(this.event.stopPropagation){
    this.event.stopPropagation();
  } else if(window.event){
   window.event.cancelBubble=true
  }
  return false
 }
}

window.eventDetails=function(e){
 if(e && e.fixedEvent===true){
  // This event was fixed already
  return e
 }
 var event=(window.event && "srcElement" in window.event) ? window.event : e
 var target=window.event && window.event.srcElement ? window.event.srcElement : (e ? e.target : document)
 if(target && target.nodeType==3)
  target=target.parentNode
 var o={
   fixedEvent: true, // to prevent recursion
   event: event,
   target: target,
   type: (event ? event.type : "")
 }
 extendObject(o,eventDetailsFunc);
 // Mouse coordinates relative to object's position
 return o
}
var isDomContent=false
// Adds a function to call when the entire document is ready to
// be analyzed by scripts.  This is normally called even before all
// images and objects are loaded and displayed (the 'onload'
// event).  Falls back to 'onload' if necessary.  The function takes
// no arguments.
window.addReadyListener=function(func){
 if(isDomContent || document.readyState=="complete"){
  func();
 } else if(document.addEventListener){
  var functionCalled=false
  addListener(document,"DOMContentLoaded",function(){
//    console.log("DOMContent")
    if(!functionCalled){isDomContent=true;functionCalled=true;func();}
  });
  addListener(window,'load',function(){
//    console.log("DOMContent2")
    if(!functionCalled){isDomContent=true;functionCalled=true;func();}
  });
 } else if(navigator.userAgent.indexOf("AppleWebKit")>0){
   var readyCheck = setInterval(function(){
     if (document.readyState=="complete"||document.readyState=="loaded"){
      clearInterval(readyCheck);
      readyCheck = null;
   }},10);
 } else if(ieversionorbelow(7) && window==top){
   var readyCheck = setInterval(function(){
     if(!isDomContent){
      try { document.body.doScroll("left"); isDomContent=true;} catch(e){return }
     }
     if (isDomContent){
      clearInterval(readyCheck);
      readyCheck = null;
      func()
     }
   },10);
 } else {
  addListener(window,'load',func)
 }
}
})(window);

////////////////////////////////

function hlsToRgb(hls) {
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
}

function colorHtmlToRgba(x){
 var arr=[]
 colorToRgba.setUpNamedColors();
 if(!x || x.length==0)return [0,0,0,255];
 x=x.toLowerCase();
 if(x.indexOf("grey")>=0)x=x.replace("grey","gray");// support "grey" variants
 var ret=colorToRgba.namedColors[x]
 if(typeof ret=="string")return colorToRgba(ret)
 for(var i=(x.charAt(0)=="#") ? 1 : 0;i<x.length;i++){
  var c=x.charCodeAt(i)
  var hex=0
  if(c>=0x30 && c<=0x39)hex=c-0x30
  if(c>=0x61 && c<=0x66)hex=c-0x61+10
  arr[arr.length]=hex
 }
 var sublength=Math.floor((arr.length+2)/3)
 while(arr.length<sublength*3){
  arr[arr.length]=0
 }
 var currlength=sublength
 var offset=0
 while(currlength>2){
  if(arr[offset]==0 && arr[sublength+offset]==0 &&
      arr[sublength*2+offset]==0){
   currlength--; offset++;    
  } else break;
 }
 return [
   arr[offset]*16+arr[offset+1],
   arr[sublength+offset]*16+arr[sublength+offset+1],
   arr[sublength*2+offset]*16+arr[sublength*2+offset+1],
   255
 ]
}

// Converts a representation of a color to its RGB form
// Returns a 4-item array containing the intensity of red,
// green, blue, and alpha (each from 0-255)
function colorToRgba(x){
 var e=null
 if(!x)return null
 var c;
 if(e=(/^#([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/.exec(x))){
  return [parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16),255]
 } else if(e=(/^rgb\(\s*([\+\-]?\d+(?:\.\d+)?%)\s*,\s*([\+\-]?\d+(?:\.\d+)?%)\s*,\s*([\+\-]?\d+(?:\.\d+)?%)\s*\)$/.exec(x))){
  var r1=((c=parseFloat(e[1]))<0 ? 0 : (c>100 ? 100 : c))*255/100;
  var r2=((c=parseFloat(e[2]))<0 ? 0 : (c>100 ? 100 : c))*255/100;
  var r3=((c=parseFloat(e[3]))<0 ? 0 : (c>100 ? 100 : c))*255/100;
  return [r1,r2,r3,255]
 } else if(e=(/^rgb\(\s*([\+\-]?\d+)\s*,\s*([\+\-]?\d+)\s*,\s*([\+\-]?\d+)\s*\)$/.exec(x))){
  var r1=((c=parseInt(e[1],10))<0 ? 0 : (c>255 ? 255 : c));
  var r2=((c=parseInt(e[2],10))<0 ? 0 : (c>255 ? 255 : c));
  var r3=((c=parseInt(e[3],10))<0 ? 0 : (c>255 ? 255 : c));
  return [r1,r2,r3,255]
 } else if(e=(/^rgba\(\s*([\+\-]?\d+(?:\.\d+)?%)\s*,\s*([\+\-]?\d+(?:\.\d+)?%)\s*,\s*([\+\-]?\d+(?:\.\d+)?%)\s*,\s*([\+\-]?\d+(?:\.\d+)?)\s*\)$/.exec(x))){
  var r1=((c=parseFloat(e[1]))<0 ? 0 : (c>100 ? 100 : c))*255/100;
  var r2=((c=parseFloat(e[2]))<0 ? 0 : (c>100 ? 100 : c))*255/100;
  var r3=((c=parseFloat(e[3]))<0 ? 0 : (c>100 ? 100 : c))*255/100;
  var r4=((c=parseFloat(e[4]))<0 ? 0 : (c>1 ? 1 : c))*255
  return [r1,r2,r3,r4]
 } else if(e=(/^rgba\(\s*([\+\-]?\d+)\s*,\s*([\+\-]?\d+)\s*,\s*([\+\-]?\d+)\s*,\s*([\+\-]?\d+(?:\.\d+)?)\s*\)$/.exec(x))){
  var r1=((c=parseInt(e[1],10))<0 ? 0 : (c>255 ? 255 : c));
  var r2=((c=parseInt(e[2],10))<0 ? 0 : (c>255 ? 255 : c));
  var r3=((c=parseInt(e[3],10))<0 ? 0 : (c>255 ? 255 : c));
  var r4=((c=parseFloat(e[4]))<0 ? 0 : (c>1 ? 1 : c))*255
  return [r1,r2,r3,r4]
 } else if(e=(/^#([A-Fa-f0-9]{1})([A-Fa-f0-9]{1})([A-Fa-f0-9]{1})$/.exec(x))){
  var a=parseInt(e[1],16); b=parseInt(e[2],16); c=parseInt(e[3],16);
  return [a+(a<<4),b+(b<<4),c+(c<<4),255]
 } else if(e=(/^hsl\(\s*([\+\-]?\d+(?:\.\d+)?)\s*,\s*([\+\-]?\d+(?:\.\d+)?)%\s*,\s*([\+\-]?\d+(?:\.\d+)?)%\s*\)$/.exec(x))){
  var r1=parseFloat(e[1]);
  if(r1<0||r1>=360)r1=(((r1%360)+360)%360);
  var r2=((c=parseFloat(e[3]))<0 ? 0 : (c>100 ? 100 : c))*255/100
  var r3=((c=parseFloat(e[2]))<0 ? 0 : (c>100 ? 100 : c))*255/100
  var rgb=hlsToRgb([r1,r2,r3])
  return [rgb[0],rgb[1],rgb[2],255]
 } else if(e=(/^hsla\(\s*([\+\-]?\d+(?:\.\d+)?)\s*,\s*([\+\-]?\d+(?:\.\d+)?)%\s*,\s*([\+\-]?\d+(?:\.\d+)?)%\s*,\s*([\+\-]?\d+(?:\.\d+)?)\s*\)$/.exec(x))){
  var r1=parseFloat(e[1]);
  if(r1<0||r1>=360)r1=(((r1%360)+360)%360);
  var r2=((c=parseFloat(e[3]))<0 ? 0 : (c>100 ? 100 : c))*255/100
  var r3=((c=parseFloat(e[2]))<0 ? 0 : (c>100 ? 100 : c))*255/100
  var r4=((c=parseFloat(e[4]))<0 ? 0 : (c>1 ? 1 : c))*255
  var rgb=hlsToRgb([r1,r2,r3])
  return [rgb[0],rgb[1],rgb[2],r4]
 } else {
  colorToRgba.setUpNamedColors();
  x=x.toLowerCase();
  if(x.indexOf("grey")>=0)x=x.replace("grey","gray");// support "grey" variants
  var ret=colorToRgba.namedColors[x]
  if(typeof ret=="string")return colorToRgba(ret)
  if(x=="transparent")return [0,0,0,0]
  return null
 }
}

colorToRgba.namedColorsPattern=function(){
 colorToRgba.setUpNamedColors();var b=[]
 for(var o in colorToRgba.namedColors){
  var v=colorToRgba.namedColors[o]
  if(typeof v=="string"){
   b[b.length]=o;if(o.indexOf("gray")>=0)b[b.length]=o.replace("gray","grey")
  }
 }
 // for IE10 compatibility, sort by descending length
 b.sort(function(x,y){ return (y.length-x.length) })
 var ret=""
 for(var i=0;i<b.length;i++){
  var buc=b[i].toUpperCase();
  if(ret.length>0)ret+="|"
  for(var j=0;j<b[i].length;j++){
   ret+="["+buc.charAt(j)+b[i].charAt(j)+"]"
  }
 }
 return ret
}

colorToRgba.setUpNamedColors=function(){
  if(!colorToRgba.namedColors){
    var nc=("aliceblue,f0f8ff,antiquewhite,faebd7,aqua,00ffff,aquamarine,7fffd4,azure,f0ffff,beige,f5f5dc,bisque,ffe4c4,black,000000,blanchedalmond,ffebcd,blue,0000ff,"
+"blueviolet,8a2be2,brown,a52a2a,burlywood,deb887,cadetblue,5f9ea0,chartreuse,7fff00,chocolate,d2691e,coral,ff7f50,cornflowerblue,6495ed,cornsilk,fff8dc,"
+"crimson,dc143c,cyan,00ffff,darkblue,00008b,darkcyan,008b8b,darkgoldenrod,b8860b,darkgray,a9a9a9,darkgreen,006400,darkkhaki,bdb76b,darkmagenta,8b008b,"
+"darkolivegreen,556b2f,darkorange,ff8c00,darkorchid,9932cc,darkred,8b0000,darksalmon,e9967a,darkseagreen,8fbc8f,darkslateblue,483d8b,darkslategray,2f4f4f,"
+"darkturquoise,00ced1,darkviolet,9400d3,deeppink,ff1493,deepskyblue,00bfff,dimgray,696969,dodgerblue,1e90ff,firebrick,b22222,floralwhite,fffaf0,forestgreen,"
+"228b22,fuchsia,ff00ff,gainsboro,dcdcdc,ghostwhite,f8f8ff,gold,ffd700,goldenrod,daa520,gray,808080,green,008000,greenyellow,adff2f,honeydew,f0fff0,hotpink,"
+"ff69b4,indianred,cd5c5c,indigo,4b0082,ivory,fffff0,khaki,f0e68c,lavender,e6e6fa,lavenderblush,fff0f5,lawngreen,7cfc00,lemonchiffon,fffacd,lightblue,add8e6,"
+"lightcoral,f08080,lightcyan,e0ffff,lightgoldenrodyellow,fafad2,lightgray,d3d3d3,lightgreen,90ee90,lightpink,ffb6c1,lightsalmon,ffa07a,lightseagreen,20b2aa,"
+"lightskyblue,87cefa,lightslategray,778899,lightsteelblue,b0c4de,lightyellow,ffffe0,lime,00ff00,limegreen,32cd32,linen,faf0e6,magenta,ff00ff,maroon,800000,"
+"mediumaquamarine,66cdaa,mediumblue,0000cd,mediumorchid,ba55d3,mediumpurple,9370d8,mediumseagreen,3cb371,mediumslateblue,7b68ee,mediumspringgreen,"
+"00fa9a,mediumturquoise,48d1cc,mediumvioletred,c71585,midnightblue,191970,mintcream,f5fffa,mistyrose,ffe4e1,moccasin,ffe4b5,navajowhite,ffdead,navy,"
+"000080,oldlace,fdf5e6,olive,808000,olivedrab,6b8e23,orange,ffa500,orangered,ff4500,orchid,da70d6,palegoldenrod,eee8aa,palegreen,98fb98,paleturquoise,"
+"afeeee,palevioletred,d87093,papayawhip,ffefd5,peachpuff,ffdab9,peru,cd853f,pink,ffc0cb,plum,dda0dd,powderblue,b0e0e6,purple,800080,red,ff0000,rosybrown,"
+"bc8f8f,royalblue,4169e1,saddlebrown,8b4513,salmon,fa8072,sandybrown,f4a460,seagreen,2e8b57,seashell,fff5ee,sienna,a0522d,silver,c0c0c0,skyblue,87ceeb,"
+"slateblue,6a5acd,slategray,708090,snow,fffafa,springgreen,00ff7f,steelblue,4682b4,tan,d2b48c,teal,008080,thistle,d8bfd8,tomato,ff6347,turquoise,40e0d0,violet,"
+"ee82ee,wheat,f5deb3,white,ffffff,whitesmoke,f5f5f5,yellow,ffff00,yellowgreen,9acd32").split(",")
    colorToRgba.namedColors={}
    for(var i=0;i<nc.length;i+=2){
     colorToRgba.namedColors[nc[i]]="#"+nc[i+1]
    }
  }
}

function colorToRgb(x){
 // don't include rgba or hsla
 if(x.indexOf("rgba")==0 || x.indexOf("hsla")==0)return null
 var rgba=colorToRgba(x);
 if(!rgba||rgba[3]==0)return null // transparent
 return [rgba[0],rgba[1],rgba[2],255]
}

// Converts a color to a string.
// 'x' is a 3- or 4-item array containing the intensity of red,
// green, and blue (each from 0-255), with optional alpha (0-255)
function rgbToColor(x){
 // we should include the spaces
 if((x.length>3 && (x[3]==255 || x[3]===null)) || x.length==3){
  return "rgb("+Math.round(x[0])+", "+Math.round(x[1])+", "+Math.round(x[2])+")"
 } else {
  var prec=Math.round((x[3]/255.0) * Math.pow(10, 2)) / Math.pow(10, 2)
  return "rgba("+Math.round(x[0])+", "+Math.round(x[1])+", "+Math.round(x[2])+", "+prec+")" 
 }
}

function rgbToColorDisplay(rgb){
 if(rgb.length==3 || (rgb.length>3 && (rgb[3]===null || rgb[3]==255))){
  return rgbToColorHtml(rgb)
 } else {
  return rgbToColor(rgb).replace(/\s+/g,"")
 }
}
function rgbToColorHtml(r,g,b){
 if(!rgbToColorHtml.table){
  rgbToColorHtml.table=[]
  for(var i=0;i<256;i++){
   var y=i.toString(16).toLowerCase()
   rgbToColorHtml.table[i]=(y.length==1) ? "0"+y : y
  }
 }
 var c;
 var tbl=rgbToColorHtml.table;
 if(r!=null && g==null && b==null){
   return "#"+tbl[((c=Math.round(r[0]))<0 ? 0 : (c>255 ? 255 : c))]
        +tbl[((c=Math.round(r[1]))<0 ? 0 : (c>255 ? 255 : c))]
        +tbl[((c=Math.round(r[2]))<0 ? 0 : (c>255 ? 255 : c))]
 } else {
   return "#"+tbl[((c=Math.round(r))<0 ? 0 : (c>255 ? 255 : c))]
        +tbl[((c=Math.round(g))<0 ? 0 : (c>255 ? 255 : c))]
        +tbl[((c=Math.round(b))<0 ? 0 : (c>255 ? 255 : c))]
 }
}

function isRgbDark(rgb){
 return((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000<=127.5
}
