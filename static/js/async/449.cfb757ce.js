"use strict";(self.webpackChunk_diary_spo_web=self.webpackChunk_diary_spo_web||[]).push([["449"],{7601:function(e,t,a){a.r(t),a.d(t,{default:()=>h});var s=a("2322"),l=a("2277"),n=a("2784"),r=a("3292"),i=a("831"),d=a("128"),c=a("9344");let o=e=>{let{subject:t}=e;return(0,s.jsx)(l.gy,{size:"l",children:(0,s.jsx)(l.Zbd,{mode:"shadow",children:(0,s.jsxs)(l.ZCY,{children:[(0,s.jsx)(l.Dxz,{level:"3",Component:"h3",children:t.name}),(0,s.jsx)(l.q$7,{header:"Тип аттестации",children:(0,s.jsx)(l.vFK,{Component:"h5",children:c.py[t.examinationType]})}),(0,s.jsx)(l.q$7,{header:"Оценки",children:(0,s.jsx)(l.vFK,{Component:"h5",children:t.marks[t.id]&&Object.keys(t.marks[t.id]).length>0?Object.keys(t.marks[t.id]).map(e=>(0,s.jsx)("span",{children:t.marks[t.id][e]},e)):"Оценок нет"})})]})})},t.id)},m=e=>{let{semesterKey:t,subjects:a,studentName:n,year:r}=e;return(0,s.jsx)(l.ZAu,{className:"tableWrapper",mode:"plain",header:(0,s.jsx)(l.h4i,{style:{alignItems:"center"},mode:"tertiary",aside:n+(r?", ".concat(r):""),children:t}),children:a.map(e=>(0,s.jsx)(o,{subject:e},e.id))},t)},u=e=>{var t;if(!e)return;let a=null==e?void 0:null===(t=e.students)||void 0===t?void 0:t[0];if(!a)return;let s={},l="".concat(a.lastName," ").concat(a.firstName.slice(0,1),".");a.middleName&&(l+=" ".concat(a.middleName.slice(0,1),"."));let n=e.year,r="Семестр ".concat(e.termNumber);for(let t of(!s[r]&&(s[r]=[]),e.subjects))s[r].push(t);return{semesters:s,studentName:l,year:n}},h=e=>{var t;let{setIsError:a,setIsLoading:c,isLoading:o}=e,[h,j]=(0,n.useState)(null);if((0,n.useEffect)(()=>{let e=localStorage.getItem("attestationData");if(e&&!(0,r.yy)("attestationData_time")){j(JSON.parse(e));return}(async()=>{c(!0),a(!1);try{let{data:e}=await (0,i.Xd)();if((0,r._y)(e,()=>a(!0),d.V,c),(0,r.k0)(e)){a(!0);return}j(e),localStorage.setItem("attestationData",JSON.stringify(e)),localStorage.setItem("attestationData_time",JSON.stringify(Date.now()))}catch{a(!0)}finally{c(!1)}})()},[]),!o&&!(null==h?void 0:null===(t=h.subjects)||void 0===t?void 0:t.length))return(0,s.jsx)(l.VmN,{children:"Данных нет"});let y=u(h);return y?(0,s.jsx)("div",{children:Object.keys(null==y?void 0:y.semesters).map(e=>(0,s.jsx)(m,{semesterKey:e,subjects:null==y?void 0:y.semesters[e],studentName:null==y?void 0:y.studentName,year:null==y?void 0:y.year},e))}):(0,s.jsx)(l.VmN,{children:"Данных нет"})}}}]);