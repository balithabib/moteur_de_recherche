(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{2233:function(e,t,a){"use strict";var r=a(1),n=a.n(r),s=a(6),i=a.n(s),o=a(32),l=a.n(o),c=a(337),u=a(551),p=a.n(u),d=a(755),m=a.n(d),f=a(761),g=a.n(f),v=a(422),y=a(3137),b=a(3222),h=a(864),S=a(2025),A=a(3234),O=a(3257),w=a(1026),E=a(3239),I=a(3139),T=a(462);function N(){return(N=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}function j(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var a=[],r=!0,n=!1,s=void 0;try{for(var i,o=e[Symbol.iterator]();!(r=(i=o.next()).done)&&(a.push(i.value),!t||a.length!==t);r=!0);}catch(e){n=!0,s=e}finally{try{r||null==o.return||o.return()}finally{if(n)throw s}}return a}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function k(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},s=Object.keys(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}function C(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var x={classes:i.a.objectOf(i.a.string),title:i.a.string.isRequired,width:i.a.oneOf(["xs","sm","md","lg","xl"]).isRequired,category:i.a.string,categoryColor:i.a.string,children:i.a.string,component:i.a.elementType,difficulty:i.a.string,duration:i.a.string,href:i.a.string,illustration:i.a.string,partners:i.a.arrayOf(i.a.string),progress:i.a.number,learningActivityStatus:i.a.string,className:i.a.string},R={classes:{},category:"",categoryColor:void 0,children:"",component:"li",difficulty:"",duration:"",href:"",illustration:"",partners:[],progress:null,learningActivityStatus:null,className:""},_=function(e){var t,a=e.children,s=e.difficulty,i=e.duration,o=e.partners,c=e.width,u=e.progress,d=e.classes,f=e.learningActivityStatus,v=e.href,y=e.className,x=k(e,["children","difficulty","duration","partners","width","progress","classes","learningActivityStatus","href","className"]),R=j(Object(r.useState)(!1),2),_=R[0],W=R[1],P=!0,L=!0,D=1/0;switch(c){case"xl":D=300;break;case"lg":D=200;break;case"md":P=!1,D=140;break;case"sm":P=!1,D=0;break;case"xs":P=!1,L=!1,D=0}var M=[];s&&M.push(n.a.createElement(h.a,{icon:g.a,accessibilityLabel:l()("openclassrooms.courses.accessibilityLabels.difficulty"),shouldNotWrap:!0},s)),L&&M.push(n.a.createElement(S.a,{icon:m.a,shouldNotWrap:!0,duration:i}));var B=D?a:"";B&&B.length>D&&(B="".concat(B.substr(0,D-3),"..."));var U=P?o:[];if(u){var H,V=(C(H={},w.a.STATUS_NOT_STARTED,l()("openclassrooms.learningActivityStatus.notStarted")),C(H,w.a.STATUS_IN_PROGRESS,l()("openclassrooms.learningActivityStatus.inProgress")),C(H,w.a.STATUS_AWAITING_REVIEW,l()("openclassrooms.learningActivityStatus.awaitingReview")),C(H,w.a.STATUS_CAN_RETRY,l()("openclassrooms.learningActivityStatus.retry")),C(H,w.a.STATUS_FAILED,l()("openclassrooms.learningActivityStatus.failed")),C(H,w.a.STATUS_PASSED,l()("openclassrooms.learningActivityStatus.passed")),H);t=n.a.createElement("div",{className:"".concat(d.progressWrapper," ").concat(v?d.clickable:"")},n.a.createElement(O.b,{value:u,maxValue:100}),n.a.createElement("div",{className:d.progressLabelWrapper},n.a.createElement(I.a,{variant:T.a.VARIANT.BODY2},u,"%"," ",n.a.createElement(p.a,{content:"openclassrooms.courses.completed"})),n.a.createElement("div",{className:d.learningActivityStatusWrapper},n.a.createElement(I.a,{variant:T.a.VARIANT.BODY2,className:d.learningActivityStatusLabel},V[f]),n.a.createElement(E.a,{status:f}))))}return n.a.createElement(b.a,{raised:!!v&&_,onMouseEnter:function(){return W(!0)},onMouseLeave:function(){return W(!1)},onFocus:function(){return W(!0)},onBlur:function(){return W(!1)},className:y,classes:{content:d.cardContent}},n.a.createElement(A.a,N({classes:{illustrationContainer:u?d.progressIllustrationContainer:null,informationContainer:d.informationContainer,listItemInner:d.listItemInner,listItemInnerHover:"".concat(d.listItemInnerHover," ").concat(v?d.clickable:"")},metadata:u?[]:M,partners:u?[]:U,href:v},x),!u&&B,u&&n.a.createElement("div",{className:d.progressDesktop},t)),u&&n.a.createElement("div",{className:d.progressMobile},t))};_.propTypes=x,_.defaultProps=R,t.a=Object(c.d)(Object(v.a)(function(e){var t,a=e.spacing,r=e.breakpoints;return{progressMobile:C({},r.up("md"),{display:"none"}),progressDesktop:C({},r.down("sm"),{display:"none"}),progressWrapper:C({marginTop:a(2)},r.down("sm"),{marginTop:0,padding:[[0,a(2),a(2),a(2)]]}),progressLabelWrapper:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:a(1)},learningActivityStatusLabel:{marginRight:a(1)},learningActivityStatusWrapper:{display:"flex",alignItems:"center"},progressIllustrationContainer:(t={},C(t,r.down("sm"),{width:100}),C(t,"width",169),t),informationContainer:{margin:[[0,0,0,a(2)]]},cardContent:{padding:0,"&:last-child":{paddingBottom:0}},listItemInnerHover:{"&:hover":{background:"inherit"},"& $informationContainer":{color:"inherit"}},listItemInner:{padding:a(2)},clickable:{"&:hover":{cursor:"pointer",background:"inherit"}}}}),Object(y.a)())(_)},410:function(e,t,a){"use strict";var r=a(489),n=a(501),s=a(472),i={semanticColors:a.n(s).a},o=a(509);a.d(t,"a",function(){return c});var l={default:{palette:r.a,fonts:n.a,styles:i}}[o.a],c=l.palette;l.fonts,l.styles},472:function(e,t,a){var r=a(473);"string"==typeof r&&(r=[[e.i,r,""]]);var n={hmr:!0,transform:void 0};a(515)(r,n);r.locals&&(e.exports=r.locals)},473:function(e,t,a){(t=e.exports=a(514)(!1)).push([e.i,"\n",""]),t.locals={backgroundBottomNavBar:"#f2f2f2"}},761:function(e,t,a){"use strict";var r=a(411);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(a(1)),s=(0,r(a(415)).default)(n.default.createElement("path",{d:"M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"}),"SignalCellularAlt");t.default=s}}]);
//# sourceMappingURL=default~courseView~projects~projectsAdmin~universalSearch.5ac812af7d1fb180c9bd.js.map