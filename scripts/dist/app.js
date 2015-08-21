(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\xampp\\htdocs\\Wikiseda_Working\\scripts\\js\\app.js":[function(require,module,exports){
var app, deviceReady, launched;

window.TIMEOUT = 6000;

launched = false;

deviceReady = (function(_this) {
  return function() {
    launched = true;
    window.SERVER_ADDRESS = "http://www.getsongg.com/dapp/";
    return window.scroll(0, 0);
  };
})(this);

app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

window.isApp = app;

if (app === true) {
  document.addEventListener("deviceready", deviceReady, false);
} else {
  deviceReady();
}

setTimeout((function(_this) {
  return function() {
    if (launched === false) {
      return deviceReady();
    }
  };
})(this), 1000);

},{}]},{},["C:\\xampp\\htdocs\\Wikiseda_Working\\scripts\\js\\app.js"]);
