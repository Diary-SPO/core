var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,i=(t,n,r)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r,s=(e,t)=>{for(var n in t||(t={}))o.call(t,n)&&i(e,n,t[n]);if(r)for(var n of r(t))a.call(t,n)&&i(e,n,t[n]);return e},l=(e,r)=>t(e,n(r)),u=(e,t)=>{var n={};for(var i in e)o.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&r)for(var i of r(e))t.indexOf(i)<0&&a.call(e,i)&&(n[i]=e[i]);return n};import{m as c,v as h,y as f,i as m,s as d,af as _,l as B,n as C,ag as D,I as p,ah as w,c as g,R as F,q as A,ai as v,ac as E,aj as b,a8 as y,F as x,ak as I,z as k,h as S,O as N,aa as R,e as L,p as P,u as j,G as O,B as z,P as M,al as T}from"./index-XyJYIhAT.js";import{I as H}from"./chevron_24-u9G6Q-o1.js";import{P as U}from"./PanelHeaderWithBack-Mte7KJTI.js";import{a as Y}from"./colors-rNCG9YyA.js";import{l as q,I as J,m as K,h as V}from"./makeRequest-t21nFAea.js";import{c as $,g as G}from"./_commonjsHelpers-uzQt2zA1.js";import{u as W}from"./useSnackbar-Q4lCaM24.js";var Q=c("Icon24Dismiss","dismiss_24","0 0 24 24",'<symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="dismiss_24"><g fill="currentColor"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12" opacity=".12" /><path d="M16.736 7.264a.9.9 0 0 1 0 1.272L13.273 12l3.463 3.464a.9.9 0 0 1 .081 1.18l-.08.092a.9.9 0 0 1-1.273 0L12 13.273l-3.464 3.463a.9.9 0 1 1-1.272-1.272L10.727 12 7.264 8.536a.9.9 0 0 1-.08-1.18l.08-.092a.9.9 0 0 1 1.272 0L12 10.727l3.464-3.463a.9.9 0 0 1 1.272 0" /></g></symbol>',24,24,!1,void 0),X=c("Icon24DismissDark","dismiss_dark_24","0 0 24 24",'<symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="dismiss_dark_24"><path fill="#000" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12" opacity=".24" /><path fill="#fff" d="M16.736 7.264a.9.9 0 0 1 0 1.272L13.273 12l3.463 3.464a.9.9 0 0 1 .081 1.18l-.08.092a.9.9 0 0 1-1.273 0L12 13.273l-3.464 3.463a.9.9 0 1 1-1.272-1.272L10.727 12 7.264 8.536a.9.9 0 0 1-.08-1.18l.08-.092a.9.9 0 0 1 1.272 0L12 10.727l3.464-3.463a.9.9 0 0 1 1.272 0" /></symbol>',24,24,!1,void 0);const Z="_Banner_14uw3_1",ee="_Banner__in_14uw3_6",te="_Banner__before_14uw3_32",ne="_Banner__content_14uw3_39",re="_Banner__subheader_14uw3_49",oe="_Banner__text_14uw3_50",ae="_Banner__bg_14uw3_54",ie="_Banner__aside_14uw3_69",se="_Banner__dismiss_14uw3_79",le="_Banner__actions_14uw3_92",ue="_Banner--mode-image_14uw3_107",ce="_Banner--inverted_14uw3_111",he="_Banner__expand_14uw3_112",fe="_Banner--size-m_14uw3_126",me="_Banner--ios_14uw3_136",de=e=>{var t=e,{mode:n="tint",imageTheme:r="dark",size:o="s",before:a,asideMode:i,header:c,subheader:b,text:y,children:x,background:I,actions:k,onDismiss:S,dismissLabel:N="Скрыть"}=t,R=u(t,["mode","imageTheme","size","before","asideMode","header","subheader","text","children","background","actions","onDismiss","dismissLabel"]);const L=h(),P="m"===o?A:v,j="m"===o?d:E,O="image"===n?X:Q,z=f(B,null,"image"===n&&I&&f("div",{"aria-hidden":!0,className:ae},I),a&&f("div",{className:te},a),f("div",{className:ne},m(c)&&f(P,{Component:"p",weight:"2",level:"m"===o?"2":"1"},c),m(b)&&f(j,{Component:"p",className:re},b),m(y)&&f(d,{Component:"p",className:oe},y),m(k)&&_.count(k)>0&&f("div",{className:le},k)));return f(F,l(s({Component:"section"},R),{baseClassName:g(Z,"ios"===L&&me,"image"===n&&ue,"m"===o&&fe,"image"===n&&"dark"===r&&ce)}),"expand"===i?f(C,{className:ee,activeMode:"ios"===L?"opacity":"background",onClick:D},z,f("div",{className:ie},f(H,{className:he}))):f("div",{className:ee},z,"dismiss"===i&&f("div",{className:ie},f(p,{label:N,className:se,onClick:S,hoverMode:"opacity",hasActive:!1},f("ios"===L?O:w,null)))))},_e="_FormItem_uewrx_1",Be="_FormItem--withPadding_uewrx_5",Ce="_FormItem--removable_uewrx_10",De="_FormItem__removable_uewrx_14",pe="_FormItem__top_uewrx_24",we="_FormItem__bottom_uewrx_32",ge="_FormItem--status-error_uewrx_38",Fe="_FormItem--status-valid_uewrx_42",Ae="_FormItem--sizeY-compact_uewrx_51",ve="_FormItem--withTop_uewrx_128",Ee={none:g("_FormItem--sizeY-none_uewrx_62","vkuiInternalFormItem--sizeY-none"),compact:g(Ae,"vkuiInternalFormItem--sizeY-compact")},be={error:g(ge,"vkuiInternalFormItem--status-error"),valid:g(Fe,"vkuiInternalFormItem--status-valid")},ye=e=>{var t=e,{children:n,top:r,topComponent:o,bottom:a,status:i="default",removable:c,onRemove:h=D,removePlaceholder:d="Удалить",getRootRef:_,htmlFor:C,bottomId:p,noPadding:w}=t,A=u(t,["children","top","topComponent","bottom","status","removable","onRemove","removePlaceholder","getRootRef","htmlFor","bottomId","noPadding"]);const v=b(_),{sizeY:k="none"}=y(),S=o||C&&"label"||"span",N=f(B,null,m(r)&&f(E,{className:pe,Component:S,htmlFor:C},r),n,m(a)&&f(x,{className:we,id:p,role:"error"===i?"alert":void 0},a));return f(F,l(s({},A),{getRootRef:v,baseClassName:g(_e,!w&&Be,"vkuiInternalFormItem","default"!==i&&be[i],"regular"!==k&&Ee[k],m(r)&&g(ve,"vkuiInternalFormItem--withTop"),c&&g(Ce,"vkuiInternalFormItem--removable"))}),c?f(I,{align:"start",onRemove:e=>{(null==v?void 0:v.current)&&h(e,v.current)},removePlaceholder:d,indent:"indent"===c},f("div",{className:g(De,"vkuiInternalFormItem__removable")},N)):N)},xe=(e,t)=>e.contains(t.activeElement);const Ie="_FormField_3gt7e_1",ke="_FormField__before_3gt7e_30",Se="_FormField__after_3gt7e_31",Ne="_FormField__border_3gt7e_66",Re="_FormField--mode-default_3gt7e_80",Le="_FormField--disabled_3gt7e_119",Pe="_FormField--hover_3gt7e_125",je="_FormField--focus-visible_3gt7e_221",Oe={none:"_FormField--sizeY-none_3gt7e_18",compact:"_FormField--sizeY-compact_3gt7e_13"},ze={error:"_FormField--status-error_3gt7e_97",valid:"_FormField--status-valid_3gt7e_112"},Me=e=>{var t=e,{Component:n="span",status:r="default",children:o,getRootRef:a,before:i,after:c,disabled:h,mode:m="default",className:d}=t,_=u(t,["Component","status","children","getRootRef","before","after","disabled","mode","className"]);const B=b(a),{sizeY:C="none"}=y(),[D,p]=S(!1),w=function(e){const{document:t}=k(),[n,r]=S((()=>!(!e.current||!t)&&xe(e.current,t)));return N((function(){if(!t)return;const n=()=>{e.current&&r(xe(e.current,t))};return n(),t.addEventListener("focus",n,{capture:!0}),t.addEventListener("blur",n,{capture:!0}),()=>{t.removeEventListener("focus",n,{capture:!0}),t.removeEventListener("blur",n,{capture:!0})}}),[]),n}(B),F=R({focusVisible:w,mode:je});return f(n,l(s({},_),{ref:B,onMouseEnter:e=>{e.stopPropagation(),p(!0)},onMouseLeave:e=>{e.stopPropagation(),p(!1)},className:g(Ie,"default"===m&&Re,"default"!==r&&ze[r],"regular"!==C&&Oe[C],h&&Le,!h&&D&&Pe,F,d)}),i&&f("span",{className:ke},i),o,c&&f("span",{className:g(Se,"vkuiInternalFormField__after")},c),f("span",{"aria-hidden":!0,className:Ne}))},Te="_FormStatus--mode-error_18np8_1",He=e=>{var t=e,{mode:n,children:r,className:o}=t,a=u(t,["mode","children","className"]);return f(de,l(s({},a),{subheader:r,className:g("vkuiInternalFormStatus","error"===n&&g(Te,"vkuiInternalFormStatus--mode-error"),o)}))},Ue="_Input_m46kk_1",Ye="_Input--align-center_m46kk_7",qe="_Input__el_m46kk_7",Je="_Input--align-right_m46kk_11",Ke="_Input--hasBefore_m46kk_59",Ve="_Input--hasAfter_m46kk_64",$e={none:"_Input--sizeY-none_m46kk_54",compact:"_Input--sizeY-compact_m46kk_49"},Ge=e=>{var t=e,{type:n="text",align:r="left",getRef:o,className:a,getRootRef:i,style:c,before:h,after:m,status:_,mode:B}=t,C=u(t,["type","align","getRef","className","getRootRef","style","before","after","status","mode"]);const{sizeY:D="none"}=y();return f(Me,{style:c,className:g(Ue,"right"===r&&Je,"center"===r&&Ye,"regular"!==D&&$e[D],h&&Ke,m&&Ve,a),getRootRef:i,before:h,after:m,disabled:C.disabled,mode:B,status:_},f(d,l(s({},C),{Component:"input",normalize:!1,type:n,className:qe,getRootRef:o})))};var We,Qe,Xe=c("Icon28DoorArrowLeftOutline","door_arrow_left_outline_28","0 0 28 28",'<symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" id="door_arrow_left_outline_28"><path fill="currentColor" fill-rule="evenodd" d="M17.643 25H15a1 1 0 1 1 0-2h2.6c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-7.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C19.529 5.001 18.736 5 17.6 5H15a1 1 0 1 1 0-2h2.643c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961C25 8.4 25 9.273 25 10.357v7.286c0 1.084 0 1.958-.058 2.666-.06.728-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C19.6 25 18.727 25 17.643 25M3 14a1 1 0 0 1 1-1h9.586l-2.293-2.293a1 1 0 0 1 1.414-1.414l4 4 .007.007a1 1 0 0 1 .286.697v.006c0 .272-.11.518-.286.698l-.008.007-3.999 4a1 1 0 0 1-1.414-1.415L13.586 15H4a1 1 0 0 1-1-1" clip-rule="evenodd" /></symbol>',28,28,!1,void 0),Ze={exports:{}};We=Ze,Qe=Ze.exports,function(){var e,t,n;function r(e){var t,n,r,o="",a=-1;if(e&&e.length)for(r=e.length;(a+=1)<r;)t=e.charCodeAt(a),n=a+1<r?e.charCodeAt(a+1):0,55296<=t&&t<=56319&&56320<=n&&n<=57343&&(t=65536+((1023&t)<<10)+(1023&n),a+=1),t<=127?o+=String.fromCharCode(t):t<=2047?o+=String.fromCharCode(192|t>>>6&31,128|63&t):t<=65535?o+=String.fromCharCode(224|t>>>12&15,128|t>>>6&63,128|63&t):t<=2097151&&(o+=String.fromCharCode(240|t>>>18&7,128|t>>>12&63,128|t>>>6&63,128|63&t));return o}function o(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function a(e,t){return e<<t|e>>>32-t}function i(e,t){for(var n,r=t?"0123456789ABCDEF":"0123456789abcdef",o="",a=0,i=e.length;a<i;a+=1)n=e.charCodeAt(a),o+=r.charAt(n>>>4&15)+r.charAt(15&n);return o}function s(e){var t,n=32*e.length,r="";for(t=0;t<n;t+=8)r+=String.fromCharCode(e[t>>5]>>>24-t%32&255);return r}function l(e){var t,n=32*e.length,r="";for(t=0;t<n;t+=8)r+=String.fromCharCode(e[t>>5]>>>t%32&255);return r}function u(e){var t,n=8*e.length,r=Array(e.length>>2),o=r.length;for(t=0;t<o;t+=1)r[t]=0;for(t=0;t<n;t+=8)r[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return r}function c(e){var t,n=8*e.length,r=Array(e.length>>2),o=r.length;for(t=0;t<o;t+=1)r[t]=0;for(t=0;t<n;t+=8)r[t>>5]|=(255&e.charCodeAt(t/8))<<24-t%32;return r}function h(e,t){var n,r,o,a,i,s,l,u,c=t.length,h=Array();for(a=(s=Array(Math.ceil(e.length/2))).length,n=0;n<a;n+=1)s[n]=e.charCodeAt(2*n)<<8|e.charCodeAt(2*n+1);for(;s.length>0;){for(i=Array(),o=0,n=0;n<s.length;n+=1)o=(o<<16)+s[n],o-=(r=Math.floor(o/c))*c,(i.length>0||r>0)&&(i[i.length]=r);h[h.length]=o,s=i}for(l="",n=h.length-1;n>=0;n--)l+=t.charAt(h[n]);for(u=Math.ceil(8*e.length/(Math.log(t.length)/Math.log(2))),n=l.length;n<u;n+=1)l=t[0]+l;return l}function f(e,t){var n,r,o,a="",i=e.length;for(t=t||"=",n=0;n<i;n+=3)for(o=e.charCodeAt(n)<<16|(n+1<i?e.charCodeAt(n+1)<<8:0)|(n+2<i?e.charCodeAt(n+2):0),r=0;r<4;r+=1)8*n+6*r>8*e.length?a+=t:a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(o>>>6*(3-r)&63);return a}e={VERSION:"1.0.6",Base64:function(){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="=",n=!0;this.encode=function(o){var a,i,s,l="",u=o.length;for(t=t||"=",o=n?r(o):o,a=0;a<u;a+=3)for(s=o.charCodeAt(a)<<16|(a+1<u?o.charCodeAt(a+1)<<8:0)|(a+2<u?o.charCodeAt(a+2):0),i=0;i<4;i+=1)l+=8*a+6*i>8*u?t:e.charAt(s>>>6*(3-i)&63);return l},this.decode=function(r){var o,a,i,s,l,u,c,h,f="",m=[];if(!r)return r;o=h=0,r=r.replace(new RegExp("\\"+t,"gi"),"");do{a=(c=e.indexOf(r.charAt(o+=1))<<18|e.indexOf(r.charAt(o+=1))<<12|(l=e.indexOf(r.charAt(o+=1)))<<6|(u=e.indexOf(r.charAt(o+=1))))>>16&255,i=c>>8&255,s=255&c,m[h+=1]=64===l?String.fromCharCode(a):64===u?String.fromCharCode(a,i):String.fromCharCode(a,i,s)}while(o<r.length);return f=m.join(""),f=n?function(e){var t,n,r,o,a,i,s=[];if(t=n=r=o=a=0,e&&e.length)for(i=e.length,e+="";t<i;)n+=1,(r=e.charCodeAt(t))<128?(s[n]=String.fromCharCode(r),t+=1):r>191&&r<224?(o=e.charCodeAt(t+1),s[n]=String.fromCharCode((31&r)<<6|63&o),t+=2):(o=e.charCodeAt(t+1),a=e.charCodeAt(t+2),s[n]=String.fromCharCode((15&r)<<12|(63&o)<<6|63&a),t+=3);return s.join("")}(f):f,f},this.setPad=function(e){return t=e||t,this},this.setTab=function(t){return e=t||e,this},this.setUTF8=function(e){return"boolean"==typeof e&&(n=e),this}},CRC32:function(e){var t,n,o,a=0,i=0;for(e=r(e),t=["00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 ","79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 ","84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F ","63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD ","A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC ","51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 ","B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 ","06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 ","E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 ","12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 ","D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 ","33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 ","CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 ","9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E ","7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D ","806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 ","60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA ","AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 ","5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 ","B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 ","05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 ","F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA ","11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 ","D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F ","30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E ","C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D"].join(""),a^=-1,n=0,o=e.length;n<o;n+=1)i=255&(a^e.charCodeAt(n)),a=a>>>8^"0x"+t.substr(9*i,8);return(-1^a)>>>0},MD5:function(e){var t=!(!e||"boolean"!=typeof e.uppercase)&&e.uppercase,n=e&&"string"==typeof e.pad?e.pad:"=",s=!e||"boolean"!=typeof e.utf8||e.utf8;function c(e){return l(d(u(e=s?r(e):e),8*e.length))}function m(e,t){var n,o,a,i,c;for(e=s?r(e):e,t=s?r(t):t,(n=u(e)).length>16&&(n=d(n,8*e.length)),o=Array(16),a=Array(16),c=0;c<16;c+=1)o[c]=909522486^n[c],a[c]=1549556828^n[c];return i=d(o.concat(u(t)),512+8*t.length),l(d(a.concat(i),640))}function d(e,t){var n,r,a,i,s,l=1732584193,u=-271733879,c=-1732584194,h=271733878;for(e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t,n=0;n<e.length;n+=16)r=l,a=u,i=c,s=h,l=B(l,u,c,h,e[n+0],7,-680876936),h=B(h,l,u,c,e[n+1],12,-389564586),c=B(c,h,l,u,e[n+2],17,606105819),u=B(u,c,h,l,e[n+3],22,-1044525330),l=B(l,u,c,h,e[n+4],7,-176418897),h=B(h,l,u,c,e[n+5],12,1200080426),c=B(c,h,l,u,e[n+6],17,-1473231341),u=B(u,c,h,l,e[n+7],22,-45705983),l=B(l,u,c,h,e[n+8],7,1770035416),h=B(h,l,u,c,e[n+9],12,-1958414417),c=B(c,h,l,u,e[n+10],17,-42063),u=B(u,c,h,l,e[n+11],22,-1990404162),l=B(l,u,c,h,e[n+12],7,1804603682),h=B(h,l,u,c,e[n+13],12,-40341101),c=B(c,h,l,u,e[n+14],17,-1502002290),l=C(l,u=B(u,c,h,l,e[n+15],22,1236535329),c,h,e[n+1],5,-165796510),h=C(h,l,u,c,e[n+6],9,-1069501632),c=C(c,h,l,u,e[n+11],14,643717713),u=C(u,c,h,l,e[n+0],20,-373897302),l=C(l,u,c,h,e[n+5],5,-701558691),h=C(h,l,u,c,e[n+10],9,38016083),c=C(c,h,l,u,e[n+15],14,-660478335),u=C(u,c,h,l,e[n+4],20,-405537848),l=C(l,u,c,h,e[n+9],5,568446438),h=C(h,l,u,c,e[n+14],9,-1019803690),c=C(c,h,l,u,e[n+3],14,-187363961),u=C(u,c,h,l,e[n+8],20,1163531501),l=C(l,u,c,h,e[n+13],5,-1444681467),h=C(h,l,u,c,e[n+2],9,-51403784),c=C(c,h,l,u,e[n+7],14,1735328473),l=D(l,u=C(u,c,h,l,e[n+12],20,-1926607734),c,h,e[n+5],4,-378558),h=D(h,l,u,c,e[n+8],11,-2022574463),c=D(c,h,l,u,e[n+11],16,1839030562),u=D(u,c,h,l,e[n+14],23,-35309556),l=D(l,u,c,h,e[n+1],4,-1530992060),h=D(h,l,u,c,e[n+4],11,1272893353),c=D(c,h,l,u,e[n+7],16,-155497632),u=D(u,c,h,l,e[n+10],23,-1094730640),l=D(l,u,c,h,e[n+13],4,681279174),h=D(h,l,u,c,e[n+0],11,-358537222),c=D(c,h,l,u,e[n+3],16,-722521979),u=D(u,c,h,l,e[n+6],23,76029189),l=D(l,u,c,h,e[n+9],4,-640364487),h=D(h,l,u,c,e[n+12],11,-421815835),c=D(c,h,l,u,e[n+15],16,530742520),l=p(l,u=D(u,c,h,l,e[n+2],23,-995338651),c,h,e[n+0],6,-198630844),h=p(h,l,u,c,e[n+7],10,1126891415),c=p(c,h,l,u,e[n+14],15,-1416354905),u=p(u,c,h,l,e[n+5],21,-57434055),l=p(l,u,c,h,e[n+12],6,1700485571),h=p(h,l,u,c,e[n+3],10,-1894986606),c=p(c,h,l,u,e[n+10],15,-1051523),u=p(u,c,h,l,e[n+1],21,-2054922799),l=p(l,u,c,h,e[n+8],6,1873313359),h=p(h,l,u,c,e[n+15],10,-30611744),c=p(c,h,l,u,e[n+6],15,-1560198380),u=p(u,c,h,l,e[n+13],21,1309151649),l=p(l,u,c,h,e[n+4],6,-145523070),h=p(h,l,u,c,e[n+11],10,-1120210379),c=p(c,h,l,u,e[n+2],15,718787259),u=p(u,c,h,l,e[n+9],21,-343485551),l=o(l,r),u=o(u,a),c=o(c,i),h=o(h,s);return Array(l,u,c,h)}function _(e,t,n,r,i,s){return o(a(o(o(t,e),o(r,s)),i),n)}function B(e,t,n,r,o,a,i){return _(t&n|~t&r,e,t,o,a,i)}function C(e,t,n,r,o,a,i){return _(t&r|n&~r,e,t,o,a,i)}function D(e,t,n,r,o,a,i){return _(t^n^r,e,t,o,a,i)}function p(e,t,n,r,o,a,i){return _(n^(t|~r),e,t,o,a,i)}this.hex=function(e){return i(c(e),t)},this.b64=function(e){return f(c(e),n)},this.any=function(e,t){return h(c(e),t)},this.raw=function(e){return c(e)},this.hex_hmac=function(e,n){return i(m(e,n),t)},this.b64_hmac=function(e,t){return f(m(e,t),n)},this.any_hmac=function(e,t,n){return h(m(e,t),n)},this.vm_test=function(){return"900150983cd24fb0d6963f7d28e17f72"===hex("abc").toLowerCase()},this.setUpperCase=function(e){return"boolean"==typeof e&&(t=e),this},this.setPad=function(e){return n=e||n,this},this.setUTF8=function(e){return"boolean"==typeof e&&(s=e),this}},SHA1:function(e){var t=!(!e||"boolean"!=typeof e.uppercase)&&e.uppercase,n=e&&"string"==typeof e.pad?e.pad:"=",l=!e||"boolean"!=typeof e.utf8||e.utf8;function u(e){return s(d(c(e=l?r(e):e),8*e.length))}function m(e,t){var n,o,a,i,u;for(e=l?r(e):e,t=l?r(t):t,(n=c(e)).length>16&&(n=d(n,8*e.length)),o=Array(16),a=Array(16),i=0;i<16;i+=1)o[i]=909522486^n[i],a[i]=1549556828^n[i];return u=d(o.concat(c(t)),512+8*t.length),s(d(a.concat(u),672))}function d(e,t){var n,r,i,s,l,u,c,h,f=Array(80),m=1732584193,d=-271733879,C=-1732584194,D=271733878,p=-1009589776;for(e[t>>5]|=128<<24-t%32,e[15+(t+64>>9<<4)]=t,n=0;n<e.length;n+=16){for(s=m,l=d,u=C,c=D,h=p,r=0;r<80;r+=1)f[r]=r<16?e[n+r]:a(f[r-3]^f[r-8]^f[r-14]^f[r-16],1),i=o(o(a(m,5),_(r,d,C,D)),o(o(p,f[r]),B(r))),p=D,D=C,C=a(d,30),d=m,m=i;m=o(m,s),d=o(d,l),C=o(C,u),D=o(D,c),p=o(p,h)}return Array(m,d,C,D,p)}function _(e,t,n,r){return e<20?t&n|~t&r:e<40?t^n^r:e<60?t&n|t&r|n&r:t^n^r}function B(e){return e<20?1518500249:e<40?1859775393:e<60?-1894007588:-899497514}this.hex=function(e){return i(u(e),t)},this.b64=function(e){return f(u(e),n)},this.any=function(e,t){return h(u(e),t)},this.raw=function(e){return u(e)},this.hex_hmac=function(e,t){return i(m(e,t))},this.b64_hmac=function(e,t){return f(m(e,t),n)},this.any_hmac=function(e,t,n){return h(m(e,t),n)},this.vm_test=function(){return"900150983cd24fb0d6963f7d28e17f72"===hex("abc").toLowerCase()},this.setUpperCase=function(e){return"boolean"==typeof e&&(t=e),this},this.setPad=function(e){return n=e||n,this},this.setUTF8=function(e){return"boolean"==typeof e&&(l=e),this}},SHA256:function(e){e&&"boolean"==typeof e.uppercase&&e.uppercase;var t,n=e&&"string"==typeof e.pad?e.pad:"=",a=!e||"boolean"!=typeof e.utf8||e.utf8;function l(e,t){return s(w(c(e=t?r(e):e),8*e.length))}function u(e,t){e=a?r(e):e,t=a?r(t):t;var n,o=0,i=c(e),l=Array(16),u=Array(16);for(i.length>16&&(i=w(i,8*e.length));o<16;o+=1)l[o]=909522486^i[o],u[o]=1549556828^i[o];return n=w(l.concat(c(t)),512+8*t.length),s(w(u.concat(n),768))}function m(e,t){return e>>>t|e<<32-t}function d(e,t){return e>>>t}function _(e,t,n){return e&t^~e&n}function B(e,t,n){return e&t^e&n^t&n}function C(e){return m(e,2)^m(e,13)^m(e,22)}function D(e){return m(e,6)^m(e,11)^m(e,25)}function p(e){return m(e,7)^m(e,18)^d(e,3)}function w(e,n){var r,a,i,s,l,u,c,h,f,w,g,F,A,v=[1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225],E=new Array(64);for(e[n>>5]|=128<<24-n%32,e[15+(n+64>>9<<4)]=n,f=0;f<e.length;f+=16){for(r=v[0],a=v[1],i=v[2],s=v[3],l=v[4],u=v[5],c=v[6],h=v[7],w=0;w<64;w+=1)E[w]=w<16?e[w+f]:o(o(o(m(A=E[w-2],17)^m(A,19)^d(A,10),E[w-7]),p(E[w-15])),E[w-16]),g=o(o(o(o(h,D(l)),_(l,u,c)),t[w]),E[w]),F=o(C(r),B(r,a,i)),h=c,c=u,u=l,l=o(s,g),s=i,i=a,a=r,r=o(g,F);v[0]=o(r,v[0]),v[1]=o(a,v[1]),v[2]=o(i,v[2]),v[3]=o(s,v[3]),v[4]=o(l,v[4]),v[5]=o(u,v[5]),v[6]=o(c,v[6]),v[7]=o(h,v[7])}return v}this.hex=function(e){return i(l(e,a))},this.b64=function(e){return f(l(e,a),n)},this.any=function(e,t){return h(l(e,a),t)},this.raw=function(e){return l(e,a)},this.hex_hmac=function(e,t){return i(u(e,t))},this.b64_hmac=function(e,t){return f(u(e,t),n)},this.any_hmac=function(e,t,n){return h(u(e,t),n)},this.vm_test=function(){return"900150983cd24fb0d6963f7d28e17f72"===hex("abc").toLowerCase()},this.setUpperCase=function(e){return this},this.setPad=function(e){return n=e||n,this},this.setUTF8=function(e){return"boolean"==typeof e&&(a=e),this},t=[1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998]},SHA512:function(e){e&&"boolean"==typeof e.uppercase&&e.uppercase;var t,n=e&&"string"==typeof e.pad?e.pad:"=",o=!e||"boolean"!=typeof e.utf8||e.utf8;function a(e){return s(u(c(e=o?r(e):e),8*e.length))}function l(e,t){e=o?r(e):e,t=o?r(t):t;var n,a=0,i=c(e),l=Array(32),h=Array(32);for(i.length>32&&(i=u(i,8*e.length));a<32;a+=1)l[a]=909522486^i[a],h[a]=1549556828^i[a];return n=u(l.concat(c(t)),1024+8*t.length),s(u(h.concat(n),1536))}function u(e,n){var r,o,a,i=new Array(80),s=new Array(16),l=[new m(1779033703,-205731576),new m(-1150833019,-2067093701),new m(1013904242,-23791573),new m(-1521486534,1595750129),new m(1359893119,-1377402159),new m(-1694144372,725511199),new m(528734635,-79577749),new m(1541459225,327033209)],u=new m(0,0),c=new m(0,0),h=new m(0,0),f=new m(0,0),g=new m(0,0),F=new m(0,0),A=new m(0,0),v=new m(0,0),E=new m(0,0),b=new m(0,0),y=new m(0,0),x=new m(0,0),I=new m(0,0),k=new m(0,0),S=new m(0,0),N=new m(0,0),R=new m(0,0);for(void 0===t&&(t=[new m(1116352408,-685199838),new m(1899447441,602891725),new m(-1245643825,-330482897),new m(-373957723,-2121671748),new m(961987163,-213338824),new m(1508970993,-1241133031),new m(-1841331548,-1357295717),new m(-1424204075,-630357736),new m(-670586216,-1560083902),new m(310598401,1164996542),new m(607225278,1323610764),new m(1426881987,-704662302),new m(1925078388,-226784913),new m(-2132889090,991336113),new m(-1680079193,633803317),new m(-1046744716,-815192428),new m(-459576895,-1628353838),new m(-272742522,944711139),new m(264347078,-1953704523),new m(604807628,2007800933),new m(770255983,1495990901),new m(1249150122,1856431235),new m(1555081692,-1119749164),new m(1996064986,-2096016459),new m(-1740746414,-295247957),new m(-1473132947,766784016),new m(-1341970488,-1728372417),new m(-1084653625,-1091629340),new m(-958395405,1034457026),new m(-710438585,-1828018395),new m(113926993,-536640913),new m(338241895,168717936),new m(666307205,1188179964),new m(773529912,1546045734),new m(1294757372,1522805485),new m(1396182291,-1651133473),new m(1695183700,-1951439906),new m(1986661051,1014477480),new m(-2117940946,1206759142),new m(-1838011259,344077627),new m(-1564481375,1290863460),new m(-1474664885,-1136513023),new m(-1035236496,-789014639),new m(-949202525,106217008),new m(-778901479,-688958952),new m(-694614492,1432725776),new m(-200395387,1467031594),new m(275423344,851169720),new m(430227734,-1194143544),new m(506948616,1363258195),new m(659060556,-544281703),new m(883997877,-509917016),new m(958139571,-976659869),new m(1322822218,-482243893),new m(1537002063,2003034995),new m(1747873779,-692930397),new m(1955562222,1575990012),new m(2024104815,1125592928),new m(-2067236844,-1578062990),new m(-1933114872,442776044),new m(-1866530822,593698344),new m(-1538233109,-561857047),new m(-1090935817,-1295615723),new m(-965641998,-479046869),new m(-903397682,-366583396),new m(-779700025,566280711),new m(-354779690,-840897762),new m(-176337025,-294727304),new m(116418474,1914138554),new m(174292421,-1563912026),new m(289380356,-1090974290),new m(460393269,320620315),new m(685471733,587496836),new m(852142971,1086792851),new m(1017036298,365543100),new m(1126000580,-1676669620),new m(1288033470,-885112138),new m(1501505948,-60457430),new m(1607167915,987167468),new m(1816402316,1246189591)]),o=0;o<80;o+=1)i[o]=new m(0,0);for(e[n>>5]|=128<<24-(31&n),e[31+(n+128>>10<<5)]=n,a=e.length,o=0;o<a;o+=32){for(d(h,l[0]),d(f,l[1]),d(g,l[2]),d(F,l[3]),d(A,l[4]),d(v,l[5]),d(E,l[6]),d(b,l[7]),r=0;r<16;r+=1)i[r].h=e[o+2*r],i[r].l=e[o+2*r+1];for(r=16;r<80;r+=1)_(S,i[r-2],19),B(N,i[r-2],29),C(R,i[r-2],6),x.l=S.l^N.l^R.l,x.h=S.h^N.h^R.h,_(S,i[r-15],1),_(N,i[r-15],8),C(R,i[r-15],7),y.l=S.l^N.l^R.l,y.h=S.h^N.h^R.h,p(i[r],x,i[r-7],y,i[r-16]);for(r=0;r<80;r+=1)I.l=A.l&v.l^~A.l&E.l,I.h=A.h&v.h^~A.h&E.h,_(S,A,14),_(N,A,18),B(R,A,9),x.l=S.l^N.l^R.l,x.h=S.h^N.h^R.h,_(S,h,28),B(N,h,2),B(R,h,7),y.l=S.l^N.l^R.l,y.h=S.h^N.h^R.h,k.l=h.l&f.l^h.l&g.l^f.l&g.l,k.h=h.h&f.h^h.h&g.h^f.h&g.h,w(u,b,x,I,t[r],i[r]),D(c,y,k),d(b,E),d(E,v),d(v,A),D(A,F,u),d(F,g),d(g,f),d(f,h),D(h,u,c);D(l[0],l[0],h),D(l[1],l[1],f),D(l[2],l[2],g),D(l[3],l[3],F),D(l[4],l[4],A),D(l[5],l[5],v),D(l[6],l[6],E),D(l[7],l[7],b)}for(o=0;o<8;o+=1)s[2*o]=l[o].h,s[2*o+1]=l[o].l;return s}function m(e,t){this.h=e,this.l=t}function d(e,t){e.h=t.h,e.l=t.l}function _(e,t,n){e.l=t.l>>>n|t.h<<32-n,e.h=t.h>>>n|t.l<<32-n}function B(e,t,n){e.l=t.h>>>n|t.l<<32-n,e.h=t.l>>>n|t.h<<32-n}function C(e,t,n){e.l=t.l>>>n|t.h<<32-n,e.h=t.h>>>n}function D(e,t,n){var r=(65535&t.l)+(65535&n.l),o=(t.l>>>16)+(n.l>>>16)+(r>>>16),a=(65535&t.h)+(65535&n.h)+(o>>>16),i=(t.h>>>16)+(n.h>>>16)+(a>>>16);e.l=65535&r|o<<16,e.h=65535&a|i<<16}function p(e,t,n,r,o){var a=(65535&t.l)+(65535&n.l)+(65535&r.l)+(65535&o.l),i=(t.l>>>16)+(n.l>>>16)+(r.l>>>16)+(o.l>>>16)+(a>>>16),s=(65535&t.h)+(65535&n.h)+(65535&r.h)+(65535&o.h)+(i>>>16),l=(t.h>>>16)+(n.h>>>16)+(r.h>>>16)+(o.h>>>16)+(s>>>16);e.l=65535&a|i<<16,e.h=65535&s|l<<16}function w(e,t,n,r,o,a){var i=(65535&t.l)+(65535&n.l)+(65535&r.l)+(65535&o.l)+(65535&a.l),s=(t.l>>>16)+(n.l>>>16)+(r.l>>>16)+(o.l>>>16)+(a.l>>>16)+(i>>>16),l=(65535&t.h)+(65535&n.h)+(65535&r.h)+(65535&o.h)+(65535&a.h)+(s>>>16),u=(t.h>>>16)+(n.h>>>16)+(r.h>>>16)+(o.h>>>16)+(a.h>>>16)+(l>>>16);e.l=65535&i|s<<16,e.h=65535&l|u<<16}this.hex=function(e){return i(a(e))},this.b64=function(e){return f(a(e),n)},this.any=function(e,t){return h(a(e),t)},this.raw=function(e){return a(e)},this.hex_hmac=function(e,t){return i(l(e,t))},this.b64_hmac=function(e,t){return f(l(e,t),n)},this.any_hmac=function(e,t,n){return h(l(e,t),n)},this.vm_test=function(){return"900150983cd24fb0d6963f7d28e17f72"===hex("abc").toLowerCase()},this.setUpperCase=function(e){return this},this.setPad=function(e){return n=e||n,this},this.setUTF8=function(e){return"boolean"==typeof e&&(o=e),this}},RMD160:function(e){e&&"boolean"==typeof e.uppercase&&e.uppercase;var t=e&&"string"==typeof e.pad?e.pa:"=",n=!e||"boolean"!=typeof e.utf8||e.utf8,s=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],l=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],c=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],m=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];function d(e){return B(C(u(e=n?r(e):e),8*e.length))}function _(e,t){e=n?r(e):e,t=n?r(t):t;var o,a,i=u(e),s=Array(16),l=Array(16);for(i.length>16&&(i=C(i,8*e.length)),o=0;o<16;o+=1)s[o]=909522486^i[o],l[o]=1549556828^i[o];return a=C(s.concat(u(t)),512+8*t.length),B(C(l.concat(a),672))}function B(e){var t,n="",r=32*e.length;for(t=0;t<r;t+=8)n+=String.fromCharCode(e[t>>5]>>>t%32&255);return n}function C(e,t){var n,r,i,u,h,f,d,_,B,C,g,F,A,v,E=1732584193,b=4023233417,y=2562383102,x=271733878,I=3285377520;for(e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t,u=e.length,i=0;i<u;i+=16){for(h=C=E,f=g=b,d=F=y,_=A=x,B=v=I,r=0;r<=79;r+=1)n=o(h,D(r,f,d,_)),n=o(n,e[i+s[r]]),n=o(n,p(r)),n=o(a(n,c[r]),B),h=B,B=_,_=a(d,10),d=f,f=n,n=o(C,D(79-r,g,F,A)),n=o(n,e[i+l[r]]),n=o(n,w(r)),n=o(a(n,m[r]),v),C=v,v=A,A=a(F,10),F=g,g=n;n=o(b,o(d,A)),b=o(y,o(_,v)),y=o(x,o(B,C)),x=o(I,o(h,g)),I=o(E,o(f,F)),E=n}return[E,b,y,x,I]}function D(e,t,n,r){return 0<=e&&e<=15?t^n^r:16<=e&&e<=31?t&n|~t&r:32<=e&&e<=47?(t|~n)^r:48<=e&&e<=63?t&r|n&~r:64<=e&&e<=79?t^(n|~r):"rmd160_f: j out of range"}function p(e){return 0<=e&&e<=15?0:16<=e&&e<=31?1518500249:32<=e&&e<=47?1859775393:48<=e&&e<=63?2400959708:64<=e&&e<=79?2840853838:"rmd160_K1: j out of range"}function w(e){return 0<=e&&e<=15?1352829926:16<=e&&e<=31?1548603684:32<=e&&e<=47?1836072691:48<=e&&e<=63?2053994217:64<=e&&e<=79?0:"rmd160_K2: j out of range"}this.hex=function(e){return i(d(e))},this.b64=function(e){return f(d(e),t)},this.any=function(e,t){return h(d(e),t)},this.raw=function(e){return d(e)},this.hex_hmac=function(e,t){return i(_(e,t))},this.b64_hmac=function(e,n){return f(_(e,n),t)},this.any_hmac=function(e,t,n){return h(_(e,t),n)},this.vm_test=function(){return"900150983cd24fb0d6963f7d28e17f72"===hex("abc").toLowerCase()},this.setUpperCase=function(e){return this},this.setPad=function(e){return void 0!==e&&(t=e),this},this.setUTF8=function(e){return"boolean"==typeof e&&(n=e),this}}},t=this,n=!1,n=Qe,Qe&&"object"==typeof $&&$&&$===$.global&&(t=$),n?We&&We.exports===n?We.exports=e:n.Hashes=e:t.Hashes=e}();const et=G(Ze.exports),tt=({id:e})=>{const t=L(),[n,r]=S(""),[o,a]=S(""),[i,s]=S(!1),[l,u]=S(!1),[c,h]=W();P((()=>{(async()=>{localStorage.getItem("token")||h({before:j(J,{fill:Y}),subtitle:"Заполни форму и войди в дневник",title:"О вас нет данных, ты кто такой?"})})()}),[]);const f=e=>{const{name:t,value:n}=e.currentTarget,o={login:r,password:a}[t];s(!1),u(!1),null==o||o(n)},m=async e=>{if(e.preventDefault(),!q.test(n))return s(!0),void u(!1);const r=(new et.SHA256).b64(o);u(!0);const a=await K("/login/","POST",JSON.stringify({login:n,password:r,isHash:!0})),i=V(a,(()=>s(!0)),void 0,u,h,!1);i&&i.token&&(nt(i),h({title:"Вхожу",subtitle:"Подождите немного"}),await t.replace(`/${T}`))},d=""===n,_=""===o,B=o&&!_,C=d?"Логин":q.test(n)?"Логин введён":"Введите корректный логин",D=""===o?"Пароль":B?"Пароль введён":"Введите корректный пароль";return j(M,{nav:e,children:[j(U,{title:"Авторизация"}),j(O,{children:[i&&j(He,{header:"Некорректные данные",mode:"error",children:"Проверьте правильность логина и пароля"}),j("form",{method:"post",onSubmit:m,children:[j(ye,{required:!0,htmlFor:"userLogin",top:"Логин",status:d?"default":q.test(n)?"valid":"error",bottom:d||C,bottomId:"login-type",children:j(Ge,{required:!0,"aria-labelledby":"login-type",id:"userLogin",type:"text",name:"login",placeholder:"Введите логин",value:n,onChange:f})}),j(ye,{top:"Пароль",htmlFor:"pass",status:_?"default":B?"valid":"error",bottom:_||D,children:j(Ge,{name:"password",id:"pass",type:"password",placeholder:"Введите пароль",onChange:f})}),j(ye,{children:j(z,{type:"submit",size:"l",stretched:!0,onClick:m,disabled:!o||!n||!q.test(n)||l,before:j(Xe,{}),children:l?"Пытаюсь войти...":"Войти"})})]}),c]})]})},nt=e=>{var t,n;const r=String(e.id),o=e.token,a=`${String(e.lastName)} ${String(e.firstName)} ${String(e.middleName)}`,i=String(null==(t=e.organization)?void 0:t.abbreviation),s=String(null==(n=e.organization)?void 0:n.addressSettlement),l=String(null==e?void 0:e.groupName);localStorage.setItem("id",r),localStorage.setItem("token",o);const u={name:a,org:i,city:s,group:l};localStorage.setItem("data",JSON.stringify(u))};export{tt as default};
