var e=Object.defineProperty,t=Object.defineProperties,a=Object.getOwnPropertyDescriptors,o=Object.getOwnPropertySymbols,c=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,r=(t,a,o)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[a]=o,s=(e,t)=>{for(var a in t||(t={}))c.call(t,a)&&r(e,a,t[a]);if(o)for(var a of o(t))l.call(t,a)&&r(e,a,t[a]);return e},i=(e,o)=>t(e,a(o)),n=(e,t)=>{var a={};for(var r in e)c.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(null!=e&&o)for(var r of o(e))t.indexOf(r)<0&&l.call(e,r)&&(a[r]=e[r]);return a};import{v as _,y as d,c as u,n as m,B as h,l as g,q as p,s as v,F as f,$ as b,a0 as y,a1 as w,h as C,K as j,T as k,a2 as A,a3 as N,a4 as z,i as R,I as B,a5 as x,a6 as S,a7 as O,S as I,a8 as H,a9 as L,aa as P,t as D,ab as M,m as T,e as V,p as F,u as K,G as W,H as Y,ac as $,ad as Z,P as q,ae as E}from"./index-XyJYIhAT.js";import{C as G}from"./Caption-crA2LuIN.js";import{P as J}from"./PanelHeaderWithBack-Mte7KJTI.js";import{u as Q}from"./useSnackbar-Q4lCaM24.js";import"./colors-rNCG9YyA.js";const U="_Alert_ugj34_1",X="_Alert--desktop_ugj34_17",ee="_Alert--closing_ugj34_21",te="_Alert__content_ugj34_39",ae="_Alert__content--withButton_ugj34_45",oe="_Alert__action_ugj34_50",ce="_Alert__actions_ugj34_55",le="_Alert__header_ugj34_63",re="_Alert__text_ugj34_68",se="_Alert--ios_ugj34_111",ie="_Alert__action--mode-cancel_ugj34_251",ne="_Alert__action--mode-destructive_ugj34_255",_e="_Alert--vkcom_ugj34_263",de="_Alert__button_ugj34_278",ue="_Alert__button--mode-cancel_ugj34_282",me="_Alert__dismiss_ugj34_286",he=e=>{var t=e,{mode:a}=t,o=n(t,["mode"]);return d(m,s({Component:o.href?"a":"button",className:u(oe,"destructive"===a&&ne,"cancel"===a&&ie)},o))},ge=e=>{var t=e,{mode:a}=t,o=n(t,["mode"]);let c="tertiary";return"vkcom"===_()&&(c="cancel"===a?"secondary":"primary"),d(h,s({className:u(de,"cancel"===a&&ue),mode:c,size:"m"},o))},pe=e=>{const t=_();return d("ios"===t?he:ge,e)},ve={left:"_Alert__actions--align-left_ugj34_92",center:"_Alert__actions--align-center_ugj34_97",right:"_Alert__actions--align-right_ugj34_102"},fe={vertical:"_Alert__actions--direction-vertical_ugj34_81",horizontal:"_Alert__actions--direction-horizontal_ugj34_77"},be=({actions:e=[],renderAction:t=(e=>d(pe,e)),onItemClick:a,actionsAlign:o,actionsLayout:c})=>{const l="vkcom"===_()?"horizontal":c;return d("div",{className:u(ce,o&&ve[o],l&&fe[l])},e.map(((e,o)=>{const c=e,{title:l,action:r,autoCloseDisabled:i}=c,_=n(c,["title","action","autoCloseDisabled"]);return d(g,{key:o},t(s({children:l,onClick:()=>a(e)},_)))})))},ye=e=>{const t=_();return d(p,s("ios"===t?{className:le,weight:"1",level:"3"}:{className:le,weight:"2",level:"2"},e))},we=e=>{switch(_()){case"vkcom":return d(f,s({className:re},e));case"ios":return d(G,s({className:re},e));default:return d(v,s({Component:"span",className:re,weight:"3"},e))}},Ce=e=>{var t=e,{actions:a=[],actionsLayout:o="horizontal",children:c,className:l,style:r,text:m,header:h,onClose:g,dismissLabel:p="Закрыть предупреждение",renderAction:v,actionsAlign:f,dismissButtonMode:I="outside",dismissButtonTestId:H,getRootRef:L}=t,P=n(t,["actions","actionsLayout","children","className","style","text","header","onClose","dismissLabel","renderAction","actionsAlign","dismissButtonMode","dismissButtonTestId","getRootRef"]);const D=b(),M=`vkui-alert-${D}-header`,T=`vkui-alert-${D}-text`,V=_(),{isDesktop:F}=y(),{waitTransitionFinish:K}=w(),[W,Y]=C(!1),$=F&&"ios"!==V,Z=j(null),q="ios"===V?300:200,E=k((()=>{Y(!0),K(Z.current,(e=>{e&&"opacity"!==e.propertyName||g()}),q)}),[Z,K,g,q]),G=k((e=>{const{action:t,autoCloseDisabled:a=!1}=e;a?t&&t():(Y(!0),K(Z.current,(e=>{e&&"opacity"!==e.propertyName||(g(),t&&t())}),q))}),[Z,K,g,q]);return A(),d(O,{className:l,closing:W,style:r,onClick:E,getRootRef:L},d(N,i(s({},P),{getRootRef:Z,onClick:z,onClose:E,timeout:q,className:u(U,"ios"===V&&se,"vkcom"===V&&_e,W&&ee,F&&X),role:"alertdialog","aria-modal":!0,"aria-labelledby":M,"aria-describedby":T}),d("div",{className:u(te,"inside"===I&&ae)},R(h)&&d(ye,{id:M},h),R(m)&&d(we,{id:T},m),c,$&&"inside"===I&&d(B,{label:p,className:u(me,"vkuiInternalAlert__dismiss"),onClick:E,hoverMode:"opacity",activeMode:"opacity","data-testid":H},d(x,null))),d(be,{actions:a,actionsAlign:f,actionsLayout:o,renderAction:v,onItemClick:G}),$&&"outside"===I&&d(S,{onClick:E,"data-testid":H},p)))},je="_CellButton_1v1ca_1",ke="_CellButton--centered_1v1ca_30",Ae="_CellButton--mode-danger_1v1ca_55",Ne=e=>{var t=e,{centered:a=!1,mode:o="primary",className:c}=t,l=n(t,["centered","mode","className"]);return d(I,i(s({},l),{className:u(je,"danger"===o&&Ae,a&&ke,c)}))},ze="_Switch_1rzjz_1",Re="_Switch--disabled_1rzjz_30",Be="_Switch__pseudo_1rzjz_34",xe="_Switch__self_1rzjz_89",Se="_Switch--ios_1rzjz_150",Oe={none:"_Switch--sizeY-none_1rzjz_23",compact:"_Switch--sizeY-compact_1rzjz_16"},Ie=e=>{var t=e,{style:a,className:o,getRootRef:c,getRef:l,checked:r}=t,m=n(t,["style","className","getRootRef","getRef","checked"]);const h=_(),{sizeY:g="none"}=H(),{focusVisible:p,onBlur:v,onFocus:f}=L(),b=P({focusVisible:p,mode:"outside"}),[y,w]=C(Boolean(m.defaultChecked)),j=void 0!==r,A=k((e=>{if(j)return;const t=e.target;w(t.checked)}),[j]),N=j?r:y;return d("label",{className:u(ze,"ios"===h&&Se,"regular"!==g&&Oe[g],m.disabled&&Re,b,o),style:a,ref:c,onBlur:M(v,m.onBlur),onFocus:M(f,m.onFocus)},d(D,i(s(s({},m),j&&{checked:r}),{Component:"input",getRootRef:l,onClick:M(A,m.onClick),type:"checkbox",role:"switch","aria-checked":N?"true":"false",className:xe})),d("span",{"aria-hidden":!0,className:Be}))};var He=T("Icon28DoorArrowRightOutline","door_arrow_right_outline_28","0 0 28 28",'<symbol xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 28 28" id="door_arrow_right_outline_28"><path fill-rule="evenodd" d="M10.357 3H13a1 1 0 1 1 0 2h-2.6c-1.137 0-1.929 0-2.546.051-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216C5.001 8.471 5 9.264 5 10.4v7.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051H13a1 1 0 1 1 0 2h-2.643c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C3 19.6 3 18.727 3 17.643v-7.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 5.73 3.544c.592-.302 1.233-.428 1.961-.487C8.4 3 9.273 3 10.357 3m8.936 6.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L21.586 15H12a1 1 0 1 1 0-2h9.586l-2.293-2.293a1 1 0 0 1 0-1.414" clip-rule="evenodd" /></symbol>',28,28,!1,void 0),Le=T("Icon28HomeArrowDownOutline","home_arrow_down_outline_28","0 0 28 28",'<symbol xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 28 28" id="home_arrow_down_outline_28"><path d="M13 11v5.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L15 16.586V11a1 1 0 1 0-2 0m2.047-7.856a4 4 0 0 0-2.095 0c-.781.212-1.462.744-2.367 1.451l-5.447 4.25c-.586.456-1.029.8-1.356 1.244a4 4 0 0 0-.634 1.3C2.999 11.918 3 12.48 3 13.222v6.018c0 .805 0 1.47.044 2.01.046.563.145 1.08.392 1.565a4 4 0 0 0 1.748 1.748c.485.247 1.002.346 1.564.392C7.29 25 7.954 25 8.758 25h10.483c.805 0 1.47 0 2.01-.044.563-.046 1.08-.145 1.565-.392a4 4 0 0 0 1.748-1.748c.247-.485.346-1.002.392-1.564.044-.541.044-1.206.044-2.01v-6.019c0-.743 0-1.304-.148-1.835a4 4 0 0 0-.634-1.299c-.327-.443-.77-.788-1.356-1.245l-5.447-4.249c-.905-.707-1.586-1.239-2.367-1.45Zm-1.57 1.93a2 2 0 0 1 1.047 0c.341.093.684.337 1.813 1.217l5.2 4.056c.723.564.928.735 1.072.93a2 2 0 0 1 .317.65c.065.232.074.5.074 1.417V19.2c0 .857 0 1.439-.038 1.889-.035.438-.1.663-.18.819a2 2 0 0 1-.874.874c-.156.08-.38.145-.819.18-.45.037-1.032.038-1.889.038H8.8c-.857 0-1.439 0-1.889-.038-.438-.035-.663-.1-.819-.18a2 2 0 0 1-.874-.874c-.08-.156-.145-.38-.18-.819C5 20.639 5 20.057 5 19.2v-5.856c0-.917.009-1.184.074-1.418a2 2 0 0 1 .317-.65c.144-.194.35-.365 1.072-.929l5.2-4.056c1.129-.88 1.472-1.124 1.813-1.217Z" clip-rule="evenodd" /></symbol>',28,28,!1,void 0),Pe=T("Icon28IncognitoOutline","incognito_outline_28","0 0 28 28",'<symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" id="incognito_outline_28"><path fill="currentColor" fill-rule="evenodd" d="M11.284 3h5.432c.56 0 1.035 0 1.428.03.414.03.808.098 1.194.268a3.5 3.5 0 0 1 1.474 1.223c.239.348.377.723.484 1.124.101.381.189.848.292 1.398l.007.036L22.33 11H25a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h2.67l.735-3.921.007-.036c.103-.55.19-1.017.292-1.398.107-.401.245-.776.484-1.124a3.5 3.5 0 0 1 1.474-1.223c.386-.17.78-.238 1.194-.269C10.249 3 10.724 3 11.284 3m8.345 4.447L20.295 11H7.705l.666-3.553c.112-.595.186-.988.266-1.288.076-.288.141-.42.2-.507a1.5 1.5 0 0 1 .632-.524c.096-.043.239-.082.536-.104C10.315 5 10.715 5 11.32 5h5.36c.606 0 1.005 0 1.315.024.297.022.44.061.536.104a1.5 1.5 0 0 1 .631.524c.06.086.125.22.201.507.08.3.154.693.266 1.288M5 20a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-5a5 5 0 1 0 5 5.083 6 6 0 0 1 2 0 5 5 0 1 0 .367-1.966 8 8 0 0 0-2.734 0A5 5 0 0 0 8 15m12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" clip-rule="evenodd" /></symbol>',28,28,!1,void 0);const De=({id:e})=>{const t=V(),[a,o]=C([]),[c,l]=C(!1),r=j(null),[s,i]=C(!1),[n,_]=Q();F((()=>{(async()=>{await E.send("VKWebAppAddToHomeScreenInfo").then((({is_feature_supported:e})=>{e&&l(!0)})).catch((e=>{}))})()}),[]),F((()=>{const e=Object.keys(localStorage).map((e=>({key:e,value:localStorage.getItem(e)||"false"})));o(e)}),[]);const d=()=>{_({title:"Выход",before:K(He,{color:"var(--vkui--color_background_accent_themed)"}),subtitle:"После удаления всех данных вы попадёте на страницу авторизации"}),setTimeout((async()=>{try{await(async()=>{localStorage.clear()})(),await t.replace("/")}catch(e){}}),1500)},u=K(Ce,{actions:[{title:"Отмена",autoCloseDisabled:!1,mode:"cancel"},{title:"Выйти",autoCloseDisabled:!1,mode:"destructive",action:()=>d()}],actionsLayout:"horizontal",onClose:()=>t.hidePopout(),header:"Выход",text:"Вы уверены, что хотите выйти из аккаунта?"});return K(q,{nav:e,children:[K(J,{title:"Настройки"}),K(W,{header:K(Y,{mode:"secondary",children:"Действия"}),children:[K(Ne,{Component:"label",after:K(Ie,{getRef:r}),onChange:()=>i(!s),before:K(Pe,{}),children:"Показывать тех. информацию"}),K(Ne,{before:K(He,{}),onClick:()=>t.showPopout(u),children:"Выйти"}),c&&K(Ne,{before:K(Le,{}),onClick:()=>{E.send("VKWebAppAddToHomeScreen").then((e=>{e.result})).catch((e=>{}))},children:"Добавить на экран"})]}),s&&K(W,{header:K(Y,{mode:"secondary",aside:K($,{Component:"h5",children:"Хранится в LocalStorage"}),children:"Кеш"}),children:a.map((e=>K(I,{children:K(Z,{header:e.key,children:e.value.slice(0,30)})},e.key)))}),n]})};export{De as default};
