/** Cookies EU banner v2.0.1 by Alex-D - alex-d.github.io/Cookies-EU-banner/ - MIT License */
!function(e,t){"use strict";"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.CookiesEuBanner=t()}(window,function(){"use strict";var i,u=window.document;return(i=function(e,t,o,n){if(!(this instanceof i))return new i(e);this.cookieTimeout=33696e6,this.bots=/bot|crawler|spider|crawling/i,this.cookieName="hasConsent",this.trackingCookiesNames=["__utma","__utmb","__utmc","__utmt","__utmv","__utmz","_ga","_gat","_gid"],this.launchFunction=e,this.waitAccept=t||!1,this.useLocalStorage=o||!1,this.init()}).prototype={init:function(){var e=this.bots.test(navigator.userAgent),t=navigator.doNotTrack||navigator.msDoNotTrack||window.doNotTrack;return e||!(null==t||t&&"yes"!==t&&1!==t&&"1"!==t)||!1===this.hasConsent()?(this.removeBanner(0),!1):!0===this.hasConsent()?(this.launchFunction(),!0):(this.showBanner(),void(this.waitAccept||this.setConsent(!0)))},showBanner:function(){var e=this,t=u.getElementById.bind(u),o=t("cookies-eu-banner"),n=t("cookies-eu-reject"),i=t("cookies-eu-accept"),s=t("cookies-eu-more"),a=void 0===o.dataset.waitRemove?0:parseInt(o.dataset.waitRemove),c=this.addClickListener,r=e.removeBanner.bind(e,a);o.style.display="block",s&&c(s,function(){e.deleteCookie(e.cookieName)}),i&&c(i,function(){r(),e.setConsent(!0),e.launchFunction()}),n&&c(n,function(){r(),e.setConsent(!1),e.trackingCookiesNames.map(e.deleteCookie)})},setConsent:function(e){if(this.useLocalStorage)return localStorage.setItem(this.cookieName,e);this.setCookie(this.cookieName,e)},hasConsent:function(){function e(e){return-1<u.cookie.indexOf(t+"="+e)||localStorage.getItem(t)===e}var t=this.cookieName;return!!e("true")||!e("false")&&null},setCookie:function(e,t){var o=new Date;o.setTime(o.getTime()+this.cookieTimeout),u.cookie=e+"="+t+";expires="+o.toGMTString()+";path=/"},deleteCookie:function(e){var t=u.location.hostname.replace(/^www\./,""),o="; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/";u.cookie=e+"=; domain=."+t+o,u.cookie=e+"="+o},addClickListener:function(e,t){if(e.attachEvent)return e.attachEvent("onclick",t);e.addEventListener("click",t)},removeBanner:function(e){setTimeout(function(){var e=u.getElementById("cookies-eu-banner");e&&e.parentNode&&e.parentNode.removeChild(e)},e)}},i});