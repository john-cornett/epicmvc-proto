/* Copyright 2007-2017 by James Shelby, shelby (at:) dtsol.com; All rights reserved. */
var m=function e(t,n){var r="[object Object]",i="[object Array]",l="[object String]",a="function";var o={}.toString;var s=/(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g,f=/\[(.+?)(?:=("|'|)(.*?)\2)?\]/;var d=/^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;var c=function(){};var u,h,v,g;function m(e){u=e.document;h=e.location;g=e.cancelAnimationFrame||e.clearTimeout;v=e.requestAnimationFrame||e.setTimeout}m(t);function p(){var e=[].slice.call(arguments);var t=e[1]!=null&&o.call(e[1])===r&&!("tag"in e[1]||"view"in e[1])&&!("subtree"in e[1]);var n=t?e[1]:{};var a="class"in n?"class":"className";var d={tag:"div",attrs:{}};var c,u=[];if(o.call(e[0])!=l)throw new Error("selector in m(selector, attrs, children) should be a string");while(c=s.exec(e[0])){if(c[1]===""&&c[2])d.tag=c[2];else if(c[1]==="#")d.attrs.id=c[2];else if(c[1]===".")u.push(c[2]);else if(c[3][0]==="["){var h=f.exec(c[3]);d.attrs[h[1]]=h[3]||(h[2]?"":true)}}var v=t?e.slice(2):e.slice(1);if(v.length===1&&o.call(v[0])===i){d.children=v[0]}else{d.children=v}for(var g in n){if(n.hasOwnProperty(g)){if(g===a&&n[g]!=null&&n[g]!==""){u.push(n[g]);d.attrs[g]=""}else d.attrs[g]=n[g]}}if(u.length>0)d.attrs[a]=u.join(" ");return d}function y(e,t,s,f,h,v,g,m,C,E,k){try{if(h==null||h.toString()==null)h=""}catch(e){h=""}if(h.subtree==="retain")return v;var A=o.call(v),O=o.call(h);if(v==null||A!==O){if(v!=null){if(s&&s.nodes){var M=m-f;var T=M+(O===i?h:v.nodes).length;N(s.nodes.slice(M,T),s.slice(M,T))}else if(v.nodes)N(v.nodes,v)}v=new h.constructor;if(v.tag)v={};v.nodes=[]}if(O===i){for(var j=0,B=h.length;j<B;j++){if(o.call(h[j])===i){h=h.concat.apply([],h);j--;B=h.length}}var S=[],$=v.length===h.length,L=0;var R=1,D=2,H=3;var I={},_=false;for(var j=0;j<v.length;j++){if(v[j]&&v[j].attrs&&v[j].attrs.key!=null){_=true;I[v[j].attrs.key]={action:R,index:j}}}var F=0;for(var j=0,B=h.length;j<B;j++){if(h[j]&&h[j].attrs&&h[j].attrs.key!=null){for(var G=0,B=h.length;G<B;G++){if(h[G]&&h[G].attrs&&h[G].attrs.key==null)h[G].attrs.key="__mithril__"+F++}break}}if(_){var U=false;if(h.length!=v.length)U=true;else for(var j=0,q,J;q=v[j],J=h[j];j++){if(q.attrs&&J.attrs&&q.attrs.key!=J.attrs.key){U=true;break}}if(U){for(var j=0,B=h.length;j<B;j++){if(h[j]&&h[j].attrs){if(h[j].attrs.key!=null){var V=h[j].attrs.key;if(!I[V])I[V]={action:D,index:j};else I[V]={action:H,index:j,from:I[V].index,element:v.nodes[I[V].index]||u.createElement("div")}}}}var W=[];for(var Y in I)W.push(I[Y]);var z=W.sort(w);var Q=new Array(v.length);Q.nodes=v.nodes.slice();for(var j=0,X;X=z[j];j++){if(X.action===R){N(v[X.index].nodes,v[X.index]);Q.splice(X.index,1)}if(X.action===D){var Z=u.createElement("div");Z.key=h[X.index].attrs.key;e.insertBefore(Z,e.childNodes[X.index]||null);Q.splice(X.index,0,{attrs:{key:h[X.index].attrs.key},nodes:[Z]});Q.nodes[X.index]=Z}if(X.action===H){if(e.childNodes[X.index]!==X.element&&X.element!==null){e.insertBefore(X.element,e.childNodes[X.index]||null)}Q[X.index]=v[X.from];Q.nodes[X.index]=X.element}}v=Q}}for(var j=0,ee=0,B=h.length;j<B;j++){var te=y(e,t,v,m,h[j],v[ee],g,m+L||L,C,E,k);if(te===n)continue;if(!te.nodes.intact)$=false;if(te.$trusted){L+=(te.match(/<[^\/]|\>\s*[^<]/g)||[0]).length}else L+=o.call(te)===i?te.length:1;v[ee++]=te}if(!$){for(var j=0,B=h.length;j<B;j++){if(v[j]!=null)S.push.apply(S,v[j].nodes)}for(var j=0,ne;ne=v.nodes[j];j++){if(ne.parentNode!=null&&S.indexOf(ne)<0)N([ne],[v[j]])}if(h.length<v.length)v.length=h.length;v.nodes=S}}else if(h!=null&&O===r){var re=[],ie=[];while(h.view){var le=h.view.$original||h.view;var ae=p.redraw.strategy()=="diff"&&v.views?v.views.indexOf(le):-1;var oe=ae>-1?v.controllers[ae]:new(h.controller||c);var V=h&&h.attrs&&h.attrs.key;h=P==0||v&&v.controllers&&v.controllers.indexOf(oe)>-1?h.view(oe):{tag:"placeholder"};if(h.subtree==="retain")return v;if(V){if(!h.attrs)h.attrs={};h.attrs.key=V}if(oe.onunload)K.push({controller:oe,handler:oe.onunload});re.push(le);ie.push(oe)}if(!h.tag&&ie.length)throw new Error("Component template must return a virtual element, not an array, string, etc.");if(!h.attrs)h.attrs={};if(!v.attrs)v.attrs={};var se=Object.keys(h.attrs);var fe=se.length>("key"in h.attrs?1:0);if(h.tag!=v.tag||se.sort().join()!=Object.keys(v.attrs).sort().join()||h.attrs.id!=v.attrs.id||h.attrs.key!=v.attrs.key||p.redraw.strategy()=="all"&&(!v.configContext||v.configContext.retain!==true)||p.redraw.strategy()=="diff"&&v.configContext&&v.configContext.retain===false){if(v.nodes.length)N(v.nodes);if(v.configContext&&typeof v.configContext.onunload===a)v.configContext.onunload();if(v.controllers){for(var j=0,oe;oe=v.controllers[j];j++){if(typeof oe.onunload===a)oe.onunload({preventDefault:c})}}}if(o.call(h.tag)!=l)return;var ne,de=v.nodes.length===0;if(h.attrs.xmlns)E=h.attrs.xmlns;else if(h.tag==="svg")E="http://www.w3.org/2000/svg";else if(h.tag==="math")E="http://www.w3.org/1998/Math/MathML";if(de){if(h.attrs.is)ne=E===n?u.createElement(h.tag,h.attrs.is):u.createElementNS(E,h.tag,h.attrs.is);else ne=E===n?u.createElement(h.tag):u.createElementNS(E,h.tag);v={tag:h.tag,attrs:fe?x(ne,h.tag,h.attrs,{},E):h.attrs,children:h.children!=null&&h.children.length>0?y(ne,h.tag,n,n,h.children,v.children,true,0,h.attrs.contenteditable?ne:C,E,k):h.children,nodes:[ne]};if(ie.length){v.views=re;v.controllers=ie;for(var j=0,oe;oe=ie[j];j++){if(oe.onunload&&oe.onunload.$old)oe.onunload=oe.onunload.$old;if(P&&oe.onunload){var ce=oe.onunload;oe.onunload=c;oe.onunload.$old=ce}}}if(v.children&&!v.children.nodes)v.children.nodes=[];if(h.tag==="select"&&"value"in h.attrs)x(ne,h.tag,{value:h.attrs.value},{},E);e.insertBefore(ne,e.childNodes[m]||null)}else{ne=v.nodes[0];if(fe)x(ne,h.tag,h.attrs,v.attrs,E);v.children=y(ne,h.tag,n,n,h.children,v.children,false,0,h.attrs.contenteditable?ne:C,E,k);v.nodes.intact=true;if(ie.length){v.views=re;v.controllers=ie}if(g===true&&ne!=null)e.insertBefore(ne,e.childNodes[m]||null)}if(typeof h.attrs["config"]===a){var ue=v.configContext=v.configContext||{};var he=function(e,t){return function(){return e.attrs["config"].apply(e,t)}};k.push(he(h,[ne,!de,ue,v]))}}else if(typeof h!=a){var S;if(v.nodes.length===0){if(h.$trusted){S=b(e,m,h)}else{S=[u.createTextNode(h)];if(!e.nodeName.match(d))e.insertBefore(S[0],e.childNodes[m]||null)}v="string number boolean".indexOf(typeof h)>-1?new h.constructor(h):h;v.nodes=S}else if(v.valueOf()!==h.valueOf()||g===true){S=v.nodes;if(!C||C!==u.activeElement){if(h.$trusted){N(S,v);S=b(e,m,h)}else{if(t==="textarea")e.value=h;else if(C)C.innerHTML=h;else{if(S[0].nodeType===1||S.length>1){N(v.nodes,v);S=[u.createTextNode(h)]}e.insertBefore(S[0],e.childNodes[m]||null);S[0].nodeValue=h}}}v=new h.constructor(h);v.nodes=S}else v.nodes.intact=true}return v}function w(e,t){return e.action-t.action||e.index-t.index}function x(e,t,n,i,l){for(var s in n){var f=n[s];var d=i[s];if(!(s in i)||d!==f){i[s]=f;try{if(s==="config"||s=="key")continue;else if(typeof f===a&&s.indexOf("on")===0){e[s]=E(f,e)}else if(s==="style"&&f!=null&&o.call(f)===r){for(var c in f){if(d==null||d[c]!==f[c])e.style[c]=f[c]}for(var c in d){if(!(c in f))e.style[c]=""}}else if(l!=null){if(s==="href")e.setAttributeNS("http://www.w3.org/1999/xlink","href",f);else if(s==="className")e.setAttribute("class",f);else e.setAttribute(s,f)}else if(s in e&&!(s==="list"||s==="style"||s==="form"||s==="type"||s==="width"||s==="height")){if(t!=="input"||e[s]!==f)e[s]=f}else e.setAttribute(s,f)}catch(e){if(e.message.indexOf("Invalid argument")<0)throw e}}else if(s==="value"&&t==="input"&&e.value!=f){e.value=f}}return i}function N(e,t){for(var n=e.length-1;n>-1;n--){if(e[n]&&e[n].parentNode){try{e[n].parentNode.removeChild(e[n])}catch(e){}t=[].concat(t);if(t[n])C(t[n])}}if(e.length!=0)e.length=0}function C(e){if(e.configContext&&typeof e.configContext.onunload===a){e.configContext.onunload();e.configContext.onunload=null}if(e.controllers){for(var t=0,n;n=e.controllers[t];t++){if(typeof n.onunload===a)n.onunload({preventDefault:c})}}if(e.children){if(o.call(e.children)===i){for(var t=0,r;r=e.children[t];t++)C(r)}else if(e.children.tag)C(e.children)}}function b(e,t,n){var r=e.childNodes[t];if(r){var i=r.nodeType!=1;var l=u.createElement("span");if(i){e.insertBefore(l,r||null);l.insertAdjacentHTML("beforebegin",n);e.removeChild(l)}else r.insertAdjacentHTML("beforebegin",n)}else e.insertAdjacentHTML("beforeend",n);var a=[];while(e.childNodes[t]!==r){a.push(e.childNodes[t]);t++}return a}function E(e,t){return function(n){n=n||event;p.redraw.strategy("diff");p.startComputation();try{return e.call(t,n)}finally{F()}}}var k;var A={appendChild:function(e){if(k===n)k=u.createElement("html");if(u.documentElement&&u.documentElement!==e){u.replaceChild(e,u.documentElement)}else u.appendChild(e);this.childNodes=u.childNodes},insertBefore:function(e){this.appendChild(e)},childNodes:[]};var O=[],M={};p.render=function(e,t,r){var i=[];if(!e)throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");var l=T(e);var a=e===u;var o=a||e===u.documentElement?A:e;if(a&&t.tag!="html")t={tag:"html",attrs:{},children:t};if(M[l]===n)N(o.childNodes);if(r===true)G(e);M[l]=y(o,null,n,n,t,M[l],false,0,null,n,i);for(var s=0,f=i.length;s<f;s++)i[s]()};p.trust=function(e){e=new String(e);e.$trusted=true;return e};function T(e){var t=O.indexOf(e);return t<0?O.push(e)-1:t}function j(e){var t=function(){if(arguments.length)e=arguments[0];return e};t.toJSON=function(){return e};return t}p.prop=j;var B=[],S=[],$=[],L=null,R=0,D=null,H=null,I=false,_,K=[];p.redraw=function(e){};p.redraw.strategy=p.prop();var P=0;p.startComputation=function(){P++};p.endComputation=function(){P=Math.max(P-1,0);if(P===0)p.redraw()};var F=function(){if(p.redraw.strategy()=="none"){P--;p.redraw.strategy("diff")}else p.endComputation()};function G(e){var t=T(e);N(e.childNodes,M[t]);M[t]=n}return p}(typeof window!="undefined"?window:{});if(typeof module!="undefined"&&module!==null&&module.exports)module.exports=m;else if(typeof define==="function"&&define.amd)define(function(){return m});

/*EpicCore*/