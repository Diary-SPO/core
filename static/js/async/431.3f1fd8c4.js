"use strict";(self.webpackChunk_diary_spo_web=self.webpackChunk_diary_spo_web||[]).push([["431"],{5753:function(e,n,t){t.r(n),t.d(n,{default:()=>E});var l=t("2322"),s=t("7694"),i=t("2277"),r=t("6368"),a=t("5313"),c=t("3803"),d=t("2784"),o=t("3683");function u(e){return`https://dequeuniversity.com/rules/axe/4.5/${e}`}u("button-name"),u("link-name"),u("image-alt");let x=e=>{var{Component:n="div",baseClassName:t,className:s,getRootRef:i}=e,a=(0,c._)(e,["Component","baseClassName","className","getRootRef"]);return(0,l.jsx)(n,(0,r._)({ref:i,className:(0,o.AK)(s,t,"vkuiRootComponent",!0===a.hidden&&"vkuiRootComponent--hidden")},a))},h=o.Nq?d.useLayoutEffect:d.useEffect,y=d.createContext({getScroll:()=>({x:0,y:0}),scrollTo:o.ZT,isScrollLock:!1,enableScrollLock:o.ZT,disableScrollLock:o.ZT}),b=({children:e,initialScroll:n,saveScroll:t})=>{let{getScroll:s,scrollTo:i}=d.useContext(y);return h(()=>("number"==typeof n&&i(0,n),()=>t(s().y)),[]),(0,l.jsx)(d.Fragment,{children:e})},j=function(e){let n=new Set;return(t,l="warn")=>{if(!n.has(t)){n.add(t);let s=`%c[VKUI/${e}] ${t}`;console[l](s,"log"===l?"color: steelblue; font-style: italic":void 0)}}}("Epic"),v=e=>{var n,{activeStory:t,tabbar:s,children:i}=e,u=(0,c._)(e,["activeStory","tabbar","children"]);let h=d.useRef({}).current,y=null!==(n=d.Children.toArray(i).find(e=>d.isValidElement(e)&&function(e,n){let t=e.nav||e.id;return t}(e.props,0)===t))&&void 0!==n?n:null;return(0,l.jsxs)(x,(0,a._)((0,r._)({},u),{baseClassName:(0,o.AK)("vkuiEpic",s&&"vkuiInternalEpic--hasTabbar"),children:[(0,l.jsx)(b,{initialScroll:h[t]||0,saveScroll:e=>h[t]=e,children:y},t),s]}))};var m=t("1029");let f=(0,d.lazy)(()=>t.e("402").then(t.bind(t,5426))),k=(0,d.lazy)(()=>t.e("323").then(t.bind(t,3081))),p=(0,d.lazy)(()=>t.e("368").then(t.bind(t,3910))),C=(0,d.lazy)(()=>t.e("980").then(t.bind(t,583))),R=(0,d.lazy)(()=>t.e("800").then(t.bind(t,5067)));var S=t("6376"),_=t("9223"),w=t("3717"),T=t("3220"),Z=t("9477");let g=e=>{let{onStoryChange:n,activeView:t}=e,{viewWidth:s}=(0,i.m4R)();return s.tabletMinus&&(0,l.jsxs)(i.Er2,{className:s.tabletMinus.className,children:[(0,l.jsx)(i.QPT,{onClick:()=>n(m.nZ),selected:t===m.nZ,"data-story":m.nZ,text:"Главная",children:(0,l.jsx)(_.r,{})}),(0,l.jsx)(i.QPT,{onClick:()=>n(m.yv),selected:t===m.yv,"data-story":m.yv,text:"Успеваемость",children:(0,l.jsx)(w.l,{})}),(0,l.jsx)(i.QPT,{onClick:()=>n(m.OR),selected:t===m.OR,"data-story":m.OR,text:"Объявления",children:(0,l.jsx)(T.F,{})}),(0,l.jsx)(i.QPT,{onClick:()=>n(m.cJ),selected:t===m.cJ,"data-story":m.cJ,text:"Настройки",children:(0,l.jsx)(Z.R,{})})]})},E=e=>{let{onStoryChange:n}=e,{view:t,panel:r}=(0,s.g5)(),{viewWidth:a}=(0,i.m4R)(),{panel:c,panelsHistory:d}=(0,s.g5)(),o=(0,s.fB)();return(0,l.jsx)(v,{activeStory:t,tabbar:a.tabletMinus&&(0,l.jsx)(g,{onStoryChange:n,activeView:r}),children:(0,l.jsxs)(i.G7x,{id:m.nZ,history:d,activePanel:c,onSwipeBack:()=>o.back(),children:[(0,l.jsx)(S.n4,{id:m.RH,mode:"screen",children:(0,l.jsx)(C,{id:m.RH})}),(0,l.jsx)(S.n4,{id:m.nZ,mode:"screen",children:(0,l.jsx)(f,{id:m.nZ})}),(0,l.jsx)(S.n4,{id:m.yv,mode:"screen",children:(0,l.jsx)(k,{id:m.yv})}),(0,l.jsx)(S.n4,{id:m.OR,mode:"screen",children:(0,l.jsx)(R,{id:m.OR})}),(0,l.jsx)(S.n4,{id:m.cJ,mode:"screen",children:(0,l.jsx)(p,{id:m.cJ})})]})})}}}]);