(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Touch, backButton, closeAlbum, main, openAlbum, openAlbumDiv, switchAlbum;

Touch = require('simple-touch');

backButton = require('./BackButton');

main = document.querySelector('.main');

Touch.onTap("item-album").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    return switchAlbum(event.listener);
  };
})(this));

openAlbumDiv = null;

closeAlbum = function() {
  backButton.deactive('album');
  openAlbumDiv.style.height = "";
  openAlbumDiv.style.width = "";
  openAlbumDiv.children[4].style.display = "";
  return openAlbumDiv = null;
};

openAlbum = function(div) {
  if (openAlbumDiv != null) {
    closeAlbum();
  }
  backButton.activate('album');
  openAlbumDiv = div;
  div.children[4].style.display = "block";
  div.style.height = "auto";
  div.style.width = "100%";
  return main.scrollTop = main.scrollTop + div.getBoundingClientRect().top - main.getBoundingClientRect().top;
};

switchAlbum = function(div) {
  if (openAlbumDiv === div) {
    if (openAlbumDiv != null) {
      return closeAlbum();
    } else {
      return openAlbum(div);
    }
  } else {
    if (openAlbumDiv != null) {
      closeAlbum();
    }
    if (div != null) {
      return openAlbum(div);
    }
  }
};

backButton.add('album', function() {
  return closeAlbum();
});



},{"./BackButton":3,"simple-touch":76}],2:[function(require,module,exports){
var AudioManager, flashMessage, loadingAnimation, settingsStorage;

settingsStorage = require('./Tools/SettingStorage');

loadingAnimation = require('./Loading');

flashMessage = require('./FlashMessage');

if (typeof cordova !== "undefined" && cordova !== null) {
  if (window.audioplayer != null) {
    module.exports = new (AudioManager = (function() {
      function AudioManager() {
        var failureCallback, successCallback;
        this.playing = false;
        this.duration = 1;
        successCallback = (function(_this) {
          return function(result) {
            var repeat;
            if (result.type === 'progress') {
              _this.duration = result.duration;
              if (_this.timePercentCallback != null) {
                _this.timePercentCallback(result.progress / result.duration);
              }
              if (_this.timeCallback != null) {
                _this.timeCallback(result.progress / 1000);
              }
              loadingAnimation.hide();
            } else if (result.type === 'state') {
              if (parseInt(result.state) === 1) {
                loadingAnimation.hide();
              } else if (parseInt(result.state) === 2) {
                _this.playing = true;
                if (_this.playStatusCallback != null) {
                  _this.playStatusCallback(true);
                }
              } else if (parseInt(result.state) === 3) {
                _this.playing = false;
                if (_this.playStatusCallback != null) {
                  _this.playStatusCallback(false);
                }
              } else if (parseInt(result.state) === 5) {
                loadingAnimation.show();
              } else if (parseInt(result.state) === 6) {
                repeat = settingsStorage.get("repeat");
                if (repeat === 1) {
                  window.audioplayer.seekto(successCallback, failureCallback, 0);
                  window.audioplayer.playfile(successCallback, failureCallback, _this.src, {
                    "title": window.playingMusicData.songname || "Wikiseda",
                    "artist": window.playingMusicData.artist || "Wikiseda",
                    "image": {
                      "url": window.playingMusicData.poster_big || window.playingMusicData.poster || ""
                    },
                    "imageThumbnail": {
                      "url": window.playingMusicData.poster_big || window.playingMusicData.poster || ""
                    }
                  }, 0, {});
                  return;
                }
                _this.playing = false;
                if (_this.changeSongCallback != null) {
                  _this.changeSongCallback();
                }
                if (_this.playToEndCallback != null) {
                  _this.playToEndCallback();
                }
              }
            } else if (result.type === 'error') {
              if (_this.changeSongCallback != null) {
                _this.changeSongCallback();
              }
              if (_this.playToEndCallback != null) {
                _this.playToEndCallback("error");
              }
            } else if (result.type === 'current') {
              console.log('current audio ' + JSON.stringify(result.audio));
            } else if (result.type === 'next') {
              if (_this.changeSongCallback != null) {
                _this.changeSongCallback();
              }
              if (_this.playToEndCallback != null) {
                _this.playToEndCallback();
              }
            } else if (result.type === 'previous') {
              if (_this.changeSongCallback != null) {
                _this.changeSongCallback();
              }
              if (_this.previousCallback != null) {
                _this.previousCallback();
              }
            } else {
              console.log('AudioCallback unhandled type (' + result.type + ')');
            }
          };
        })(this);
        failureCallback = function() {
          var elText;
          elText = "Audio player failed";
          if (window.lang === "fa") {
            elText = "پخش انجام نشد";
          }
          return flashMessage.show(elText);
        };
        if (window.plugins.OnDestroyPlugin != null) {
          window.plugins.OnDestroyPlugin.setEventListener((function(_this) {
            return function() {
              window.audioplayer.stop();
              _this.playing = false;
              if (_this.playStatusCallback != null) {
                return _this.playStatusCallback(false);
              }
            };
          })(this));
        }
        if (typeof cordova !== "undefined" && cordova !== null) {
          window.audioplayer.configure(successCallback, failureCallback);
        }
        this._events = {};
      }

      AudioManager.prototype.play = function(src) {
        var failureCallback, successCallback;
        if (src === this.src) {
          return;
        }
        successCallback = (function(_this) {
          return function(result) {
            var repeat;
            if (result.type === 'progress') {
              _this.duration = result.duration;
              if (_this.timePercentCallback != null) {
                _this.timePercentCallback(result.progress / result.duration);
              }
              if (_this.timeCallback != null) {
                _this.timeCallback(result.progress / 1000);
              }
              loadingAnimation.hide();
            } else if (result.type === 'state') {
              if (parseInt(result.state) === 1) {
                loadingAnimation.hide();
              } else if (parseInt(result.state) === 2) {
                _this.playing = true;
                if (_this.playStatusCallback != null) {
                  _this.playStatusCallback(true);
                }
              } else if (parseInt(result.state) === 3) {
                _this.playing = false;
                if (_this.playStatusCallback != null) {
                  _this.playStatusCallback(false);
                }
              } else if (parseInt(result.state) === 5) {
                loadingAnimation.show();
              } else if (parseInt(result.state) === 6) {
                repeat = settingsStorage.get("repeat");
                if (repeat === 1) {
                  window.audioplayer.seekto(successCallback, failureCallback, 0);
                  window.audioplayer.playfile(successCallback, failureCallback, _this.src, {
                    "title": window.playingMusicData.songname || "Wikiseda",
                    "artist": window.playingMusicData.artist || "Wikiseda",
                    "image": {
                      "url": window.playingMusicData.poster_big || window.playingMusicData.poster || ""
                    },
                    "imageThumbnail": {
                      "url": window.playingMusicData.poster_big || window.playingMusicData.poster || ""
                    }
                  }, 0, {});
                  return;
                }
                _this.playing = false;
                if (_this.changeSongCallback != null) {
                  _this.changeSongCallback();
                }
                if (_this.playToEndCallback != null) {
                  _this.playToEndCallback();
                }
              }
            } else if (result.type === 'error') {
              if (_this.changeSongCallback != null) {
                _this.changeSongCallback();
              }
              if (_this.playToEndCallback != null) {
                _this.playToEndCallback("error");
              }
            } else if (result.type === 'current') {
              console.log('current audio ' + JSON.stringify(result.audio));
            } else if (result.type === 'next') {
              if (_this.changeSongCallback != null) {
                _this.changeSongCallback();
              }
              if (_this.playToEndCallback != null) {
                _this.playToEndCallback();
              }
            } else if (result.type === 'previous') {
              if (_this.changeSongCallback != null) {
                _this.changeSongCallback();
              }
              if (_this.previousCallback != null) {
                _this.previousCallback();
              }
            } else {
              console.log('AudioCallback unhandled type (' + result.type + ')');
            }
          };
        })(this);
        failureCallback = function() {
          var elText;
          elText = "Audio player failed";
          if (window.lang === "fa") {
            elText = "پخش انجام نشد";
          }
          return flashMessage.show(elText);
        };
        if (src !== void 0) {
          if (this.playing === true) {
            this.pause();
          }
          this.src = src;
          if (this.changeSongCallback != null) {
            this.changeSongCallback();
          }
          loadingAnimation.show();
        }
        window.audioplayer.playfile(successCallback, failureCallback, this.src, {
          "title": window.playingMusicData.songname || "Wikiseda",
          "artist": window.playingMusicData.artist || "Wikiseda",
          "image": {
            "url": window.playingMusicData.poster_big || window.playingMusicData.poster || ""
          },
          "imageThumbnail": {
            "url": window.playingMusicData.poster_big || window.playingMusicData.poster || ""
          }
        }, 0, {});
        this.playing = true;
        if (this.playStatusCallback != null) {
          return this.playStatusCallback(true);
        }
      };

      AudioManager.prototype.pause = function() {
        window.audioplayer.pause();
        this.playing = false;
        if (this.playStatusCallback != null) {
          return this.playStatusCallback(false);
        }
      };

      AudioManager.prototype["switch"] = function() {
        if (this.playing) {
          return this.pause();
        } else {
          return this.play();
        }
      };

      AudioManager.prototype.seekToPercent = function(x) {
        var cb;
        if (x < 0 || x > 1) {
          return;
        }
        cb = function() {};
        if (this.duration) {
          try {
            return window.audioplayer.seekto(cb, cb, x * this.duration);
          } catch (undefined) {}
        }
      };

      AudioManager.prototype.onPlayStatus = function(playStatusCallback) {
        this.playStatusCallback = playStatusCallback;
      };

      AudioManager.prototype.onPlayToEnd = function(playToEndCallback) {
        this.playToEndCallback = playToEndCallback;
      };

      AudioManager.prototype.onTime = function(timeCallback) {
        this.timeCallback = timeCallback;
      };

      AudioManager.prototype.onTimePercent = function(timePercentCallback) {
        this.timePercentCallback = timePercentCallback;
      };

      AudioManager.prototype.onChangeSong = function(changeSongCallback) {
        this.changeSongCallback = changeSongCallback;
      };

      AudioManager.prototype.onPrevious = function(previousCallback) {
        this.previousCallback = previousCallback;
      };

      return AudioManager;

    })());
  } else {
    module.exports = new (AudioManager = (function() {
      function AudioManager() {
        this.playing = false;
        this.buffering = false;
        this.reachedEndOnce = false;
        this.started = false;
        setInterval((function(_this) {
          return function() {
            if (_this.audio != null) {
              return _this.audio.getCurrentPosition(function(pos) {
                var duration, repeat;
                if (pos > 0) {
                  if (_this.timeCallback != null) {
                    _this.timeCallback(pos);
                  }
                  duration = _this.audio.getDuration();
                  if (duration > 1) {
                    if (_this.timePercentCallback != null) {
                      _this.timePercentCallback(pos / duration);
                    }
                  }
                  if (_this.started === false && pos > 0 && duration > 0) {
                    loadingAnimation.hide();
                    _this.started = true;
                    _this.reachedEndOnce = false;
                  }
                  if (_this.started === true && pos > 0 && (duration > 1) && ((duration - 1) < pos && pos < (duration + 1)) && _this.reachedEndOnce === false) {
                    repeat = settingsStorage.get("repeat");
                    if (repeat === 1) {
                      _this.audio.seekTo(0);
                      _this.audio.play();
                      return;
                    }
                    if (_this.playToEndCallback != null) {
                      _this.playToEndCallback(false);
                    }
                    _this.reachedEndOnce = true;
                    if (_this.playing === true) {
                      return _this.pause();
                    }
                  }
                }
              });
            }
          };
        })(this), 1000);
        this._events = {};
      }

      AudioManager.prototype.play = function(src) {
        if (src === this.src) {
          return;
        }
        if (src !== void 0) {
          if (this.playing === true) {
            this.pause();
          }
          this.src = src;
          if (this.audio != null) {
            this.audio.release();
          }
          this.audio = new Media(this.src, function() {}, function(e) {
            if (this.playToEndCallback != null) {
              this.playToEndCallback("error");
            }
          }, function(e) {});
          window.audioplayer = this.audio;
          if (this.changeSongCallback != null) {
            this.changeSongCallback();
          }
          this.buffering = true;
          this.reachedEndOnce = false;
          this.started = false;
          loadingAnimation.show();
          setTimeout((function(_this) {
            return function() {
              return _this.releaseResources();
            };
          })(this), 300);
        }
        this.audio.play();
        this.playing = true;
        if (this.playStatusCallback != null) {
          return this.playStatusCallback(true);
        }
      };

      AudioManager.prototype.pause = function() {
        this.audio.pause();
        this.playing = false;
        if (this.playStatusCallback != null) {
          return this.playStatusCallback(false);
        }
      };

      AudioManager.prototype["switch"] = function() {
        if (this.playing) {
          return this.pause();
        } else {
          return this.play();
        }
      };

      AudioManager.prototype.seekToPercent = function(x) {
        if (x < 0 || x > 1) {
          return;
        }
        if (this.audio == null) {
          return;
        }
        try {
          return this.audio.currentTime = x * this.audio.duration;
        } catch (undefined) {}
      };

      AudioManager.prototype.onPlayStatus = function(playStatusCallback) {
        this.playStatusCallback = playStatusCallback;
      };

      AudioManager.prototype.onPlayToEnd = function(playToEndCallback) {
        this.playToEndCallback = playToEndCallback;
      };

      AudioManager.prototype.onTime = function(timeCallback) {
        this.timeCallback = timeCallback;
      };

      AudioManager.prototype.onTimePercent = function(timePercentCallback) {
        this.timePercentCallback = timePercentCallback;
      };

      AudioManager.prototype.onChangeSong = function(changeSongCallback) {
        this.changeSongCallback = changeSongCallback;
      };

      AudioManager.prototype.onPrevious = function(prevCallback) {
        this.prevCallback = prevCallback;
      };

      return AudioManager;

    })());
  }
} else {
  module.exports = new (AudioManager = (function() {
    function AudioManager() {
      this.audio = new Audio();
      this.audio.addEventListener("canplaythrough", (function(_this) {
        return function() {
          return loadingAnimation.hide();
        };
      })(this));
      this.audio.addEventListener("ended", (function(_this) {
        return function() {
          var repeat;
          repeat = settingsStorage.get("repeat");
          if (repeat === 1) {
            _this.audio.currentTime = 0;
            _this.audio.play();
            return;
          }
          if (_this.changeSongCallback != null) {
            _this.changeSongCallback();
          }
          if (_this.playToEndCallback != null) {
            _this.playToEndCallback();
          }
          return _this.playing = false;
        };
      })(this));
      this.audio.addEventListener("timeupdate", (function(_this) {
        return function(event) {
          if (_this.timePercentCallback != null) {
            _this.timePercentCallback(_this.audio.currentTime / _this.audio.duration);
          }
          if (_this.timeCallback != null) {
            return _this.timeCallback(_this.audio.currentTime);
          }
        };
      })(this));
      window.audioplayer = this.audio;
      this._events = {};
    }

    AudioManager.prototype.play = function(src) {
      if (src === this.src) {
        return;
      }
      if (src !== void 0) {
        if (this.playing === true) {
          this.pause();
        }
        this.src = src;
        this.audio.src = this.src;
        if (this.changeSongCallback != null) {
          this.changeSongCallback();
        }
        loadingAnimation.show();
      }
      this.audio.play();
      this.playing = true;
      if (this.playStatusCallback != null) {
        return this.playStatusCallback(true);
      }
    };

    AudioManager.prototype.pause = function() {
      this.audio.pause();
      this.playing = false;
      if (this.playStatusCallback != null) {
        return this.playStatusCallback(false);
      }
    };

    AudioManager.prototype["switch"] = function() {
      if (this.playing) {
        return this.pause();
      } else {
        return this.play();
      }
    };

    AudioManager.prototype.seekToPercent = function(x) {
      if (x < 0 || x > 1) {
        return;
      }
      if (this.audio == null) {
        return;
      }
      try {
        return this.audio.currentTime = x * this.audio.duration;
      } catch (undefined) {}
    };

    AudioManager.prototype.onPlayStatus = function(playStatusCallback) {
      this.playStatusCallback = playStatusCallback;
    };

    AudioManager.prototype.onPlayToEnd = function(playToEndCallback) {
      this.playToEndCallback = playToEndCallback;
    };

    AudioManager.prototype.onTime = function(timeCallback) {
      this.timeCallback = timeCallback;
    };

    AudioManager.prototype.onTimePercent = function(timePercentCallback) {
      this.timePercentCallback = timePercentCallback;
    };

    AudioManager.prototype.onChangeSong = function(changeSongCallback) {
      this.changeSongCallback = changeSongCallback;
    };

    AudioManager.prototype.onPrevious = function(previousCallback) {
      this.previousCallback = previousCallback;
    };

    return AudioManager;

  })());
}



},{"./FlashMessage":4,"./Loading":21,"./Tools/SettingStorage":27}],3:[function(require,module,exports){
var BackButton, backButton, backButtonEventHandler;

BackButton = (function() {
  function BackButton() {
    this.cbs = {};
    this.activeCbs = [];
    this.activeIds = [];
  }

  BackButton.prototype.add = function(id, cb) {
    return this.cbs[id] = cb;
  };

  BackButton.prototype.activate = function(id) {
    this.deactive(id);
    this.activeCbs.push(this.cbs[id]);
    return this.activeIds.push(id);
  };

  BackButton.prototype.deactive = function(id) {
    var index;
    index = this.activeIds.indexOf(id);
    if (index > -1) {
      this.activeIds.splice(index, 1);
      return this.activeCbs.splice(index, 1);
    }
  };

  BackButton.prototype.backPressed = function() {
    if (this.activeIds.length > 0) {
      this.activeIds.pop();
      return this.activeCbs.pop()();
    } else {
      return navigator.Backbutton.goBack(function() {}, function() {});
    }
  };

  return BackButton;

})();

backButton = new BackButton;

backButtonEventHandler = function(event) {
  backButton.backPressed();
  event.preventDefault();
  return false;
};

document.addEventListener("backbutton", backButtonEventHandler);

module.exports = backButton;



},{}],4:[function(require,module,exports){
var FlashMessage,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

FlashMessage = (function() {
  function FlashMessage() {
    this._invisble = bind(this._invisble, this);
    this.show = bind(this.show, this);
    this._showing = false;
    this._timeout = null;
  }

  FlashMessage.prototype.setNode = function(node) {
    this.node = node;
    return this;
  };

  FlashMessage.prototype.show = function(msg, time) {
    if (time == null) {
      time = 2000;
    }
    if (this._showing === true) {
      clearTimeout(this._timeout);
    } else {
      this._showing = true;
    }
    this._updateContent(msg);
    this._visible();
    this._timeout = setTimeout(this._invisble, time);
  };

  FlashMessage.prototype._visible = function() {
    this.node.style.display = "block";
    setTimeout((function(_this) {
      return function() {
        _this.node.style.transform = "translateY(0px)";
        _this.node.style.webkitTransform = "translateY(0px)";
      };
    })(this), 5);
  };

  FlashMessage.prototype._invisble = function() {
    this.node.style.transform = "translateY(-100px)";
    this.node.style.webkitTransform = "translateY(-100px)";
    this._showing = false;
    return setTimeout((function(_this) {
      return function() {
        if (_this._showing === true) {
          return;
        }
        _this.node.style.display = "none";
      };
    })(this), 310);
  };

  FlashMessage.prototype._updateContent = function(msg) {
    this.node.innerHTML = msg;
  };

  return FlashMessage;

})();

module.exports = new FlashMessage;



},{}],5:[function(require,module,exports){
var musicDataCache, settingStorage, url;

url = require('../Tools/url');

musicDataCache = require('../musicDataCache');

settingStorage = require('../Tools/SettingStorage');

module.exports = function(data, downloaded, history) {
  var downloadedAlbumText, downloadedText, i, j, len, mp3, ref, song, songs, viewString, viewText;
  if (downloaded == null) {
    downloaded = false;
  }
  if (history == null) {
    history = false;
  }
  if (data.albumtracks.length === 0) {
    return "";
  }
  musicDataCache.data["album" + data.id] = data;
  downloadedAlbumText = "";
  if (downloaded === true) {
    downloadedAlbumText = "downloaded=\"true\"";
    musicDataCache.more["album" + data.id] = data;
  }
  if (history === true) {
    downloadedAlbumText = "history=\"true\"";
    musicDataCache.more["album" + data.id] = data;
  }
  songs = "";
  data.poster = url(data.poster);
  data.poster_big = data.poster_600x600 || url(data.poster_big) || data.poster;
  data.poster_small = data.poster_60x60 || data.poster;
  ref = data.albumtracks;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    song = ref[i];
    mp3 = song.mp3;
    if (settingStorage.get("play-default-quality") === "high") {
      mp3 = song.mp3 || song.mp3_low;
    } else {
      mp3 = song.mp3_low || song.mp3;
    }
    if (mp3 === void 0 || mp3 === null) {
      continue;
    }
    song.poster = url(data.poster);
    song.poster_big = data.poster_600x600 || url(data.poster_big) || data.poster;
    song.poster_small = data.poster_60x60 || data.poster;
    musicDataCache.data[song.id] = song;
    viewString = "<div class=\"main-item-titles-view-icon\"></div>" + song.view;
    downloadedText = "";
    if (downloaded === true) {
      downloadedText = "downloaded=\"true\"";
      viewString = "";
      musicDataCache.more[song.id] = song;
    }
    if (history === true) {
      downloadedText = "history=\"true\"";
      viewString = "";
      musicDataCache.more[song.id] = song;
    }
    songs = songs + ("<div class=\"main-item-album-song\" data-mp3=\"" + mp3 + "\" id=\"item-song-play\" data-kind=\"album-song\" data-song-id=\"" + song.id + "\" " + downloadedText + ">\n	<div class=\"menu-item-album-song-number\">" + (i + 1) + "</div>\n	<div class=\"menu-item-album-song-title\">" + song.songname + "</div>\n	<div class=\"menu-item-album-song-view\">" + viewString + "</div>\n	<div class=\"menu-item-pause-icon\" id=\"item-song-pause\"></div>\n	<div class=\"main-item-humberger-icon main-item-album-song-humberger-icon\" id=\"item-song-humberger\"></div>\n</div>");
  }
  viewText = "";
  if (data.view != null) {
    viewText = "<div class=\"main-item-titles-view-icon\"></div>" + data.view;
  }
  return "<div class=\"main-item\" id=\"item-album\" data-album-id=\"" + data.id + "\" " + downloadedAlbumText + ">\n	<div class=\"main-item-poster\" style=\"opacity: 0\"><img src=\"" + data.poster_small + "\" onLoad=\"this.parentNode.style.opacity = '';\"  onError=\"this.src='./assets/images/ws.jpg';\"/></div>\n	<div class=\"main-item-titles\">\n		<div class=\"main-item-titles-title\">" + data.album + "</div>\n		<div class=\"main-item-titles-artist\">" + data.artist + "</div>\n		<div class=\"main-item-titles-view\"><div class=\"main-item-titles-view-icon main-item-titles-view-songs\"></div>" + data.trackcount + viewText + "</div>\n	</div>\n	<div class=\"main-item-titles-count\">" + data.trackcount + " Song</div>\n	<div class=\"main-item-humberger-icon\" id=\"item-album-humberger\"></div>\n	<div class=\"main-item-album-songs\">" + songs + "</div>\n</div>";
};



},{"../Tools/SettingStorage":27,"../Tools/url":30,"../musicDataCache":52}],6:[function(require,module,exports){
var musicDataCache, url;

url = require('../Tools/url');

musicDataCache = require('../musicDataCache');

module.exports = function(data) {
  var elText, following;
  data.poster = url(data.poster);
  data.thumb = url(data.thumb);
  musicDataCache.data["artist" + data.id] = data;
  elText = "Fans";
  if (window.lang === "fa") {
    elText = "طرفدار";
  }
  following = "";
  if (parseInt(data.following) === 1) {
    following = " + You";
    if (window.lang === "fa") {
      following = " و شما";
    }
  }
  if (data.fans == null) {
    data.fans = 0;
  }
  return "<div class=\"main-item\" id=\"item-artist\" data-artist-id=\"" + data.id + "\">\n	<div class=\"main-item-poster\" style=\"opacity: 0\"><img src=\"" + data.thumb + "\" onLoad=\"this.parentNode.style.opacity = '';\"  onError=\"this.src='./assets/images/ws.jpg';\"/></div>\n	<div class=\"main-item-titles\">\n		<div class=\"main-item-titles-title\">" + data.artist + "</div>\n		<div class=\"main-item-titles-artist\" data-following=\"" + data.following + "\" data-fans=\"" + data.fans + "\">" + data.fans + "<small> " + elText + " " + following + "</small></div>\n		<div class=\"main-item-titles-view\">" + data.albums + " Album " + data.tracks + " Song</div>\n	</div>\n	<div class=\"main-item-humberger-icon\" id=\"item-artist-humberger\"></div>\n</div>";
};



},{"../Tools/url":30,"../musicDataCache":52}],7:[function(require,module,exports){
var musicDataCache, url;

url = require('../Tools/url');

musicDataCache = require('../musicDataCache');

module.exports = function(data) {
  var albumsText, fansText, following, shouldUpdate, tracksText;
  musicDataCache.data["artist" + data.id] = data;
  if (data.fans == null) {
    data.fans = "--";
  }
  if (data.albums == null) {
    data.albums = "--";
  }
  if (data.tracks == null) {
    data.tracks = "--";
  }
  if (data.thumb != null) {
    data.thumb = url(data.thumb);
  } else {
    data.thumb = "./assets/images/logo.png";
  }
  fansText = "" + data.fans;
  if (data.fans > 1000) {
    fansText = (Math.floor(data.fans / 1000)) + "K";
  }
  albumsText = data.albums + " <small>Albums</small>";
  if (window.lang === "fa") {
    albumsText = data.albums + " <small>آلبوم</small>";
  }
  tracksText = data.tracks + " <small>Songs</small>";
  if (window.lang === "fa") {
    tracksText = data.tracks + " <small>موسیقی</small>";
  }
  following = "";
  if (parseInt(data.following) === 1) {
    following = "main-item-titles-isfan";
  }
  shouldUpdate = "";
  if (data.shouldUpdate != null) {
    shouldUpdate = "shouldUpdate";
  }
  return "<div class=\"main-item maxWidth artist-page-item " + shouldUpdate + "\" id=\"artist-page-header\" data-artist-id=\"" + data.id + "\" data-following=\"" + data.following + "\">\n	<div class=\"main-item-artist-header-back\" id=\"segmented-back\"></div>\n	<div class=\"main-item-poster\"><div class=\"main-item-poster-holder\"><img src=\"" + data.thumb + "\"/></div></div>\n	<div class=\"main-item-titles\">\n		<div class=\"main-item-titles-title\">" + data.artist + "</div>\n		<div class=\"main-item-titles-fan-holder\" id=\"artist-page-follow\">\n			<div class=\"main-item-titles-become " + following + "\"></div>\n			<div class=\"main-item-artist-header-desc-field-fans\">" + fansText + "</div>\n		</div>\n	</div>\n	<div class=\"main-item-artist-header-share\" id=\"artist-share\"></div>\n	<div class=\"main-item-artist-header-desc\">\n		<div class=\"main-item-artist-header-desc-field main-item-artist-header-desc-field-albums main-item-artist-header-desc-field-selected\" id=\"artist-album-filter\">\n			<label>\n				<span class=\"clean\"></span>\n				<span id=\"artist-album-filter-text\">" + albumsText + "</span>\n			</label>\n		</div>\n		<div class=\"main-item-artist-header-desc-field main-item-artist-header-desc-field-songs main-item-artist-header-desc-field-selected\" id=\"artist-song-filter\">\n			<label>\n				<span class=\"clean\"></span>\n				<span id=\"artist-song-filter-text\">" + tracksText + "</span>\n			</label>\n		</div>\n	</div>\n</div>";
};



},{"../Tools/url":30,"../musicDataCache":52}],8:[function(require,module,exports){
module.exports = {
  node: (function(_this) {
    return function(message, id) {
      return "<div class=\"main-item maxWidth\" id=\"" + id + "\">\n<div class=\"main-item-ending circleLoading-text\">" + message + "</div>\n<div class=\"circleLoading\"></div>\n</div>";
    };
  })(this),
  update: function(main, message, id) {
    var loadMore;
    if (id == null) {
      id = "";
    }
    loadMore = main.children[main.children.length - 1];
    loadMore.id = id;
    return loadMore.children[0].innerHTML = message;
  },
  remove: function(main) {
    var loadMore;
    loadMore = main.children[main.children.length - 1];
    return main.removeChild(loadMore);
  }
};



},{}],9:[function(require,module,exports){
var musicDataCache, url;

url = require('../Tools/url');

musicDataCache = require('../musicDataCache');

module.exports = function(data) {
  var viewString;
  musicDataCache.data["genre" + data.id] = data;
  viewString = "Playlist";
  if (window.lang === "fa") {
    viewString = "لیست پخش";
  }
  return "<div class=\"main-item\" id=\"item-genre\" data-genre-id=\"" + data.id + "\">\n	<div class=\"main-item-poster\">" + data.song_count + "<div class=\"main-item-poster-count\">Songs</div></div>\n	<div class=\"main-item-titles\">\n		<div class=\"main-item-titles-title\">" + data.name + "</div>\n		<div></div>\n		<div class=\"main-item-titles-view\">" + viewString + "</div>\n	</div>\n	<div></div>\n</div>";
};



},{"../Tools/url":30,"../musicDataCache":52}],10:[function(require,module,exports){
module.exports = function(data) {
  return "<div class=\"main-item maxWidth\" id=\"genre-header\">\n	<div class=\"main-item-artist-header-back\" id=\"segmented-back\"></div>\n	<div class=\"main-item-titles-title\">" + data.name + "</div>\n</div>";
};



},{}],11:[function(require,module,exports){
var settingStorage;

settingStorage = require('../Tools/SettingStorage');

module.exports = function(data) {
  var elText, syncPlaylist;
  elText = " Song";
  if (window.lang === "fa") {
    elText = ' موسیقی';
  }
  syncPlaylist = "";
  if (settingStorage.get("playlist-" + data.id)) {
    syncPlaylist = " data-synced=\"true\" ";
  }
  return "<div class=\"menu-playlist-item\" id=\"menu-playlist-item\" data-playlist-name=\"" + data.groupname + "\" " + syncPlaylist + ">\n	<div class=\"menu-playlist-item-title\">" + data.groupname + "</div>\n	<div class=\"menu-playlist-item-count\">" + (data.albumtracks.length + elText) + "</div>\n	<div class=\"main-item-playlist-sync\"></div>\n</div>";
};



},{"../Tools/SettingStorage":27}],12:[function(require,module,exports){
module.exports = function(data) {
  return data.html;
};



},{}],13:[function(require,module,exports){
var musicDataCache, playlistSong, settingStorage, url;

url = require('../Tools/url');

musicDataCache = require('../musicDataCache');

settingStorage = require('../Tools/SettingStorage');

playlistSong = require('./playlistSong');

module.exports = function(data, downloaded) {
  var count, downloadedText, elText, i, j, len, playlistPoster, ref, song, songText, songs, syncPlaylist;
  if (downloaded == null) {
    downloaded = false;
  }
  data.albumtracks = data.albumtracks || data.tracks;
  musicDataCache.data["playlist" + data.id] = data;
  musicDataCache.more["playlist" + data.id] = data;
  playlistPoster = "./assets/images/logo.png";
  if (data.albumtracks.length > 3) {
    playlistPoster = "http://getsongg.com/dappimages/playlist_" + data.id + ".jpg";
  }
  downloadedText = "";
  if (downloaded === true) {
    downloadedText = "downloaded=\"true\"";
  }
  elText = "Song";
  if (window.lang === "fa") {
    elText = "موسیقی";
  }
  songs = "";
  count = 0;
  ref = data.albumtracks;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    song = ref[i];
    count++;
    songText = playlistSong(song, downloaded);
    if (songText === "" || songText === false) {
      count--;
    }
    if (songText !== false) {
      songs = songs + songText;
    }
  }
  syncPlaylist = "";
  if (settingStorage.get("playlist-" + data.id)) {
    syncPlaylist = " data-synced=\"true\" ";
  }
  return "<div class=\"main-item main-item-playlist\" id=\"item-album\" data-playlist-id=\"" + data.id + "\" data-playlist-name=\"" + data.groupname + "\" " + syncPlaylist + " " + downloadedText + ">\n	<div class=\"main-item-titles\">\n		<div class=\"main-item-titles-title\"><span class=\"main-item-titles-title-count\">" + count + "</span> " + elText + "</div>\n		<div class=\"main-item-titles-artist\">" + data.groupname + "</div>\n		<div class=\"main-item-playlist-sync\"></div>\n	</div>\n	<div></div><div></div>\n	<div class=\"main-item-humberger-icon\" id=\"item-playlist-humberger\"></div>\n	<div class=\"main-item-album-songs\">" + songs + "</div>\n	<img class=\"main-item-poster\" src=\"" + playlistPoster + "\">\n</div>";
};



},{"../Tools/SettingStorage":27,"../Tools/url":30,"../musicDataCache":52,"./playlistSong":19}],14:[function(require,module,exports){
var settingStorage, url;

settingStorage = require('../Tools/SettingStorage');

url = require('../Tools/url');

module.exports = function(data, i, id) {
  var div, mp3;
  if (data == null) {
    return;
  }
  mp3 = data.mp3;
  if (settingStorage.get("play-default-quality") === "high") {
    mp3 = data.mp3 || data.mp3_low;
  } else {
    mp3 = data.mp3_low || data.mp3;
  }
  if (mp3 === void 0 || mp3 === null) {
    return;
  }
  div = "";
  if (i === id) {
    div = "<div class=\"queue-item queue-item-playing\" data-mp3=\"" + mp3 + "\" data-queue-id=\"" + i + "\" id=\"item-queue-song-play\" data-song-id=\"" + data.id + "\"><span class=\"queue-item-number\">" + (i + 1) + "</span><span class=\"queue-item-name\">" + data.songname + "</span><span class=\"queue-item-artist\">" + data.artist + "</span><div class=\"queue-item-playing-icon\"></div><div class=\"queue-item-poster\"><img src=\"" + (url(data.poster)) + "\"/></div><div class=\"main-item-humberger-icon\" id=\"item-song-humberger\"></div><div class=\"main-item-titles-view\"></div></div>";
  } else {
    div = "<div class=\"queue-item\" data-mp3=\"" + mp3 + "\" data-queue-id=\"" + i + "\" id=\"item-queue-song-play\" data-song-id=\"" + data.id + "\"><span class=\"queue-item-number\" data-mp3=\"" + mp3 + "\" id=\"item-song-play\" data-song-id=\"" + data.id + "\">" + (i + 1) + "</span><span class=\"queue-item-name\">" + data.songname + "</span><span class=\"queue-item-artist\">" + data.artist + "</span><div class=\"queue-item-poster\"><img src=\"" + (url(data.poster)) + "\"/></div><div class=\"main-item-humberger-icon\" id=\"item-song-humberger\"></div><div class=\"main-item-titles-view\"></div></div>";
  }
  return div;
};



},{"../Tools/SettingStorage":27,"../Tools/url":30}],15:[function(require,module,exports){
module.exports = function(data, fa) {
  var d, div, i, j, lable, len;
  if (typeof leftIcon !== "undefined" && leftIcon !== null) {
    div = "<div class=\"main-item main-item-segmented\"><span class=\"main-item-segmented-left\" id=\"segmented-" + leftIcon + "\"><div class=\"main-item-segmented-left-icon\"></div><span class=\"main-item-segmented-left-text\">" + leftIcon + "</span></span><span class=\"segmented\">";
  } else {
    div = "<div class=\"main-item main-item-segmented\"><span class=\"segmented\">";
  }
  for (i = j = 0, len = data.length; j < len; i = ++j) {
    d = data[i];
    lable = d[0].toUpperCase() + d.slice(1);
    if (window.lang === "fa") {
      lable = fa[i];
    }
    div = div + ("<span class=\"segmented-label\" id=\"segmented-" + d + "\">" + lable + "</span>");
  }
  div = div + "</span></div>";
  return div;
};



},{}],16:[function(require,module,exports){
var Touch, autoPlayChk, changeCheckboxState, getAbout, historyManage, login, repeat, searchHistory, settingStorage, shuffle, tries;

login = require('../login');

settingStorage = require('../Tools/SettingStorage');

Touch = require('simple-touch');

historyManage = require('../historyManage');

searchHistory = require('../searchHistory');

shuffle = settingStorage.get("shuffle");

repeat = settingStorage.get("repeat");

autoPlayChk = settingStorage.get("auto-play-switch");

if (shuffle === null || shuffle === void 0) {
  settingStorage.set("shuffle", 0);
}

if (repeat === null || repeat === void 0) {
  settingStorage.set("repeat", 0);
}

if (autoPlayChk === null || autoPlayChk === void 0) {
  settingStorage.set("autoPlayChk", "on");
  window.autoPlay = true;
} else if (autoPlayChk === "on") {
  window.autoPlay = true;
} else {
  window.autoPlay = false;
}

changeCheckboxState = function(chk) {
  if (chk.checked) {
    chk.checked = false;
    return false;
  } else {
    chk.checked = true;
    return true;
  }
};

Touch.onTap("play-default-quality").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var chk, state;
    event.preventDefault();
    state;
    if (event.listener.type === "checkbox") {
      state = changeCheckboxState(event.listener);
    } else {
      chk = event.listener.querySelector(".ios-switch");
      state = changeCheckboxState(chk);
    }
    if (state) {
      settingStorage.set("play-default-quality", "high");
    } else {
      settingStorage.set("play-default-quality", "low");
    }
    return false;
  };
})(this));

Touch.onTap("download-default-quality").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var chk, state;
    event.preventDefault();
    state;
    if (event.listener.type === "checkbox") {
      state = changeCheckboxState(event.listener);
    } else {
      chk = event.listener.querySelector(".ios-switch");
      state = changeCheckboxState(chk);
    }
    if (state) {
      settingStorage.set("download-default-quality", "high");
    } else {
      settingStorage.set("download-default-quality", "low");
    }
    return false;
  };
})(this));

Touch.onTap("auto-play-switch").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var chk, state;
    event.preventDefault();
    state;
    if (event.listener.type === "checkbox") {
      state = changeCheckboxState(event.listener);
    } else {
      chk = event.listener.querySelector(".ios-switch");
      state = changeCheckboxState(chk);
    }
    window.autoPlay = state;
    if (state) {
      settingStorage.set("auto-play-switch", "on");
    } else {
      settingStorage.set("auto-play-switch", "off");
    }
    return false;
  };
})(this));

tries = 0;

getAbout = function() {
  var oReq, transferComplete, transferFailed;
  transferComplete = (function(_this) {
    return function(evt) {
      var aboutDiv;
      aboutDiv = evt.target.responseText;
    };
  })(this);
  transferFailed = (function(_this) {
    return function(evt) {
      tries++;
      if (tries < 10) {
        return getAbout();
      }
    };
  })(this);
  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", transferComplete, false);
  oReq.addEventListener("error", transferFailed, false);
  oReq.addEventListener("abort", transferFailed, false);
  oReq.addEventListener("timeout", transferFailed, false);
  oReq.open("get", SERVER_ADDRESS + "about", true);
  oReq.timeout = window.TIMEOUT;
  return oReq.send();
};

module.exports = function() {
  var aboutDiv, aboutFullText, aboutText, autoplayChecked, downloadChecked, langChangeText, playChecked;
  playChecked = "";
  if (settingStorage.get("play-default-quality") === "high") {
    playChecked = "checked";
  }
  downloadChecked = "checked";
  if (settingStorage.get("download-default-quality") === "low") {
    downloadChecked = "";
  }
  autoplayChecked = "checked";
  window.autoPlay = true;
  if (settingStorage.get("auto-play-switch") === "off") {
    autoplayChecked = "";
    window.autoPlay = false;
  }
  langChangeText = "فا";
  if (window.lang === "fa") {
    langChangeText = "en";
  }
  aboutText = "About Us";
  if (window.lang === "fa") {
    aboutText = "درباره ما";
  }
  aboutDiv = "<div class=\"main-item maxWidth custom-about\" id=\"more-option-About_us\">\n	<div class=\"custom-about-text\">\n		<div id=\"label-about-text\">\n			<div class=\"segmented-label segmented-label-selected\">\n				" + aboutText + "\n			</div>\n		</div>\n	</div>\n</div>";
  aboutFullText = ("<div class=\"main-item maxWidth setting-defaults\" id=\"setting-logout\">\n	<div class=\"main-item-username\">" + login.query.username + "</div>\n	<div class=\"main-item-logout\">Logout</div>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"setting-lang\">\n	<div class=\"main-item-username\">Change language</div>\n	<div class=\"main-item-logout\">" + langChangeText + "</div>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"setting-clear-history\">\n	<div class=\"main-item-username\">Clear Play History</div>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"setting-clear-search-history\">\n	<div class=\"main-item-username\">Clear Search History</div>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"play-default-quality\">\n	<div class=\"main-item-default\">High quality play</div>\n   <label class=\"checkbox-setting\"><input type=\"checkbox\" class=\"ios-switch\" " + playChecked + " /><div><div></div></div></label>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"download-default-quality\">\n	<div class=\"main-item-default\">High quality download</div>\n	<label class=\"checkbox-setting\"><input type=\"checkbox\" class=\"ios-switch\"  " + downloadChecked + " /><div><div></div></div></label>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"auto-play-switch\">\n	<div class=\"main-item-default\">Auto play after queue</div>\n   <label class=\"checkbox-setting\"><input type=\"checkbox\" class=\"ios-switch\" " + autoplayChecked + " /><div><div></div></div></label>\n</div>") + aboutDiv;
  if (window.lang === "fa") {
    aboutFullText = ("<div class=\"main-item maxWidth setting-defaults\" id=\"setting-logout\">\n	<div class=\"main-item-username\">" + login.query.username + "</div>\n	<div class=\"main-item-logout\">خروج</div>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"setting-lang\">\n	<div class=\"main-item-username\">تغییر زبان</div>\n	<div class=\"main-item-logout\">" + langChangeText + "</div>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"setting-clear-history\">\n	<div class=\"main-item-username\">پاک کردن سابقه پخش</div>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"setting-clear-search-history\">\n	<div class=\"main-item-username\">پاک کردن سابقه جستجو</div>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"play-default-quality\">\n	<div class=\"main-item-default\">پخش با بالاترین کیفیت</div>\n   <label class=\"checkbox-setting\"><input type=\"checkbox\" class=\"ios-switch\" " + playChecked + " /><div><div></div></div></label>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"download-default-quality\">\n	<div class=\"main-item-default\">دانلود با بالاترین کیفیت</div>\n	<label class=\"checkbox-setting\"><input type=\"checkbox\" class=\"ios-switch\"  " + downloadChecked + " /><div><div></div></div></label>\n</div>\n<div class=\"main-item maxWidth setting-defaults\" id=\"auto-play-switch\">\n	<div class=\"main-item-default\">پخش خودکار بعد از لیست</div>\n   <label class=\"checkbox-setting\"><input type=\"checkbox\" class=\"ios-switch\" " + autoplayChecked + " /><div><div></div></div></label>\n</div>") + aboutDiv;
  }
  return aboutFullText;
};

Touch.onTap("setting-clear-history").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var callBackConfirmFunction, div, msgTxt, res;
    event.preventDefault();
    div = event.listener;
    div.style.backgroundColor = '';
    callBackConfirmFunction = function(button) {
      if (button === 1) {
        return historyManage.clean();
      }
    };
    msgTxt = "Clean history?";
    if (window.lang === "fa") {
      msgTxt = "پاک کردن سابقه؟";
    }
    if (navigator.notification != null) {
      return navigator.notification.confirm(msgTxt, callBackConfirmFunction, "History", ["Yes", "No"]);
    } else {
      res = confirm(msgTxt);
      if (res) {
        return callBackConfirmFunction(1);
      }
    }
  };
})(this));

Touch.onTap("setting-clear-search-history").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var callBackConfirmFunction, div, msgTxt, res;
    event.preventDefault();
    div = event.listener;
    div.style.backgroundColor = '';
    callBackConfirmFunction = function(button) {
      if (button === 1) {
        return searchHistory.clean();
      }
    };
    msgTxt = "Clean search history?";
    if (window.lang === "fa") {
      msgTxt = "پاک کردن سابقه جستجو؟";
    }
    if (navigator.notification != null) {
      return navigator.notification.confirm(msgTxt, callBackConfirmFunction, "History", ["Yes", "No"]);
    } else {
      res = confirm(msgTxt);
      if (res) {
        return callBackConfirmFunction(1);
      }
    }
  };
})(this));



},{"../Tools/SettingStorage":27,"../historyManage":38,"../login":43,"../searchHistory":62,"simple-touch":76}],17:[function(require,module,exports){
var musicDataCache, settingStorage, url;

musicDataCache = require('../musicDataCache');

url = require('../Tools/url');

settingStorage = require('../Tools/SettingStorage');

module.exports = function(data, downloaded, history) {
  var downloadedText, mp3, viewString;
  if (downloaded == null) {
    downloaded = false;
  }
  if (history == null) {
    history = false;
  }
  if (data == null) {
    return "";
  }
  mp3 = data.mp3;
  if (settingStorage.get("play-default-quality") === "high") {
    mp3 = data.mp3 || data.mp3_low;
  } else {
    mp3 = data.mp3_low || data.mp3;
  }
  if (mp3 === void 0 || mp3 === null) {
    return;
  }
  viewString = "<div class=\"main-item-titles-view-icon\"></div>" + data.view;
  downloadedText = "";
  if (downloaded === true) {
    downloadedText = "downloaded=\"true\"";
    viewString = "";
    musicDataCache.more[data.id] = data;
  }
  if (history === true) {
    downloadedText = "history=\"true\"";
    viewString = "";
    musicDataCache.more[data.id] = data;
  }
  data.poster = url(data.poster);
  data.poster_big = data.poster_600x600 || url(data.poster_big) || data.poster;
  data.poster_small = data.poster_60x60 || data.poster;
  musicDataCache.data[data.id] = data;
  return "<div class=\"main-item\" data-mp3=\"" + mp3 + "\" id=\"item-song-play\" data-song-id=\"" + data.id + "\" " + downloadedText + ">\n	<div class=\"main-item-poster\" style=\"opacity: 0\"><img src=\"" + (url(data.poster_small)) + "\" onLoad=\"this.parentNode.style.opacity = '';\" onError=\"this.src='./assets/images/ws.jpg';\"/></div>\n	<div class=\"main-item-titles\">\n		<div class=\"main-item-titles-title\">" + data.songname + "</div>\n		<div class=\"main-item-titles-artist\">" + data.artist + "</div>\n		<div class=\"main-item-titles-view\">" + viewString + "</div>\n	</div>\n	<div class=\"main-item-humberger-icon\" id=\"item-song-humberger\"></div>\n	<div class=\"main-item-poster menu-item-pause-icon\" id=\"item-song-pause\"></div>\n</div>";
};



},{"../Tools/SettingStorage":27,"../Tools/url":30,"../musicDataCache":52}],18:[function(require,module,exports){
var SongDownloading, musicDataCache, settingStorage, url;

musicDataCache = require('../musicDataCache');

url = require('../Tools/url');

settingStorage = require('../Tools/SettingStorage');


(function(DOMParser) {
    var DOMParser_proto = DOMParser.prototype
      , real_parseFromString = DOMParser_proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {}

    DOMParser_proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var doc = document.implementation.createHTMLDocument("")
              , doc_elt = doc.documentElement
              , first_elt;

            doc_elt.innerHTML = markup;
            first_elt = doc_elt.firstElementChild;

            if (doc_elt.childElementCount === 1
                && first_elt.localName.toLowerCase() === "html") {
                doc.replaceChild(first_elt, doc_elt);
            }

            return doc;
        } else {
            return real_parseFromString.apply(this, arguments);
        }
    };
}(DOMParser));
;

module.exports = SongDownloading = (function() {
  function SongDownloading(data1) {
    var doc, parser;
    this.data = data1;
    this.mp3 = this.data.mp3;
    if (settingStorage.get("download-default-quality") === "low") {
      this.mp3 = this.data.mp3_low || this.data.mp3;
    } else {
      this.mp3 = this.data.mp3 || this.data.mp3_low;
    }
    if (this.mp3 === void 0 || this.mp3 === null) {
      return;
    }
    this.data.poster = this.data.poster;
    this.data.poster_big = this.data.poster_600x600 || this.data.poster_big || this.data.poster;
    this.data.poster_small = this.data.poster_60x60 || this.data.poster;
    musicDataCache.data[this.data.id] = this.data;
    musicDataCache.more[this.data.id] = this.data;
    this.view = "Waiting for download";
    this.nodeHTML = "<div class=\"main-item\" data-mp3=\"" + this.mp3 + "\" id=\"item-song-download\" data-song-id=\"" + this.data.id + "\" download " + this._downloading + ">\n	<div class=\"main-item-poster\" style=\"opacity: 0\"><img src=\"" + (url(this.data.poster)) + "\" onLoad=\"this.parentNode.style.opacity = '';\" onError=\"this.src='./assets/images/ws.jpg';\"/></div>\n	<div class=\"main-item-titles\">\n		<div class=\"main-item-titles-title\">" + this.data.songname + "</div>\n		<div class=\"main-item-titles-artist\">" + this.data.artist + "</div>\n		<div class=\"main-item-titles-view\">" + this.view + "</div>\n	</div>\n	<div class=\"main-item-humberger-icon\" id=\"item-song-humberger\"></div>\n	<div class=\"menu-item-cancel-icon\" id=\"item-song-cancel\"></div>\n</div>";
    parser = new DOMParser();
    doc = parser.parseFromString(this.nodeHTML, "text/html");
    this.el = doc.querySelector(".main-item");
  }

  SongDownloading.prototype.getEl = function() {
    var el;
    if (this.el != null) {
      return this.el;
    }
    el = document.querySelector("div[data-song-id=\"" + this.data.id + "\"]");
    if ((el != null) && (el.getAttribute("download") != null)) {
      this.el = el;
      return this.el;
    }
    this.el = null;
    return false;
  };

  SongDownloading.prototype.setView = function(v) {
    if (v != null) {
      this.view = v;
    } else {
      this.view = "" + this.data.view;
    }
    this.getEl();
    if (this.el != null) {
      this.viewEl = this.el.querySelector(".main-item-titles-view");
      if (this.viewEl == null) {
        this.viewEl = this.el.querySelector(".menu-item-album-song-view");
      }
      return this.viewEl.innerHTML = this.view;
    }
  };

  SongDownloading.prototype.setDone = function() {
    this._downloading = "";
    this.getEl();
    if (this.el != null) {
      return this.el.removeAttribute("data-downloading");
    }
  };

  SongDownloading.prototype.setDownloading = function() {
    this._downloading = "data-downloading=\"true\"";
    this.getEl();
    if (this.el != null) {
      return this.el.setAttribute("data-downloading", "true");
    }
  };

  SongDownloading.prototype.get = function() {
    return this.el;
  };

  SongDownloading.prototype.setDownloaded = function() {
    var data, div, e, mp3, parent;
    this.getEl();
    if (this.el != null) {
      data = this.data;
      mp3 = data.mp3_low || data.mp3;
      if (mp3 === void 0 || mp3 === null) {
        return;
      }
      data.poster = url(data.poster);
      data.poster_big = url(data.poster_big) || data.poster;
      musicDataCache.data[data.id] = data;
      musicDataCache.more[data.id] = data;
      div = "<div class=\"main-item\" data-mp3=\"" + mp3 + "\" id=\"item-song-play\" data-song-id=\"" + data.id + "\" downloaded=\"true\">\n	<div class=\"main-item-poster\" style=\"opacity: 0\"><img src=\"" + (url(data.poster)) + "\" onLoad=\"this.parentNode.style.opacity = '';\" onError=\"this.src='./assets/images/ws.jpg';\"/></div>\n	<div class=\"main-item-titles\">\n		<div class=\"main-item-titles-title\">" + data.songname + "</div>\n		<div class=\"main-item-titles-artist\">" + data.artist + "</div>\n		<div class=\"main-item-titles-view\"></div>\n	</div>\n	<div class=\"main-item-humberger-icon\" id=\"item-song-humberger\"></div>\n	<div class=\"menu-item-pause-icon\" id=\"item-song-pause\"></div>\n</div>";
      e = document.createElement('div');
      e.innerHTML = div;
      parent = this.el.parentNode;
      parent.insertBefore(e, this.el);
      return parent.removeChild(this.el);
    }
  };

  SongDownloading.prototype.skip = function() {
    this._downloading = "";
    try {
      this.el.parentNode.removeChild(this.el);
    } catch (undefined) {}
    return this.el = document.createElement("div");
  };

  return SongDownloading;

})();



},{"../Tools/SettingStorage":27,"../Tools/url":30,"../musicDataCache":52}],19:[function(require,module,exports){
var musicDataCache, settingStorage, url;

url = require('../Tools/url');

musicDataCache = require('../musicDataCache');

settingStorage = require('../Tools/SettingStorage');

module.exports = function(song, downloaded) {
  var downloadedText, mp3;
  if (downloaded == null) {
    downloaded = false;
  }
  if (song == null) {
    return "";
  }
  mp3 = song.mp3;
  if (settingStorage.get("play-default-quality") === "high") {
    mp3 = song.mp3 || song.mp3_low;
  } else {
    mp3 = song.mp3_low || song.mp3;
  }
  downloadedText = "";
  if (downloaded === true) {
    downloadedText = "downloaded=\"true\"";
  }
  if (mp3 === void 0 || mp3 === null) {
    return false;
  }
  musicDataCache.data[song.id] = song;
  musicDataCache.more[song.id] = song;
  song.poster = url(song.poster);
  song.poster_big = song.poster_600x600 || url(song.poster_big) || song.poster;
  song.poster_small = song.poster_60x60 || song.poster;
  return "<div class=\"main-item-album-song\" data-mp3=\"" + mp3 + "\" id=\"item-song-play\" data-kind=\"album-song\" data-song-id=\"" + song.id + "\"  " + downloadedText + ">\n	<div class=\"menu-item-album-song-number\"></div>\n	<div class=\"menu-item-album-song-title\">" + song.songname + "</div>\n	<div class=\"menu-item-album-song-artist\">" + song.artist + "</div>\n	<div class=\"menu-item-pause-icon\" id=\"item-song-pause\"></div>\n	<div class=\"menu-item-album-song-view\"><div class=\"main-item-titles-view-icon\"></div>" + song.view + "</div>\n	<div class=\"main-item-humberger-icon main-item-album-song-humberger-icon\" id=\"item-song-humberger\"></div>\n	<div class=\"main-item-poster\" style=\"opacity: 0\"><img src=\"" + (url(song.poster_small)) + "\" onLoad=\"this.parentNode.style.opacity = '';\" onError=\"this.src='./assets/images/ws.jpg';\"/></div>\n</div>";
};



},{"../Tools/SettingStorage":27,"../Tools/url":30,"../musicDataCache":52}],20:[function(require,module,exports){
module.exports = function(query, placeholder) {
  var elText;
  if (placeholder == null) {
    placeholder = "";
  }
  elText = "Search everything";
  if (window.lang === "fa") {
    elText = "جستجو در همه موارد";
  }
  if (query === "") {
    return "<div id=\"search-container\" class=\"main-item main-item-search\">\n	<div class=\"main-item-search-input\">\n		<input type=\"search\" placeholder=\"" + elText + "\" id=\"search-input\">\n	</div>\n	<div class=\"main-item-search-btn\" id=\"search-button\"></div>\n</div>\n<div class=\"main-item-search-history\"></div>";
  }
  return "<div id=\"search-container\" class=\"main-item main-item-search\">\n	<div class=\"main-item-search-input\">\n		<input type=\"search\" placeholder=\"" + elText + "\" id=\"search-input\" value=\"" + query + "\">\n	</div>\n	<div class=\"main-item-search-btn\" id=\"search-button\"></div>\n	<div class=\"main-item-search-icon\" id=\"search-cancel\"></div>\n</div>\n<div class=\"main-item-search-history\"></div>";
};



},{}],21:[function(require,module,exports){
var Loading;

Loading = (function() {
  function Loading() {
    this.node = document.querySelector('.loading');
  }

  Loading.prototype.show = function() {
    return this.node.style.display = "block";
  };

  Loading.prototype.hide = function() {
    return this.node.style.display = "none";
  };

  return Loading;

})();

module.exports = new Loading;



},{}],22:[function(require,module,exports){
var Touch, backButton, hideMenu, menu, menuArtistTitle, menuRequest, showMenu, showingMore;

Touch = require('simple-touch');

menuRequest = require('./MenuRequest');

backButton = require('./BackButton');

menu = document.querySelector('.menu');

menuArtistTitle = menu.children[2].querySelector(".menu-box-item#item-artist");

showingMore = false;

showMenu = function(number) {
  var child, i, index, len, ref;
  backButton.activate('menu');
  menu.style.visibility = "visible";
  ref = menu.children;
  for (index = i = 0, len = ref.length; i < len; index = ++i) {
    child = ref[index];
    if (index === 0) {
      continue;
    }
    if (index === number) {
      child.style.display = "";
    } else {
      child.style.display = "none";
    }
  }
  setTimeout((function(_this) {
    return function() {
      menu.children[0].style.opacity = .6;
      menu.children[number].style.transform = "translateY(0px)";
      return menu.children[number].style.webkitTransform = "translateY(0px)";
    };
  })(this), 10);
  if (number === 6) {
    menu.style.bottom = "57px";
  } else {
    menu.style.bottom = "";
  }
};

hideMenu = function() {
  var child, i, index, len, menuHeight, ref;
  showingMore = false;
  backButton.deactive('menu');
  menuHeight = menu.getBoundingClientRect().height;
  ref = menu.children;
  for (index = i = 0, len = ref.length; i < len; index = ++i) {
    child = ref[index];
    if (index === 0) {
      child.style.opacity = 0;
    } else {
      child.style.transform = "translateY(" + menuHeight + "px)";
      child.style.webkitTransform = "translateY(" + menuHeight + "px)";
    }
  }
  return setTimeout((function(_this) {
    return function() {
      return menu.style.visibility = "hidden";
    };
  })(this), 500);
};

Touch.onTap("item-song-humberger").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onDone((function(_this) {
  return function(event) {
    menuRequest.data = event.listener.parentNode;
    return showMenu(1);
  };
})(this));

Touch.onTap("item-nowplaying-humberger").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onDone((function(_this) {
  return function(event) {
    event.listener.setAttribute("data-song-id", window.playingMusicData.id);
    menuArtistTitle.setAttribute("data-artist-id", window.playingMusicData.artist_id);
    menuArtistTitle.setAttribute("data-artist-name", window.playingMusicData.artist);
    menuRequest.data = event.listener;
    return showMenu(2);
  };
})(this));

Touch.onTap("item-album-humberger").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onDone((function(_this) {
  return function(event) {
    menuRequest.data = event.listener.parentNode;
    return showMenu(4);
  };
})(this));

Touch.onTap("item-artist-humberger").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onDone((function(_this) {
  return function(event) {
    menuRequest.data = event.listener.parentNode;
    return showMenu(3);
  };
})(this));

Touch.onTap("item-playlist-humberger").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onDone((function(_this) {
  return function(event) {
    menuRequest.data = event.listener.parentNode;
    return showMenu(5);
  };
})(this));

Touch.onTap("icon-playlist").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onDone((function(_this) {
  return function(event) {
    menuRequest.data = event.listener.parentNode;
    if (showingMore) {
      showingMore = false;
      return hideMenu();
    } else {
      showingMore = true;
      return showMenu(6);
    }
  };
})(this));

Touch.onTap("menu-box-cancel").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    return hideMenu();
  };
})(this));

Touch.onTap("menu-close").onStart((function(_this) {
  return function(event) {
    return hideMenu();
  };
})(this));

backButton.add('menu', function() {
  return hideMenu();
});

module.exports = {
  openMenu: (function(_this) {
    return function() {
      return showMenu(7);
    };
  })(this),
  closeMenu: (function(_this) {
    return function() {
      return hideMenu();
    };
  })(this),
  updateSubpageContent: function(div) {
    return menu.children[7].innerHTML = div;
  }
};



},{"./BackButton":3,"./MenuRequest":23,"simple-touch":76}],23:[function(require,module,exports){
module.exports = {
  data: null
};



},{}],24:[function(require,module,exports){
var APP_VERSION_CODE, PageManager, cache, login, request, serialize;

APP_VERSION_CODE = "3";

cache = require('js-cache');

request = require('superagent');

login = require('./login');

serialize = require('./Tools/serialize');

module.exports = PageManager = (function() {
  function PageManager(cbDone, cbFail, cbAbort, cbLowSpeed) {
    this.cbDone = cbDone;
    this.cbFail = cbFail;
    this.cbAbort = cbAbort;
    this.cbLowSpeed = cbLowSpeed;
    this.times = 0;
  }

  PageManager.prototype.refresh = function() {
    return this.page = 1;
  };

  PageManager.prototype.home = function(order, query) {
    if (query == null) {
      query = "";
    }
    if (query === "") {
      this.address = "getnewcases";
      this.query = {
        page: this.page,
        "1": "1",
        lang: window.lang,
        v: APP_VERSION_CODE
      };
    } else {
      this.address = "";
      this.query = {
        page: this.page,
        type: "all",
        lang: window.lang,
        v: APP_VERSION_CODE,
        query: query,
        order: "top"
      };
    }
    return this.get();
  };

  PageManager.prototype.artist = function(order, query) {
    if (query == null) {
      query = "";
    }
    this.address = "";
    this.query = {
      page: this.page,
      type: "artist",
      lang: window.lang,
      v: APP_VERSION_CODE,
      query: query,
      sid: login.sid
    };
    return this.get();
  };

  PageManager.prototype.song = function(order, query) {
    if (query == null) {
      query = "";
    }
    this.address = "";
    this.query = {
      page: this.page,
      type: "title",
      order: order,
      query: query,
      lang: window.lang,
      v: APP_VERSION_CODE
    };
    return this.get();
  };

  PageManager.prototype.album = function(order, query) {
    if (query == null) {
      query = "";
    }
    this.address = "";
    this.query = {
      page: this.page,
      type: "album",
      order: order,
      query: query,
      lang: window.lang,
      v: APP_VERSION_CODE
    };
    return this.get();
  };

  PageManager.prototype.artistExpanded = function(order, id, songFilter, albumFilter, query) {
    if (query == null) {
      query = "";
    }
    this.address = "getnewcases";
    this.query = {
      signer_id: id,
      lang: window.lang,
      v: APP_VERSION_CODE,
      order: order,
      page: this.page,
      sid: login.sid
    };
    if (!(songFilter && albumFilter)) {
      if (songFilter) {
        this.query.just_song = 1;
      }
      if (albumFilter) {
        this.query.just_album = 1;
      }
    }
    return this.get();
  };

  PageManager.prototype.genreExpanded = function(order, id, query) {
    if (query == null) {
      query = "";
    }
    this.address = "";
    this.query = {
      page: this.page,
      type: "playlist",
      id: id,
      lang: window.lang,
      v: APP_VERSION_CODE
    };
    return this.get();
  };

  PageManager.prototype.playlist = function() {
    this.address = "getuserplaylist";
    this.query = {
      sid: login.sid,
      lang: window.lang,
      v: APP_VERSION_CODE
    };
    return this.get();
  };

  PageManager.prototype.abortLast = function() {
    if (this.oReq != null) {
      this.oReq.abort();
      return this.oReq = null;
    }
  };

  PageManager.prototype.get = function() {
    var addressToMakeRequest, cacheResult, transferCanceled, transferComplete, transferFailed, transferTimeout;
    this.abortLast();
    addressToMakeRequest = SERVER_ADDRESS + this.address + "?" + serialize(this.query);
    cacheResult = cache.get(addressToMakeRequest);
    if (cacheResult != null) {
      this.page++;
      this.cbDone(JSON.parse(cacheResult));
      this.times = 0;
      return;
    }
    transferComplete = (function(_this) {
      return function(evt) {
        var resultJson;
        _this.page++;
        resultJson = evt.target.responseText;
        _this.cbDone(JSON.parse(resultJson));
        cache.set(addressToMakeRequest, resultJson, 10 * 60 * 1000);
        _this.times = 0;
      };
    })(this);
    transferFailed = (function(_this) {
      return function(evt) {
        _this.cbFail(evt);
        return _this.times = 0;
      };
    })(this);
    transferTimeout = (function(_this) {
      return function(evt) {
        _this.times++;
        if (_this.times > 10) {
          _this.cbFail(evt);
          _this.cbLowSpeed();
          return _this.times = 0;
        } else {
          return _this.get();
        }
      };
    })(this);
    transferCanceled = (function(_this) {
      return function(evt) {
        _this.cbAbort();
        return _this.times = 0;
      };
    })(this);
    this.oReq = new XMLHttpRequest();
    this.oReq.addEventListener("load", transferComplete, false);
    this.oReq.addEventListener("error", transferFailed, false);
    this.oReq.addEventListener("abort", transferCanceled, false);
    this.oReq.addEventListener("timeout", transferTimeout, false);
    this.oReq.open("get", addressToMakeRequest, true);
    this.oReq.timeout = window.TIMEOUT;
    return this.oReq.send();
  };

  return PageManager;

})();



},{"./Tools/serialize":29,"./login":43,"js-cache":70,"superagent":77}],25:[function(require,module,exports){
var Queue, settingsStorage;

settingsStorage = require('./Tools/SettingStorage');

module.exports = Queue = (function() {
  function Queue() {
    this.divQueue = [];
    this.dataQueue = [];
    this.i = 0;
    this.playedInShuffle = {};
  }

  Queue.prototype.add = function(div, data) {
    this.remove(div);
    this.divQueue.push(div);
    this.dataQueue.push(data);
    if (this.onChangeCallback != null) {
      this.onChangeCallback(this.dataQueue, this.i);
    }
  };

  Queue.prototype.addNext = function(div, data) {
    var insetionId;
    this.remove(div);
    insetionId = this.i + 1;
    if (this.i === this.divQueue.length) {
      insetionId = 0;
    }
    this.divQueue.splice(insetionId, 0, div);
    this.dataQueue.splice(insetionId, 0, data);
    if (this.onChangeCallback != null) {
      this.onChangeCallback(this.dataQueue, this.i);
    }
  };

  Queue.prototype.remove = function(targetDiv) {
    this.removeBySongId(targetDiv.getAttribute("data-song-id"));
  };

  Queue.prototype.removeBySongId = function(id, noCb) {
    var div, foundId, index, j, len, ref;
    if (noCb == null) {
      noCb = false;
    }
    foundId = null;
    ref = this.divQueue;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      div = ref[index];
      if (div.getAttribute("data-song-id") === id) {
        foundId = index;
      }
    }
    if (foundId != null) {
      if (foundId < this.i) {
        this.i--;
      }
      this.divQueue.splice(foundId, 1);
      this.dataQueue.splice(foundId, 1);
      if (noCb === true) {
        return;
      }
      if (this.onChangeCallback != null) {
        this.onChangeCallback(this.dataQueue, this.i);
      }
    }
  };

  Queue.prototype.checkExisting = function(id) {
    var div, index, j, len, ref;
    ref = this.divQueue;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      div = ref[index];
      if (div.getAttribute("data-song-id") === id) {
        return true;
      }
    }
    return false;
  };

  Queue.prototype.removeAllExceptPlaying = function() {
    this.divQueue = [this.divQueue[this.i]];
    this.dataQueue = [this.dataQueue[this.i]];
    this.i = 0;
    if (this.onChangeCallback != null) {
      return this.onChangeCallback(this.dataQueue, this.i);
    }
  };

  Queue.prototype.jumpToEnd = function() {
    return this.i = this.divQueue.length - 1;
  };

  Queue.prototype.jumpTo = function(i) {
    if (!(i < this.divQueue.length)) {
      return;
    }
    this.i = i;
    if (this.onChangeCallback != null) {
      this.onChangeCallback(this.dataQueue, this.i);
    }
  };

  Queue.prototype.get = function(i) {
    return {
      div: this.divQueue[i],
      data: this.dataQueue[i]
    };
  };

  Queue.prototype.next = function() {
    var repeat, shuffle;
    shuffle = settingsStorage.get("shuffle");
    repeat = settingsStorage.get("repeat");
    if (shuffle === 0) {
      this.i++;
      if (this.i >= this.divQueue.length) {
        if (repeat === 0) {
          this.i--;
          return false;
        }
        this.i = 0;
      }
      if (this.onChangeCallback != null) {
        this.onChangeCallback(this.dataQueue, this.i);
      }
      return {
        div: this.divQueue[this.i],
        data: this.dataQueue[this.i]
      };
    } else {
      this.i = Math.floor(Math.random() * this.divQueue.length);
      while (this.playedInShuffle[this.dataQueue[this.i].id]) {
        this.i = Math.floor(Math.random() * this.divQueue.length);
        if (Object.keys(this.playedInShuffle).length === this.divQueue.length) {
          this.playedInShuffle = {};
          if (repeat === 0) {
            return false;
          }
          break;
        }
      }
      this.playedInShuffle[this.dataQueue[this.i].id] = true;
      if (this.onChangeCallback != null) {
        this.onChangeCallback(this.dataQueue, this.i);
      }
      return {
        div: this.divQueue[this.i],
        data: this.dataQueue[this.i]
      };
    }
  };

  Queue.prototype.prev = function() {
    this.i--;
    if (this.i < 0) {
      this.i = this.divQueue.length - 1;
    }
    if (this.onChangeCallback != null) {
      this.onChangeCallback(this.dataQueue, this.i);
    }
    return {
      div: this.divQueue[this.i],
      data: this.dataQueue[this.i]
    };
  };

  Queue.prototype.onChange = function(onChangeCallback) {
    this.onChangeCallback = onChangeCallback;
  };

  Queue.prototype.getData = function() {
    return {
      data: this.dataQueue,
      id: this.i
    };
  };

  return Queue;

})();



},{"./Tools/SettingStorage":27}],26:[function(require,module,exports){
var MenuManagement, Queue, QueueItem, Touch, _setCoverPosition, ad, audio, backButton, closePlayer, countForAd, cover, covercover, currentTime, disableOpenTop, disableSlideshowMove, errorTimes, failedUpdateSegments, fav, findMusicInPlaylist, flashMessage, hideNowPlayingAndQueue, historyManage, info, infoDate, infoDesc, infoDivs, infoDownloads, infoLength, infoLoading, infoRate, infoSize, infoViews, jumpToNowPlaying, lastMp3Div, loadTrackDetail, lyric, main, menuRequest, miniImageNode, miniPlayNode, miniPlayerHeight, miniPlayerNode, miniTitlesNode, move, musicDataCache, newX, nowPlaying, nowPlayingSelector, open, openPlayer, openedOn, playDiv, playMusic, playNode, playQueue, playQueueHolder, playQueueSelector, playerNode, playlistManager, queue, repeatShuffle, repositionCover, repositionCoverOndemend, seekBarHandle, seekBarHolder, seekBarMove, selects, setSlideShowPosition, setTransform, setTransition, settingsStorage, showLastOpened, showNowPlaying, showPlayQueue, slideshowPos, subtitle, timeout, titlesNode, top, updatePlayer, updateQueue, updateQueueOnDemend, updateSegments, x;

settingsStorage = require('./Tools/SettingStorage');

musicDataCache = require('./musicDataCache');

setTransition = require('./setTransition');

setTransform = require('./setTransform');

flashMessage = require('./FlashMessage');

menuRequest = require('./MenuRequest');

MenuManagement = require('./MenuManagement');

audio = require('./AudioManager');

Touch = require('simple-touch');

Queue = require('./Queue');

QueueItem = require('./Item/QueueItem');

subtitle = require('./subtitle');

loadTrackDetail = require('./loadTrackDetail');

backButton = require('./BackButton');

findMusicInPlaylist = require('./findMusicInPlaylist');

ad = require('./ad');

playlistManager = require('./getPlaylists');

repeatShuffle = require('./repeatShuffle');

historyManage = require('./historyManage');

queue = new Queue;

playNode = document.getElementById("player-play");

titlesNode = document.getElementById("player-titles");

miniTitlesNode = document.getElementById("mini-player-titles");

miniImageNode = document.getElementById("mini-player-image");

miniPlayNode = document.querySelector(".mini-player-icons-play");

fav = document.getElementById("player-fav");

window.mp3Div = null;

lastMp3Div = null;

window.playingMusicData = null;

slideshowPos = 0;

playMusic = function() {
  var address, msgTxt, musicAddress;
  historyManage.add(window.playingMusicData);
  if (typeof cordova !== "undefined" && cordova !== null) {
    musicAddress = null;
    musicAddress = settingsStorage.get(window.playingMusicData.id);
    if (musicAddress != null) {
      if (window.fs != null) {
        address = window.fs.root.toURL() + musicAddress;
        audio.play(encodeURI(address));
        musicAddress = null;
        address = null;
      } else {
        msgTxt = "Your phone not allow to play local file";
        if (window.lang === "fa") {
          msgTxt = "دستگاه شما اجازه پخش نمیدهد";
        }
        flashMessage.show(msgTxt);
        audio.play(encodeURI(window.mp3Div.getAttribute('data-mp3')));
      }
    } else {
      audio.play(encodeURI(window.mp3Div.getAttribute('data-mp3')));
    }
  } else {
    audio.play(window.mp3Div.getAttribute('data-mp3'));
  }
  return findMusicInPlaylist("FavoriteSongs", window.mp3Div.getAttribute('data-song-id'), function(found) {
    return fav.classList.add("top-icons-faved");
  });
};

module.exports = {
  checkIsPlaying: function(songId) {
    if (window.mp3Div != null) {
      if (window.mp3Div.getAttribute('data-song-id') === songId) {
        return true;
      }
    }
    return false;
  },
  changePlayingDiv: function(div) {
    lastMp3Div = window.mp3Div;
    window.mp3Div = div;
    return window.mp3Div.children[3].style.visibility = "visible";
  },
  closePlayer: function() {
    return closePlayer();
  }
};

audio.onPlayStatus((function(_this) {
  return function(playing) {
    if (playing === true) {
      window.mp3Div.children[3].style.visibility = "visible";
      updatePlayer(window.playingMusicData);
      playNode.classList.add("top-icons-pause");
      miniPlayNode.classList.add("top-icons-pause-mini");
      if (lastMp3Div != null) {
        lastMp3Div.children[3].style.visibility = "hidden";
      }
      return subtitle.updateContent(window.playingMusicData.id);
    } else {
      window.mp3Div.children[3].style.visibility = "hidden";
      playNode.classList.remove("top-icons-pause");
      return miniPlayNode.classList.remove("top-icons-pause-mini");
    }
  };
})(this));

audio.onPrevious(function() {
  var queueData;
  queueData = queue.prev();
  window.playingMusicData = queueData.data;
  window.mp3Div.children[3].style.visibility = "hidden";
  lastMp3Div = window.mp3Div;
  window.mp3Div = queueData.div;
  fav.classList.remove("top-icons-faved");
  playMusic();
  updateSegments();
  return loadTrackDetail(window.mp3Div.getAttribute('data-song-id'), updateSegments, failedUpdateSegments);
});

countForAd = 0;

audio.onPlayToEnd(function(event) {
  var queueData;
  countForAd++;
  if (countForAd === 3) {
    ad.interstitial();
    countForAd = 0;
  }
  queueData = queue.next();
  if (queueData === false && window.autoPlay === true) {
    queueData = window.backupQueue.pop();
    if (queueData != null) {
      while (queueData && queue.checkExisting(queueData.data.id)) {
        queueData = window.backupQueue.pop();
      }
    }
    if (queueData != null) {
      queueData.div = document.querySelector("[data-song-id='" + queueData.data.id + "']");
      if (queueData.div != null) {
        queue.add(queueData.div, queueData.data);
        queue.jumpToEnd();
      } else {
        queueData = false;
      }
    } else {
      queueData = false;
    }
  }
  if (queueData != null) {
    window.playingMusicData = queueData.data;
  }
  window.mp3Div.children[3].style.visibility = "hidden";
  if (event === "error" && queue.dataQueue.length === 1) {
    playNode.classList.remove("top-icons-pause");
    miniPlayNode.classList.remove("top-icons-pause-mini");
    return;
  }
  if (queueData === false) {
    playNode.classList.remove("top-icons-pause");
    miniPlayNode.classList.remove("top-icons-pause-mini");
    return;
  }
  lastMp3Div = window.mp3Div;
  window.mp3Div = queueData.div;
  fav.classList.remove("top-icons-faved");
  playMusic();
  updateSegments();
  return loadTrackDetail(window.mp3Div.getAttribute('data-song-id'), updateSegments, failedUpdateSegments);
});

audio.onTime(subtitle.tick);

seekBarHolder = document.querySelector('.top-seekbar');

seekBarMove = document.querySelector('.top-seekbar-move');

seekBarHandle = document.getElementById('seekbar-handle');

disableOpenTop = false;

x = 0;

currentTime = 0;

audio.onTimePercent(function(cent) {
  currentTime = cent;
  setTransform(seekBarMove, "scaleX(" + cent + ")");
  if (disableOpenTop === false) {
    x = cent * (window.innerWidth - 10);
    return setTransform(seekBarHandle, "translateX(" + x + "px)");
  }
});

window.addEventListener('resize', function() {
  var resizeNewX;
  resizeNewX = currentTime * (window.innerWidth - 10);
  return setTransform(seekBarHandle, "translateX(" + resizeNewX + "px)");
});

newX = 0;

Touch.onPan("seekbar-handle").onStart(function(event) {
  if (window.playingMusicData == null) {
    return;
  }
  return disableOpenTop = true;
}).onGeneralPan(function(event) {
  var cent;
  if (window.playingMusicData == null) {
    return;
  }
  newX = x - event.totalX;
  cent = newX / (window.innerWidth - 10);
  if (cent < 0) {
    newX = 0;
  } else if (1 < cent) {
    newX = window.innerWidth - 10;
  }
  return setTransform(event.listener, "translateX(" + newX + "px)");
}).onGeneralEnd(function() {
  var seekPosX;
  if (window.playingMusicData == null) {
    return;
  }
  x = x - event.totalX;
  seekPosX = newX / (window.innerWidth - 10);
  if ((0 < seekPosX && seekPosX < 1)) {
    audio.seekToPercent(seekPosX);
    setTransform(event.listener, "translateX(" + newX + "px)");
  }
  disableOpenTop = false;
  if (device.platform === 'Android') {
    audio["switch"]();
    return audio["switch"]();
  }
});

Touch.onTap("item-song-play").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    if (event.listener !== window.mp3Div) {
      return playDiv(event.listener);
    } else {
      return audio["switch"]();
    }
  };
})(this));

playDiv = function(div) {
  var albumData, albumSongDiv, i, j, len, musicData, ref, results;
  lastMp3Div = window.mp3Div;
  window.mp3Div = div;
  musicData = musicDataCache.data[window.mp3Div.getAttribute('data-song-id')];
  if (musicData == null) {
    musicData = musicDataCache.more[window.mp3Div.getAttribute('data-song-id')];
  }
  window.playingMusicData = musicData;
  queue.add(window.mp3Div, musicData);
  queue.jumpToEnd();
  fav.classList.remove("top-icons-faved");
  playMusic();
  updateSegments();
  loadTrackDetail(window.mp3Div.getAttribute('data-song-id'), updateSegments, failedUpdateSegments);
  if (window.mp3Div.getAttribute("data-kind") === "album-song") {
    albumData = musicDataCache.data["album" + window.mp3Div.parentNode.parentNode.getAttribute('data-album-id')];
    if (albumData == null) {
      albumData = musicDataCache.more["album" + window.mp3Div.parentNode.parentNode.getAttribute('data-album-id')];
    }
    if (albumData == null) {
      albumData = playlistManager.getOnePlaylist(window.mp3Div.parentNode.parentNode.getAttribute('data-playlist-id'));
    }
    ref = window.mp3Div.parentNode.children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      albumSongDiv = ref[i];
      if (window.mp3Div === albumSongDiv) {
        continue;
      }
      results.push(queue.addNext(albumSongDiv, albumData.albumtracks[i]));
    }
    return results;
  }
};

Touch.onTap("item-queue-song-play").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var queueData, queueId;
    queueId = parseInt(event.listener.getAttribute('data-queue-id'));
    queueData = queue.get(queueId);
    if (queueData.div !== window.mp3Div) {
      lastMp3Div = window.mp3Div;
      window.mp3Div = queueData.div;
      window.playingMusicData = queueData.data;
      queue.jumpTo(queueId);
      fav.classList.remove("top-icons-faved");
      playMusic();
      updateSegments();
      return loadTrackDetail(window.mp3Div.getAttribute('data-song-id'), updateSegments, failedUpdateSegments);
    } else {
      return audio["switch"]();
    }
  };
})(this));

Touch.onTap("player-prev").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var queueData;
    queueData = queue.prev();
    if (queueData.div == null) {
      return;
    }
    window.playingMusicData = queueData.data;
    lastMp3Div = window.mp3Div;
    window.mp3Div = queueData.div;
    fav.classList.remove("top-icons-faved");
    playMusic();
    updateSegments();
    return loadTrackDetail(window.mp3Div.getAttribute('data-song-id'), updateSegments, failedUpdateSegments);
  };
})(this));

Touch.onTap("player-play").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    return audio["switch"]();
  };
})(this));

Touch.onTap("player-next").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var queueData;
    queueData = queue.next();
    if (queueData.div == null) {
      return;
    }
    window.playingMusicData = queueData.data;
    lastMp3Div = window.mp3Div;
    window.mp3Div = queueData.div;
    fav.classList.remove("top-icons-faved");
    playMusic();
    updateSegments();
    return loadTrackDetail(window.mp3Div.getAttribute('data-song-id'), updateSegments, failedUpdateSegments);
  };
})(this));

Touch.onTap("menu-box-add-to-queue").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var msgTxt, musicData;
    MenuManagement.closeMenu();
    msgTxt = "Added to end of play queue";
    if (window.lang === "fa") {
      msgTxt = "به انتهای لیست پخش افزوده شد";
    }
    flashMessage.show(msgTxt);
    musicData = musicDataCache.data[menuRequest.data.getAttribute('data-song-id')];
    if (musicData == null) {
      musicData = musicDataCache.more[menuRequest.data.getAttribute('data-song-id')];
    }
    return queue.add(menuRequest.data, musicData);
  };
})(this));

Touch.onTap("menu-box-play-next").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var msgTxt, musicData;
    MenuManagement.closeMenu();
    msgTxt = "It will play next";
    if (window.lang === "fa") {
      msgTxt = "بعد از این موسیقی پخش میشود";
    }
    flashMessage.show(msgTxt);
    musicData = musicDataCache.data[menuRequest.data.getAttribute('data-song-id')];
    if (musicData == null) {
      musicData = musicDataCache.more[menuRequest.data.getAttribute('data-song-id')];
    }
    return queue.addNext(menuRequest.data, musicData);
  };
})(this));

Touch.onTap("menu-box-play-album").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var albumData, albumSongDiv, i, j, len, msgTxt, musicData, ref, results;
    MenuManagement.closeMenu();
    albumData = musicDataCache.data["album" + menuRequest.data.getAttribute('data-album-id')];
    if (albumData == null) {
      albumData = musicDataCache.more["album" + menuRequest.data.getAttribute('data-album-id')];
    }
    if (albumData != null) {
      msgTxt = "Playing " + albumData.album + " of " + albumData.artist;
      if (window.lang === "fa") {
        msgTxt = "پخش " + albumData.album + " از آلبوم " + albumData.artist;
      }
      flashMessage.show(msgTxt);
    } else {
      albumData = playlistManager.getOnePlaylist(menuRequest.data.getAttribute('data-playlist-id'));
      msgTxt = "Playing " + albumData.groupname;
      if (window.lang === "fa") {
        msgTxt = "پخش " + albumData.groupname;
      }
      flashMessage.show(msgTxt);
    }
    lastMp3Div = window.mp3Div;
    window.mp3Div = menuRequest.data.children[4].children[0];
    musicData = albumData.albumtracks[0];
    window.playingMusicData = musicData;
    queue.add(window.mp3Div, musicData);
    queue.jumpToEnd();
    fav.classList.remove("top-icons-faved");
    playMusic();
    updateSegments();
    loadTrackDetail(window.mp3Div.getAttribute('data-song-id'), updateSegments, failedUpdateSegments);
    ref = menuRequest.data.children[4].children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      albumSongDiv = ref[i];
      results.push(queue.add(albumSongDiv, albumData.albumtracks[i]));
    }
    return results;
  };
})(this));

Touch.onTap("menu-box-album-add-to-queue").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var albumData, albumSongDiv, i, j, len, msgTxt, ref, results;
    MenuManagement.closeMenu();
    albumData = musicDataCache.data["album" + menuRequest.data.getAttribute('data-album-id')];
    if (albumData == null) {
      albumData = musicDataCache.more["album" + menuRequest.data.getAttribute('data-album-id')];
    }
    if (albumData != null) {
      msgTxt = albumData.album + " of " + albumData.artist + " added to queue";
      if (window.lang === "fa") {
        msgTxt = albumData.album + " از " + albumData.artist + " به لیست پخش افزوده شد";
      }
      flashMessage.show(msgTxt);
    } else {
      albumData = playlistManager.getOnePlaylist(menuRequest.data.getAttribute('data-playlist-id'));
      msgTxt = albumData.groupname + " added to queue";
      if (window.lang === "fa") {
        msgTxt = albumData.groupname + " به لیست پخش افزوده شد";
      }
      flashMessage.show(msgTxt);
    }
    ref = menuRequest.data.children[4].children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      albumSongDiv = ref[i];
      results.push(queue.add(albumSongDiv, albumData.albumtracks[i]));
    }
    return results;
  };
})(this));

Touch.onTap("menu-box-album-play-next").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var albumData, albumSongDiv, i, j, len, msgTxt, ref, results;
    MenuManagement.closeMenu();
    albumData = musicDataCache.data["album" + menuRequest.data.getAttribute('data-album-id')];
    if (albumData == null) {
      albumData = musicDataCache.more["album" + menuRequest.data.getAttribute('data-album-id')];
    }
    if (albumData != null) {
      msgTxt = albumData.album + " of " + albumData.artist + " will play next";
      if (window.lang === "fa") {
        msgTxt = albumData.album + " از " + albumData.artist + " بعد از این موسیقی پخش میشود";
      }
      flashMessage.show(msgTxt);
    } else {
      albumData = playlistManager.getOnePlaylist(menuRequest.data.getAttribute('data-playlist-id'));
      msgTxt = albumData.groupname + " will play next";
      if (window.lang === "fa") {
        msgTxt = albumData.groupname + " بعد از این موسیقی پخش میشود";
      }
      flashMessage.show(msgTxt);
    }
    ref = menuRequest.data.children[4].children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      albumSongDiv = ref[i];
      results.push(queue.addNext(albumSongDiv, albumData.albumtracks[i]));
    }
    return results;
  };
})(this));

Touch.onTap("play-all-downloaded").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var downloadedSongDiv, downloadedSongs, i, j, len, musicData, otherMusicData, results;
    downloadedSongs = document.querySelectorAll('[downloaded="true"]');
    if (downloadedSongs === null || downloadedSongs === void 0 || downloadedSongs.length === 0) {
      downloadedSongs = document.querySelectorAll('[history="true"]');
    }
    lastMp3Div = window.mp3Div;
    window.mp3Div = downloadedSongs[0];
    if (downloadedSongs[0].id === "item-album") {
      downloadedSongs = downloadedSongs[0].children[4].children;
    }
    musicData = musicDataCache.data[downloadedSongs[0].getAttribute('data-song-id')];
    if (musicData == null) {
      musicData = musicDataCache.more[downloadedSongs[0].getAttribute('data-song-id')];
    }
    window.playingMusicData = musicData;
    queue.add(window.mp3Div, musicData);
    queue.jumpToEnd();
    fav.classList.remove("top-icons-faved");
    playMusic();
    updateSegments();
    loadTrackDetail(window.mp3Div.getAttribute('data-song-id'), updateSegments, failedUpdateSegments);
    results = [];
    for (i = j = 0, len = downloadedSongs.length; j < len; i = ++j) {
      downloadedSongDiv = downloadedSongs[i];
      otherMusicData = musicDataCache.data[downloadedSongs[i].getAttribute('data-song-id')];
      if (otherMusicData == null) {
        otherMusicData = musicDataCache.more[downloadedSongs[i].getAttribute('data-song-id')];
      }
      results.push(queue.add(downloadedSongDiv, otherMusicData));
    }
    return results;
  };
})(this));

top = document.getElementById("top");

main = document.querySelector(".main");

playerNode = document.querySelector(".player");

miniPlayerNode = document.querySelector(".mini-player");

miniPlayerHeight = miniPlayerNode.getBoundingClientRect().height;

move = window.innerHeight - miniPlayerHeight + 20;

if (typeof device !== "undefined" && device !== null) {
  if (typeof appAvailability !== "undefined" && appAvailability !== null) {
    if (device.platform === 'iOS') {
      move = window.innerHeight - miniPlayerHeight;
    }
  }
}

open = false;

top.style.transition = "all 0s";

setTransform(top, "translateY(" + (-move) + "px)");

setTimeout(function() {
  return top.style.transition = "";
}, 200);

window.addEventListener('resize', function() {
  move = window.innerHeight - miniPlayerHeight + 20;
  if (typeof device !== "undefined" && device !== null) {
    if (typeof appAvailability !== "undefined" && appAvailability !== null) {
      if (device.platform === 'iOS') {
        move = window.innerHeight - miniPlayerHeight;
      }
    }
  }
  if (open === true) {
    setSlideShowPosition(0);
  } else {
    setTransition(top, "transform", "0");
    setTransform(top, "translateY(" + (-move) + "px)");
    setTimeout(function() {
      return setTransition(top);
    }, 200);
  }
  return repositionCover();
});

backButton.add('player', function() {
  return closePlayer();
});

openPlayer = function() {
  jumpToNowPlaying();
  slideshowPos = 0;
  setSlideShowPosition(0);
  setTransform(top, "");
  playerNode.style.display = "inline-block";
  miniPlayerNode.style.display = "none";
  setTransform(seekBarHolder, "translateY(-100px)");
  backButton.activate('player');
  return open = true;
};

closePlayer = function() {
  hideNowPlayingAndQueue();
  setTransform(top, "translateY(" + (-move) + "px)");
  playerNode.style.display = "";
  miniPlayerNode.style.display = "";
  setTransform(seekBarHolder, "translateY(0px)");
  backButton.deactive('player');
  backButton.deactive('queue');
  return open = false;
};

Touch.onTap("player-expand").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var msgTxt;
    if (disableOpenTop) {
      return;
    }
    if (window.mp3Div === null) {
      msgTxt = "Play something to show full player";
      if (window.lang === "fa") {
        msgTxt = "هیچ چیز پخش نشده";
      }
      flashMessage.show(msgTxt);
      return;
    }
    openPlayer();
    return setTimeout(function() {
      var searchInput;
      searchInput = document.getElementById('search-input');
      return searchInput.blur();
    }, 100);
  };
})(this));

Touch.onPan("player-expand").onPan(function(event) {
  var msgTxt;
  if (disableOpenTop) {
    return;
  }
  if (event.totalY > -10) {
    return;
  }
  if (window.mp3Div === null) {
    msgTxt = "Play something to show full player";
    if (window.lang === "fa") {
      msgTxt = "هیچ چیز پخش نشده";
    }
    flashMessage.show(msgTxt);
    return;
  }
  openPlayer();
  return setTimeout(function() {
    var searchInput;
    searchInput = document.getElementById('search-input');
    return searchInput.blur();
  }, 100);
});

Touch.onPan("top").onPan(function(event) {
  if (event.totalY < 40) {
    return;
  }
  return closePlayer();
});

Touch.onTap("player-close").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap(closePlayer);

cover = document.getElementById("cover");

covercover = document.getElementById("covercover");

lyric = document.getElementById("lyric");

info = document.getElementById("info");

setTransform(lyric, "translateX(" + window.innerWidth + "px)");

setTransform(info, "translateX(" + window.innerWidth + "px)");

infoLoading = document.getElementById("info-loading");

infoDivs = document.getElementById("info-divs");

infoDownloads = document.getElementById("info-downloads");

infoViews = document.getElementById("info-views");

infoSize = document.getElementById("info-size");

infoLength = document.getElementById("info-length");

infoDate = document.getElementById("info-date");

infoRate = document.getElementById("info-rate");

infoDesc = document.getElementById("info-desc");

updateSegments = function(data) {
  if (data != null) {
    if (window.playingMusicData.id !== data.song[0].id) {
      return;
    }
    infoLoading.style.display = "none";
    infoDivs.style.display = "block";
    lyric.innerHTML = data.lyric || "<h3>No lyric to display</h3>";
    infoDownloads.style.display = "none";
    if (data.info.view != null) {
      infoViews.innerHTML = data.info.view + " Views";
      if (window.lang === "fa") {
        infoViews.innerHTML = data.info.view + " بار پخش شده";
      }
      infoViews.style.display = "block";
    } else {
      infoViews.style.display = "none";
    }
    infoSize.innerHTML = "File size: " + data.summary.size;
    if (window.lang === "fa") {
      infoSize.innerHTML = "حجم فایل: " + data.summary.size;
    }
    infoLength.innerHTML = "Music length: " + data.song[0].time;
    if (window.lang === "fa") {
      infoLength.innerHTML = "زمان ترانه: " + data.song[0].time;
    }
    infoDate.innerHTML = "Added at: " + data.song[0].date;
    if (window.lang === "fa") {
      infoDate.innerHTML = "درج در تاریخ: " + data.song[0].date;
    }
    infoRate.innerHTML = data.song[0].ratecount !== 0 ? "Rating: " + (data.song[0].popularity / data.song[0].ratecount) + " from " + data.song[0].ratecount + " votes" : "No vote for rate yet";
    if (window.lang === "fa") {
      infoRate.innerHTML = data.song[0].ratecount !== 0 ? "امتیاز " + (data.song[0].popularity / data.song[0].ratecount) + " از " + data.song[0].ratecount + " رای" : "هنوز امتیازی داده نشده";
    }
    if (data.info.descrip != null) {
      infoDesc.innerHTML = data.info.descrip;
      return infoDesc.style.display = "block";
    } else {
      return infoDesc.style.display = "none";
    }
  } else {
    lyric.innerHTML = "<h3>Loading Lyric</h3>";
    if (window.lang === "fa") {
      lyric.innerHTML = "<h3>در حال دریافت متن ترانه</h3>";
    }
    infoLoading.innerHTML = "<h3>Loading Info</h3>";
    if (window.lang === "fa") {
      infoLoading.innerHTML = "<h3>در حال دریافت جزییات</h3>";
    }
    infoLoading.style.display = "block";
    return infoDivs.style.display = "none";
  }
};

failedUpdateSegments = function(data) {
  lyric.innerHTML = "<h3>Loading Failed</h3>";
  infoLoading.innerHTML = "<h3>Loading Failed</h3>";
  if (window.lang === "fa") {
    lyric.innerHTML = "<h3>دریافت نشد!</h3>";
    infoLoading.innerHTML = "<h3>دریافت نشد!</h3>";
  }
  infoLoading.style.display = "block";
  return infoDivs.style.display = "none";
};

updatePlayer = function(musicData) {
  titlesNode.children[0].innerHTML = "<span>" + musicData.songname + "</span>";
  titlesNode.children[1].innerHTML = "<span>" + musicData.artist + "</span>";
  miniTitlesNode.children[0].innerHTML = musicData.songname;
  miniTitlesNode.children[1].innerHTML = musicData.artist;
  if (cover.children[0].children[0].src !== musicData.poster_big || musicData.poster) {
    cover.children[0].children[0].src = "./assets/images/ws.jpg";
    miniImageNode.src = "./assets/images/ws.jpg";
    repositionCover();
    cover.children[0].children[1].src = musicData.poster_big || musicData.poster;
  }
  return miniImageNode.src = musicData.poster_big || musicData.poster;
};

cover.children[0].children[0].addEventListener("load", (function(_this) {
  return function() {
    return repositionCover();
  };
})(this));

errorTimes = 0;

cover.children[0].children[1].addEventListener("error", (function(_this) {
  return function() {
    errorTimes++;
    if (errorTimes < 20) {
      cover.children[0].children[1].src = "./assets/images/ws.jpg";
      cover.children[0].children[1].src = window.playingMusicData.poster_big || window.playingMusicData.poster;
    } else {
      cover.children[0].children[1].src = "./assets/images/ws.jpg";
    }
    return repositionCover();
  };
})(this));

cover.children[0].children[1].addEventListener("load", (function(_this) {
  return function() {
    cover.children[0].children[0].src = cover.children[0].children[1].src;
    repositionCover();
    return errorTimes = 0;
  };
})(this));

nowPlaying = document.getElementById("top-tab-slide");

playQueue = document.getElementById("top-tab-queue");

Touch.onPan("top-tab-queue").onStart(function() {}).onPan(function() {});

nowPlayingSelector = document.getElementById("now-playing");

playQueueSelector = document.getElementById("play-queue");

openedOn = 0;

updateQueueOnDemend = false;

showNowPlaying = function() {
  if (openedOn === 0 && open === true) {
    return;
  }
  playQueue.style.display = "none";
  nowPlaying.style.display = "block";
  playQueueSelector.classList.remove("top-tab-selector-selected");
  nowPlayingSelector.classList.add("top-tab-selector-selected");
  backButton.deactive('queue');
  return openedOn = 0;
};

showPlayQueue = function() {
  var queueData;
  if (openedOn === 1 && open === true) {
    return;
  }
  if (updateQueueOnDemend !== false) {
    queueData = queue.getData();
    updateQueue(queueData.data, queueData.id);
  }
  backButton.activate('queue');
  playQueue.style.display = "block";
  nowPlaying.style.display = "none";
  playQueueSelector.classList.add("top-tab-selector-selected");
  nowPlayingSelector.classList.remove("top-tab-selector-selected");
  return openedOn = 1;
};

hideNowPlayingAndQueue = function() {
  if (open === false) {
    return;
  }
  playQueue.style.display = "none";
  return nowPlaying.style.display = "none";
};

showLastOpened = function() {
  if (openedOn === 0) {
    return showNowPlaying();
  } else if (openedOn === 1) {
    return showPlayQueue();
  }
};

jumpToNowPlaying = function() {
  openedOn = 0;
  backButton.deactive('queue');
  return showNowPlaying();
};

backButton.add('queue', function() {
  return showNowPlaying();
});

hideNowPlayingAndQueue();

Touch.onTap("play-queue").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap(showPlayQueue);

Touch.onTap("now-playing").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap(showNowPlaying);

queue.onChange(function(data, id) {
  if (open === false || openedOn === 0) {
    updateQueueOnDemend = true;
    return;
  }
  updateQueueOnDemend = false;
  updateQueue(data, id);
});

playQueueHolder = playQueue.querySelector(".top-tab-queue-holder");

updateQueue = function(data, id) {
  var d, div, i, j, len;
  div = "";
  for (i = j = 0, len = data.length; j < len; i = ++j) {
    d = data[i];
    div = div + QueueItem(d, i, id);
  }
  playQueueHolder.innerHTML = div;
};

selects = document.querySelectorAll(".top-tab-slide-selects-select");

disableSlideshowMove = false;

lyric.addEventListener('scroll', (function(_this) {
  return function(event) {
    disableSlideshowMove = true;
    return setSlideShowPosition(0);
  };
})(this));

Touch.onPan("cover").onStart(function() {
  return disableSlideshowMove = false;
}).onPan(function(event) {
  var op;
  if (disableSlideshowMove === true) {
    return;
  }
  setTransition(covercover, "opacity", "0");
  covercover.style.zIndex = 100;
  switch (slideshowPos) {
    case 0:
      setTransition(info);
      setTransition(lyric);
      setTransform(info, "translateX(" + (-event.totalX - window.innerWidth) + "px)");
      setTransform(lyric, "translateX(" + (window.innerWidth - event.totalX) + "px)");
      op = Math.abs(event.totalX / window.innerWidth);
      if (op < 0.9) {
        return covercover.style.opacity = op;
      }
      break;
    case 1:
      setTransition(info);
      setTransition(lyric);
      setTransform(lyric, "translateX(" + (-event.totalX) + "px)");
      return setTransform(info, "translateX(" + (window.innerWidth - event.totalX) + "px)");
    case 2:
      setTransition(info);
      setTransition(lyric);
      setTransform(lyric, "translateX(" + (-event.totalX - window.innerWidth) + "px)");
      setTransform(info, "translateX(" + (-event.totalX) + "px)");
      op = 0.9 - (event.totalX / window.innerWidth);
      if (op < 0.9) {
        return covercover.style.opacity = op;
      }
  }
}).onEnd(function(event) {
  if (disableSlideshowMove === true) {
    return;
  }
  return setSlideShowPosition(event.totalX);
});

setSlideShowPosition = function(x) {
  setTransition(covercover);
  switch (slideshowPos) {
    case 0:
      if (x > 100) {
        setTransition(lyric, "transform", ".4");
        setTimeout(function() {
          setTransition(lyric);
          return setTransition(info);
        }, 400);
        ++slideshowPos;
        selects[0].style.backgroundColor = "";
        selects[1].style.backgroundColor = "#5e6465";
        selects[2].style.backgroundColor = "";
        setTransform(lyric, "translateX(0px)");
        setTransform(info, "translateX(" + window.innerWidth + "px)");
        return covercover.style.opacity = 0.9;
      } else if (x < -100) {
        setTransition(info, "transform", ".4");
        setTimeout(function() {
          setTransition(lyric);
          return setTransition(info);
        }, 400);
        slideshowPos = 2;
        selects[0].style.backgroundColor = "";
        selects[1].style.backgroundColor = "";
        selects[2].style.backgroundColor = "#5e6465";
        setTransform(lyric, "translateX(" + (-window.innerWidth) + "px)");
        setTransform(info, "translateX(0px)");
        return covercover.style.opacity = 0.9;
      } else {
        setTransform(lyric, "translateX(" + window.innerWidth + "px)");
        setTransform(info, "translateX(" + window.innerWidth + "px)");
        covercover.style.opacity = 0;
        return covercover.style.zIndex = "";
      }
      break;
    case 1:
      if (x > 100) {
        setTransition(lyric, "transform", ".4");
        setTransition(info, "transform", ".4");
        setTimeout(function() {
          setTransition(lyric);
          return setTransition(info);
        }, 400);
        ++slideshowPos;
        selects[0].style.backgroundColor = "";
        selects[1].style.backgroundColor = "";
        selects[2].style.opacity = 1;
        selects[2].style.backgroundColor = "#5e6465";
        setTransform(lyric, "translateX(" + (-window.innerWidth) + "px)");
        return setTransform(info, "translateX(0px)");
      } else if (x < -100) {
        setTransition(lyric, "transform", ".4");
        setTimeout(function() {
          setTransition(lyric);
          return setTransition(info);
        }, 400);
        slideshowPos--;
        selects[0].style.backgroundColor = "#5e6465";
        selects[1].style.backgroundColor = "";
        selects[2].style.backgroundColor = "";
        setTransform(lyric, "translateX(" + window.innerWidth + "px)");
        setTransform(info, "translateX(" + window.innerWidth + "px)");
        covercover.style.opacity = 0;
        return covercover.style.zIndex = "";
      } else {
        setTransition(lyric, "transform", ".4");
        setTransition(info, "transform", ".4");
        setTimeout(function() {
          setTransition(lyric);
          return setTransition(info);
        }, 400);
        setTransform(info, "translateX(" + window.innerWidth + "px)");
        return setTransform(lyric, "translateX(0px)");
      }
      break;
    case 2:
      setTransition(lyric, "transform", ".4");
      setTransition(info, "transform", ".4");
      setTimeout(function() {
        setTransition(lyric);
        return setTransition(info);
      }, 400);
      if (x > 100) {
        slideshowPos = 0;
        selects[0].style.backgroundColor = "#5e6465";
        selects[1].style.backgroundColor = "";
        selects[2].style.backgroundColor = "";
        setTransform(info, "translateX(" + (-window.innerWidth) + "px)");
        setTransform;
        covercover.style.opacity = 0;
        return covercover.style.zIndex = "";
      } else if (x < -100) {
        slideshowPos--;
        selects[0].style.backgroundColor = "";
        selects[1].style.backgroundColor = "#5e6465";
        selects[2].style.backgroundColor = "";
        setTransform(info, "translateX(" + window.innerWidth + "px)");
        return setTransform(lyric, "translateX(0px)");
      } else {
        setTransform(info, "translateX(0px)");
        setTransform(lyric, "translateX(" + (-window.innerWidth) + "px)");
        return covercover.style.opacity = 0.9;
      }
  }
};

repositionCoverOndemend = null;

repositionCover = function() {
  if (repositionCoverOndemend == null) {
    clearTimeout(repositionCoverOndemend);
    repositionCoverOndemend = null;
  }
  if (cover.clientHeight === 0 || cover.clientWidth === 0) {
    repositionCoverOndemend = setTimeout(repositionCover, 1000);
    return;
  }
  return _setCoverPosition();
};

_setCoverPosition = function() {
  repositionCoverOndemend = null;
  if (cover.clientHeight / cover.clientWidth > cover.children[0].children[0].naturalHeight / cover.children[0].children[0].naturalWidth) {
    cover.children[0].children[0].style.width = "100%";
    return cover.children[0].children[0].style.height = "auto";
  } else {
    cover.children[0].children[0].style.width = "auto";
    return cover.children[0].children[0].style.height = "100%";
  }
};

timeout = null;

Touch.onTap("item-queue-song-play").onStart((function(_this) {
  return function(event) {
    var div;
    event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
    div = event.listener;
    if (div.className.search("queue-item-playing") > 0) {
      return;
    }
    return timeout = setTimeout(function() {
      div.style.backgroundColor = '';
      return queue.removeBySongId(div.getAttribute('data-song-id'));
    }, 1000);
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    event.listener.style.backgroundColor = '';
    return clearTimeout(timeout);
  };
})(this));

Touch.onTap("item-queue-clear").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    return queue.removeAllExceptPlaying();
  };
})(this));



},{"./AudioManager":2,"./BackButton":3,"./FlashMessage":4,"./Item/QueueItem":14,"./MenuManagement":22,"./MenuRequest":23,"./Queue":25,"./Tools/SettingStorage":27,"./ad":31,"./findMusicInPlaylist":35,"./getPlaylists":37,"./historyManage":38,"./loadTrackDetail":42,"./musicDataCache":52,"./repeatShuffle":60,"./setTransform":63,"./setTransition":64,"./subtitle":67,"simple-touch":76}],27:[function(require,module,exports){
var SettingsStorage, settingsStorage;

SettingsStorage = (function() {
  function SettingsStorage() {}

  SettingsStorage.prototype.set = function(key, val) {
    return localStorage.setItem(key, JSON.stringify(val));
  };

  SettingsStorage.prototype.get = function(key) {
    return JSON.parse(localStorage.getItem(key));
  };

  SettingsStorage.prototype.remove = function(key) {
    return localStorage.removeItem(key);
  };

  return SettingsStorage;

})();

settingsStorage = new SettingsStorage;

module.exports = settingsStorage;



},{}],28:[function(require,module,exports){
var dirTries, flashMessage, gotDir, gotFs, requestFS, tries;

flashMessage = require('../FlashMessage');

tries = 0;

dirTries = 0;

gotDir = (function(_this) {
  return function(dirEntry) {
    return window.dirEntry = dirEntry;
  };
})(this);

gotFs = (function(_this) {
  return function(fileSystem) {
    var dirAddr;
    window.fs = fileSystem;
    tries = 0;
    dirAddr = "Wikiseda/";
    if (typeof device !== "undefined" && device !== null) {
      if (typeof appAvailability !== "undefined" && appAvailability !== null) {
        if (device.platform === 'iOS') {
          dirAddr = "wikiseda/";
        }
      }
    }
    fileSystem.root.getDirectory(dirAddr, {
      create: true,
      exclusive: false
    }, gotDir, function(event) {
      setTimeout(function() {
        if (dirTries < 30) {
          gotFs(fileSystem);
          return dirTries++;
        } else {
          return dirTries = 0;
        }
      }, 3000);
    });
  };
})(this);

requestFS = function() {
  return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFs, function() {
    setTimeout(function() {
      if (dirTries < 30) {
        requestFS();
        return tries++;
      } else {
        return tries = 0;
      }
    }, 3000);
  });
};

module.exports = function() {
  if (typeof cordova !== "undefined" && cordova !== null) {
    return setTimeout(function() {
      return requestFS();
    }, 2000);
  }
};



},{"../FlashMessage":4}],29:[function(require,module,exports){
var serialize;

module.exports = serialize = function(obj) {
  var k, str, v;
  str = [];
  for (k in obj) {
    v = obj[k];
    str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
  }
  return str.join("&");
};



},{}],30:[function(require,module,exports){
module.exports = function(address) {
  if (address === null || address === void 0) {
    return void 0;
  }
  return encodeURI(address);
};



},{}],31:[function(require,module,exports){
var adPublisherIds, admobid;

if (typeof AdMob !== "undefined" && AdMob !== null) {
  adPublisherIds = {
    ios: {
      banner: "ca-app-pub-3850619128711801/1412784928",
      interstitial: "ca-app-pub-3850619128711801/3214895722"
    },
    android: {
      banner: "ca-app-pub-3850619128711801/7390109729",
      interstitial: "ca-app-pub-3850619128711801/8866842923"
    }
  };
  admobid = /(android)/i.test(navigator.userAgent) ? adPublisherIds.android : adPublisherIds.ios;
}

module.exports = {
  interstitial: function() {
    if (typeof AdMob !== "undefined" && AdMob !== null) {
      return AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow: true
      });
    }
  },
  banner: function() {},
  remove: function() {}
};



},{}],32:[function(require,module,exports){
var ArtistAlbumSongFilter, Touch,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Touch = require('simple-touch');

module.exports = window.x = new (ArtistAlbumSongFilter = (function() {
  function ArtistAlbumSongFilter() {
    this.changeAlbumFilterState = bind(this.changeAlbumFilterState, this);
    this.changeSongFilterState = bind(this.changeSongFilterState, this);
    this.songState = true;
    this.albumState = true;
    Touch.onTap("artist-song-filter").onStart((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
      };
    })(this)).onEnd((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = '';
      };
    })(this)).onTap((function(_this) {
      return function(event) {
        return _this.changeSongFilterState(event);
      };
    })(this));
    Touch.onTap("artist-album-filter").onStart((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
      };
    })(this)).onEnd((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = '';
      };
    })(this)).onTap((function(_this) {
      return function(event) {
        return _this.changeAlbumFilterState(event);
      };
    })(this));
  }

  ArtistAlbumSongFilter.prototype.getNodes = function() {
    this.song = document.getElementById("artist-song-filter").querySelector(".clean");
    this.album = document.getElementById("artist-album-filter").querySelector(".clean");
    return this.applyOldState();
  };

  ArtistAlbumSongFilter.prototype.applyOldState = function() {
    this.changeState(this.song, this.songState);
    return this.changeState(this.album, this.albumState);
  };

  ArtistAlbumSongFilter.prototype.changeState = function(element, state) {
    if (state) {
      return element.classList.add("clean-checked");
    } else {
      return element.classList.remove("clean-checked");
    }
  };

  ArtistAlbumSongFilter.prototype.changeSongFilterState = function() {
    if (this.song == null) {
      return false;
    }
    this.songState = !this.songState;
    this.changeState(this.song, this.songState);
    if (!this.songState) {
      this.albumState = true;
      this.changeState(this.album, this.albumState);
    }
    if (this.cb != null) {
      return this.cb();
    }
  };

  ArtistAlbumSongFilter.prototype.changeAlbumFilterState = function() {
    if (this.album == null) {
      return false;
    }
    this.albumState = !this.albumState;
    this.changeState(this.album, this.albumState);
    if (!this.albumState) {
      this.songState = true;
      this.changeState(this.song, this.songState);
    }
    if (this.cb != null) {
      return this.cb();
    }
  };

  ArtistAlbumSongFilter.prototype.getSongFilter = function() {
    if (this.song == null) {
      return false;
    }
    return this.songState;
  };

  ArtistAlbumSongFilter.prototype.getAlbumFilter = function() {
    if (this.album == null) {
      return false;
    }
    return this.albumState;
  };

  ArtistAlbumSongFilter.prototype.onChange = function(cb) {
    this.cb = cb;
  };

  return ArtistAlbumSongFilter;

})());



},{"simple-touch":76}],33:[function(require,module,exports){
module.exports = function(artistHeader, data) {
  var album, albumsText, artistName, fansCount, fansText, followingIcon, posterHolder, song, tracksText;
  posterHolder = document.querySelector(".main-item-poster-holder");
  artistName = document.querySelector(".main-item-titles-title");
  followingIcon = document.querySelector(".main-item-titles-become");
  fansCount = document.querySelector(".main-item-artist-header-desc-field-fans");
  song = document.getElementById("artist-song-filter-text");
  album = document.getElementById("artist-album-filter-text");
  if (data.fans == null) {
    data.fans = "--";
  }
  if (data.albums == null) {
    data.albums = "--";
  }
  if (data.tracks == null) {
    data.tracks = "--";
  }
  if (data.thumb == null) {
    data.thumb = "./assets/images/logo.png";
  }
  if (parseInt(data.following) === 1) {
    followingIcon.classList.add("main-item-titles-isfan");
  } else {
    followingIcon.classList.remove("main-item-titles-isfan");
  }
  posterHolder.children[0].src = data.thumb;
  fansText = "" + data.fans;
  if (data.fans > 1000) {
    fansText = (Math.floor(data.fans / 1000)) + "K";
  }
  fansCount.innerHTML = fansText;
  if ((data.shouldUpdate != null) && data.shouldUpdate) {
    artistHeader.classList.add("shouldUpdate");
  } else {
    artistHeader.classList.remove("shouldUpdate");
  }
  albumsText = data.albums + " <small>Albums</small>";
  if (window.lang === "fa") {
    albumsText = data.albums + " <small>آلبوم</small>";
  }
  tracksText = data.tracks + " <small>Songs</small>";
  if (window.lang === "fa") {
    tracksText = data.tracks + " <small>موسیقی</small>";
  }
  album.innerHTML = albumsText;
  return song.innerHTML = tracksText;
};



},{}],34:[function(require,module,exports){
var Downloader, MenuManagement, SongDownloading, Touch, beingSync, dl, downloadSong, downloadingDivs, flashMessage, getFS, menuRequest, musicDataCache, network, playlistManager, playlistSync, settingStorage, syncSong;

settingStorage = require('./Tools/SettingStorage');

musicDataCache = require('./musicDataCache');

flashMessage = require('./FlashMessage');

menuRequest = require('./MenuRequest');

MenuManagement = require('./MenuManagement');

network = require('./network');

playlistSync = require('./playlistSync');

Touch = require('simple-touch');

SongDownloading = require('./Item/SongDownloading');

getFS = require('./Tools/getFS');

playlistManager = require('./getPlaylists');

dl;

if (typeof cordova !== "undefined" && cordova !== null) {
  Downloader = (function() {
    function Downloader() {
      network.onConnectionStatus((function(_this) {
        return function(status) {
          if (status === true) {
            return _this.check();
          }
        };
      })(this));
      this.urls = [];
      this.artists = [];
      this.names = [];
      this.cbs = [];
      this.downloadingName = null;
      this.downloading = false;
      this.store = "file:///data/data/com.player.jik/files/Music/";
    }

    Downloader.prototype.download = function(musicUrl, artist, name, cb) {
      var elText, i, j, len, ref, u;
      if (this.downloadingName === (artist + " - " + name)) {
        elText = "Downloading " + name;
        if (window.lang === "fa") {
          elText = "دانلود " + name;
        }
        flashMessage.show(elText);
        cb({
          skip: true
        });
        return;
      }
      ref = this.urls;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        u = ref[i];
        if (u === musicUrl) {
          elText = name + " is in download list";
          if (window.lang === "fa") {
            elText = name + " در لیست موجود است";
          }
          flashMessage.show(elText);
          cb({
            skip: true
          });
          return;
        }
      }
      this.urls.push(musicUrl);
      this.artists.push(artist);
      this.names.push(name);
      this.cbs.push(cb);
      return this.check();
    };

    Downloader.prototype.start = function(musicUrl, artist, name, cb) {
      var msgTxt, timeout;
      this.fileTransfer = new FileTransfer();
      timeout = setTimeout((function(_this) {
        return function() {
          return _this.abort();
        };
      })(this), 10000);
      this.fileTransfer.onprogress = (function(_this) {
        return function(progressEvent) {
          if (timeout != null) {
            clearTimeout(timeout);
            timeout = null;
          }
          if (progressEvent.loaded == null) {
            progressEvent.loaded = 0;
          }
          if (progressEvent.lengthComputable) {
            cb({
              done: false,
              loaded: Math.floor(progressEvent.loaded / 10000) / 100,
              total: Math.floor(progressEvent.total / 10000) / 100
            });
          } else {
            cb({
              done: false,
              loaded: Math.floor(progressEvent.loaded / 10000) / 100
            });
          }
        };
      })(this);
      cb({
        done: false,
        start: true
      });
      if (window.dirEntry == null) {
        msgTxt = "Your phone doesn't respond for download";
        if (window.lang === "fa") {
          msgTxt = "دستگاه شما برای دانلود پاسخگو نبود";
        }
        cb({
          error: true,
          msg: msgTxt
        });
        if (timeout != null) {
          clearTimeout(timeout);
          timeout = null;
        }
        this.downloading = false;
        this.check();
        this.fileTransfer = null;
        return;
      }
      this.store = window.dirEntry.toURL() + artist + " - " + name + ".mp3";
      if (this.downloadingName === (artist + " - " + name)) {
        musicUrl = musicUrl + "?date=" + Date.now();
      }
      this.downloadingName = artist + " - " + name;
      this.fileTransfer.download(encodeURI(musicUrl), encodeURI(this.store), (function(_this) {
        return function(entry) {
          if (timeout != null) {
            clearTimeout(timeout);
            timeout = null;
          }
          cb({
            done: true,
            address: "wikiseda/" + artist + " - " + name + ".mp3"
          });
          _this.downloading = false;
          _this.check();
          _this.fileTransfer = null;
        };
      })(this), (function(_this) {
        return function(err) {
          if (timeout != null) {
            clearTimeout(timeout);
            timeout = null;
          }
          cb({
            error: true
          });
          _this.downloading = false;
          _this.check();
          _this.fileTransfer = null;
        };
      })(this));
    };

    Downloader.prototype.check = function() {
      if (network.status === false) {
        return;
      }
      if (this.downloading === false && this.urls.length > 0) {
        this.downloading = true;
        this.start(this.urls.shift(), this.artists.shift(), this.names.shift(), this.cbs.shift());
      }
    };

    Downloader.prototype.abort = function() {
      if (this.fileTransfer != null) {
        this.downloading = false;
        this.fileTransfer.abort();
        return this.fileTransfer = null;
      }
    };

    Downloader.prototype.cancel = function(url) {
      var found, i, j, len, ref, u;
      found = null;
      ref = this.urls;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        u = ref[i];
        if (u === url) {
          found = i;
          break;
        }
      }
      if (found != null) {
        this.urls.splice(found, 1);
        this.artists.splice(found, 1);
        this.names.splice(found, 1);
        return this.cbs.splice(found, 1);
      }
    };

    return Downloader;

  })();
  dl = new Downloader();
} else {
  Downloader = (function() {
    function Downloader() {}

    Downloader.prototype.download = function(musicUrl, artist, name, cb) {
      var msgTxt;
      window.open(musicUrl);
      msgTxt = "Downloaded media may not be played in web app";
      if (window.lang === "fa") {
        msgTxt = "پخش موسیقی در نرم افزار تحت وب امکان پذیر نیست";
      }
      return cb({
        done: true,
        address: "wikiseda/" + artist + " - " + name + ".mp3"
      });
    };

    return Downloader;

  })();
  dl = new Downloader();
}

downloadingDivs = [];

downloadSong = function(musicData, view, again) {
  var callBackConfirmFunction, downloadingDiv, mp3, msgTxt, no_, res, viewInnerHTML, yes_;
  if (again == null) {
    again = false;
  }
  if ((settingStorage.get(musicData.id) != null) && again === false) {
    callBackConfirmFunction = function(button) {
      var downl, downloaded, found, i, j, len;
      if (button !== 1) {

      } else {
        settingStorage.remove(musicData.id);
        downloaded = settingStorage.get("downloaded");
        if (downloaded != null) {
          downloaded = JSON.parse(downloaded);
          found = null;
          for (i = j = 0, len = downloaded.length; j < len; i = ++j) {
            downl = downloaded[i];
            if (downl.id === musicData.id) {
              found = i;
              break;
            }
          }
          if (found != null) {
            downloaded.splice(found);
          }
        } else {
          downloaded = [musicData];
        }
        return settingStorage.set("downloaded", JSON.stringify(downloaded));
      }
    };
    msgTxt = "Download " + musicData.songname + " again?";
    yes_ = "yes";
    no_ = "no";
    if (window.lang === "fa") {
      msgTxt = "دانلود مجدد " + musicData.songname + "?";
      yes_ = "بله";
      no_ = "خیر";
    }
    if (navigator.notification != null) {
      navigator.notification.confirm(msgTxt, callBackConfirmFunction, 'Download', [yes_, no_]);
    } else {
      res = confirm(msgTxt);
      if (res) {
        callBackConfirmFunction(1);
      }
    }
  }
  downloadingDiv = new SongDownloading(musicData);
  msgTxt = "Waiting for download";
  if (window.lang === "fa") {
    msgTxt = "در انتظار دانلود";
  }
  downloadingDiv.setView(msgTxt);
  downloadingDivs.push(downloadingDiv);
  viewInnerHTML = view.innerHTML;
  try {
    msgTxt = "Added to download queue";
    if (window.lang === "fa") {
      msgTxt = "اضافه شده به لیست دانلود";
    }
    view.innerHTML = msgTxt;
  } catch (undefined) {}
  mp3 = musicData.mp3;
  if (settingStorage.get("download-default-quality") === "low") {
    mp3 = musicData.mp3_low || musicData.mp3;
  } else {
    mp3 = musicData.mp3 || musicData.mp3_low;
  }
  return dl.download(mp3, musicData.artist, musicData.songname, function(eve) {
    var cent, div, downloaded, foundId, id, j, len, msgTxt2;
    if (eve.skip != null) {
      downloadingDiv.skip();
      view.innerHTML = viewInnerHTML;
      return;
    }
    if (eve.error != null) {
      if (eve.msg != null) {
        flashMessage.show(eve.msg);
        msgTxt = "Error during download";
        if (window.lang === "fa") {
          msgTxt = "خطا در دانلود";
        }
        downloadingDiv.setView(msgTxt);
      } else {
        msgTxt = "Error downloading " + musicData.songname;
        msgTxt2 = "Error during download";
        if (window.lang === "fa") {
          msgTxt = "خطا در دانلود " + musicData.songname;
          msgTxt2 = "خطا در دانلود";
        }
        flashMessage.show(msgTxt);
        downloadingDiv.setView(msgTxt2);
      }
      downloadingDiv.setDone();
      view.innerHTML = viewInnerHTML;
      return;
    }
    if (eve.done === true) {
      settingStorage.set(musicData.id, eve.address);
      downloaded = settingStorage.get("downloaded");
      if (downloaded != null) {
        downloaded = JSON.parse(downloaded);
        downloaded.push(musicData);
      } else {
        downloaded = [musicData];
      }
      settingStorage.set("downloaded", JSON.stringify(downloaded));
      msgTxt = musicData.songname + " download success";
      if (window.lang === "fa") {
        msgTxt = musicData.songname + " دانلود شد";
      }
      flashMessage.show(msgTxt);
      downloadingDiv.setView();
      foundId = null;
      for (id = j = 0, len = downloadingDivs.length; j < len; id = ++j) {
        div = downloadingDivs[id];
        if (div.data.id === musicData.id) {
          foundId = id;
        }
      }
      if (foundId != null) {
        downloadingDivs.splice(foundId, 1);
      }
      downloadingDiv.setDone();
      downloadingDiv.setDownloaded();
      view.innerHTML = viewInnerHTML;
    } else {
      downloadingDiv.setDownloading();
      msgTxt = "Downloading";
      if (window.lang === "fa") {
        msgTxt = "در حال دانلود";
      }
      if (eve.start != null) {
        downloadingDiv.setView(msgTxt);
        view.innerHTML = msgTxt;
      } else if (eve.loaded > 0) {
        if (eve.total != null) {
          cent = Math.round(eve.loaded / eve.total * 10000) / 100;
          downloadingDiv.setView(msgTxt + " " + cent + "%");
          view.innerHTML = msgTxt + " " + cent + "%";
        } else {
          downloadingDiv.setView(msgTxt + " " + eve.loaded + "Mb");
          view.innerHTML = msgTxt + " " + eve.loaded + "Mb";
        }
      } else {
        downloadingDiv.setView("" + msgTxt);
        view.innerHTML = "" + msgTxt;
      }
    }
  });
};

syncSong = function(musicData, playlist) {
  var activeSongForSync, found, j, len, mp3, syncedPlaylist, syncedPlaylists;
  syncedPlaylists = settingStorage.get("synced-playlists");
  if ((syncedPlaylists != null) && (syncedPlaylists.length != null)) {
    found = false;
    for (j = 0, len = syncedPlaylists.length; j < len; j++) {
      syncedPlaylist = syncedPlaylists[j];
      if (syncedPlaylist.id === playlist.data.id) {
        syncedPlaylist.albumtracks.push(musicData);
        found = true;
        break;
      }
    }
    if (found === false) {
      syncedPlaylists.push({
        id: playlist.data.id,
        albumtracks: [musicData],
        groupname: playlist.data.groupname
      });
    }
  } else {
    syncedPlaylists = [
      {
        id: playlist.data.id,
        albumtracks: [musicData],
        groupname: playlist.data.groupname
      }
    ];
  }
  activeSongForSync = playlist.selectActiveSong(musicData);
  mp3 = musicData.mp3;
  if (settingStorage.get("download-default-quality") === "low") {
    mp3 = musicData.mp3_low || musicData.mp3;
  } else {
    mp3 = musicData.mp3 || musicData.mp3_low;
  }
  return dl.download(mp3, musicData.artist, musicData.songname, function(eve) {
    var cent;
    if (eve.skip != null) {
      activeSongForSync.skip();
      return;
    }
    if (eve.error != null) {
      activeSongForSync.error();
      return;
    }
    if (eve.done === true) {
      settingStorage.set(musicData.id, eve.address);
      activeSongForSync.done();
      settingStorage.set("synced-playlists", syncedPlaylists);
    } else {
      cent = Math.round(eve.loaded / eve.total * 10000) / 100;
      activeSongForSync.inProgress(cent);
    }
  });
};

Touch.onTap("menu-box-sync").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var musicData, view;
    MenuManagement.closeMenu();
    musicData = musicDataCache.data[menuRequest.data.getAttribute('data-song-id')];
    if (musicData == null) {
      musicData = musicDataCache.more[menuRequest.data.getAttribute('data-song-id')];
    }
    view = menuRequest.data.querySelector(".main-item-titles-view");
    if (view == null) {
      view = menuRequest.data.querySelector(".menu-item-album-song-view");
    }
    return downloadSong(musicData, view);
  };
})(this));

Touch.onTap("menu-box-sync-album").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var albumData, albumSongDiv, i, j, len, ref, results, view;
    MenuManagement.closeMenu();
    albumData = musicDataCache.data["album" + menuRequest.data.getAttribute('data-album-id')];
    if (albumData == null) {
      albumData = musicDataCache.more["album" + menuRequest.data.getAttribute('data-album-id')];
    }
    flashMessage.show("Downloading " + albumData.album + " of " + albumData.artist);
    ref = menuRequest.data.children[4].children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      albumSongDiv = ref[i];
      view = albumSongDiv.querySelector(".menu-item-album-song-view");
      results.push(downloadSong(albumData.albumtracks[i], view));
    }
    return results;
  };
})(this));

Touch.onTap("menu-box-download-playlist").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var albumSongDiv, i, j, len, playlistData, ref, results, view;
    MenuManagement.closeMenu();
    playlistData = playlistManager.getOnePlaylist(menuRequest.data.getAttribute('data-playlist-id'));
    flashMessage.show("Downloading playlist " + playlistData.groupname);
    ref = menuRequest.data.children[4].children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      albumSongDiv = ref[i];
      view = albumSongDiv.querySelector(".menu-item-album-song-view");
      results.push(downloadSong(playlistData.albumtracks[i], view));
    }
    return results;
  };
})(this));

Touch.onTap("player-sync").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var musicData, view;
    if (window.mp3Div == null) {
      return;
    }
    musicData = window.playingMusicData;
    view = window.mp3Div.querySelector(".main-item-titles-view");
    if (view == null) {
      view = window.mp3Div.querySelector(".menu-item-album-song-view");
    }
    return downloadSong(musicData, view);
  };
})(this));

beingSync = {};

playlistSync.onSync((function(_this) {
  return function(playlist) {
    var j, len, ref, results, song;
    flashMessage.show("Syncing playlist " + playlist.data.groupname);
    ref = playlist.data.albumtracks;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      song = ref[j];
      if (settingStorage.get(song.id) || beingSync[song.id] === true) {
        continue;
      }
      beingSync[song.id] = true;
      results.push(syncSong(song, playlist));
    }
    return results;
  };
})(this));

Touch.onTap("item-song-cancel").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var div, foundId, i, id, j, len, mp3, node;
    if (event.listener.parentNode.getAttribute("data-downloading") != null) {
      dl.abort();
      node = event.listener.parentNode;
      node.parentNode.removeChild(node);
    } else {
      mp3 = event.listener.parentNode.getAttribute("data-mp3");
      dl.cancel(mp3);
      node = event.listener.parentNode;
      node.parentNode.removeChild(node);
    }
    id = event.listener.parentNode.getAttribute("data-song-id");
    foundId = null;
    for (i = j = 0, len = downloadingDivs.length; j < len; i = ++j) {
      div = downloadingDivs[i];
      if (div.data.id === id) {
        foundId = i;
      }
    }
    if (foundId != null) {
      return downloadingDivs.splice(foundId, 1);
    }
  };
})(this));

module.exports = function() {
  var div, divs, error, j, len;
  divs = document.createElement("div");
  for (j = 0, len = downloadingDivs.length; j < len; j++) {
    div = downloadingDivs[j];
    try {
      divs.insertBefore(div.get(), divs.children[0]);
    } catch (error) {
      divs.appendChild(div.get());
    }
  }
  return divs;
};



},{"./FlashMessage":4,"./Item/SongDownloading":18,"./MenuManagement":22,"./MenuRequest":23,"./Tools/SettingStorage":27,"./Tools/getFS":28,"./getPlaylists":37,"./musicDataCache":52,"./network":53,"./playlistSync":55,"simple-touch":76}],35:[function(require,module,exports){
var playlists;

playlists = require('./getPlaylists');

module.exports = function(plName, songId, cb) {
  playlists.get((function(_this) {
    return function(datas) {
      var data, i, j, k, len, len1, ref, song;
      for (j = 0, len = datas.length; j < len; j++) {
        data = datas[j];
        if (data.groupname === plName) {
          ref = data.tracks;
          for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
            song = ref[i];
            if (song.id === songId) {
              cb(plName);
              return;
            }
          }
        }
      }
    };
  })(this));
  return false;
};



},{"./getPlaylists":37}],36:[function(require,module,exports){
var FollowArtist, MenuManagement, Touch, artist, cache, flashMessage, login, menuRequest, musicDataCache, serialize;

Touch = require('simple-touch');

login = require('./login');

flashMessage = require('./FlashMessage');

serialize = require('./Tools/serialize');

musicDataCache = require('./musicDataCache');

menuRequest = require('./MenuRequest');

MenuManagement = require('./MenuManagement');

cache = require('js-cache');

FollowArtist = (function() {
  function FollowArtist() {
    this.id = null;
    this.oReq = null;
  }

  FollowArtist.prototype.follow = function(id, cb) {
    return this.sendRequest("addFans", id, cb);
  };

  FollowArtist.prototype.unfollow = function(id, cb) {
    return this.sendRequest("removeFans", id, cb);
  };

  FollowArtist.prototype.sendRequest = function(address, id, cb) {
    var query, transferCanceled, transferComplete, transferFailed, transferTimeout;
    if (this.id === id) {
      if (this.oReq != null) {
        return this.oReq.abort();
      }
    }
    this.id = id;
    transferComplete = (function(_this) {
      return function(evt) {
        var msg;
        cache.clear();
        msg = JSON.parse(evt.target.responseText);
        if (msg.error === 0) {
          cb(msg.following);
        } else {
          cb();
        }
        _this.oReq = null;
      };
    })(this);
    transferFailed = (function(_this) {
      return function(evt) {
        cb();
        return _this.oReq = null;
      };
    })(this);
    transferTimeout = (function(_this) {
      return function(evt) {
        cb();
        return _this.oReq = null;
      };
    })(this);
    transferCanceled = (function(_this) {
      return function(evt) {
        cb();
        return _this.oReq = null;
      };
    })(this);
    query = {
      sid: login.sid,
      signer_id: id
    };
    this.oReq = new XMLHttpRequest();
    this.oReq.addEventListener("load", transferComplete, false);
    this.oReq.addEventListener("error", transferFailed, false);
    this.oReq.addEventListener("abort", transferCanceled, false);
    this.oReq.addEventListener("timeout", transferTimeout, false);
    this.oReq.open("get", SERVER_ADDRESS + address + "?" + serialize(query), true);
    this.oReq.timeout = window.TIMEOUT;
    return this.oReq.send();
  };

  return FollowArtist;

})();

artist = new FollowArtist;

Touch.onTap("artist-page-follow").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var artistHeader, become, fans, id;
    artistHeader = event.target.parentNode;
    id = artistHeader.getAttribute("data-artist-id");
    while (id === null) {
      artistHeader = artistHeader.parentNode;
      id = artistHeader.getAttribute("data-artist-id");
    }
    fans = artistHeader.querySelector(".main-item-artist-header-desc-field-fans");
    become = artistHeader.querySelector(".main-item-titles-become");
    if (parseInt(artistHeader.getAttribute("data-following")) === 0) {
      become.classList.add("main-item-titles-isfan");
      return artist.follow(id, function(following) {
        var elText, errorText, exactArtistElement, fansOfExactArstistElement;
        if (following != null) {
          exactArtistElement = document.querySelector("#item-artist.main-item[data-artist-id='" + id + "']");
          if (exactArtistElement != null) {
            fansOfExactArstistElement = exactArtistElement.querySelector(".main-item-titles-artist");
            fansOfExactArstistElement.setAttribute("data-following", 1);
            elText = " <small>Fans + You</small>";
            if (window.lang === "fa") {
              elText = " <small>طرفدار و شما</small>";
            }
            fansOfExactArstistElement.innerHTML = fansOfExactArstistElement.getAttribute("data-fans") + elText;
          }
          elText = " <small>Fans</small>";
          if (window.lang === "fa") {
            elText = " <small>طرفدار</small>";
          }
          if (following > 1000) {
            following = (Math.floor(following / 1000)) + "K";
          }
          fans.innerHTML = following;
          artistHeader.setAttribute("data-following", 1);
          return;
        }
        errorText = "Follow request failed";
        if (window.lang === "fa") {
          errorText = "درخواست دنبال کردن دچار مشکل شد";
        }
        flashMessage.show(errorText);
        become.classList.remove("main-item-titles-isfan");
        return artistHeader.setAttribute("data-following", 0);
      });
    } else {
      become.classList.remove("main-item-titles-isfan");
      return artist.unfollow(id, function(following) {
        var elText, errorText, exactArtistElement, fansOfExactArstistElement;
        if (following != null) {
          exactArtistElement = document.querySelector("#item-artist.main-item[data-artist-id='" + id + "']");
          if (exactArtistElement != null) {
            fansOfExactArstistElement = exactArtistElement.querySelector(".main-item-titles-artist");
            fansOfExactArstistElement.setAttribute("data-following", 0);
            elText = " <small>Fans</small>";
            if (window.lang === "fa") {
              elText = " <small>طرفدار</small>";
            }
            fansOfExactArstistElement.innerHTML = fansOfExactArstistElement.getAttribute("data-fans") + elText;
          }
          elText = " <small>Fans</small>";
          if (window.lang === "fa") {
            elText = " <small>طرفدار</small>";
          }
          if (following > 1000) {
            following = (Math.floor(following / 1000)) + "K";
          }
          fans.innerHTML = following;
          artistHeader.setAttribute("data-following", 0);
          return;
        }
        errorText = "Unfollow request failed";
        if (window.lang === "fa") {
          errorText = "درخواست لغو دنبال کردن دچار مشکل شد";
        }
        flashMessage.show(errorText);
        become.classList.add("main-item-titles-isfan");
        return artistHeader.setAttribute("data-following", 1);
      });
    }
  };
})(this));

Touch.onTap("menu-box-follow").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var artistItem, elText, fans, id;
    MenuManagement.closeMenu();
    artistItem = menuRequest.data;
    id = artistItem.getAttribute('data-artist-id');
    fans = artistItem.querySelector(".main-item-titles-artist");
    if (parseInt(fans.getAttribute("data-following")) === 0) {
      elText = " <small>Fans + You</small>";
      if (window.lang === "fa") {
        elText = " <small>طرفدار و شما</small>";
      }
      fans.innerHTML = fans.getAttribute("data-fans") + elText;
      fans.setAttribute("data-following", "1");
      return artist.follow(id, function(following) {
        if (following != null) {
          elText = " <small>Fans + You</small>";
          if (window.lang === "fa") {
            elText = " <small>طرفدار و شما</small>";
          }
          fans.innerHTML = fans.getAttribute("data-fans") + elText;
          return;
        }
        elText = " <small>Fans</small>";
        if (window.lang === "fa") {
          elText = " <small>طرفدار</small>";
        }
        fans.innerHTML = fans.getAttribute("data-fans") + elText;
        return fans.setAttribute("data-following", "0");
      });
    } else {
      elText = " <small>Fans - You</small>";
      if (window.lang === "fa") {
        elText = " <small>طرفدار - شما</small>";
      }
      fans.innerHTML = fans.getAttribute("data-fans") + elText;
      fans.setAttribute("data-following", "0");
      return artist.follow(id, function(following) {
        if (following != null) {
          elText = " <small>Fans</small>";
          if (window.lang === "fa") {
            elText = " <small>طرفدار</small>";
          }
          fans.innerHTML = fans.getAttribute("data-fans") + elText;
          return;
        }
        elText = " <small>Fans + You</small>";
        if (window.lang === "fa") {
          elText = " <small>طرفدار و شما</small>";
        }
        fans.innerHTML = fans.getAttribute("data-fans") + elText;
        return fans.setAttribute("data-following", "1");
      });
    }
  };
})(this));



},{"./FlashMessage":4,"./MenuManagement":22,"./MenuRequest":23,"./Tools/serialize":29,"./login":43,"./musicDataCache":52,"js-cache":70,"simple-touch":76}],37:[function(require,module,exports){
var Playlists, login, playlists, serialize;

login = require('./login');

serialize = require('./Tools/serialize');

playlists = new (Playlists = (function() {
  function Playlists() {
    this.list = null;
    this.listOfRequests = [];
    this.listOfRequestsLast = [];
    this.failedTimes = 0;
    this.loadedOnce = false;
  }

  Playlists.prototype.getOnePlaylist = function(id) {
    var i, item, len, ref;
    ref = this.list;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (id === item.id) {
        return item;
      }
    }
  };

  Playlists.prototype.onAdd = function(addCb) {
    this.addCb = addCb;
  };

  Playlists.prototype.get = function(cbDone, cbFail, last) {
    if (this.list != null) {
      return cbDone(this.list);
    } else {
      if (this.loadedOnce === false) {
        this.load();
        this.loadedOnce = true;
      }
      if (last) {
        return this.listOfRequestsLast.push({
          done: cbDone,
          fail: cbFail
        });
      } else {
        return this.listOfRequests.push({
          done: cbDone,
          fail: cbFail
        });
      }
    }
  };

  Playlists.prototype.add = function(plName, song) {
    var i, len, pl, ref;
    if (this.loadedOnce === false) {
      this.get((function(_this) {
        return function() {
          return _this.add(plName, song);
        };
      })(this));
      return;
    }
    ref = this.list;
    for (i = 0, len = ref.length; i < len; i++) {
      pl = ref[i];
      if (pl.groupname === plName) {
        if (song === null) {
          return;
        }
        if (pl.albumtracks.length > 0) {
          pl.albumtracks.push(song);
          pl.count = parseInt(pl.count) + 1;
        } else {
          pl.albumtracks = [song];
          pl.count = 1;
        }
        if (this.addCb != null) {
          this.addCb(pl, song);
        }
        return;
      }
    }
    pl = {
      groupname: plName,
      albumtracks: [song],
      count: 1
    };
    this.list.push(pl);
    if (this.addCb != null) {
      return this.addCb(pl, song);
    }
  };

  Playlists.prototype.load = function() {
    var address, oReq, query, transferCanceled, transferComplete, transferFailed, transferTimeout;
    transferComplete = (function(_this) {
      return function(evt) {
        var i, j, len, len1, ref, ref1, req;
        _this.list = JSON.parse(evt.target.responseText);
        ref = _this.listOfRequestsLast;
        for (i = 0, len = ref.length; i < len; i++) {
          req = ref[i];
          req.done(_this.list);
        }
        ref1 = _this.listOfRequests;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          req = ref1[j];
          req.done(_this.list);
        }
        _this.listOfRequests = [];
        _this.listOfRequestsLast = [];
      };
    })(this);
    transferFailed = (function(_this) {
      return function(evt) {
        var i, j, len, len1, ref, ref1, req;
        _this.failedTimes++;
        if (_this.failedTimes > 10) {
          ref = _this.listOfRequests;
          for (i = 0, len = ref.length; i < len; i++) {
            req = ref[i];
            req.fail(_this.list);
          }
          ref1 = _this.listOfRequestsLast;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            req = ref1[j];
            req.fail(_this.list);
          }
          _this.loadedOnce = false;
          _this.failedTimes = 0;
          return;
        }
        return _this.load();
      };
    })(this);
    transferTimeout = (function(_this) {
      return function(evt) {
        var i, j, len, len1, ref, ref1, req;
        _this.failedTimes++;
        if (_this.failedTimes > 10) {
          ref = _this.listOfRequests;
          for (i = 0, len = ref.length; i < len; i++) {
            req = ref[i];
            req.fail(_this.list);
          }
          ref1 = _this.listOfRequestsLast;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            req = ref1[j];
            req.fail(_this.list);
          }
          _this.loadedOnce = false;
          _this.failedTimes = 0;
          return;
        }
        return _this.load();
      };
    })(this);
    transferCanceled = (function(_this) {
      return function(evt) {
        var i, j, len, len1, ref, ref1, req;
        _this.failedTimes++;
        if (_this.failedTimes > 10) {
          ref = _this.listOfRequests;
          for (i = 0, len = ref.length; i < len; i++) {
            req = ref[i];
            req.fail(_this.list);
          }
          ref1 = _this.listOfRequestsLast;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            req = ref1[j];
            req.fail(_this.list);
          }
          _this.loadedOnce = false;
          _this.failedTimes = 0;
          return;
        }
        return _this.load();
      };
    })(this);
    address = "getuserplaylist";
    query = {
      sid: login.sid,
      lang: window.lang
    };
    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", transferComplete, false);
    oReq.addEventListener("error", transferFailed, false);
    oReq.addEventListener("abort", transferCanceled, false);
    oReq.addEventListener("timeout", transferTimeout, false);
    oReq.open("get", SERVER_ADDRESS + address + "?" + serialize(query), true);
    oReq.timeout = window.TIMEOUT;
    return oReq.send();
  };

  return Playlists;

})());

module.exports = playlists;



},{"./Tools/serialize":29,"./login":43}],38:[function(require,module,exports){
var HistoryManage, settingStorage;

settingStorage = require('./Tools/SettingStorage');

module.exports = new (HistoryManage = (function() {
  function HistoryManage() {
    if (this.getList() == null) {
      this.clean();
    }
  }

  HistoryManage.prototype.add = function(data) {
    var keys, list;
    list = this.getList();
    keys = Object.keys(list);
    if (keys.length >= 50) {
      delete list[keys[keys.length - 1]];
    }
    list[data.id] = data;
    return settingStorage.set("play-history", list);
  };

  HistoryManage.prototype.getList = function() {
    return settingStorage.get("play-history");
  };

  HistoryManage.prototype.remove = function(id) {
    var list;
    list = this.getList();
    if (list[id] != null) {
      list[id] = null;
      return settingStorage.set("play-history", list);
    }
  };

  HistoryManage.prototype.clean = function() {
    return settingStorage.set("play-history", {});
  };

  return HistoryManage;

})());



},{"./Tools/SettingStorage":27}],39:[function(require,module,exports){
var Forms, backButton, forms, setTransform, setTransition;

setTransition = require('./setTransition');

setTransform = require('./setTransform');

backButton = require('./BackButton');

Forms = (function() {
  function Forms() {
    this.backButtonDiv = document.getElementById("back-button");
    this.backButtonDiv.addEventListener("click", (function(_this) {
      return function() {
        return _this.hideLogin();
      };
    })(this));
    backButton.add('login', (function(_this) {
      return function() {
        return _this.hideLogin();
      };
    })(this));
    this.loginForm = document.querySelector('.login');
    this.loginForm.addEventListener('submit', (function(_this) {
      return function(event) {
        var data;
        event.preventDefault();
        data = _this.getLoginData();
        if (data.username === "") {
          _this.loginForm.elements["username"].focus();
          return;
        }
        if (data.password === "") {
          _this.loginForm.elements["password"].focus();
          return;
        }
        _this.loginForm.elements["login-submit"].focus();
        _this.loginForm.elements["login-submit"].setAttribute('disabled', 'true');
        if (_this.cbLoginSubmit != null) {
          _this.cbLoginSubmit(data);
        }
        return false;
      };
    })(this));
    this.registerForm = document.querySelector('.register');
    this.registerForm.addEventListener('submit', (function(_this) {
      return function(event) {
        var data;
        event.preventDefault();
        data = _this.getRegisterData();
        if (data.username === "") {
          _this.registerForm.elements["username"].focus();
          return;
        }
        if (data.email === "") {
          _this.registerForm.elements["email"].focus();
          return;
        }
        if (data.password === "") {
          _this.registerForm.elements["password"].focus();
          return;
        }
        _this.registerForm.elements["register-submit"].focus();
        _this.registerForm.elements["register-submit"].setAttribute('disabled', 'true');
        if (_this.cbRegisterSubmit != null) {
          _this.cbRegisterSubmit(data);
        }
        return false;
      };
    })(this));
    this.toLogin = document.getElementById("login-link");
    this.toLogin.addEventListener("click", (function(_this) {
      return function() {
        return _this.showLogin();
      };
    })(this));
  }

  Forms.prototype.getRegisterData = function() {
    return {
      username: this.registerForm.elements["username"].value,
      password: this.registerForm.elements["password"].value,
      email: this.registerForm.elements["email"].value
    };
  };

  Forms.prototype.getLoginData = function() {
    return {
      username: this.loginForm.elements["username"].value,
      password: this.loginForm.elements["password"].value
    };
  };

  Forms.prototype.clearRegister = function() {
    this.registerForm.elements["username"].value = "";
    this.registerForm.elements["password"].value = "";
    return this.registerForm.elements["email"].value = "";
  };

  Forms.prototype.clearLogin = function() {
    this.loginForm.elements["username"].value = "";
    return this.loginForm.elements["password"].value = "";
  };

  Forms.prototype.release = function() {
    this.registerForm.elements["register-submit"].removeAttribute('disabled');
    return this.loginForm.elements["login-submit"].removeAttribute('disabled');
  };

  Forms.prototype.onLoginSubmit = function(cbLoginSubmit) {
    this.cbLoginSubmit = cbLoginSubmit;
  };

  Forms.prototype.onRegisterSubmit = function(cbRegisterSubmit) {
    this.cbRegisterSubmit = cbRegisterSubmit;
  };

  Forms.prototype.showLogin = function() {
    this.loginForm.style.display = "block";
    this.backButtonDiv.style.display = "block";
    this.registerForm.style.display = "none";
    return backButton.activate('login');
  };

  Forms.prototype.hideLogin = function() {
    this.loginForm.style.display = "";
    this.backButtonDiv.style.display = "";
    this.registerForm.style.display = "";
    return backButton.deactive('login');
  };

  return Forms;

})();

forms = new Forms;

module.exports = forms;



},{"./BackButton":3,"./setTransform":63,"./setTransition":64}],40:[function(require,module,exports){
var MenuManagement, Touch, failedUpdateSegments, flashMessage, loadTrackDetail, menuRequest, musicData, musicDataCache, updateSegments;

loadTrackDetail = require('./loadTrackDetail');

musicDataCache = require('./musicDataCache');

flashMessage = require('./FlashMessage');

menuRequest = require('./MenuRequest');

MenuManagement = require('./MenuManagement');

Touch = require('simple-touch');

musicData = null;

Touch.onTap("menu-box-info").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    musicData = musicDataCache.data[menuRequest.data.getAttribute('data-song-id')];
    if (musicData == null) {
      musicData = musicDataCache.more[menuRequest.data.getAttribute('data-song-id')];
    }
    MenuManagement.openMenu();
    updateSegments();
    return loadTrackDetail(musicData.id, updateSegments, failedUpdateSegments);
  };
})(this));

updateSegments = function(data) {
  var infoRate, lyricX, x;
  if (data != null) {
    if (musicData.id !== data.song[0].id) {
      return;
    }
    infoRate = data.song[0].ratecount !== 0 ? "Rating: " + (data.song[0].popularity / data.song[0].ratecount) + " from " + data.song[0].ratecount + " votes" : "No vote for rate yet";
    if (window.lang === "fa") {
      infoRate = data.song[0].ratecount !== 0 ? "امتیاز: " + (data.song[0].popularity / data.song[0].ratecount) + " از " + data.song[0].ratecount + " رای" : "هنوز امتیازی داده نشده";
    }
    x = "<div class=\"menu-subpage-info-divs\" style=\"display: block;\">\n	<div class=\"menu-subpage-info-text-lyric\">Info</div>\n	<div class=\"menu-subpage-info-text-artist\" id=\"item-artist\" data-artist-id=\"" + data.song[0]['artist_id'] + "\">" + data.song[0]['artist'] + "</div>\n	<div class=\"menu-subpage-info-text\" style=\"display: block;\">" + (data.info.view || "0") + " Views</div>\n	<div class=\"menu-subpage-info-text\">File size: " + data.summary.size + "</div>\n	<div class=\"menu-subpage-info-text\">Music length: " + data.song[0].time + "</div>\n	<div class=\"menu-subpage-info-text\">Added at: " + data.song[0].date + "</div>\n	<div class=\"menu-subpage-info-text\">" + infoRate + "</div>\n	<div class=\"menu-subpage-info-text\">" + (data.info.descrip || "") + "</div>";
    if (window.lang === "fa") {
      x = "<div class=\"menu-subpage-info-divs\" style=\"display: block;\">\n	<div class=\"menu-subpage-info-text-lyric\">جزییات</div>\n	<div class=\"menu-subpage-info-text-artist\" id=\"item-artist\" data-artist-id=\"" + data.song[0]['artist_id'] + "\">" + data.song[0]['artist'] + "</div>\n	<div class=\"menu-subpage-info-text\" style=\"display: block;\">" + (data.info.view || "0") + " بار پخش شده</div>\n	<div class=\"menu-subpage-info-text\">حجم فایل: " + data.summary.size + "</div>\n	<div class=\"menu-subpage-info-text\">زمان ترانه: " + data.song[0].time + "</div>\n	<div class=\"menu-subpage-info-text\">درج در تاریخ: " + data.song[0].date + "</div>\n	<div class=\"menu-subpage-info-text\">" + infoRate + "</div>\n	<div class=\"menu-subpage-info-text\">" + (data.info.descrip || "") + "</div>";
    }
    if (data.lyric.length > 10) {
      lyricX = "<div class=\"menu-subpage-info-text-lyric\">Lyric</div>\n<div class=\"menu-subpage-info-text-lyric-content\">" + data.lyric + "</div>";
      if (window.lang === "fa") {
        lyricX = "<div class=\"menu-subpage-info-text-lyric\">متن ترانه</div>\n<div class=\"menu-subpage-info-text-lyric-content\">" + data.lyric + "</div>";
      }
      x = x + lyricX;
    }
    x = x + "</div>";
  } else {
    x = "<h5>Loading info</h5>";
    if (window.lang === "fa") {
      x = "<h5>درحال بارگذاری جزییات</h5>";
    }
  }
  return MenuManagement.updateSubpageContent(x);
};

failedUpdateSegments = function(data) {
  var x;
  x = "<h5>Loading failed</h5>";
  if (window.lang === "fa") {
    x = "<h5>بارگذاری انجام نشد</h5>";
  }
  return MenuManagement.updateSubpageContent(x);
};



},{"./FlashMessage":4,"./MenuManagement":22,"./MenuRequest":23,"./loadTrackDetail":42,"./musicDataCache":52,"simple-touch":76}],41:[function(require,module,exports){
var Touch, changeStatics, enTexts, readTexts, settingStorage;

Touch = require('simple-touch');

settingStorage = require('./Tools/SettingStorage');

window.lang = settingStorage.get("lang");

if (window.lang == null) {
  settingStorage.set("lang", "fa");
  window.lang = "fa";
}

if (window.lang === "fa") {
  document.getElementById("change-lang").innerHTML = "en";
}

Touch.onTap("change-lang").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var el2;
    el2 = document.getElementById("change-lang");
    if (window.lang === "fa") {
      settingStorage.set("lang", "en");
      window.lang = "en";
      el2.innerHTML = "فا";
    } else {
      settingStorage.set("lang", "fa");
      window.lang = "fa";
      el2.innerHTML = "en";
    }
    return changeStatics();
  };
})(this));

Touch.onTap("setting-lang").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var el1, el2, el3, el4, el5, elAbout, elClearPlayHistory, elClearSearchHistory;
    el1 = document.getElementById("setting-logout");
    el2 = document.getElementById("setting-lang");
    el3 = document.getElementById("play-default-quality");
    el4 = document.getElementById("download-default-quality");
    el5 = document.getElementById("auto-play-switch");
    elAbout = document.getElementById("label-about-text");
    elClearPlayHistory = document.getElementById("setting-clear-history");
    elClearSearchHistory = document.getElementById("setting-clear-search-history");
    if (window.lang === "fa") {
      settingStorage.set("lang", "en");
      window.lang = "en";
      el1.children[1].innerHTML = "Logout";
      el2.children[0].innerHTML = "Change Language";
      el2.children[1].innerHTML = "فا";
      el3.children[0].innerHTML = "High quality play";
      el4.children[0].innerHTML = "High quality download";
      el5.children[0].innerHTML = "Auto play after queue";
      elAbout.innerHTML = "<div class=\"segmented-label segmented-label-selected\">\n	About Us\n</div>";
      elClearPlayHistory.children[0].innerHTML = "Clear Play History";
      elClearSearchHistory.children[0].innerHTML = "Clear Search History";
    } else {
      settingStorage.set("lang", "fa");
      window.lang = "fa";
      el1.children[1].innerHTML = "خروج";
      el2.children[0].innerHTML = "تغییر زبان";
      el2.children[1].innerHTML = "en";
      el3.children[0].innerHTML = "پخش با بالاترین کیفیت";
      el4.children[0].innerHTML = "دانلود با بالاترین کیفیت";
      el5.children[0].innerHTML = "پخش خودکار بعد از لیست";
      elAbout.innerHTML = "<div class=\"segmented-label segmented-label-selected\">\n	درباره ما\n</div>";
      elClearPlayHistory.children[0].innerHTML = "پاک کردن سابقه پخش";
      elClearSearchHistory.children[0].innerHTML = "پاک کردن سابقه جستجو";
    }
    return changeStatics();
  };
})(this));

enTexts = {};

(readTexts = function() {
  enTexts["label-wikiseda"] = document.getElementById("label-wikiseda").innerHTML;
  enTexts["label-wikiseda-desc"] = document.getElementById("label-wikiseda-desc").innerHTML;
  enTexts["login-link"] = document.getElementById("login-link").innerHTML;
  enTexts["forgetLink"] = document.getElementById("forgetLink").innerHTML;
  enTexts["label-register-username"] = document.getElementById("label-register-username").placeholder;
  enTexts["label-register-email"] = document.getElementById("label-register-email").placeholder;
  enTexts["label-register-password"] = document.getElementById("label-register-password").placeholder;
  enTexts["label-register-submit"] = document.getElementById("label-register-submit").value;
  enTexts["label-login-username"] = document.getElementById("label-login-username").placeholder;
  enTexts["label-login-password"] = document.getElementById("label-login-password").placeholder;
  enTexts["label-login-submit"] = document.getElementById("label-login-submit").value;
  enTexts["label-bottom-home"] = document.getElementById("label-bottom-home").innerHTML;
  enTexts["label-bottom-artists"] = document.getElementById("label-bottom-artists").innerHTML;
  enTexts["label-bottom-songs"] = document.getElementById("label-bottom-songs").innerHTML;
  enTexts["label-bottom-albums"] = document.getElementById("label-bottom-albums").innerHTML;
  enTexts["label-bottom-more"] = document.getElementById("label-bottom-more").innerHTML;
  enTexts["now-playing"] = document.getElementById("now-playing").innerHTML;
  enTexts["play-queue"] = document.getElementById("play-queue").innerHTML;
  enTexts["label-player-wikiseda"] = document.getElementById("label-player-wikiseda").innerHTML;
  enTexts["label-player-wikiseda-sesc"] = document.getElementById("label-player-wikiseda-sesc").innerHTML;
  enTexts["label-miniplayer-wikiseda"] = document.getElementById("label-miniplayer-wikiseda").innerHTML;
  enTexts["label-miniplayer-wikiseda-desc"] = document.getElementById("label-miniplayer-wikiseda-desc").innerHTML;
  enTexts["label-menu-box-add-to-queue"] = document.getElementById("label-menu-box-add-to-queue").innerHTML;
  enTexts["label-menu-box-play-next"] = document.getElementById("label-menu-box-play-next").innerHTML;
  enTexts["label-menu-box-add-to-playlist"] = document.getElementById("label-menu-box-add-to-playlist").innerHTML;
  enTexts["label-menu-box-sync"] = document.getElementById("label-menu-box-sync").innerHTML;
  enTexts["label-menu-box-music-share"] = document.getElementById("label-menu-box-music-share").innerHTML;
  enTexts["label-menu-box-info"] = document.getElementById("label-menu-box-info").innerHTML;
  enTexts[".label-multi-music#label-menu-box-cancel"] = document.querySelector(".label-multi-music#label-menu-box-cancel").innerHTML;
  enTexts["label-menu-box-follow"] = document.getElementById("label-menu-box-follow").innerHTML;
  enTexts["label-menu-box-play-top"] = document.getElementById("label-menu-box-play-top").innerHTML;
  enTexts["label-menu-box-artist-share"] = document.getElementById("label-menu-box-artist-share").innerHTML;
  enTexts[".label-multi-artist#label-menu-box-cancel"] = document.querySelector(".label-multi-artist#label-menu-box-cancel").innerHTML;
  enTexts[".label-multi-album#label-menu-box-play-album"] = document.querySelector(".label-multi-album#label-menu-box-play-album").innerHTML;
  enTexts[".label-multi-album#label-menu-box-album-add-to-queue"] = document.querySelector(".label-multi-album#label-menu-box-album-add-to-queue").innerHTML;
  enTexts[".label-multi-album#label-menu-box-album-play-next"] = document.querySelector(".label-multi-album#label-menu-box-album-play-next").innerHTML;
  enTexts["label-menu-box-sync-album"] = document.getElementById("label-menu-box-sync-album").innerHTML;
  enTexts["label-menu-box-album-share"] = document.getElementById("label-menu-box-album-share").innerHTML;
  enTexts[".label-multi-album#label-menu-box-cancel"] = document.querySelector(".label-multi-album#label-menu-box-cancel").innerHTML;
  enTexts["label-menu-box-artist-page"] = document.getElementById("label-menu-box-artist-page").innerHTML;
  enTexts["label-menu-box-now-add-to-playlist"] = document.getElementById("label-menu-box-now-add-to-playlist").innerHTML;
  enTexts["label-menu-box-now-music-share"] = document.getElementById("label-menu-box-now-music-share").innerHTML;
  enTexts[".label-multi-music#label-now-menu-box-cancel"] = document.querySelector(".label-multi-music#label-now-menu-box-cancel").innerHTML;
  enTexts[".label-multi-playlist#label-menu-box-play-album"] = document.querySelector(".label-multi-playlist#label-menu-box-play-album").innerHTML;
  enTexts[".label-multi-playlist#label-menu-box-album-add-to-queue"] = document.querySelector(".label-multi-playlist#label-menu-box-album-add-to-queue").innerHTML;
  enTexts[".label-multi-playlist#label-menu-box-album-play-next"] = document.querySelector(".label-multi-playlist#label-menu-box-album-play-next").innerHTML;
  enTexts["label-menu-box-sync-playlist"] = document.getElementById("label-menu-box-sync-playlist").innerHTML;
  enTexts["label-menu-box-download-playlist"] = document.getElementById("label-menu-box-download-playlist").innerHTML;
  enTexts["label-menu-box-remove-playlist"] = document.getElementById("label-menu-box-remove-playlist").innerHTML;
  enTexts[".label-multi-playlist#label-menu-box-cancel"] = document.querySelector(".label-multi-playlist#label-menu-box-cancel").innerHTML;
  enTexts["#more-option-Downloaded_Media"] = document.querySelector("#more-option-Downloaded_Media").children[1].innerHTML;
  enTexts["#more-option-Recent_Media"] = document.querySelector("#more-option-Recent_Media").children[1].innerHTML;
  enTexts["#more-option-Playlists"] = document.querySelector("#more-option-Playlists").children[1].innerHTML;
  return enTexts["#more-option-Settings"] = document.querySelector("#more-option-Settings").children[1].innerHTML;
})();

(changeStatics = function() {
  if (window.lang === "fa") {
    document.body.classList.add("fa");
    document.getElementById("label-wikiseda").innerHTML = "ویکی صدا";
    document.getElementById("label-wikiseda-desc").innerHTML = "مرجع موسیقی ایرانی";
    document.getElementById("login-link").innerHTML = "اکانت دارید؟‌ وارد شوید";
    document.getElementById("forgetLink").innerHTML = "رمز را فراموش کرده اید؟";
    document.getElementById("label-register-username").placeholder = "نام کاربری";
    document.getElementById("label-register-email").placeholder = "ایمیل";
    document.getElementById("label-register-password").placeholder = "رمز عبور";
    document.getElementById("label-register-submit").value = "ثبت نام";
    document.getElementById("label-login-username").placeholder = "نام کاربری";
    document.getElementById("label-login-password").placeholder = "رمز عبور";
    document.getElementById("label-login-submit").value = "وارد شو";
    document.getElementById("label-bottom-home").innerHTML = "خانه";
    document.getElementById("label-bottom-artists").innerHTML = "هنرمندان";
    document.getElementById("label-bottom-songs").innerHTML = "موسیقی";
    document.getElementById("label-bottom-albums").innerHTML = "آلبوم";
    document.getElementById("label-bottom-more").innerHTML = "بیشتر";
    document.getElementById("now-playing").innerHTML = "در حال پخش";
    document.getElementById("play-queue").innerHTML = "لیست پخش";
    document.getElementById("label-player-wikiseda").innerHTML = "ویکی صدا";
    document.getElementById("label-player-wikiseda-sesc").innerHTML = "مرجع موسیقی ایرانی";
    document.getElementById("label-miniplayer-wikiseda").innerHTML = "ویکی صدا";
    document.getElementById("label-miniplayer-wikiseda-desc").innerHTML = "مرجع موسیقی ایرانی";
    document.getElementById("label-menu-box-add-to-queue").innerHTML = "اضافه به صف";
    document.getElementById("label-menu-box-play-next").innerHTML = "پخش بعد از این موسیقی";
    document.getElementById("label-menu-box-add-to-playlist").innerHTML = "اضافه به لیست پخش";
    document.getElementById("label-menu-box-sync").innerHTML = "دانلود";
    document.getElementById("label-menu-box-music-share").innerHTML = "اشتراک گذاری";
    document.getElementById("label-menu-box-info").innerHTML = "جزییات";
    document.querySelector(".label-multi-music#label-menu-box-cancel").innerHTML = "خروج";
    document.getElementById("label-menu-box-artist-page").innerHTML = "صفحه هنرمند";
    document.getElementById("label-menu-box-now-add-to-playlist").innerHTML = "اضافه به لیست پخش";
    document.getElementById("label-menu-box-now-music-share").innerHTML = "اشتراک گذاری";
    document.querySelector(".label-multi-music#label-now-menu-box-cancel").innerHTML = "خروج";
    document.getElementById("label-menu-box-follow").innerHTML = "دنبال کردن";
    document.getElementById("label-menu-box-play-top").innerHTML = "بخش بهترین موسیقی ها";
    document.getElementById("label-menu-box-artist-share").innerHTML = "اشتراک گذاری";
    document.querySelector(".label-multi-artist#label-menu-box-cancel").innerHTML = "خروج";
    document.querySelector(".label-multi-album#label-menu-box-play-album").innerHTML = "پخش همه";
    document.querySelector(".label-multi-album#label-menu-box-album-add-to-queue").innerHTML = "اضافه آلبوم به لیست پخش";
    document.querySelector(".label-multi-album#label-menu-box-album-play-next").innerHTML = "پخش آلبوم بعد از این موسیقی";
    document.getElementById("label-menu-box-sync-album").innerHTML = "دانلود آلبوم";
    document.getElementById("label-menu-box-album-share").innerHTML = "اشتراک گذاری";
    document.querySelector(".label-multi-album#label-menu-box-cancel").innerHTML = "خروج";
    document.querySelector(".label-multi-playlist#label-menu-box-play-album").innerHTML = "پخش لیست";
    document.querySelector(".label-multi-playlist#label-menu-box-album-add-to-queue").innerHTML = "اضافه لیست به لیست پخش";
    document.querySelector(".label-multi-playlist#label-menu-box-album-play-next").innerHTML = "پخش لیست بعد از این موسیقی";
    document.getElementById("label-menu-box-download-playlist").innerHTML = "دانلود همه";
    document.getElementById("label-menu-box-sync-playlist").innerHTML = "همزمان نگه داری این لیست پخش";
    document.getElementById("label-menu-box-remove-playlist").innerHTML = "حذف لیست";
    document.querySelector(".label-multi-playlist#label-menu-box-cancel").innerHTML = "خروج";
    document.querySelector("#more-option-Downloaded_Media").children[1].innerHTML = "دانلود ها";
    document.querySelector("#more-option-Recent_Media").children[1].innerHTML = "آخرین پخش شده ها";
    document.querySelector("#more-option-Playlists").children[1].innerHTML = "لیست های پخش";
    document.querySelector("#more-option-Settings").children[1].innerHTML = "تنظیمات";
    return document.querySelector(".flash-message").style.direction = "rtl";
  } else {
    document.body.classList.remove("fa");
    document.getElementById("label-wikiseda").innerHTML = enTexts["label-wikiseda"];
    document.getElementById("label-wikiseda-desc").innerHTML = enTexts["label-wikiseda-desc"];
    document.getElementById("login-link").innerHTML = enTexts["login-link"];
    document.getElementById("forgetLink").innerHTML = enTexts["forgetLink"];
    document.getElementById("label-register-username").placeholder = enTexts["label-register-username"];
    document.getElementById("label-register-email").placeholder = enTexts["label-register-email"];
    document.getElementById("label-register-password").placeholder = enTexts["label-register-password"];
    document.getElementById("label-register-submit").value = enTexts["label-register-submit"];
    document.getElementById("label-login-username").placeholder = enTexts["label-login-username"];
    document.getElementById("label-login-password").placeholder = enTexts["label-login-password"];
    document.getElementById("label-login-submit").value = enTexts["label-login-submit"];
    document.getElementById("label-bottom-home").innerHTML = enTexts["label-bottom-home"];
    document.getElementById("label-bottom-artists").innerHTML = enTexts["label-bottom-artists"];
    document.getElementById("label-bottom-songs").innerHTML = enTexts["label-bottom-songs"];
    document.getElementById("label-bottom-albums").innerHTML = enTexts["label-bottom-albums"];
    document.getElementById("label-bottom-more").innerHTML = enTexts["label-bottom-more"];
    document.getElementById("now-playing").innerHTML = enTexts["now-playing"];
    document.getElementById("play-queue").innerHTML = enTexts["play-queue"];
    document.getElementById("label-player-wikiseda").innerHTML = enTexts["label-player-wikiseda"];
    document.getElementById("label-player-wikiseda-sesc").innerHTML = enTexts["label-player-wikiseda-sesc"];
    document.getElementById("label-miniplayer-wikiseda").innerHTML = enTexts["label-miniplayer-wikiseda"];
    document.getElementById("label-miniplayer-wikiseda-desc").innerHTML = enTexts["label-miniplayer-wikiseda-desc"];
    document.getElementById("label-menu-box-add-to-queue").innerHTML = enTexts["label-menu-box-add-to-queue"];
    document.getElementById("label-menu-box-play-next").innerHTML = enTexts["label-menu-box-play-next"];
    document.getElementById("label-menu-box-add-to-playlist").innerHTML = enTexts["label-menu-box-add-to-playlist"];
    document.getElementById("label-menu-box-sync").innerHTML = enTexts["label-menu-box-sync"];
    document.getElementById("label-menu-box-music-share").innerHTML = enTexts["label-menu-box-music-share"];
    document.getElementById("label-menu-box-info").innerHTML = enTexts["label-menu-box-info"];
    document.querySelector(".label-multi-music#label-menu-box-cancel").innerHTML = enTexts[".label-multi-music#label-menu-box-cancel"];
    document.getElementById("label-menu-box-artist-page").innerHTML = enTexts["label-menu-box-artist-page"];
    document.getElementById("label-menu-box-now-add-to-playlist").innerHTML = enTexts["label-menu-box-now-add-to-playlist"];
    document.getElementById("label-menu-box-now-music-share").innerHTML = enTexts["label-menu-box-now-music-share"];
    document.querySelector(".label-multi-music#label-now-menu-box-cancel").innerHTML = enTexts[".label-multi-music#label-now-menu-box-cancel"];
    document.getElementById("label-menu-box-follow").innerHTML = enTexts["label-menu-box-follow"];
    document.getElementById("label-menu-box-play-top").innerHTML = enTexts["label-menu-box-play-top"];
    document.getElementById("label-menu-box-artist-share").innerHTML = enTexts["label-menu-box-artist-share"];
    document.querySelector(".label-multi-artist#label-menu-box-cancel").innerHTML = enTexts[".label-multi-artist#label-menu-box-cancel"];
    document.querySelector(".label-multi-album#label-menu-box-play-album").innerHTML = enTexts[".label-multi-album#label-menu-box-play-album"];
    document.querySelector(".label-multi-album#label-menu-box-album-add-to-queue").innerHTML = enTexts[".label-multi-album#label-menu-box-album-add-to-queue"];
    document.querySelector(".label-multi-album#label-menu-box-album-play-next").innerHTML = enTexts[".label-multi-album#label-menu-box-album-play-next"];
    document.getElementById("label-menu-box-sync-album").innerHTML = enTexts["label-menu-box-sync-album"];
    document.getElementById("label-menu-box-album-share").innerHTML = enTexts["label-menu-box-album-share"];
    document.querySelector(".label-multi-album#label-menu-box-cancel").innerHTML = enTexts[".label-multi-album#label-menu-box-cancel"];
    document.querySelector(".label-multi-playlist#label-menu-box-play-album").innerHTML = enTexts[".label-multi-playlist#label-menu-box-play-album"];
    document.querySelector(".label-multi-playlist#label-menu-box-album-add-to-queue").innerHTML = enTexts[".label-multi-playlist#label-menu-box-album-add-to-queue"];
    document.querySelector(".label-multi-playlist#label-menu-box-album-play-next").innerHTML = enTexts[".label-multi-playlist#label-menu-box-album-play-next"];
    document.getElementById("label-menu-box-sync-playlist").innerHTML = enTexts["label-menu-box-sync-playlist"];
    document.getElementById("label-menu-box-download-playlist").innerHTML = enTexts["label-menu-box-download-playlist"];
    document.getElementById("label-menu-box-remove-playlist").innerHTML = enTexts["label-menu-box-remove-playlist"];
    document.querySelector(".label-multi-playlist#label-menu-box-cancel").innerHTML = enTexts[".label-multi-playlist#label-menu-box-cancel"];
    document.querySelector("#more-option-Downloaded_Media").children[1].innerHTML = enTexts["#more-option-Downloaded_Media"];
    document.querySelector("#more-option-Recent_Media").children[1].innerHTML = enTexts["#more-option-Recent_Media"];
    document.querySelector("#more-option-Playlists").children[1].innerHTML = enTexts["#more-option-Playlists"];
    document.querySelector("#more-option-Settings").children[1].innerHTML = enTexts["#more-option-Settings"];
    return document.querySelector(".flash-message").style.direction = "ltr";
  }
})();



},{"./Tools/SettingStorage":27,"simple-touch":76}],42:[function(require,module,exports){
var lastRequest, request;

request = require('superagent');

lastRequest = null;

module.exports = (function(_this) {
  return function(id, cbDone, cbFail) {
    if (lastRequest != null) {
      lastRequest.xhr.abort();
    }
    return lastRequest = request.get(SERVER_ADDRESS + "gettrackdetail").query({
      lyric: 1,
      id: id
    }).on('error', function(e) {
      if (cbFail != null) {
        return cbFail(e);
      }
    }).end(function(res) {
      if (res.ok) {
        if (cbDone != null) {
          return cbDone(res.body);
        }
      } else {
        if (cbFail != null) {
          return cbFail(res);
        }
      }
    });
  };
})(this);



},{"superagent":77}],43:[function(require,module,exports){
var Login, login, request, serialize, settingStorage;

settingStorage = require('./Tools/SettingStorage');

serialize = require('./Tools/serialize');

request = require('superagent');

Login = (function() {
  function Login() {
    this.ok = false;
    this.tryCount = 0;
    this.query = {
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
      remember: "1"
    };
    this.sid = localStorage.getItem("sid");
  }

  Login.prototype.delayedLogin = function() {
    return setTimeout((function(_this) {
      return function() {
        return _this.login();
      };
    })(this), 1000);
  };

  Login.prototype.login = function(username, password) {
    var transferCanceled, transferComplete, transferFailed, transferTimeout;
    if ((username != null) && (password != null)) {
      this.query = {
        username: username,
        password: password,
        remember: "1"
      };
    }
    transferComplete = (function(_this) {
      return function(evt) {
        var data;
        data = JSON.parse(evt.target.responseText);
        if (data.error === 0) {
          _this.tryCount = 0;
          _this.sid = data.sid;
          _this.ok = true;
          localStorage.setItem("username", _this.query.username);
          localStorage.setItem("password", _this.query.password);
          localStorage.setItem("sid", _this.sid);
          if (_this.successCb != null) {
            _this.successCb();
          }
        } else {
          if (data.msg.password != null) {
            if (_this.failedCb != null) {
              _this.failedCb(data.msg.password[0]);
            }
          } else {
            if (_this.failedCb != null) {
              _this.failedCb();
            }
          }
        }
      };
    })(this);
    transferFailed = (function(_this) {
      return function(evt) {
        if (_this.tryCount < 10) {
          _this.login(_this.query.username, _this.query.password);
          return _this.tryCount++;
        } else {
          _this.tryCount = 0;
          if (_this.cbAbort != null) {
            return _this.cbAbort("Conncetion Problem");
          }
        }
      };
    })(this);
    transferTimeout = (function(_this) {
      return function(evt) {
        if (_this.tryCount < 10) {
          _this.login(_this.query.username, _this.query.password);
          return _this.tryCount++;
        } else {
          _this.tryCount = 0;
          if (_this.cbAbort != null) {
            return _this.cbAbort("Conncetion Problem");
          }
        }
      };
    })(this);
    transferCanceled = (function(_this) {
      return function(evt) {
        if (_this.cbAbort != null) {
          _this.cbAbort();
        }
        return _this.tryCount++;
      };
    })(this);
    this.oReq = new XMLHttpRequest();
    this.oReq.addEventListener("load", transferComplete, false);
    this.oReq.addEventListener("error", transferFailed, false);
    this.oReq.addEventListener("abort", transferCanceled, false);
    this.oReq.addEventListener("timeout", transferTimeout, false);
    this.oReq.open("get", SERVER_ADDRESS + "login?" + serialize(this.query), true);
    this.oReq.timeout = window.TIMEOUT;
    return this.oReq.send();
  };

  Login.prototype.register = function(username, password, email) {
    var transferCanceled, transferComplete, transferFailed, transferTimeout;
    if ((username != null) && (password != null) && (email != null)) {
      this.query = {
        username: username,
        password: password,
        password2: password,
        email: email
      };
    }
    transferComplete = (function(_this) {
      return function(evt) {
        var data;
        data = JSON.parse(evt.target.responseText);
        _this.tryCount = 0;
        if (data.error === 0) {
          _this.sid = data.sid;
          _this.ok = true;
          localStorage.setItem("username", _this.query.username);
          localStorage.setItem("password", _this.query.password);
          localStorage.setItem("sid", _this.sid);
          if (_this.successCb != null) {
            _this.successCb();
          }
        } else {
          if (data.msg.password != null) {
            if (_this.failedCb != null) {
              _this.failedCb(data.msg.password[0]);
            }
          } else if (data.msg.user_username != null) {
            if (_this.failedCb != null) {
              _this.failedCb(data.msg.user_username[0]);
            }
          } else if (data.msg.repeatPassword != null) {
            if (_this.failedCb != null) {
              _this.failedCb(data.msg.repeatPassword[0]);
            }
          } else if (data.msg.user_email != null) {
            if (_this.failedCb != null) {
              _this.failedCb(data.msg.user_email[0]);
            }
          } else {
            if (_this.failedCb != null) {
              _this.failedCb();
            }
          }
        }
      };
    })(this);
    transferFailed = (function(_this) {
      return function(evt) {
        if (_this.tryCount < 10) {
          _this.register(_this.query.username, _this.query.password, _this.query.email);
          return _this.tryCount++;
        } else {
          _this.tryCount = 0;
          if (_this.cbAbort != null) {
            return _this.cbAbort("Conncetion Problem");
          }
        }
      };
    })(this);
    transferTimeout = (function(_this) {
      return function(evt) {
        if (_this.tryCount < 10) {
          _this.register(_this.query.username, _this.query.password, _this.query.email);
          return _this.tryCount++;
        } else {
          _this.tryCount = 0;
          if (_this.cbAbort != null) {
            return _this.cbAbort("Conncetion Problem");
          }
        }
      };
    })(this);
    transferCanceled = (function(_this) {
      return function(evt) {
        if (_this.cbAbort != null) {
          _this.cbAbort();
        }
        return _this.tryCount++;
      };
    })(this);
    this.oReq = new XMLHttpRequest();
    this.oReq.addEventListener("load", transferComplete, false);
    this.oReq.addEventListener("error", transferFailed, false);
    this.oReq.addEventListener("abort", transferCanceled, false);
    this.oReq.addEventListener("timeout", transferTimeout, false);
    this.oReq.open("get", SERVER_ADDRESS + "signup?" + serialize(this.query), true);
    this.oReq.timeout = window.TIMEOUT;
    return this.oReq.send();
  };

  Login.prototype.logout = function() {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    return localStorage.removeItem("sid");
  };

  Login.prototype.onSuccess = function(successCb) {
    this.successCb = successCb;
  };

  Login.prototype.onFail = function(failedCb) {
    this.failedCb = failedCb;
  };

  Login.prototype.onAbort = function(cbAbort) {
    this.cbAbort = cbAbort;
  };

  return Login;

})();

login = new Login();

module.exports = login;



},{"./Tools/SettingStorage":27,"./Tools/serialize":29,"superagent":77}],44:[function(require,module,exports){
var Touch, login;

login = require("./login");

Touch = require('simple-touch');

Touch.onTap("setting-logout").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var callBackConfirmFunction, result;
    callBackConfirmFunction = function(button) {
      var fail, success;
      if (button === 1) {
        login.logout();
        window.location.href = "./index.html";
        if (typeof cordova !== "undefined" && cordova !== null) {
          success = function() {};
          fail = function() {};
          return window.audioplayer.stop(success, fail);
        }
      }
    };
    if (navigator.notification != null) {
      return navigator.notification.confirm("Logout?", callBackConfirmFunction, 'Logout', ["Yes", "No"]);
    } else {
      result = confirm("Logout?");
      if (result) {
        return callBackConfirmFunction(1);
      }
    }
  };
})(this));



},{"./login":43,"simple-touch":76}],45:[function(require,module,exports){
var BianLian, MenuManagement, PageManager, SongManagement, Touch, _lastType, _lastTypeBeforeLoadSongs, _query, _segment, _type, ad, artistFilter, artistHeaderUpdate, artists, backButton, bottomIconDoneTouchHandler, bottomIconEndTouchHandler, bottomIconIds, bottomIconStartTouchHandler, closeArtist, closeGenre, flashMessage, followArtist, getFS, handleScrollCallback, i, id, initPage, len, loadSongs, login, main, morePage, musicDataCache, network, openArtist, openGenre, pm, reachedEnd, searchEvent, searchEverything, searchHistory, searchQuerySegmented, segmented, segmentedTypes, selectedArtist, selectedGenre, selectedMenuItem, selectedSegmented, settingStorage, types;

window.TIMEOUT = 6000;

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

flashMessage = require('./FlashMessage');

getFS = require('./Tools/getFS')();

require('./share');

require('./logout');

require('./playlist');

morePage = require('./morePage');

require('./infoInMenu');

require('./removePlaylist');

require('./AlbumManagement');

require('./removeSongFromDevice');

login = require('./login');

ad = require('./ad');

Touch = require('simple-touch');

BianLian = require('./Item/BianLian');

segmented = require('./Item/Segmented');

backButton = require('./BackButton');

PageManager = require('./PageManager');

followArtist = require('./followArtist');

SongManagement = require('./SongManagement');

musicDataCache = require('./musicDataCache');

settingStorage = require('./Tools/SettingStorage');

searchQuerySegmented = require('./Item/searchQuerySegmented');

types = {
  song: require('./Item/Song'),
  album: require('./Item/Album'),
  artist: require('./Item/Artist'),
  artistExpanded: require('./Item/ArtistHeader'),
  settings: require('./Item/Settings'),
  playlist: require('./Item/Playlist'),
  publicplaylist: require('./Item/Genre'),
  genreHeader: require('./Item/GenreHeader'),
  other: require('./Item/Other')
};

searchHistory = require('./searchHistory');

searchEvent = require('./searchEvent');

MenuManagement = require('./MenuManagement');

artistFilter = require('./artistAlbumSongFilter');

artistHeaderUpdate = require('./artistHeaderUpdate');

artistFilter.onChange(function() {
  return initPage();
});

network = require('./network');

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

main = document.querySelector('.main');

selectedMenuItem = document.getElementById('icon-home');

selectedMenuItem.style.backgroundColor = '#00a1eb';

_type = "home";

_lastType = "";

_segment = "featured";

_query = "";

reachedEnd = false;

segmentedTypes = {
  home: function() {
    return "";
  },
  artist: function() {
    return "";
  },
  song: function() {
    return segmented(['featured', 'new', 'top'], ['برجسته', 'جدید', 'بهترین']);
  },
  album: function() {
    return segmented(['featured', 'new', 'top'], ['برجسته', 'جدید', 'بهترین']);
  },
  artistExpanded: function() {
    return segmented(['new', 'top'], ['جدید', 'بهترین']);
  },
  genreExpanded: function() {
    return "";
  },
  playlist: function() {
    return segmented(['downloads', 'playlist', 'settings'], ['دانلود', 'لیست ها', 'تنظیمات']);
  }
};

selectedSegmented = null;

Touch.onTap("segmented-featured").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    selectedSegmented.classList.remove('segmented-label-selected');
    selectedSegmented = event.listener;
    selectedSegmented.classList.add('segmented-label-selected');
    _segment = "featured";
    return initPage();
  };
})(this));

Touch.onTap("segmented-new").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    selectedSegmented.classList.remove('segmented-label-selected');
    selectedSegmented = event.listener;
    selectedSegmented.classList.add('segmented-label-selected');
    _segment = "new";
    return initPage();
  };
})(this));

Touch.onTap("segmented-top").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    selectedSegmented.classList.remove('segmented-label-selected');
    selectedSegmented = event.listener;
    selectedSegmented.classList.add('segmented-label-selected');
    _segment = "top";
    return initPage();
  };
})(this));

morePage.onSelect(function(pageName) {
  if (pageName === "Downloaded Media") {
    selectedMenuItem.style.backgroundColor = '';
    selectedMenuItem = document.getElementById("more-option-Downloaded_Media");
    selectedMenuItem.style.backgroundColor = '#00a1eb';
  } else {
    selectedMenuItem.style.backgroundColor = '';
    selectedMenuItem = document.getElementById("icon-playlist");
    selectedMenuItem.style.backgroundColor = '#00a1eb';
  }
  _type = "playlist";
  _segment = "downloads";
  backButton.activate('home');
  pm.abortLast();
  main.innerHTML = "";
  return main.appendChild(morePage.getNode());
});

Touch.onTap("downloads-more-shortcut").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    selectedSegmented.classList.remove('segmented-label-selected');
    selectedSegmented = event.listener;
    selectedSegmented.classList.add('segmented-label-selected');
    return morePage.jumpToDownloads();
  };
})(this));

Touch.onTap("segmented-downloads").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    selectedSegmented.classList.remove('segmented-label-selected');
    selectedSegmented = event.listener;
    selectedSegmented.classList.add('segmented-label-selected');
    return morePage.jumpToDownloads();
  };
})(this));

Touch.onTap("segmented-playlist").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    selectedSegmented.classList.remove('segmented-label-selected');
    selectedSegmented = event.listener;
    selectedSegmented.classList.add('segmented-label-selected');
    _segment = "playlist";
    return initPage();
  };
})(this));

Touch.onTap("segmented-settings").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    selectedSegmented.classList.remove('segmented-label-selected');
    selectedSegmented = event.listener;
    selectedSegmented.classList.add('segmented-label-selected');
    _segment = "settings";
    pm.abortLast();
    if (segmentedTypes[_type] != null) {
      main.innerHTML = segmentedTypes[_type]() + types.settings();
    }
    selectedSegmented = document.getElementById('segmented-' + _segment);
    return selectedSegmented.classList.add('segmented-label-selected');
  };
})(this));

Touch.onTap("segmented-back").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    _type = _lastType;
    backButton.deactive('artist');
    closeArtist();
    return initPage();
  };
})(this));

selectedArtist = null;

artists = [];

pm = new PageManager((function(_this) {
  return function(items) {
    var data, div, elText, i, isPlaying, j, k, len, len1, len2, playlist, ref, shouldUpdateHeader, track;
    if ((_type === "artistExpanded" || _type === "genreExpanded") && items.items.length === 0) {
      return;
    }
    BianLian.remove(main);
    if (items.length === 0 && _segment !== "playlist") {
      elText = "No result!";
      if (window.lang === "fa") {
        elText = "بدون نتیجه!";
      }
      main.innerHTML = main.innerHTML + BianLian.node(elText, 'no-result');
      searchEvent();
      return;
    }
    if (_type === "artist" || (_type === "home" && _query !== "")) {
      artists = items;
    } else if (_type === "artistExpanded") {
      if (selectedArtist.shouldUpdate) {
        selectedArtist = items.artist[0];
      }
      items = items.items;
      artists = [];
    } else if (_type === "genreExpanded") {
      items = items.items;
    } else {
      artists = [];
    }
    div = "";
    if (_type === "playlist" && _segment === "playlist") {
      for (i = 0, len = items.length; i < len; i++) {
        playlist = items[i];
        div = div + types.playlist(playlist);
      }
      elText = 'Create new playlist';
      if (window.lang === "fa") {
        elText = 'ساخت لیست جدید';
      }
      main.innerHTML = main.innerHTML + div + BianLian.node(elText, 'new-playlist');
    } else {
      isPlaying = false;
      for (j = 0, len1 = items.length; j < len1; j++) {
        data = items[j];
        if (types[data.type] != null) {
          div = div + types[data.type](data);
        }
        if (data.type === "song") {
          window.backupQueue.unshift({
            data: data
          });
        }
        if (data.type === "album") {
          ref = data.albumtracks;
          for (k = 0, len2 = ref.length; k < len2; k++) {
            track = ref[k];
            window.backupQueue.unshift({
              data: track
            });
          }
        }
        if (data.type === "song" && SongManagement.checkIsPlaying(data.id) === true) {
          isPlaying = data.id;
        }
      }
      if (items.length > 19) {
        elText = 'Load More Items';
        if (window.lang === "fa") {
          elText = 'بارگذاری موارد بیشتر';
        }
        div = div + BianLian.node(elText, 'load-more-items');
      } else {
        reachedEnd = true;
      }
      main.innerHTML = main.innerHTML + div;
      if (isPlaying !== false) {
        SongManagement.changePlayingDiv(document.querySelector('[data-song-id="' + isPlaying + '"]'));
      }
      if (selectedSegmented != null) {
        selectedSegmented.classList.add('segmented-label-selected');
      }
      if (_type === "artistExpanded") {
        shouldUpdateHeader = main.querySelector(".shouldUpdate");
        if (shouldUpdateHeader != null) {
          artistHeaderUpdate(shouldUpdateHeader, selectedArtist);
        }
        artistFilter.getNodes();
      }
    }
    return searchEvent();
  };
})(this), (function(_this) {
  return function() {
    var elText;
    if (network.status) {
      elText = "Failed, Tap to retry";
      if (window.lang === "fa") {
        elText = 'برای بارگذاری مجدد ضربه بزنید';
      }
      return BianLian.update(main, elText, "failed-refresh");
    } else {
      elText = "You are offline, Tap to play offline";
      if (window.lang === "fa") {
        elText = 'برای پخش در حالت آفلاین ضربه بزنید';
      }
      return BianLian.update(main, elText, "downloads-more-shortcut");
    }
  };
})(this), (function(_this) {
  return function() {
    return false;
  };
})(this), (function(_this) {
  return function() {
    var msgTxt;
    msgTxt = "We tried, but your connection is slow";
    if (window.lang === "fa") {
      msgTxt = "ارتباط شما با اینترنت ضعیف است!";
    }
    return flashMessage.show(msgTxt);
  };
})(this));

(initPage = function() {
  var elText;
  musicDataCache.data = {};
  window.backupQueue = [];
  if (_type === "artistExpanded") {
    elText = 'Loading';
    if (window.lang === "fa") {
      elText = 'در حال بارگذاری';
    }
    if (segmentedTypes[_type] != null) {
      main.innerHTML = segmentedTypes[_type]() + types.artistExpanded(selectedArtist) + BianLian.node(elText, 'load-more');
      artistFilter.getNodes();
    }
  } else if (_type === "genreExpanded") {
    elText = 'Loading';
    if (window.lang === "fa") {
      elText = 'در حال بارگذاری';
    }
    if (segmentedTypes[_type] != null) {
      main.innerHTML = segmentedTypes[_type]() + types.genreHeader(selectedGenre) + BianLian.node(elText, 'load-more');
    }
  } else if (_type === "playlist") {
    elText = 'Loading';
    if (window.lang === "fa") {
      elText = 'در حال بارگذاری';
    }
    if (segmentedTypes[_type] != null) {
      main.innerHTML = segmentedTypes[_type]() + BianLian.node(elText, 'load-more');
    }
  } else {
    elText = 'Load More';
    if (window.lang === "fa") {
      elText = 'بارگذاری بیشتر';
    }
    if (segmentedTypes[_type] != null) {
      main.innerHTML = "<input type='submit' autofocus style='visibility: hidden; position: absolute;'/>" + searchQuerySegmented(_query) + segmentedTypes[_type]() + BianLian.node(elText, 'load-more');
    } else {
      main.innerHTML = "<input type='submit' autofocus style='visibility: hidden; position: absolute;'/>" + searchQuerySegmented(_query) + BianLian.node(elText, 'load-more');
    }
  }
  if (_type === "song" || _type === "album" || _type === "artistExpanded" || _type === "playlist") {
    selectedSegmented = document.getElementById('segmented-' + _segment);
    selectedSegmented.classList.add('segmented-label-selected');
  }
  pm.refresh();
  setTimeout(function() {
    return loadSongs();
  }, 100);
  return searchEvent();
})();

backButton.add('home', function() {
  _type = "home";
  _segment = "new";
  _query = "";
  setTimeout(initPage, 200);
  selectedMenuItem.style.backgroundColor = '';
  selectedMenuItem = document.getElementById('icon-home');
  return selectedMenuItem.style.backgroundColor = '#00a1eb';
});

bottomIconStartTouchHandler = (function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this);

bottomIconEndTouchHandler = (function(_this) {
  return function(event) {
    event.listener.style.backgroundColor = '';
    if (selectedMenuItem === event.listener) {
      return selectedMenuItem.style.backgroundColor = '#00a1eb';
    }
  };
})(this);

bottomIconDoneTouchHandler = (function(_this) {
  return function(event) {
    var id;
    id = event.listener.id;
    _type = id.substring(5, id.length);
    switch (_type) {
      case "artistExpanded":
        _segment = "new";
        break;
      case "playlist":
        _query = "";
        return;
      default:
        _segment = "featured";
    }
    if (_type === "home") {
      backButton.deactive('home');
    } else {
      backButton.activate('home');
    }
    MenuManagement.closeMenu();
    _query = "";
    setTimeout(initPage, 200);
    selectedMenuItem.style.backgroundColor = '';
    selectedMenuItem = event.listener;
    return selectedMenuItem.style.backgroundColor = '#00a1eb';
  };
})(this);

bottomIconIds = ["icon-home", "icon-artist", "icon-song", "icon-album", "icon-playlist"];

for (i = 0, len = bottomIconIds.length; i < len; i++) {
  id = bottomIconIds[i];
  Touch.onTap(id).onStart(bottomIconStartTouchHandler).onEnd(bottomIconEndTouchHandler).onDone(bottomIconDoneTouchHandler);
}

_lastTypeBeforeLoadSongs = "";

loadSongs = (function(_this) {
  return function() {
    var elText;
    elText = "Loading items";
    if (window.lang === "fa") {
      elText = 'درحال بارگذاری موارد';
    }
    BianLian.update(main, elText);
    if (!(reachedEnd && _type === _lastTypeBeforeLoadSongs)) {
      reachedEnd = false;
    }
    _lastTypeBeforeLoadSongs = _type;
    if (_type === "artistExpanded") {
      return pm[_type](_segment, selectedArtist.id, artistFilter.getSongFilter(), artistFilter.getAlbumFilter(), _query);
    } else if (_type === "genreExpanded") {
      return pm[_type](_segment, selectedGenre.id, _query);
    } else {
      return pm[_type](_segment, _query);
    }
  };
})(this);

handleScrollCallback = (function(_this) {
  return function(event) {
    if (reachedEnd) {
      return;
    }
    if (Math.ceil(main.scrollTop + main.getBoundingClientRect().height) >= main.scrollHeight && _type !== "playlist") {
      return loadSongs();
    }
  };
})(this);

main.addEventListener('scroll', handleScrollCallback);

Touch.onTap("load-more-items").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    return loadSongs();
  };
})(this));

Touch.onTap("failed-refresh").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var elText;
    pm.get();
    elText = "Loading";
    if (window.lang === "fa") {
      elText = 'درحال بارگذاری';
    }
    return BianLian.update(main, elText);
  };
})(this));

Touch.onTap("menu-box-add-to-playlist").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var msgTxt;
    msgTxt = "Select a playlist";
    if (window.lang === "fa") {
      msgTxt = "یک لیست را انتخاب کنید";
    }
    return flashMessage.show(msgTxt);
  };
})(this));

selectedGenre = null;

Touch.onTap("item-genre").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    return openGenre(event.listener);
  };
})(this));

backButton.add('genre', function() {
  _type = _lastType;
  return initPage();
});

closeGenre = function() {
  return selectedGenre = null;
};

openGenre = function(div) {
  var genre;
  id = div.getAttribute("data-genre-id");
  _lastType = _type;
  _type = "genreExpanded";
  _segment = "new";
  backButton.activate('genre');
  genre = musicDataCache.data["genre" + id];
  selectedGenre = genre;
  return initPage();
};

Touch.onTap("item-artist").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    MenuManagement.closeMenu();
    SongManagement.closePlayer();
    return openArtist(event.listener);
  };
})(this));

backButton.add('artist', function() {
  _type = _lastType;
  initPage();
  return closeArtist();
});

closeArtist = function() {
  return selectedArtist = null;
};

openArtist = function(div) {
  var artist, artistname, found, j, len1;
  id = div.getAttribute("data-artist-id");
  if (id == null) {
    return;
  }
  if (selectedArtist != null) {
    if (id === selectedArtist.id && _type === "artistExpanded") {
      return;
    }
  }
  found = false;
  for (j = 0, len1 = artists.length; j < len1; j++) {
    artist = artists[j];
    if (artist.id === id) {
      found = true;
      if (_type !== "artistExpanded") {
        _lastType = _type;
        _type = "artistExpanded";
        _segment = "new";
        backButton.activate('artist');
      }
      selectedArtist = artist;
      initPage();
    }
  }
  if (!found) {
    if (_type !== "artistExpanded") {
      _lastType = _type;
      _type = "artistExpanded";
      _segment = "new";
      backButton.activate('artist');
    }
    artistname = div.getAttribute("data-artist-name");
    if ((artistname == null) || artistname === "") {
      artistname = div.innerHTML;
    }
    selectedArtist = {
      id: id,
      artist: artistname,
      shouldUpdate: true
    };
    return initPage();
  }
};

searchEverything = function(text, hasInput) {
  var msgTxt, searchInput, searchInputText;
  if (hasInput == null) {
    hasInput = false;
  }
  searchInputText = "";
  if (hasInput === false) {
    searchInput = document.getElementById('search-input');
    searchInputText = searchInput.value;
  } else {
    searchInputText = text;
  }
  if (searchInputText !== null && searchInputText !== "") {
    msgTxt = "Searching for '" + searchInputText + "'";
    if (window.lang === "fa") {
      msgTxt = "در حال جستجو برای '" + searchInputText + "'";
    }
    flashMessage.show(msgTxt);
    _type = "home";
    _segment = "new";
    _query = searchInputText;
    searchHistory.add(searchInputText);
    setTimeout(initPage, 200);
    selectedMenuItem.style.backgroundColor = '';
    selectedMenuItem = document.getElementById('icon-home');
    return selectedMenuItem.style.backgroundColor = '#00a1eb';
  } else {
    return setTimeout(function() {
      return searchInput.focus();
    }, 300);
  }
};

Touch.onTap("search-button").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap(searchEverything);

Touch.onTap("history-item").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var text;
    id = event.listener.getAttribute("data-history-id");
    text = event.listener.querySelector(".history-item-text").innerText;
    return searchEverything(text, true);
  };
})(this));

Touch.onTap("search-cancel").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    _query = "";
    return initPage();
  };
})(this));

document.addEventListener('keydown', (function(_this) {
  return function(event) {
    if (event.keyCode === 13) {
      return searchEverything();
    }
  };
})(this));

network.onConnectionStatus(function(status) {
  var elText, msgTxt;
  if (status === true && login.ok === false) {
    if (login.query.username != null) {
      login.login();
      msgTxt = "Logging in '" + login.query.username + "'";
      if (window.lang === "fa") {
        msgTxt = "ورود '" + login.query.username + "'";
      }
      flashMessage.show(msgTxt);
    } else {
      alert("Lets login once, then you can use all featurs");
      window.location.href = "./index.html";
      return;
    }
  }
  if (status === true) {
    if (_segment !== "downloads") {
      pm.get();
      elText = "Loading";
      if (window.lang === "fa") {
        elText = 'درحال بارگذاری';
      }
      BianLian.update(main, elText);
    }
    msgTxt = "Wellcome back online";
    if (window.lang === "fa") {
      msgTxt = "دوباره آنلاین هستید";
    }
    flashMessage.show(msgTxt);
    return ad.banner();
  } else {
    return setTimeout(function() {
      msgTxt = "You just went offline";
      if (window.lang === "fa") {
        msgTxt = "شما آفلاین شدید";
      }
      flashMessage.show(msgTxt);
      morePage.jumpToDownloads();
      selectedMenuItem.style.backgroundColor = '';
      selectedMenuItem = document.getElementById("more-option-Downloaded_Media");
      selectedMenuItem.style.backgroundColor = '#00a1eb';
      return ad.remove();
    }, 1000);
  }
});



},{"./AlbumManagement":1,"./BackButton":3,"./FlashMessage":4,"./Item/Album":5,"./Item/Artist":6,"./Item/ArtistHeader":7,"./Item/BianLian":8,"./Item/Genre":9,"./Item/GenreHeader":10,"./Item/Other":12,"./Item/Playlist":13,"./Item/Segmented":15,"./Item/Settings":16,"./Item/Song":17,"./Item/searchQuerySegmented":20,"./MenuManagement":22,"./PageManager":24,"./SongManagement":26,"./Tools/SettingStorage":27,"./Tools/getFS":28,"./ad":31,"./artistAlbumSongFilter":32,"./artistHeaderUpdate":33,"./followArtist":36,"./infoInMenu":40,"./login":43,"./logout":44,"./morePage":46,"./musicDataCache":52,"./network":53,"./playlist":54,"./removePlaylist":58,"./removeSongFromDevice":59,"./searchEvent":61,"./searchHistory":62,"./share":65,"simple-touch":76}],46:[function(require,module,exports){
var About, Downloads, History, MenuManagement, Playlists, Settings, Touch, morePage;

Touch = require('simple-touch');

Downloads = require('./more/downloads');

History = require('./more/history');

Playlists = require('./more/playlists');

Settings = require('./more/settings');

About = require('./more/about');

MenuManagement = require('./MenuManagement');

morePage = (function() {
  function morePage() {
    this.node = document.createElement("div");
    this.downloads = new Downloads();
    this.history = new History();
    this.playlists = new Playlists();
    this.settings = new Settings();
    this.about = new About();
    this.items = [
      {
        name: "Downloaded Media",
        fa: "دانلود ها",
        page: this.downloads
      }, {
        name: "Recent Media",
        fa: "آخرین پخش شده ها",
        page: this.history
      }, {
        name: "Playlists",
        fa: "لیست های پخش",
        page: this.playlists
      }, {
        name: "Settings",
        fa: "تنظیمات",
        page: this.settings
      }, {
        name: "About us",
        fa: "درباره ما",
        page: this.about
      }
    ];
    this.setEventsOnce();
  }

  morePage.prototype.onSelect = function(selectCb) {
    this.selectCb = selectCb;
  };

  morePage.prototype.jumpToDownloads = function() {
    if (this.selectCb != null) {
      this.selectCb();
    }
    this.node.innerHTML = "";
    return this.node.appendChild(this.items[0].page.getNode());
  };

  morePage.prototype.setEventsOnce = function() {
    var i, item, len, ref, results;
    ref = this.items;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      results.push((function(_this) {
        return function(item) {
          var id;
          id = "more-option-" + item.name.replace(" ", "_");
          return Touch.onTap(id).onStart(function(event) {
            return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
          }).onEnd(function(event) {
            return event.listener.style.backgroundColor = '';
          }).onTap(function(event) {
            MenuManagement.closeMenu();
            _this.selectCb(item.name);
            _this.node.innerHTML = "";
            return _this.node.appendChild(item.page.getNode());
          });
        };
      })(this)(item));
    }
    return results;
  };

  morePage.prototype.getNode = function() {
    return this.node;
  };

  morePage.prototype.createOption = function(text, fa) {
    var id;
    id = "more-option-" + text.replace(" ", "_");
    if (window.lang === "fa") {
      text = fa;
    }
    return "<div id=\"" + id + "\" class=\"more-select\"><span class=\"more-select-icon\"></span><span class=\"more-select-text\">" + text + "</span></div>";
  };

  return morePage;

})();

module.exports = new morePage;



},{"./MenuManagement":22,"./more/about":47,"./more/downloads":48,"./more/history":49,"./more/playlists":50,"./more/settings":51,"simple-touch":76}],47:[function(require,module,exports){
var About, Touch, fbLink, fbLinks, historyManage, insta, instaLinks, schemeFb, schemeInsta;

historyManage = require('../historyManage');

Touch = require('simple-touch');

module.exports = About = (function() {
  function About() {}

  About.prototype.getNode = function() {
    var div;
    div = document.createElement("div");
    div.classList.add("about");
    div.innerHTML = "<div class=\"about-logo\">\n	<a onclick=\"window.open('http://wikiseda.org', '_system')\"><img src=\"./assets/images/logo.png\" height=\"120px\" width=\"120px\" alt=\"Instagram\" /></a>\n</div>\n<div class=\"about-link\"><a onclick=\"window.open('http://wikiseda.org', '_system')\">ویکی صدا</a></div>\n<div class=\"about-desc\">تمام ترانه ها در جیب شما</div>\n<div class=\"about-dmca\"><a onclick=\"window.open('http://wikiseda.org/DMCA.html', '_system')\">ادعای حذف آثار کپی رایت شده (DMCA)</a></div>\n<div>\n	<span>\n		<a id=\"about-link-insta\"><img src=\"./assets/images/insta.png\" height=\"60px\" width=\"60px\" alt=\"Instagram\" /></a>\n	</span>\n	<span>\n		<a id=\"about-link-face\"><img src=\"./assets/images/face.png\" height=\"60px\" width=\"60px\" alt=\"Facebook\" /></a>\n	</span>\n</div>\n";
    return div;
  };

  return About;

})();

insta = "http://instagram.com/_u/wikiseda";

fbLink = "http://facebook.com/wikiseda";

if (typeof device !== "undefined" && device !== null) {
  if (typeof appAvailability !== "undefined" && appAvailability !== null) {
    instaLinks = {
      android: "http://instagram.com/_u/wikiseda",
      ios: "instagram://user?username=wikiseda"
    };
    fbLinks = "fb://page/wikiseda";
    schemeInsta = void 0;
    schemeFb = void 0;
    if (device.platform === 'iOS') {
      schemeInsta = 'instagram://';
      schemeFb = 'fb://';
    } else if (device.platform === 'Android') {
      schemeInsta = 'com.instagram.android';
      schemeFb = 'com.facebook.katana';
    }
    appAvailability.check(schemeInsta, (function() {
      if (device.platform === 'iOS') {
        insta = instaLinks.ios;
      } else if (device.platform === 'Android') {
        insta = instaLinks.android;
      }
    }), function() {});
    appAvailability.check(schemeFb, (function() {
      if (device.platform === 'iOS') {
        fbLink = fbLinks;
      } else if (device.platform === 'Android') {
        fbLink = fbLinks;
      }
    }), function() {});
  }
}

Touch.onTap("about-link-face").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    event.preventDefault();
    return window.open(fbLink, '_system');
  };
})(this));

Touch.onTap("about-link-insta").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    event.preventDefault();
    return window.open(insta, '_system');
  };
})(this));



},{"../historyManage":38,"simple-touch":76}],48:[function(require,module,exports){
var Downloads, Touch, album, downloadingList, playlist, settingStorage, song;

Touch = require('simple-touch');

settingStorage = require('../Tools/SettingStorage');

downloadingList = require('../download');

song = require('../Item/Song');

album = require('../Item/Album');

playlist = require('../Item/Playlist');

Downloads = (function() {
  function Downloads() {
    this.init();
  }

  Downloads.prototype.init = function() {
    this.node = document.createElement("div");
    this.node.appendChild(this.createSegmented());
    this.node.appendChild(this.createSearchElement());
    return this.node.appendChild(this.createPlaceForItems());
  };

  Downloads.prototype.createSegmented = function() {
    var albumsText, allText, playlistsText, songsText;
    this.segmentedNode = document.createElement("div");
    this.segmentedNode.className = "main-item main-item-segmented";
    allText = "All";
    songsText = "Song";
    albumsText = "Album";
    playlistsText = "Playlist";
    if (window.lang === "fa") {
      allText = "همه";
      songsText = "موسیقی";
      albumsText = "آلبوم";
      playlistsText = "لیست پخش";
    }
    this.segmentedNode.innerHTML = "<input type=\"submit\" autofocus=\"\" style=\"visibility: hidden; position: absolute;\"><span class=\"segmented\"><span class=\"segmented-label segmented-label-selected\" data-filter=\"all\" id=\"segmented-downloaded\">" + allText + "</span><span class=\"segmented-label\" data-filter=\"song\" id=\"segmented-downloaded\">" + songsText + "</span><span class=\"segmented-label\" data-filter=\"album\" id=\"segmented-downloaded\">" + albumsText + "</span><span class=\"segmented-label\" data-filter=\"playlist\" id=\"segmented-downloaded\">" + playlistsText + "</span></span>";
    this.segmentedAll = this.selectedSegment = this.segmentedNode.children[1].children[0];
    Touch.onTap("segmented-downloaded").onStart((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
      };
    })(this)).onEnd((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = '';
      };
    })(this)).onTap((function(_this) {
      return function(event) {
        var clicked, downloadedItem, downloadedList, filter, filteredList, i, j, len, len1, syncedPlaylists;
        clicked = event.listener;
        _this.selectedSegment.classList.remove("segmented-label-selected");
        _this.selectedSegment = clicked;
        _this.selectedSegment.classList.add("segmented-label-selected");
        filter = _this.selectedSegment.getAttribute("data-filter");
        if (filter === "all") {
          return _this.placeAllItems();
        } else {
          _this.input.value = "";
          filteredList = [];
          _this.placeForItems.innerHTML = "";
          downloadedList = JSON.parse(settingStorage.get("downloaded"));
          if ((downloadedList != null) && downloadedList.length > 0) {
            switch (filter) {
              case "album":
                for (i = 0, len = downloadedList.length; i < len; i++) {
                  downloadedItem = downloadedList[i];
                  if (downloadedItem.album_id != null) {
                    filteredList.push(downloadedItem);
                  }
                }
                break;
              case "song":
                for (j = 0, len1 = downloadedList.length; j < len1; j++) {
                  downloadedItem = downloadedList[j];
                  if (downloadedItem.album_id == null) {
                    filteredList.push(downloadedItem);
                  }
                }
            }
          }
          if (filter === "playlist") {
            syncedPlaylists = settingStorage.get("synced-playlists");
            if ((syncedPlaylists != null) && (syncedPlaylists.length != null)) {
              _this.placePlaylists(syncedPlaylists);
            }
          }
          return _this.placeForItems.appendChild(_this.createDownloadedItems(filteredList));
        }
      };
    })(this));
    return this.segmentedNode;
  };

  Downloads.prototype.createPlaceForItems = function() {
    this.placeForItems = document.createElement("div");
    this.placeForItems.id = "place-for-items";
    return this.placeForItems;
  };

  Downloads.prototype.createDownloadedItems = function(items) {
    var albumData, albumDiv, albumId, albumPlace, albums, data, div, downloadedDivs, i, len;
    div = document.createElement("div");
    div.id = "downloaded";
    downloadedDivs = "";
    if (items != null) {
      albums = {};
      for (i = 0, len = items.length; i < len; i++) {
        data = items[i];
        if (data.album_id) {
          if (albums[data.album_id] != null) {
            albums[data.album_id]["albumtracks"].push(data);
            albums[data.album_id]["trackcount"]++;
          } else {
            albums[data.album_id] = {
              id: data.album_id,
              poster: data.poster,
              poster_big: data.poster_big,
              trackcount: 1,
              album: data.album,
              artist: data.artist
            };
            albums[data.album_id]["albumtracks"] = [data];
            downloadedDivs = ("<div data-place-album='" + data.album_id + "'></div>") + downloadedDivs;
          }
        } else {
          downloadedDivs = song(data, true) + downloadedDivs;
        }
      }
      div.innerHTML = downloadedDivs;
      for (albumId in albums) {
        albumData = albums[albumId];
        albumDiv = album(albumData, true);
        albumPlace = div.querySelector("[data-place-album='" + albumId + "']");
        if (albumPlace != null) {
          albumPlace.outerHTML = albumDiv;
        }
      }
    }
    return div;
  };

  Downloads.prototype.createPlayAll = function() {
    var elText;
    this.playAllDiv = document.createElement("span");
    this.playAllDiv.id = "playall";
    elText = 'Play all';
    if (window.lang === "fa") {
      elText = 'پخش همه';
    }
    this.playAllDiv.innerHTML = "<span class=\"main-item maxWidth\" id=\"play-all-downloaded\">" + elText + "</span>";
    return this.playAllDiv;
  };

  Downloads.prototype.placeAllItems = function() {
    var downloaded, syncedPlaylists;
    this.placeForItems.innerHTML = "";
    this.placeForItems.appendChild(downloadingList());
    downloaded = JSON.parse(settingStorage.get("downloaded"));
    this.placeForItems.appendChild(this.createDownloadedItems(downloaded));
    syncedPlaylists = settingStorage.get("synced-playlists");
    if ((syncedPlaylists != null) && (syncedPlaylists.length != null)) {
      return this.placePlaylists(syncedPlaylists);
    }
  };

  Downloads.prototype.placePlaylists = function(syncedPlaylists) {
    var div, downloadedDivs, i, len, syncedPlaylist;
    div = document.createElement("div");
    div.id = "downloaded";
    downloadedDivs = "";
    for (i = 0, len = syncedPlaylists.length; i < len; i++) {
      syncedPlaylist = syncedPlaylists[i];
      if (syncedPlaylist.albumtracks.length > 0) {
        downloadedDivs = playlist(syncedPlaylist, true) + downloadedDivs;
      }
    }
    div.innerHTML = downloadedDivs;
    return this.placeForItems.appendChild(div);
  };

  Downloads.prototype.getNode = function() {
    var albumsText, allText, elText, playlistsText, songsText;
    this.input.setAttribute("placeholder", "Tap to Filter Results");
    allText = "All";
    songsText = "Song";
    albumsText = "Album";
    playlistsText = "Playlist";
    elText = 'Play all';
    if (window.lang === "fa") {
      allText = "همه";
      songsText = "موسیقی";
      albumsText = "آلبوم";
      playlistsText = "لیست پخش";
      this.input.setAttribute("placeholder", "برای جستجو ضربه بزنید");
      elText = 'پخش همه';
    }
    this.segmentedNode.innerHTML = "<input type=\"submit\" autofocus=\"\" style=\"visibility: hidden; position: absolute;\"><span class=\"segmented\"><span class=\"segmented-label segmented-label-selected\" data-filter=\"all\" id=\"segmented-downloaded\">" + allText + "</span><span class=\"segmented-label\" data-filter=\"song\" id=\"segmented-downloaded\">" + songsText + "</span><span class=\"segmented-label\" data-filter=\"album\" id=\"segmented-downloaded\">" + albumsText + "</span><span class=\"segmented-label\" data-filter=\"playlist\" id=\"segmented-downloaded\">" + playlistsText + "</span></span>";
    this.segmentedAll = this.selectedSegment = this.segmentedNode.children[1].children[0];
    this.playAllDiv.innerHTML = "<span class=\"main-item maxWidth\" id=\"play-all-downloaded\">" + elText + "</span>";
    this.input.value = "";
    this.placeAllItems();
    return this.node;
  };

  Downloads.prototype.filterResults = function(filter) {
    var downloaded, fuse, i, len, options, playlistsFiltered, syncedPlaylist, syncedPlaylists;
    this.selectedSegment.classList.remove("segmented-label-selected");
    this.selectedSegment = this.segmentedAll;
    this.selectedSegment.classList.add("segmented-label-selected");
    if (filter !== "") {
      this.placeForItems.innerHTML = "";
      downloaded = JSON.parse(settingStorage.get("downloaded"));
      options = {
        caseSensitive: false,
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        keys: ["songname", "album", "artist"]
      };
      fuse = new Fuse(downloaded, options);
      this.placeForItems.appendChild(this.createDownloadedItems(fuse.search(filter)));
      syncedPlaylists = settingStorage.get("synced-playlists");
      if ((syncedPlaylists != null) && (syncedPlaylists.length != null)) {
        options = {
          caseSensitive: false,
          shouldSort: true,
          threshold: 0.1,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          keys: ["songname", "album", "artist"]
        };
        playlistsFiltered = [];
        for (i = 0, len = syncedPlaylists.length; i < len; i++) {
          syncedPlaylist = syncedPlaylists[i];
          fuse = new Fuse(syncedPlaylist.albumtracks, options);
          syncedPlaylist.albumtracks = fuse.search(filter);
          playlistsFiltered.push(syncedPlaylist);
        }
        return this.placePlaylists(playlistsFiltered);
      }
    } else {
      return this.placeAllItems();
    }
  };

  Downloads.prototype.createSearchElement = function() {
    var div;
    div = document.createElement("div");
    div.classList.add("main-item");
    div.classList.add("maxWidth");
    div.classList.add("search-bar");
    this.input = document.createElement("input");
    this.input.setAttribute("placeholder", "Tap to Filter Results");
    if (window.lang === "fa") {
      this.input.setAttribute("placeholder", "برای محدود کردن جستجو ضربه بزنید");
    }
    this.input.setAttribute("type", "Search");
    div.appendChild(this.input);
    this.input.addEventListener("input", (function(_this) {
      return function() {
        return _this.filterResults(_this.input.value);
      };
    })(this));
    div.appendChild(this.createPlayAll());
    return div;
  };

  return Downloads;

})();

module.exports = Downloads;



},{"../Item/Album":5,"../Item/Playlist":13,"../Item/Song":17,"../Tools/SettingStorage":27,"../download":34,"simple-touch":76}],49:[function(require,module,exports){
var History, Touch, album, albumTimeout, historyManage, musicDataCache, song, timeout;

historyManage = require('../historyManage');

song = require('../Item/Song');

album = require('../Item/Album');

Touch = require('simple-touch');

musicDataCache = require('../musicDataCache');

timeout = null;

Touch.onTap("item-song-play").onStart((function(_this) {
  return function(event) {
    var div, parentDiv;
    div = event.listener;
    parentDiv = div.parentNode;
    div.style.backgroundColor = 'rgba(0,0,0,.1)';
    if (div.getAttribute("history") !== "true") {
      return;
    }
    return timeout = setTimeout(function() {
      div.style.backgroundColor = '';
      historyManage.remove(div.getAttribute("data-song-id"));
      parentDiv.removeChild(div);
      if (div.getAttribute("data-kind") === "album-song" && parentDiv.children.length === 0) {
        return parentDiv.parentNode.parentNode.removeChild(parentDiv.parentNode);
      }
    }, 700);
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    event.listener.style.backgroundColor = '';
    if (timeout != null) {
      return clearTimeout(timeout);
    }
  };
})(this));

albumTimeout = null;

Touch.onTap("item-album").onStart((function(_this) {
  return function(event) {
    var div, parentDiv;
    div = event.listener;
    parentDiv = div.parentNode;
    div.style.backgroundColor = 'rgba(0,0,0,.1)';
    if (div.getAttribute("history") !== "true") {
      return;
    }
    return albumTimeout = setTimeout(function() {
      var albumData, i, len, musicData, ref;
      div.style.backgroundColor = '';
      albumData = musicDataCache.data["album" + div.getAttribute('data-album-id')];
      if (albumData == null) {
        albumData = musicDataCache.more["album" + div.getAttribute('data-album-id')];
      }
      ref = albumData.albumtracks;
      for (i = 0, len = ref.length; i < len; i++) {
        musicData = ref[i];
        historyManage.remove(musicData.id);
      }
      return parentDiv.removeChild(div);
    }, 700);
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    event.listener.style.backgroundColor = '';
    if (albumTimeout != null) {
      return clearTimeout(albumTimeout);
    }
  };
})(this));

History = (function() {
  function History() {
    this.init();
  }

  History.prototype.init = function() {
    this.node = document.createElement("div");
    this.node.appendChild(this.createSegmented());
    this.node.appendChild(this.createSearchElement());
    return this.node.appendChild(this.createPlaceForItems());
  };

  History.prototype.createSegmented = function() {
    var albumsText, allText, songsText;
    this.segmentedNode = document.createElement("div");
    this.segmentedNode.className = "main-item main-item-segmented";
    allText = "All";
    songsText = "Song";
    albumsText = "Album";
    if (window.lang === "fa") {
      allText = "همه";
      songsText = "موسیقی";
      albumsText = "آلبوم";
    }
    this.segmentedNode.innerHTML = "<input type=\"submit\" autofocus=\"\" style=\"visibility: hidden; position: absolute;\"><span class=\"segmented\"><span class=\"segmented-label segmented-label-selected\" data-filter=\"all\" id=\"segmented-history\">" + allText + "</span><span class=\"segmented-label\" data-filter=\"song\" id=\"segmented-history\">" + songsText + "</span><span class=\"segmented-label\" data-filter=\"album\" id=\"segmented-history\">" + albumsText + "</span></span>";
    this.segmentedAll = this.selectedSegment = this.segmentedNode.children[1].children[0];
    Touch.onTap("segmented-history").onStart((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
      };
    })(this)).onEnd((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = '';
      };
    })(this)).onTap((function(_this) {
      return function(event) {
        var clicked, downloadedItem, downloadedItems, downloadedList, filter, filteredList, i, j, len, len1;
        clicked = event.listener;
        _this.selectedSegment.classList.remove("segmented-label-selected");
        _this.selectedSegment = clicked;
        _this.selectedSegment.classList.add("segmented-label-selected");
        filter = _this.selectedSegment.getAttribute("data-filter");
        if (filter === "all") {
          return _this.placeAllItems();
        } else {
          _this.input.value = "";
          filteredList = [];
          _this.placeForItems.innerHTML = "";
          downloadedItems = historyManage.getList();
          downloadedList = Object.keys(downloadedItems).map(function(key) {
            return downloadedItems[key];
          });
          if ((downloadedList != null) && downloadedList.length > 0) {
            switch (filter) {
              case "album":
                for (i = 0, len = downloadedList.length; i < len; i++) {
                  downloadedItem = downloadedList[i];
                  if (downloadedItem.album_id != null) {
                    filteredList.push(downloadedItem);
                  }
                }
                break;
              case "song":
                for (j = 0, len1 = downloadedList.length; j < len1; j++) {
                  downloadedItem = downloadedList[j];
                  if (downloadedItem.album_id == null) {
                    filteredList.push(downloadedItem);
                  }
                }
            }
          }
          return _this.placeForItems.appendChild(_this.createHistoryItems(filteredList));
        }
      };
    })(this));
    return this.segmentedNode;
  };

  History.prototype.createPlaceForItems = function() {
    this.placeForItems = document.createElement("div");
    this.placeForItems.id = "place-for-items";
    return this.placeForItems;
  };

  History.prototype.createHistoryItems = function(items) {
    var albumData, albumDiv, albumId, albumPlace, albums, data, div, downloadedDivs, key;
    div = document.createElement("div");
    div.id = "downloaded";
    downloadedDivs = "";
    if (items != null) {
      albums = {};
      for (key in items) {
        data = items[key];
        if (data != null) {
          if (data.album_id != null) {
            if (albums[data.album_id] != null) {
              albums[data.album_id]["albumtracks"].push(data);
              albums[data.album_id]["trackcount"]++;
            } else {
              albums[data.album_id] = {
                id: data.album_id,
                poster: data.poster,
                poster_big: data.poster_big,
                trackcount: 1,
                album: data.album,
                artist: data.artist
              };
              albums[data.album_id]["albumtracks"] = [data];
              downloadedDivs = ("<div data-place-album='" + data.album_id + "'></div>") + downloadedDivs;
            }
          } else {
            downloadedDivs = song(data, false, true) + downloadedDivs;
          }
        }
      }
      div.innerHTML = downloadedDivs;
      for (albumId in albums) {
        albumData = albums[albumId];
        albumDiv = album(albumData, false, true);
        albumPlace = div.querySelector("[data-place-album='" + albumId + "']");
        if (albumPlace != null) {
          albumPlace.outerHTML = albumDiv;
        }
      }
    }
    return div;
  };

  History.prototype.createPlayAll = function() {
    var elText;
    this.playAllDiv = document.createElement("span");
    this.playAllDiv.id = "playall";
    elText = 'Play all';
    if (window.lang === "fa") {
      elText = 'پخش همه';
    }
    this.playAllDiv.innerHTML = "<span class=\"main-item maxWidth\" id=\"play-all-downloaded\">" + elText + "</span>";
    return this.playAllDiv;
  };

  History.prototype.placeAllItems = function() {
    var downloaded;
    this.placeForItems.innerHTML = "";
    downloaded = historyManage.getList();
    return this.placeForItems.appendChild(this.createHistoryItems(downloaded));
  };

  History.prototype.getNode = function() {
    var albumsText, allText, elText, songsText;
    this.input.setAttribute("placeholder", "Tap to Filter Results");
    allText = "All";
    songsText = "Song";
    albumsText = "Album";
    elText = 'Play all';
    if (window.lang === "fa") {
      this.input.setAttribute("placeholder", "برای جستجو ضربه بزنید");
      allText = "همه";
      songsText = "موسیقی";
      albumsText = "آلبوم";
      elText = 'پخش همه';
    }
    this.playAllDiv.innerHTML = "<span class=\"main-item maxWidth\" id=\"play-all-downloaded\">" + elText + "</span>";
    this.segmentedNode.innerHTML = "<input type=\"submit\" autofocus=\"\" style=\"visibility: hidden; position: absolute;\"><span class=\"segmented\"><span class=\"segmented-label segmented-label-selected\" data-filter=\"all\" id=\"segmented-history\">" + allText + "</span><span class=\"segmented-label\" data-filter=\"song\" id=\"segmented-history\">" + songsText + "</span><span class=\"segmented-label\" data-filter=\"album\" id=\"segmented-history\">" + albumsText + "</span></span>";
    this.segmentedAll = this.selectedSegment = this.segmentedNode.children[1].children[0];
    this.input.value = "";
    this.placeAllItems();
    return this.node;
  };

  History.prototype.filterResults = function(filter) {
    var downloaded, fuse, list, options;
    this.selectedSegment.classList.remove("segmented-label-selected");
    this.selectedSegment = this.segmentedAll;
    this.selectedSegment.classList.add("segmented-label-selected");
    if (filter !== "") {
      this.placeForItems.innerHTML = "";
      downloaded = historyManage.getList();
      list = Object.keys(downloaded).map(function(key) {
        return downloaded[key];
      });
      options = {
        caseSensitive: false,
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        keys: ["songname", "album", "artist"]
      };
      fuse = new Fuse(list, options);
      return this.placeForItems.appendChild(this.createHistoryItems(fuse.search(filter)));
    } else {
      return this.placeAllItems();
    }
  };

  History.prototype.createSearchElement = function() {
    var div;
    div = document.createElement("div");
    div.classList.add("main-item");
    div.classList.add("maxWidth");
    div.classList.add("search-bar");
    this.input = document.createElement("input");
    this.input.setAttribute("placeholder", "Tap to Filter Results");
    if (window.lang === "fa") {
      this.input.setAttribute("placeholder", "برای محدود کردن جستجو ضربه بزنید");
    }
    this.input.setAttribute("type", "Search");
    div.appendChild(this.input);
    this.input.addEventListener("input", (function(_this) {
      return function() {
        return _this.filterResults(_this.input.value);
      };
    })(this));
    div.appendChild(this.createPlayAll());
    return div;
  };

  return History;

})();

module.exports = History;



},{"../Item/Album":5,"../Item/Song":17,"../historyManage":38,"../musicDataCache":52,"simple-touch":76}],50:[function(require,module,exports){
var Playlists, Touch, album, playlist, playlistManager, playlistSong, playlistSync, settingStorage, song;

settingStorage = require('../Tools/SettingStorage');

song = require('../Item/Song');

album = require('../Item/Album');

playlist = require('../Item/Playlist');

playlistManager = require('../getPlaylists');

Touch = require('simple-touch');

playlistSong = require('../Item/playlistSong');

playlistSync = require('../playlistSync');

Playlists = (function() {
  function Playlists() {
    this.loading = false;
    this.init();
    this.getPlaylists();
  }

  Playlists.prototype.init = function() {
    this.node = document.createElement("div");
    this.node.appendChild(this.createPlaylistButton());
    this.node.appendChild(this.createPlaceForItems());
    this.node.appendChild(this.createLoading());
    return this.node.appendChild(this.createFailedButton());
  };

  Playlists.prototype.getPlaylists = function() {
    this.showLoading();
    this.failedDiv.style.display = "none";
    playlistManager.get((function(_this) {
      return function(list) {
        _this.items = list;
        _this.hideLoading();
        return _this.placeAllItems();
      };
    })(this), (function(_this) {
      return function() {
        _this.failedDiv.style.display = "block";
        return _this.hideLoading();
      };
    })(this), true);
    return playlistManager.onAdd((function(_this) {
      return function(pl, item) {
        _this.addNewSongToPlaylist(pl, item);
        return playlistSync.addNewSongToPlaylist(pl, item);
      };
    })(this));
  };

  Playlists.prototype.addNewSongToPlaylist = function(pl, item) {
    var countEl, newPlaylistDiv, playlistDiv, songs;
    playlistDiv = this.placeForItems.querySelector("[data-playlist-name=\"" + pl.groupname + "\"]");
    if (playlistDiv == null) {
      if (pl.id != null) {
        playlistDiv = this.placeForItems.querySelector("[data-playlist-id=\"" + pl.id + "\"]");
      }
    }
    if (playlistDiv != null) {
      songs = playlistDiv.querySelector(".main-item-album-songs");
      countEl = playlistDiv.querySelector(".main-item-titles-title-count");
      countEl.innerHTML = parseInt(countEl.innerHTML) + 1;
      return songs.innerHTML = songs.innerHTML + playlistSong(item);
    } else {
      newPlaylistDiv = document.createElement("div");
      this.placeForItems.childNodes[0].insertBefore(newPlaylistDiv, this.placeForItems.childNodes[0].childNodes[0]);
      return newPlaylistDiv.outerHTML = playlist(pl);
    }
  };

  Playlists.prototype.showLoading = function() {
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    return this.loadingDiv.style.display = "";
  };

  Playlists.prototype.hideLoading = function() {
    if (this.loading === false) {
      return;
    }
    this.loading = false;
    return this.loadingDiv.style.display = "none";
  };

  Playlists.prototype.createPlaceForItems = function() {
    this.placeForItems = document.createElement("div");
    this.placeForItems.id = "place-for-items";
    return this.placeForItems;
  };

  Playlists.prototype.createDownloadedItems = function(items) {
    var albums, data, div, downloadedDivs, i, len;
    div = document.createElement("div");
    div.id = "downloaded";
    downloadedDivs = "";
    if (items != null) {
      albums = {};
      for (i = 0, len = items.length; i < len; i++) {
        data = items[i];
        downloadedDivs = playlist(data) + downloadedDivs;
      }
    }
    div.innerHTML = downloadedDivs;
    return div;
  };

  Playlists.prototype.createLoading = function() {
    var elText;
    this.loadingDiv = document.createElement("div");
    this.loadingDiv.id = "loading";
    elText = 'Loading';
    if (window.lang === "fa") {
      elText = 'درحال بارگذاری';
    }
    this.loadingDiv.innerHTML = "<div class=\"main-item maxWidth\">\n<div class=\"main-item-ending circleLoading-text\">" + elText + "</div>\n<div class=\"circleLoading\"></div>\n</div>";
    return this.loadingDiv;
  };

  Playlists.prototype.placeAllItems = function() {
    var downloaded;
    this.placeForItems.innerHTML = "";
    downloaded = this.items;
    this.placeForItems.appendChild(this.createDownloadedItems(downloaded));
    return playlistSync.setPlaylists(this.items, this.placeForItems);
  };

  Playlists.prototype.createPlaylistButton = function() {
    var createPlaylist, elText;
    createPlaylist = document.createElement("div");
    elText = 'Create new playlist';
    if (window.lang === "fa") {
      elText = 'ساخت لیست جدید';
    }
    createPlaylist.id = "createplaylist";
    createPlaylist.innerHTML = "<div class=\"main-item maxWidth\" id=\"new-playlist\">" + elText + "</div>";
    return createPlaylist;
  };

  Playlists.prototype.createFailedButton = function() {
    var elText;
    this.failedDiv = document.createElement("div");
    elText = 'Tap to load again';
    if (window.lang === "fa") {
      elText = 'برای بارگذاری مجدد ضربه بزنید';
    }
    this.failedDiv.id = "failedDiv";
    this.failedDiv.style.display = "none";
    this.failedDiv.innerHTML = "<div class=\"main-item maxWidth\" id=\"failed-load-playlist\">" + elText + "</div>";
    Touch.onTap("failed-load-playlist").onStart((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
      };
    })(this)).onEnd((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = '';
      };
    })(this)).onTap((function(_this) {
      return function(event) {
        return _this.getPlaylists();
      };
    })(this));
    return this.failedDiv;
  };

  Playlists.prototype.getNode = function() {
    return this.node;
  };

  return Playlists;

})();

module.exports = Playlists;



},{"../Item/Album":5,"../Item/Playlist":13,"../Item/Song":17,"../Item/playlistSong":19,"../Tools/SettingStorage":27,"../getPlaylists":37,"../playlistSync":55,"simple-touch":76}],51:[function(require,module,exports){
var Settings, Touch, historyManage, settingsText;

historyManage = require('../historyManage');

settingsText = require('../Item/Settings');

Touch = require('simple-touch');

module.exports = Settings = (function() {
  function Settings(back) {}

  Settings.prototype.getNode = function() {
    var settingsDivs;
    settingsDivs = document.createElement("div");
    settingsDivs.innerHTML = settingsText();
    return settingsDivs;
  };

  return Settings;

})();



},{"../Item/Settings":16,"../historyManage":38,"simple-touch":76}],52:[function(require,module,exports){
module.exports = {
  data: {},
  more: {}
};



},{}],53:[function(require,module,exports){
var Network, network;

Network = (function() {
  function Network() {
    this.cbs = [];
    this.status = false;
    document.addEventListener("offline", (function(_this) {
      return function() {
        var cb, i, len, ref, results;
        _this.status = false;
        ref = _this.cbs;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          cb = ref[i];
          results.push(cb(_this.status));
        }
        return results;
      };
    })(this), false);
    document.addEventListener('online', (function(_this) {
      return function() {
        var cb, i, len, ref, results;
        _this.status = true;
        ref = _this.cbs;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          cb = ref[i];
          results.push(cb(_this.status));
        }
        return results;
      };
    })(this), false);
    if (navigator.connection != null && navigator.connection.type != null) {
      if (navigator.connection.type.toUpperCase() === "NONE" && navigator.connection.type.toUpperCase() === "UNKNOWN") {
        this.status = false;
      } else {
        this.status = true;
      }
    } else {
      this.status = true;
    }
  }

  Network.prototype.onConnectionStatus = function(cb) {
    return this.cbs.push(cb);
  };

  return Network;

})();

network = new Network();

module.exports = network;



},{}],54:[function(require,module,exports){
var MenuManagement, MenuPlaylist, Playlist, Touch, cache, fav, flashMessage, login, menuRequest, musicData, musicDataCache, playlists, request, serialize;

login = require('./login');

flashMessage = require('./FlashMessage');

request = require('superagent');

Touch = require('simple-touch');

Playlist = require('./Item/Playlist');

MenuPlaylist = require('./Item/MenuPlaylist');

musicDataCache = require('./musicDataCache');

menuRequest = require('./MenuRequest');

playlists = require('./getPlaylists');

serialize = require('./Tools/serialize');

MenuManagement = require('./MenuManagement');

cache = require('js-cache');

fav = document.getElementById("player-fav");

Touch.onTap("new-playlist").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var callbackPrompt, msgTxt, msgTxt2, msgTxt3, res;
    callbackPrompt = function(answer) {
      var msgTxt, oReq, plName, query, transferComplete, transferFailed;
      if (answer.buttonIndex === 1) {
        plName = answer.input1;
        msgTxt = "Creating playlist " + plName;
        if (window.lang === "fa") {
          msgTxt = "در حال ساخت لیست " + plName;
        }
        event.listener.innerHTML = msgTxt;
        query = {
          favoritegroup_name: plName,
          sid: login.sid,
          playlist: ""
        };
        transferComplete = (function(_this) {
          return function(evt) {
            var msgTxt2;
            msgTxt = "Playlist " + plName + " created";
            msgTxt2 = "Create new playlist";
            if (window.lang === "fa") {
              msgTxt = "لیست " + plName + " ساخته شد";
              msgTxt2 = "ساخت لیست جدید";
            }
            flashMessage.show(msgTxt);
            event.listener.innerHTML = msgTxt2;
            cache.clear();
            return playlists.add(plName);
          };
        })(this);
        transferFailed = (function(_this) {
          return function(evt) {
            var msgTxt2;
            msgTxt = "Create new playlist failed";
            msgTxt2 = "Create new playlist";
            if (window.lang === "fa") {
              msgTxt = "ساخت " + plName + " موفق نبود!";
              msgTxt2 = "ساخت لیست جدید";
            }
            flashMessage.show(msgTxt);
            return event.listener.innerHTML = msgTxt2;
          };
        })(this);
        oReq = new XMLHttpRequest();
        oReq.addEventListener("load", transferComplete, false);
        oReq.addEventListener("error", transferFailed, false);
        oReq.addEventListener("abort", transferFailed, false);
        oReq.addEventListener("timeout", transferFailed, false);
        oReq.open("get", SERVER_ADDRESS + "addplaylistjson?" + serialize(query), true);
        oReq.timeout = window.TIMEOUT * 3;
        return oReq.send();
      }
    };
    msgTxt = "New playlist name";
    msgTxt2 = "Create";
    msgTxt3 = "Cancel";
    if (window.lang === "fa") {
      msgTxt = "نام لیست جدید";
      msgTxt2 = "بساز";
      msgTxt3 = "بی خیال";
    }
    if (navigator.notification != null) {
      return navigator.notification.prompt(msgTxt, callbackPrompt, "Playlist", [msgTxt2, msgTxt3]);
    } else {
      res = prompt(msgTxt);
      if (res != null) {
        return callbackPrompt({
          buttonIndex: 1,
          input1: res
        });
      }
    }
  };
})(this));

musicData = null;

Touch.onTap("menu-box-add-to-playlist").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var msgTxt;
    musicData = musicDataCache.data[menuRequest.data.getAttribute('data-song-id')];
    if (musicData == null) {
      musicData = musicDataCache.more[menuRequest.data.getAttribute('data-song-id')];
    }
    MenuManagement.openMenu();
    msgTxt = "<h3>Loading playlists</h3>";
    if (window.lang === "fa") {
      msgTxt = "<h3>در حال بارگذاری لیست ها</h3>";
    }
    MenuManagement.updateSubpageContent(msgTxt);
    return playlists.get(function(list) {
      var i, len, pl, x;
      x = "";
      for (i = 0, len = list.length; i < len; i++) {
        pl = list[i];
        x = x + MenuPlaylist(pl);
      }
      return MenuManagement.updateSubpageContent(x);
    }, function() {
      msgTxt = "<h3>Loading playlists failed</h3><h4 id=\"menu-box-add-to-playlist\">Tap to retry</h4>";
      if (window.lang === "fa") {
        msgTxt = "<h3>بارگذاری لیست ها ناموفق</h3><h4 id=\"menu-box-add-to-playlist\">برای بارگذاری مجدد ضربه بزنید</h4>";
      }
      return MenuManagement.updateSubpageContent(msgTxt);
    });
  };
})(this));

Touch.onTap("player-add").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var msgTxt;
    musicData = window.playingMusicData;
    MenuManagement.openMenu();
    msgTxt = "<h3>Loading playlists</h3>";
    if (window.lang === "fa") {
      msgTxt = "<h3>در حال بارگذاری لیست ها</h3>";
    }
    MenuManagement.updateSubpageContent(msgTxt);
    return playlists.get(function(list) {
      var i, len, pl, x;
      x = "";
      for (i = 0, len = list.length; i < len; i++) {
        pl = list[i];
        x = x + MenuPlaylist(pl);
      }
      return MenuManagement.updateSubpageContent(x);
    }, function() {
      msgTxt = "<h3>Loading playlists failed</h3><h4 id=\"menu-box-add-to-playlist\">Tap to retry</h4>";
      if (window.lang === "fa") {
        msgTxt = "<h3>بارگذاری لیست ها ناموفق</h3><h4 id=\"menu-box-add-to-playlist\">برای بارگذاری مجدد ضربه بزنید</h4>";
      }
      return MenuManagement.updateSubpageContent(msgTxt);
    });
  };
})(this));

Touch.onTap("player-fav").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var oReq, plName, query, transferComplete, transferFailed;
    musicData = window.playingMusicData;
    fav.classList.add("top-icons-faved");
    plName = "FavoriteSongs";
    query = {
      favoritegroup_name: plName,
      sid: login.sid,
      playlist: "[{\"id\":\"" + musicData.id + "\"}]"
    };
    transferComplete = function(evt) {
      var msgTxt;
      msgTxt = musicData.songname + " added to " + plName;
      if (window.lang === "fa") {
        msgTxt = musicData.songname + " به لیست " + plName + " اضافه شد";
      }
      flashMessage.show(msgTxt);
      cache.clear();
      return playlists.add(plName, musicData);
    };
    transferFailed = function(evt) {
      var msgTxt;
      msgTxt = "Add " + musicData.songname + " to " + plName + " failed";
      if (window.lang === "fa") {
        msgTxt = "اضافه کردن " + musicData.songname + " به لیست " + plName + " انجام نشد!";
      }
      flashMessage.show(msgTxt);
      return fav.classList.remove("top-icons-faved");
    };
    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", transferComplete, false);
    oReq.addEventListener("error", transferFailed, false);
    oReq.addEventListener("abort", transferFailed, false);
    oReq.addEventListener("timeout", transferFailed, false);
    oReq.open("get", SERVER_ADDRESS + "addplaylistjson?" + serialize(query), true);
    oReq.timeout = window.TIMEOUT * 3;
    return oReq.send();
  };
})(this));

Touch.onTap("menu-playlist-item").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var oReq, plName, query, transferComplete, transferFailed;
    if (musicData === null) {
      return;
    }
    plName = event.listener.getAttribute("data-playlist-name");
    MenuManagement.closeMenu();
    query = {
      favoritegroup_name: plName,
      sid: login.sid,
      playlist: "[{\"id\":\"" + musicData.id + "\"}]"
    };
    transferComplete = function(evt) {
      var msgTxt;
      msgTxt = musicData.songname + " added to " + plName;
      if (window.lang === "fa") {
        msgTxt = musicData.songname + " به لیست " + plName + " اضافه شد";
      }
      flashMessage.show(msgTxt);
      cache.clear();
      return playlists.add(plName, musicData);
    };
    transferFailed = function(evt) {
      var msgTxt;
      msgTxt = "Add " + musicData.songname + " to " + plName + " failed";
      if (window.lang === "fa") {
        msgTxt = "اضافه کردن " + musicData.songname + " به لیست " + plName + " انجام نشد!";
      }
      flashMessage.show(msgTxt);
      return fav.classList.remove("top-icons-faved");
    };
    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", transferComplete, false);
    oReq.addEventListener("error", transferFailed, false);
    oReq.addEventListener("abort", transferFailed, false);
    oReq.addEventListener("timeout", transferFailed, false);
    oReq.open("get", SERVER_ADDRESS + "addplaylistjson?" + serialize(query), true);
    oReq.timeout = window.TIMEOUT * 3;
    return oReq.send();
  };
})(this));



},{"./FlashMessage":4,"./Item/MenuPlaylist":11,"./Item/Playlist":13,"./MenuManagement":22,"./MenuRequest":23,"./Tools/serialize":29,"./getPlaylists":37,"./login":43,"./musicDataCache":52,"js-cache":70,"simple-touch":76,"superagent":77}],55:[function(require,module,exports){
var ActivePlaylistSync, MenuManagement, PlaylistSync, Touch, menuRequest, musicDataCache, playlistManager, settingStorage;

Touch = require('simple-touch');

MenuManagement = require('./MenuManagement');

menuRequest = require('./MenuRequest');

musicDataCache = require('./musicDataCache');

ActivePlaylistSync = require('./playlistSync/ActivePlaylistSync');

playlistManager = require('./getPlaylists');

settingStorage = require('./Tools/SettingStorage');

PlaylistSync = (function() {
  function PlaylistSync() {
    this.activePlaylistSyncs = [];
    this.initListeners();
  }

  PlaylistSync.prototype.setPlaylists = function(list, holderEl) {
    var activePlaylistSync, data, div, i, len, results;
    results = [];
    for (i = 0, len = list.length; i < len; i++) {
      data = list[i];
      div = holderEl.querySelector("[data-playlist-id=\"" + data.id + "\"]");
      if (settingStorage.get("playlist-" + data.id)) {
        activePlaylistSync = new ActivePlaylistSync(data, div);
        this.activePlaylistSyncs.push(activePlaylistSync);
        if (this.syncCb != null) {
          results.push(this.syncCb(activePlaylistSync));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  PlaylistSync.prototype.addNewSongToPlaylist = function(pl, item) {
    var activePlaylistSync, i, len, ref, results;
    ref = this.activePlaylistSyncs;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      activePlaylistSync = ref[i];
      if (activePlaylistSync.data.id === pl.id) {
        if (this.syncCb != null) {
          results.push(this.syncCb(activePlaylistSync));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  PlaylistSync.prototype.initListeners = function() {
    return Touch.onTap("menu-box-sync-playlist").onStart((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
      };
    })(this)).onEnd((function(_this) {
      return function(event) {
        return event.listener.style.backgroundColor = '';
      };
    })(this)).onTap((function(_this) {
      return function(event) {
        var activePlaylistSync, data, i, len, ref;
        data = playlistManager.getOnePlaylist(menuRequest.data.getAttribute('data-playlist-id'));
        if (settingStorage.get("playlist-" + data.id)) {
          ref = _this.activePlaylistSyncs;
          for (i = 0, len = ref.length; i < len; i++) {
            activePlaylistSync = ref[i];
            if (activePlaylistSync.data.id === data.id) {
              activePlaylistSync.cancelSync(menuRequest.data);
            }
          }
        } else {
          activePlaylistSync = new ActivePlaylistSync(data, menuRequest.data);
          if (_this.syncCb != null) {
            _this.syncCb(activePlaylistSync);
          }
          _this.activePlaylistSyncs.push(activePlaylistSync);
        }
        return MenuManagement.closeMenu();
      };
    })(this));
  };

  PlaylistSync.prototype.onSync = function(syncCb) {
    this.syncCb = syncCb;
  };

  return PlaylistSync;

})();

module.exports = new PlaylistSync;



},{"./MenuManagement":22,"./MenuRequest":23,"./Tools/SettingStorage":27,"./getPlaylists":37,"./musicDataCache":52,"./playlistSync/ActivePlaylistSync":56,"simple-touch":76}],56:[function(require,module,exports){
var ActivePlaylistSync, ActiveSongSync, flashMessage, settingStorage;

ActiveSongSync = require('./ActiveSongSync');

settingStorage = require('../Tools/SettingStorage');

flashMessage = require('../FlashMessage');

module.exports = ActivePlaylistSync = (function() {
  function ActivePlaylistSync(data, div) {
    this.data = data;
    this.div = div;
    this.sync();
  }

  ActivePlaylistSync.prototype.sync = function() {
    if (this.div != null) {
      this.div.setAttribute("data-synced", true);
    }
    return settingStorage.set("playlist-" + this.data.id, true);
  };

  ActivePlaylistSync.prototype.cancelSync = function(div) {
    this.div = div;
    if (this.div != null) {
      this.div.removeAttribute("data-synced");
    }
    return settingStorage.remove("playlist-" + this.data.id);
  };

  ActivePlaylistSync.prototype.selectActiveSong = function(musicData) {
    return new ActiveSongSync(musicData, this.div);
  };

  return ActivePlaylistSync;

})();



},{"../FlashMessage":4,"../Tools/SettingStorage":27,"./ActiveSongSync":57}],57:[function(require,module,exports){
var ActiveSongSync, flashMessage;

flashMessage = require('../FlashMessage');

module.exports = ActiveSongSync = (function() {
  function ActiveSongSync(musicData, parent1) {
    this.musicData = musicData;
    this.parent = parent1;
    this.findDiv(this.parent);
    this.findViewFirstText();
  }

  ActiveSongSync.prototype.findDiv = function(parent) {
    if (parent != null) {
      this.div = parent.querySelector(".main-item-album-song#item-song-play[data-song-id='" + this.musicData.id + "']");
    } else {
      this.div = document.querySelector(".main-item-album-song#item-song-play[data-song-id='" + this.musicData.id + "']");
    }
  };

  ActiveSongSync.prototype.findViewFirstText = function() {
    if (this.div) {
      this.view = this.div.querySelector(".menu-item-album-song-view");
      return this.viewFirstText = this.view.innerHTML;
    }
  };

  ActiveSongSync.prototype.skip = function() {
    this.findDiv(this.parent);
    if (this.view) {
      this.view.innerHTML = this.viewFirstText;
    }
  };

  ActiveSongSync.prototype.error = function() {
    var msgTxt;
    msgTxt = "Downloading " + this.musicData.songname + " failed";
    if (window.lang === "fa") {
      msgTxt = "بارگذاری " + this.musicData.songname + " موفق تمام نشد";
    }
    flashMessage.show(msgTxt);
    this.findDiv(this.parent);
    if (this.view) {
      this.view.innerHTML = this.viewFirstText;
    }
  };

  ActiveSongSync.prototype.done = function() {
    this.findDiv(this.parent);
    if (this.view) {
      this.view.innerHTML = this.viewFirstText;
    }
  };

  ActiveSongSync.prototype.inProgress = function(percent) {
    this.findDiv(this.parent);
    if (this.view) {
      return this.view.innerHTML = percent + " %";
    }
  };

  return ActiveSongSync;

})();



},{"../FlashMessage":4}],58:[function(require,module,exports){
var MenuManagement, Touch, flashMessage, login, menuRequest, musicDataCache, playlistManager, remove, serialize;

musicDataCache = require('./musicDataCache');

flashMessage = require('./FlashMessage');

menuRequest = require('./MenuRequest');

MenuManagement = require('./MenuManagement');

Touch = require('simple-touch');

login = require('./login');

serialize = require('./Tools/serialize');

playlistManager = require('./getPlaylists');

remove = function(id, failCb) {
  var address, oReq, query, transferComplete, transferFailed;
  transferComplete = (function(_this) {
    return function(evt) {
      var msgTxt;
      msgTxt = "Playlist removed";
      if (window.lang === "fa") {
        msgTxt = "لیست حذف شد";
      }
      flashMessage.show(msgTxt);
    };
  })(this);
  transferFailed = (function(_this) {
    return function(evt) {
      var failedTimes, msgTxt;
      failedTimes++;
      if (failedTimes > 10) {
        msgTxt = "Remove playlist failed";
        if (window.lang === "fa") {
          msgTxt = "لیست حذف نشد";
        }
        flashMessage.show(msgTxt);
        failCb();
        failedTimes = 0;
        return;
      }
      return remove(id, failCb);
    };
  })(this);
  address = "removeplaylist";
  query = {
    sid: login.sid,
    id: id
  };
  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", transferComplete, false);
  oReq.addEventListener("error", transferFailed, false);
  oReq.addEventListener("abort", transferFailed, false);
  oReq.addEventListener("timeout", transferFailed, false);
  oReq.open("get", SERVER_ADDRESS + address + "?" + serialize(query), true);
  oReq.timeout = window.TIMEOUT;
  return oReq.send();
};

Touch.onTap("menu-box-remove-playlist").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var albumData, callBackConfirmFunction, div, msgTxt, res;
    MenuManagement.closeMenu();
    div = menuRequest.data;
    albumData = playlistManager.getOnePlaylist(menuRequest.data.getAttribute('data-playlist-id'));
    callBackConfirmFunction = function(button) {
      var parent;
      if (button === 1) {
        parent = div.parentNode;
        parent.removeChild(div);
        return remove(albumData.id, function() {
          return parent.appendChild(div);
        });
      }
    };
    msgTxt = "Remove playlist";
    if (window.lang === "fa") {
      msgTxt = "حذف لیست";
    }
    if (navigator.notification != null) {
      return navigator.notification.confirm((msgTxt + " ") + albumData.groupname + "?", callBackConfirmFunction, msgTxt, ["Yes", "No"]);
    } else {
      res = confirm((msgTxt + " ") + albumData.groupname + "?");
      if (res) {
        return callBackConfirmFunction(1);
      }
    }
  };
})(this));



},{"./FlashMessage":4,"./MenuManagement":22,"./MenuRequest":23,"./Tools/serialize":29,"./getPlaylists":37,"./login":43,"./musicDataCache":52,"simple-touch":76}],59:[function(require,module,exports){
var Touch, flashMessage, musicDataCache, remove, settingStorage, timeout, timeoutAlbum;

settingStorage = require('./Tools/SettingStorage');

musicDataCache = require('./musicDataCache');

flashMessage = require('./FlashMessage');

Touch = require('simple-touch');

remove = function(mp3, artist, title, failCb) {
  var error, fileName, fileTransfer, msgTxt, store;
  if (typeof cordova === "undefined" || cordova === null) {
    return;
  }
  fileName = artist + " - " + title + ".mp3";
  try {
    store = window.dirEntry.toURL() + fileName;
    fileTransfer = new FileTransfer();
    fileTransfer.download(encodeURI(mp3), encodeURI(store), (function(_this) {
      return function(entry) {};
    })(this));
    return setTimeout(function() {
      var msgTxt;
      fileTransfer.abort();
      fileTransfer = null;
      msgTxt = title + " removed";
      if (window.lang === "fa") {
        msgTxt = title + " حذف شد";
      }
      return flashMessage.show(msgTxt);
    }, 500);
  } catch (error) {
    failCb();
    msgTxt = "Cannot remove file";
    if (window.lang === "fa") {
      msgTxt = "حذف نشد!";
    }
    return flashMessage.show(msgTxt);
  }
};

timeout = null;

Touch.onTap("item-song-play").onStart((function(_this) {
  return function(event) {
    var div;
    event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
    div = event.listener;
    if (div.getAttribute("downloaded") !== "true") {
      return;
    }
    return timeout = setTimeout(function() {
      var callBackConfirmFunction, msgTxt, musicData, res;
      musicData = musicDataCache.data[div.getAttribute('data-song-id')];
      if (musicData == null) {
        musicData = musicDataCache.more[div.getAttribute('data-song-id')];
      }
      div.style.backgroundColor = '';
      callBackConfirmFunction = function(button) {
        var downl, downloaded, found, i, j, k, l, len, len1, len2, m, parent, ref, syncedPlaylist, syncedPlaylists, track;
        if (button === 1) {
          parent = div.parentNode;
          parent.removeChild(div);
          if (div.getAttribute("data-kind") === "album-song" && parent.children.length === 0) {
            parent.parentNode.parentNode.removeChild(parent.parentNode);
          }
          remove(musicData.mp3, musicData.artist, musicData.songname, function() {
            return parent.appendChild(div);
          });
          settingStorage.remove(musicData.id);
          downloaded = settingStorage.get("downloaded");
          if (downloaded != null) {
            downloaded = JSON.parse(downloaded);
            found = null;
            for (i = k = 0, len = downloaded.length; k < len; i = ++k) {
              downl = downloaded[i];
              if (downl.id === musicData.id) {
                found = i;
                break;
              }
            }
            if (found != null) {
              downloaded.splice(found, 1);
            }
            settingStorage.set("downloaded", JSON.stringify(downloaded));
            syncedPlaylists = settingStorage.get("synced-playlists");
            if ((syncedPlaylists != null) && (syncedPlaylists.length != null)) {
              found = null;
              for (i = l = 0, len1 = syncedPlaylists.length; l < len1; i = ++l) {
                syncedPlaylist = syncedPlaylists[i];
                ref = syncedPlaylist.albumtracks;
                for (j = m = 0, len2 = ref.length; m < len2; j = ++m) {
                  track = ref[j];
                  if (track.id === musicData.id) {
                    found = j;
                    break;
                  }
                }
                if (found != null) {
                  syncedPlaylist.albumtracks.splice(found, 1);
                }
              }
            }
            return settingStorage.set("synced-playlists", syncedPlaylists);
          }
        }
      };
      msgTxt = "Remove";
      if (window.lang === "fa") {
        msgTxt = "حذف";
      }
      if (navigator.notification != null) {
        return navigator.notification.confirm((msgTxt + " ") + musicData.songname + "?", callBackConfirmFunction, msgTxt, ["Yes", "No"]);
      } else {
        res = confirm((msgTxt + " ") + musicData.songname + "?");
        if (res) {
          return callBackConfirmFunction(1);
        }
      }
    }, 700);
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    event.listener.style.backgroundColor = '';
    return clearTimeout(timeout);
  };
})(this));

timeoutAlbum = null;

Touch.onTap("item-album").onStart((function(_this) {
  return function(event) {
    var div;
    event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
    div = event.listener;
    if (div.getAttribute("downloaded") !== "true") {
      return;
    }
    return timeoutAlbum = setTimeout(function() {
      var albumData, callBackConfirmFunction, msgTxt, res;
      albumData = musicDataCache.data["album" + div.getAttribute('data-album-id')];
      if (albumData == null) {
        albumData = musicDataCache.more["album" + div.getAttribute('data-album-id')];
      }
      if (albumData == null) {
        albumData = musicDataCache.data["playlist" + div.getAttribute('data-playlist-id')];
        if (albumData == null) {
          albumData = musicDataCache.more["playlist" + div.getAttribute('data-playlist-id')];
        }
        albumData.album = albumData.groupname;
      }
      div.style.backgroundColor = '';
      callBackConfirmFunction = function(button) {
        var downl, downloaded, found, i, k, l, len, len1, len2, m, musicData, parent, ref, syncedPlaylist, syncedPlaylists;
        if (button === 1) {
          parent = div.parentNode;
          parent.removeChild(div);
          ref = albumData.albumtracks;
          for (k = 0, len = ref.length; k < len; k++) {
            musicData = ref[k];
            remove(musicData.mp3, musicData.artist, musicData.songname, function() {});
            settingStorage.remove(musicData.id);
            downloaded = settingStorage.get("downloaded");
            if (downloaded != null) {
              downloaded = JSON.parse(downloaded);
              found = null;
              for (i = l = 0, len1 = downloaded.length; l < len1; i = ++l) {
                downl = downloaded[i];
                if (downl.id === musicData.id) {
                  found = i;
                  break;
                }
              }
              if (found != null) {
                downloaded.splice(found, 1);
              }
              settingStorage.set("downloaded", JSON.stringify(downloaded));
            }
          }
          if (albumData.groupname != null) {
            syncedPlaylists = settingStorage.get("synced-playlists");
            if ((syncedPlaylists != null) && (syncedPlaylists.length != null)) {
              found = null;
              for (i = m = 0, len2 = syncedPlaylists.length; m < len2; i = ++m) {
                syncedPlaylist = syncedPlaylists[i];
                console.log(syncedPlaylist, albumData);
                if (syncedPlaylist.id === albumData.id) {
                  found = i;
                  break;
                }
              }
              if (found != null) {
                syncedPlaylists.splice(found, 1);
              }
            }
            return settingStorage.set("synced-playlists", syncedPlaylists);
          }
        }
      };
      msgTxt = "Remove";
      if (window.lang === "fa") {
        msgTxt = "حذف";
      }
      if (navigator.notification != null) {
        return navigator.notification.confirm((msgTxt + " ") + albumData.album + "?", callBackConfirmFunction, msgTxt, ["Yes", "No"]);
      } else {
        res = confirm((msgTxt + " ") + albumData.album + "?");
        if (res) {
          return callBackConfirmFunction(1);
        }
      }
    }, 700);
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    event.listener.style.backgroundColor = '';
    return clearTimeout(timeoutAlbum);
  };
})(this));

module.exports = remove;



},{"./FlashMessage":4,"./Tools/SettingStorage":27,"./musicDataCache":52,"simple-touch":76}],60:[function(require,module,exports){
var Touch, flashMessage, repeat, repeatDiv, settingsStorage, shuffle;

settingsStorage = require('./Tools/SettingStorage');

Touch = require('simple-touch');

flashMessage = require('./FlashMessage');

repeat = settingsStorage.get("repeat");

repeatDiv = document.getElementById("repeat");

if (repeat == null) {
  repeat = 0;
}

if (repeat === 1) {
  repeatDiv.classList.add("repeat");
} else if (repeat === 2) {
  repeatDiv.classList.add("repeat-all");
}

Touch.onTap("repeat").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var div, msgTxt;
    div = event.listener;
    repeat++;
    msgTxt = "";
    if (repeat === 1) {
      div.classList.add("repeat");
      msgTxt = "Repeat this song";
      if (window.lang === "fa") {
        msgTxt = "پخش مجدد این موسیقی";
      }
    } else if (repeat === 2) {
      div.classList.remove("repeat");
      div.classList.add("repeat-all");
      msgTxt = "Repeat all songs";
      if (window.lang === "fa") {
        msgTxt = "پخش مجدد همه موسیقی ها";
      }
    } else {
      repeat = 0;
      div.classList.remove("repeat-all");
      msgTxt = "No repeat";
      if (window.lang === "fa") {
        msgTxt = "پخش طبیعی";
      }
    }
    flashMessage.show(msgTxt);
    return settingsStorage.set("repeat", repeat);
  };
})(this));

shuffle = settingsStorage.get("shuffle");

if (shuffle == null) {
  shuffle = 0;
}

if (shuffle === 1) {
  document.getElementById("shuffle").classList.add("shuffle");
}

Touch.onTap("shuffle").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var div, msgTxt;
    div = event.listener;
    shuffle++;
    msgTxt = "";
    if (shuffle === 1) {
      div.classList.add("shuffle");
      msgTxt = "Shuffle playlist";
      if (window.lang === "fa") {
        msgTxt = "پخش در هم";
      }
    } else {
      shuffle = 0;
      div.classList.remove("shuffle");
      msgTxt = "Shuffle disabled";
      if (window.lang === "fa") {
        msgTxt = "پخش پشت سر هم";
      }
    }
    flashMessage.show(msgTxt);
    return settingsStorage.set("shuffle", shuffle);
  };
})(this));



},{"./FlashMessage":4,"./Tools/SettingStorage":27,"simple-touch":76}],61:[function(require,module,exports){
var Touch, cancelBlur, searchHistory, updateList;

Touch = require('simple-touch');

searchHistory = require('./searchHistory');

cancelBlur = false;

updateList = function(element, val) {
  var count, i, id, item, itemsDivText, list, ref;
  list = searchHistory.getFilteredList(val);
  itemsDivText = "";
  count = 0;
  for (id = i = ref = list.length; ref <= 0 ? i <= 0 : i >= 0; id = ref <= 0 ? ++i : --i) {
    item = list[id];
    if (item === null || item === void 0) {
      continue;
    }
    count++;
    itemsDivText = itemsDivText + ("<div class=\"history-item\" id=\"history-item\" data-history-id=\"" + id + "\"><span class=\"history-item-text\">" + item + "</span><span class=\"history-item-icon history-item-search\"></span><span class=\"history-item-icon history-item-remove\" id=\"history-item-remove\"></span></div>");
    if (count > 4) {
      break;
    }
  }
  return element.innerHTML = itemsDivText;
};

Touch.onTap("search-container").onTap((function(_this) {
  return function(event) {
    var element;
    element = document.querySelector(".main-item-search-history");
    return element.style.display = "block";
  };
})(this));

module.exports = function() {
  var element, searchInput;
  searchInput = document.getElementById('search-input');
  element = document.querySelector(".main-item-search-history");
  element.style.display = "";
  if (searchInput != null) {
    updateList(element, searchInput.value);
    searchInput.addEventListener("input", function() {
      if (searchInput.value !== "") {
        updateList(element, searchInput.value);
        return element.style.display = "block";
      } else {
        return element.style.display = "";
      }
    });
    searchInput.addEventListener("blur", function() {
      return setTimeout(function() {
        if (cancelBlur) {
          return cancelBlur = false;
        } else {
          return element.style.display = "";
        }
      }, 200);
    });
    return searchInput.addEventListener("focus", function() {
      return setTimeout(function() {
        return element.style.display = "focus";
      }, 200);
    });
  }
};

Touch.onTap("history-item-remove").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var element, id, text;
    id = event.listener.parentNode.getAttribute("data-history-id");
    text = event.listener.parentNode.querySelector(".history-item-text").innerText;
    searchHistory.remove(id);
    cancelBlur = true;
    element = event.listener.parentNode.parentNode;
    element.removeChild(event.listener.parentNode);
    return updateList(element, "");
  };
})(this));



},{"./searchHistory":62,"simple-touch":76}],62:[function(require,module,exports){
var SearchHistory, settingStorage;

settingStorage = require('./Tools/SettingStorage');

module.exports = new (SearchHistory = (function() {
  function SearchHistory() {
    if (this.getList() == null) {
      this.clean();
    }
  }

  SearchHistory.prototype.add = function(data) {
    var list;
    this.removeByValue(data);
    list = this.getList();
    list.push(data);
    return settingStorage.set("search-history", list);
  };

  SearchHistory.prototype.getList = function() {
    return settingStorage.get("search-history");
  };

  SearchHistory.prototype.remove = function(id) {
    var list;
    list = this.getList();
    if (list[id] != null) {
      delete list[id];
      return settingStorage.set("search-history", list);
    }
  };

  SearchHistory.prototype.removeByValue = function(val) {
    var id, list;
    list = this.getList();
    id = list.indexOf(val);
    if (id > -1) {
      return this.remove(id);
    }
  };

  SearchHistory.prototype.clean = function() {
    return settingStorage.set("search-history", []);
  };

  SearchHistory.prototype.getFilteredList = function(filter) {
    return this.getList();
  };

  return SearchHistory;

})());



},{"./Tools/SettingStorage":27}],63:[function(require,module,exports){
module.exports = function(node, value) {
  if (value == null) {
    value = "";
  }
  node.style.transform = value;
  node.style.webkitTransform = value;
};



},{}],64:[function(require,module,exports){
module.exports = function(node, prop, duration) {
  if (prop == null) {
    node.style.transition = "";
    node.style.webkitTransition = "";
    return;
  }
  node.style.transition = prop + (" " + duration + "s");
  if (prop === "transform") {
    prop = "-webkit-" + prop;
  }
  return node.style.webkitTransition = prop + (" " + duration + "s");
};



},{}],65:[function(require,module,exports){
var MenuManagement, Touch, loadTrackDetail, menuRequest, musicDataCache, shareArtist;

loadTrackDetail = require('./loadTrackDetail');

musicDataCache = require('./musicDataCache');

menuRequest = require('./MenuRequest');

MenuManagement = require('./MenuManagement');

Touch = require('simple-touch');

Touch.onTap("menu-box-music-share").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var musicData, shareTxt;
    MenuManagement.closeMenu();
    musicData = musicDataCache.data[menuRequest.data.getAttribute('data-song-id')];
    if (musicData == null) {
      musicData = musicDataCache.more[menuRequest.data.getAttribute('data-song-id')];
    }
    shareTxt = "Download ahange " + musicData.songname + " az " + musicData.artist + "            ";
    if (window.lang === "fa") {
      shareTxt = "دانلود آهنگ " + musicData.songname + " از " + musicData.artist + "            ";
    }
    return window.plugins.socialsharing.share(shareTxt, "Wikiseda", null, musicData.url || "http://www.wikiseda.com");
  };
})(this));

Touch.onTap("menu-box-album-share").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var albumData, shareTxt;
    MenuManagement.closeMenu();
    albumData = musicDataCache.data["album" + menuRequest.data.getAttribute('data-album-id')];
    if (albumData == null) {
      albumData = musicDataCache.more["album" + menuRequest.data.getAttribute('data-album-id')];
    }
    shareTxt = "Download album " + albumData.album + " az " + albumData.artist + "            ";
    if (window.lang === "fa") {
      shareTxt = "دانلود آلبوم " + albumData.album + " از " + albumData.artist + "            ";
    }
    return window.plugins.socialsharing.share(shareTxt, "Wikiseda", null, albumData.url || "http://www.wikiseda.com");
  };
})(this));

Touch.onTap("menu-box-artist-share").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var artistData;
    MenuManagement.closeMenu();
    artistData = musicDataCache.data["artist" + menuRequest.data.getAttribute('data-artist-id')];
    return shareArtist(artistData);
  };
})(this));

Touch.onTap("artist-share").onStart((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = 'rgba(0,0,0,.1)';
  };
})(this)).onEnd((function(_this) {
  return function(event) {
    return event.listener.style.backgroundColor = '';
  };
})(this)).onTap((function(_this) {
  return function(event) {
    var artistData;
    console.log(musicDataCache.data, event.listener.parentNode.getAttribute('data-artist-id'));
    artistData = musicDataCache.data["artist" + event.listener.parentNode.getAttribute('data-artist-id')];
    return shareArtist(artistData);
  };
})(this));

shareArtist = function(artistData) {
  var shareTxt;
  shareTxt = "Download " + artistData.artist + " musics and albums                      ";
  if (window.lang === "fa") {
    shareTxt = "دانلود آهنگ ها و آلبوم های " + artistData.artist + "            ";
  }
  return window.plugins.socialsharing.share(shareTxt, "Wikiseda", null, artistData.url || "http://www.wikiseda.com");
};



},{"./MenuManagement":22,"./MenuRequest":23,"./loadTrackDetail":42,"./musicDataCache":52,"simple-touch":76}],66:[function(require,module,exports){
var flashMessage, login, network;

network = require('./network');

login = require('./login');

flashMessage = require('./FlashMessage');

module.exports = function(needLogin) {
  var appPage, loginRegisterPage, main, msgTxt;
  if (needLogin === true) {
    if ((login.query.username != null) && network.status === true) {
      login.login();
      msgTxt = "Logging in '" + login.query.username + "'";
      if (window.lang === "fa") {
        msgTxt = "در حال وارد شدن با '" + login.query.username + "'";
      }
      flashMessage.show(msgTxt);
    }
  }
  loginRegisterPage = document.querySelector('.login-register');
  loginRegisterPage.style.display = "none";
  appPage = document.querySelector('.app-page');
  appPage.style.display = "block";
  main = require('./main');
  if (typeof device !== "undefined" && device !== null) {
    if (typeof appAvailability !== "undefined" && appAvailability !== null) {
      if (device.platform === 'iOS') {
        return document.body.classList.add("ios");
      }
    }
  }
};



},{"./FlashMessage":4,"./login":43,"./main":45,"./network":53}],67:[function(require,module,exports){
var Subtitle, Touch, request,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

request = require('superagent');

Touch = require('simple-touch');

Subtitle = (function() {
  function Subtitle() {
    this.tick = bind(this.tick, this);
    this._interval = null;
    this.node = document.getElementById("subtitle");
    this.icon = document.getElementById("toggle-subtitle");
  }

  Subtitle.prototype.updateContent = function(id) {
    var loadingId;
    if (id === this.id) {
      return;
    }
    loadingId = this.id = id;
    if (this._interval != null) {
      clearInterval(this._interval);
    }
    this.node.innerHTML = "...";
    this.srtObj = false;
    this.weAbort = false;
    if (this.lastRequest != null) {
      this.weAbort = true;
      this.lastRequest.xhr.abort();
    }
    this.lastRequest = request.get(SERVER_ADDRESS + "getlyric").query({
      id: this.id
    }).on('error', (function(_this) {
      return function(e) {
        if (_this.weAbort === true) {
          return;
        }
        return _this.node.innerHTML = "";
      };
    })(this)).end((function(_this) {
      return function(res) {
        var i, resObj;
        if (loadingId !== _this.id) {
          return;
        }
        if (res.ok) {
          _this.node.innerHTML = "♪";
          resObj = JSON.parse(res.text);
          _this.srtObj = JSON.parse(resObj.lyricsrt);
          if (_this.srtObj === false) {
            _this.node.innerHTML = "";
            return;
          }
          i = 0;
          return _this._interval = setInterval(function() {
            var j, len, ref, ref1, results, srt;
            if (_this.srtObj === false || _this.time === void 0) {
              return;
            }
            ref = _this.srtObj;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              srt = ref[j];
              if ((parseInt(srt.start) <= (ref1 = _this.time) && ref1 < parseInt(srt.end))) {
                results.push(_this.node.innerHTML = srt.value);
              } else {
                results.push(void 0);
              }
            }
            return results;
          }, 1000);
        } else {
          if (_this.weAbort === true) {
            return;
          }
          return _this.node.innerHTML = "";
        }
      };
    })(this));
  };

  Subtitle.prototype.tick = function(time) {
    this.time = time;
  };

  return Subtitle;

})();

module.exports = new Subtitle;



},{"simple-touch":76,"superagent":77}],68:[function(require,module,exports){
var app, deviceReady, flashMessage, indexForms, launched, login, onOffline, startApp, startPoint;

require('./modules/language');

login = require('./modules/login');

indexForms = require('./modules/indexForms');

flashMessage = require('./modules/FlashMessage').setNode(document.querySelector('.flash-message'));

startPoint = require('./modules/startPoint');

indexForms.onLoginSubmit(function(data) {
  var msgTxt;
  login.login(data.username, data.password);
  msgTxt = "Logging you in";
  if (window.lang === "fa") {
    msgTxt = "در حال ورود";
  }
  return flashMessage.show(msgTxt);
});

indexForms.onRegisterSubmit(function(data) {
  var msgTxt;
  login.register(data.username, data.password, data.email);
  msgTxt = "Registering";
  if (window.lang === "fa") {
    msgTxt = "در حال ثبت نام";
  }
  return flashMessage.show(msgTxt);
});

login.onSuccess(function() {
  return startPoint();
});

login.onFail(function(msg) {
  indexForms.release();
  if (msg != null) {
    return flashMessage.show(msg);
  }
});

login.onAbort(function(msg) {
  var msgTxt;
  indexForms.release();
  if (msg != null) {
    flashMessage.show(msg);
  }
  msgTxt = "We tried, but connection is poor";
  if (window.lang === "fa") {
    msgTxt = "ما تلاش کردیم؛ اما اتصال شما ضعیف است";
  }
  return flashMessage.show(msgTxt);
});

startApp = function() {
  if (login.query.username != null) {
    startPoint(true);
  }
};

onOffline = function() {
  var msgTxt;
  if (login.query.username != null) {
    return startPoint();
  } else {
    msgTxt = "You are offline";
    if (window.lang === "fa") {
      msgTxt = "شما آفلاین هستید";
    }
    return flashMessage.show(msgTxt);
  }
};

launched = false;

deviceReady = (function(_this) {
  return function() {
    launched = true;
    window.SERVER_ADDRESS = "http://www.getsongg.com/dapp/";
    if (window.isApp) {
      document.addEventListener("offline", onOffline, false);
      if (navigator.connection.type.toUpperCase() === "NONE" && navigator.connection.type.toUpperCase() === "UNKNOWN") {
        onOffline();
      } else {
        startApp();
      }
    } else {
      startApp();
    }
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
})(this), 50000);



},{"./modules/FlashMessage":4,"./modules/indexForms":39,"./modules/language":41,"./modules/login":43,"./modules/startPoint":66}],69:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],70:[function(require,module,exports){
module.exports = require('./lib/cache');
},{"./lib/cache":71}],71:[function(require,module,exports){
(function (process){
var timeout = require('infinite-timeout');
var events = require('backbone-events-standalone');

/**
 * Find out if an object has a certain property
 *
 * @param {object} object
 * @param {string} key
 */
function has(object, key){
    return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Cache class
 */
function Cache(){
    this.initialize.apply(this, arguments);
}
var _ = Cache.prototype;
events.mixin(_);

/**
 * Constructor
 *
 * @param {object} external Forward set, get, clear and del commands to an external handler (optional)
 */
_.initialize = function(external){
    this.store = {};
    this.external = external;
};

/**
 * Insert or overwrite data
 *
 * @param {string} key
 * @param {mixed} value
 * @param {number} ttl   Time to live in milliseconds (optional)
 */
_.set = function(key, value, ttl){
    if(typeof key === 'undefined') throw new Error('Required argument key is undefined');

    // Clear timeout on existing record
    var oldRecord = has(this.store, key)? this.store[key] : undefined;
    if(oldRecord && oldRecord.timeout){
        timeout.clear(oldRecord.timeout);
    }

    // Set value + timeout on new record
    var record = {value: value};
    if(typeof ttl === 'number'){
        record.timeout = timeout.set(this.delInternal.bind(this, key), ttl);
    }
    this.store[key] = record;

    // Call external handler
    if(this.external && typeof this.external.set === 'function'){
        this.external.set(key, value, ttl);
    }

    // Emit update/set events
    var action = oldRecord? 'update' : 'set';
    this.trigger(action, key, value, ttl);
    this.trigger(action + ':' + key, value, ttl);
};

/**
 * Get cached data
 *
 * @param {string} key
 * @param {function} callback  Return value in callback if records exists locally or on external resource (optional)
 * @return {mixed} value Only returned if callback is undefined
 */
_.get = function(key, callback){
    if(typeof key === 'undefined') throw new Error('Required argument key is undefined');
    if(has(this.store, key)){
        if(typeof callback === 'function'){
            process.nextTick(callback.bind(null, this.store[key].value));
        }else{
            return this.store[key].value;
        }
    }else if(typeof callback === 'function' && this.external && typeof this.external.get === 'function'){
        this.external.get(key, callback);
    }
};

/**
 * Delete cached data
 *
 * @param {string} key
 * @return {boolean} Returns true if record existed
 */
_.del = function(key){
    if(typeof key === 'undefined') throw new Error('Required argument key is undefined');
    if(this.external && typeof this.external.del === 'function'){
        this.external.del(key);
    }
    return this.delInternal(key);
};

_.delInternal = function(key){
    if(has(this.store, key)){

        // Clear timeout
        if(this.store[key].timeout){
            timeout.clear(this.store[key].timeout);
        }

        // Delete record
        delete this.store[key];

        // Emit del events
        this.trigger('del', key);
        this.trigger('del:' + key);
        return true;
    }else{
        return false;
    }
};

/**
 * Clear cached data
 *
 * @return {number} Returns number of cleared records
 */
_.clear = function(){
    var size = this.size();
    this.store = {};
    if(this.external && typeof this.external.clear === 'function'){
        this.external.clear();
    }
    this.trigger('clear', size);
    return size;
};

/**
 * Retrieve number of records
 *
 * @return {number}
 */
_.size = function(){
    var size = 0;
    for(var key in this.store){
        if(has(this.store, key)) size++;
    }
    return size;
};

/**
 * Retrieve internal store
 *
 * @return {object}
 */
_.debug = function(){
    return this.store;
};


/**
 * Export a combined instance and constructor
 */
var instance = new Cache();
var constructor = function(){
    return new Cache(arguments[0]);
};
constructor.Cache = Cache;
for(var key in _){
    if(has(_, key) && typeof _[key] === 'function'){
        constructor[key] = _[key].bind(instance);
    }
}
module.exports = constructor;

}).call(this,require("VCmEsw"))
},{"VCmEsw":69,"backbone-events-standalone":73,"infinite-timeout":74}],72:[function(require,module,exports){
/**
 * Standalone extraction of Backbone.Events, no external dependency required.
 * Degrades nicely when Backone/underscore are already available in the current
 * global context.
 *
 * Note that docs suggest to use underscore's `_.extend()` method to add Events
 * support to some given object. A `mixin()` method has been added to the Events
 * prototype to avoid using underscore for that sole purpose:
 *
 *     var myEventEmitter = BackboneEvents.mixin({});
 *
 * Or for a function constructor:
 *
 *     function MyConstructor(){}
 *     MyConstructor.prototype.foo = function(){}
 *     BackboneEvents.mixin(MyConstructor.prototype);
 *
 * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
 * (c) 2013 Nicolas Perriault
 */
/* global exports:true, define, module */
(function() {
  var root = this,
      nativeForEach = Array.prototype.forEach,
      hasOwnProperty = Object.prototype.hasOwnProperty,
      slice = Array.prototype.slice,
      idCounter = 0;

  // Returns a partial implementation matching the minimal API subset required
  // by Backbone.Events
  function miniscore() {
    return {
      keys: Object.keys || function (obj) {
        if (typeof obj !== "object" && typeof obj !== "function" || obj === null) {
          throw new TypeError("keys() called on a non-object");
        }
        var key, keys = [];
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            keys[keys.length] = key;
          }
        }
        return keys;
      },

      uniqueId: function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
      },

      has: function(obj, key) {
        return hasOwnProperty.call(obj, key);
      },

      each: function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
          obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
          for (var i = 0, l = obj.length; i < l; i++) {
            iterator.call(context, obj[i], i, obj);
          }
        } else {
          for (var key in obj) {
            if (this.has(obj, key)) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        }
      },

      once: function(func) {
        var ran = false, memo;
        return function() {
          if (ran) return memo;
          ran = true;
          memo = func.apply(this, arguments);
          func = null;
          return memo;
        };
      }
    };
  }

  var _ = miniscore(), Events;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return this;
      var deleteListener = !name && !callback;
      if (typeof name === 'object') callback = this;
      if (obj) (listeners = {})[obj._listenerId] = obj;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
        if (deleteListener) delete this._listeners[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      if (typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Mixin utility
  Events.mixin = function(proto) {
    var exports = ['on', 'once', 'off', 'trigger', 'stopListening', 'listenTo',
                   'listenToOnce', 'bind', 'unbind'];
    _.each(exports, function(name) {
      proto[name] = this[name];
    }, this);
    return proto;
  };

  // Export Events as BackboneEvents depending on current context
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Events;
    }
    exports.BackboneEvents = Events;
  }else if (typeof define === "function") {
    define(function() {
      return Events;
    });
  } else {
    root.BackboneEvents = Events;
  }
})(this);

},{}],73:[function(require,module,exports){
module.exports = require('./backbone-events-standalone');

},{"./backbone-events-standalone":72}],74:[function(require,module,exports){
module.exports = require('./lib/timeout');
},{"./lib/timeout":75}],75:[function(require,module,exports){
(function(exports){
    var MAX_INT = 2147483647;
    var timeouts = {};
    var index = 1;

    // Set new timeout
    var set = function(callback, timeout){
        var id = index++;
        if(timeout > MAX_INT){
            timeouts[id] = setTimeout(set.bind(undefined, callback, timeout - MAX_INT), MAX_INT);
        }else{
            if(timeout < 0) timeout = 0;
            timeouts[id] = setTimeout(function(){
                delete timeouts[id];
                callback();
            }, timeout);
        }
        return id;
    };

    // Clear existing timeout
    var clear = function(id){
        if(timeouts.hasOwnProperty(id)){
            clearTimeout(timeouts[id]);
            delete timeouts[id];
        }
    };

    // Expose public interface
    exports.set = set;
    exports.clear = clear;
    exports._timeouts = timeouts;

})(typeof module === 'undefined' && typeof exports === 'undefined'? this.timeout = {} : exports);
},{}],76:[function(require,module,exports){
var PanListener, SimpleTouch, TapListener;

SimpleTouch = (function() {
  function SimpleTouch(node) {
    this.node = node;
    this._tapListeners = [];
    this._panListeners = [];
    this._panGeneralProspect = false;
    if (window.navigator.msPointerEnabled) {
      this.touchDown = false;
      this.node.addEventListener("MSHoldVisual", function(e) {
        return e.preventDefault();
      }, false);
      this.node.addEventListener("contextmenu", function(e) {
        return e.preventDefault();
      }, false);
      this.node.addEventListener('MSPointerDown', (function(_this) {
        return function(event) {
          _this.touchDown = true;
          return _this._handleTouchStart(event);
        };
      })(this));
      this.node.addEventListener('MSPointerMove', (function(_this) {
        return function(event) {
          if (_this.touchDown === false) {
            return;
          }
          return _this._handleTouchMove(event);
        };
      })(this));
      this.node.addEventListener('MSPointerUp', (function(_this) {
        return function(event) {
          _this.touchDown = false;
          return _this._handleTouchEnd(event);
        };
      })(this));
    }
    this.node.addEventListener('touchstart', (function(_this) {
      return function(event) {
        return _this._handleTouchStart(event);
      };
    })(this));
    this.node.addEventListener('touchmove', (function(_this) {
      return function(event) {
        return _this._handleTouchMove(event);
      };
    })(this));
    this.node.addEventListener('touchend', (function(_this) {
      return function(event) {
        return _this._handleTouchEnd(event);
      };
    })(this));
    if (window.ontouchstart === void 0) {
      this.touchSimulateDown = false;
      this.node.addEventListener('mousedown', (function(_this) {
        return function(event) {
          _this.touchSimulateDown = true;
          return _this._handleTouchStart(event);
        };
      })(this));
      this.node.addEventListener('mousemove', (function(_this) {
        return function(event) {
          if (_this.touchSimulateDown === false) {
            return;
          }
          return _this._handleTouchMove(event);
        };
      })(this));
      this.node.addEventListener('mouseup', (function(_this) {
        return function(event) {
          _this.touchSimulateDown = false;
          return _this._handleTouchEnd(event);
        };
      })(this));
    }
  }

  SimpleTouch.prototype._handleTouchStart = function(event) {
    var i, j, len, len1, listener, panListener, prospect, tapListener;
    prospect = this._checkProspect(event.target, this._tapListeners);
    if (prospect !== false) {
      tapListener = this._tapListeners[prospect.id];
      event.listener = prospect;
      for (i = 0, len = tapListener.length; i < len; i++) {
        listener = tapListener[i];
        listener.callStart(event);
      }
    }
    prospect = this._checkProspect(event.target, this._panListeners);
    if (prospect !== false) {
      panListener = this._panListeners[prospect.id];
      event.listener = prospect;
      this._panGeneralProspect = prospect;
      for (j = 0, len1 = panListener.length; j < len1; j++) {
        listener = panListener[j];
        listener.callStart(event);
      }
    }
  };

  SimpleTouch.prototype._handleTouchMove = function(event) {
    var i, j, k, len, len1, len2, listener, panListener, prospect, tapListener;
    prospect = this._checkProspect(event.target, this._tapListeners);
    if (prospect !== false) {
      tapListener = this._tapListeners[prospect.id];
      event.listener = prospect;
      for (i = 0, len = tapListener.length; i < len; i++) {
        listener = tapListener[i];
        listener.callCancel(event);
      }
    }
    prospect = this._checkProspect(event.target, this._panListeners);
    if (prospect !== false) {
      panListener = this._panListeners[prospect.id];
      event.listener = prospect;
      for (j = 0, len1 = panListener.length; j < len1; j++) {
        listener = panListener[j];
        listener.callPan(event);
      }
    }
    if (this._panGeneralProspect !== false) {
      panListener = this._panListeners[this._panGeneralProspect.id];
      event.listener = this._panGeneralProspect;
      for (k = 0, len2 = panListener.length; k < len2; k++) {
        listener = panListener[k];
        listener.callGeneralPan(event);
      }
    }
  };

  SimpleTouch.prototype._handleTouchEnd = function(event) {
    var i, j, k, len, len1, len2, listener, panListener, prospect, tapListener;
    prospect = this._checkProspect(event.target, this._tapListeners);
    if (prospect !== false) {
      tapListener = this._tapListeners[prospect.id];
      event.listener = prospect;
      for (i = 0, len = tapListener.length; i < len; i++) {
        listener = tapListener[i];
        listener.callDone(event);
      }
    }
    prospect = this._checkProspect(event.target, this._panListeners);
    if (prospect !== false) {
      panListener = this._panListeners[prospect.id];
      event.listener = prospect;
      for (j = 0, len1 = panListener.length; j < len1; j++) {
        listener = panListener[j];
        listener.callEnd(event);
      }
    }
    if (this._panGeneralProspect !== false) {
      panListener = this._panListeners[this._panGeneralProspect.id];
      event.listener = this._panGeneralProspect;
      for (k = 0, len2 = panListener.length; k < len2; k++) {
        listener = panListener[k];
        listener.callGeneralEnd(event);
      }
      this._panGeneralProspect = false;
    }
  };

  SimpleTouch.prototype._checkProspect = function(prospect, listeners) {
    while (prospect) {
      if (listeners[prospect.id] != null) {
        return prospect;
      }
      prospect = prospect.parentNode;
    }
    return false;
  };

  SimpleTouch.prototype.onTap = function(id) {
    var l;
    l = new TapListener();
    if (this._tapListeners[id] != null) {
      this._tapListeners[id].push(l);
      return l;
    }
    this._tapListeners[id] = [l];
    return l;
  };

  SimpleTouch.prototype.onPan = function(id) {
    var l;
    l = new PanListener();
    if (this._panListeners[id] != null) {
      this._panListeners[id].push(l);
      return l;
    }
    this._panListeners[id] = [l];
    return l;
  };

  return SimpleTouch;

})();

TapListener = (function() {
  function TapListener(milisec) {
    this.milisec = milisec != null ? milisec : 300;
    this._tapStart = false;
    this.touchPosX = this.touchTotalPosX = this.touchStartPosX = 0;
    this.touchPosY = this.touchTotalPosY = this.touchStartPosY = 0;
  }

  TapListener.prototype.onStart = function(cbStart) {
    this.cbStart = cbStart;
    return this;
  };

  TapListener.prototype.onCancel = function(cbCancel) {
    this.cbCancel = cbCancel;
    return this;
  };

  TapListener.prototype.onEnd = function(cbEnd) {
    this.cbEnd = cbEnd;
    return this;
  };

  TapListener.prototype.onDone = function(cbDone) {
    this.cbDone = cbDone;
    return this;
  };

  TapListener.prototype.onTap = function(cbTap) {
    this.cbTap = cbTap;
    return this;
  };

  TapListener.prototype.callStart = function(event) {
    event.startX = this.touchStartPosX = (event.clientX != null ? event.clientX : event.touches[0].clientX);
    event.startY = this.touchStartPosY = (event.clientY != null ? event.clientY : event.touches[0].clientY);
    if (this.cbStart != null) {
      this.cbStart(event);
    }
    this._tapStart = Date.now();
  };

  TapListener.prototype.callCancel = function(event) {
    event.movementX = (event.clientX != null ? event.clientX : event.touches[0].clientX) - this.touchPosX;
    event.movementY = (event.clientY != null ? event.clientY : event.touches[0].clientY) - this.touchPosY;
    event.startX = this.touchStartPosX;
    event.startY = this.touchStartPosY;
    this.touchPosX = (event.clientX != null ? event.clientX : event.touches[0].clientX);
    this.touchPosY = (event.clientY != null ? event.clientY : event.touches[0].clientY);
    this.touchTotalPosX += this.touchPosX;
    this.touchTotalPosY += this.touchPosY;
    event.totalX = this.touchTotalPosX = this.touchStartPosX - this.touchPosX;
    event.totalY = this.touchTotalPosY = this.touchStartPosY - this.touchPosY;
    event.time = Date.now() - this._tapStart;
    if (Math.abs(event.totalX) > 10 || Math.abs(event.totalY) > 10) {
      if (this.cbCancel != null) {
        this.cbCancel(event);
      }
      this.callEnd(event);
      this._tapStart = false;
    }
  };

  TapListener.prototype.callEnd = function(event) {
    event.startX = this.touchStartPosX;
    event.startY = this.touchStartPosY;
    event.totalX = this.touchTotalPosX;
    event.totalY = this.touchTotalPosY;
    if (this.cbEnd != null) {
      this.cbEnd(event);
    }
    this.touchPosX = this.touchTotalPosX = this.touchStartPosX = 0;
    this.touchPosY = this.touchTotalPosY = this.touchStartPosY = 0;
  };

  TapListener.prototype.callDone = function(event) {
    event.time = Date.now() - this._tapStart;
    this.callEnd(event);
    if (this._tapStart !== false) {
      if (this.cbDone != null) {
        this.cbDone(event);
      }
      if (event.time < this.milisec) {
        this.callTap(event);
        this._tapStart = false;
      }
    }
  };

  TapListener.prototype.callTap = function(event) {
    if (this.cbTap != null) {
      this.cbTap(event);
    }
  };

  return TapListener;

})();

PanListener = (function() {
  function PanListener() {
    this.touchPosX = this.touchTotalPosX = this.touchStartPosX = 0;
    this.touchPosY = this.touchTotalPosY = this.touchStartPosY = 0;
  }

  PanListener.prototype.onStart = function(cbStart) {
    this.cbStart = cbStart;
    return this;
  };

  PanListener.prototype.onEnd = function(cbEnd) {
    this.cbEnd = cbEnd;
    return this;
  };

  PanListener.prototype.onPan = function(cbPan) {
    this.cbPan = cbPan;
    return this;
  };

  PanListener.prototype.onGeneralEnd = function(cbGeneralEnd) {
    this.cbGeneralEnd = cbGeneralEnd;
    return this;
  };

  PanListener.prototype.onGeneralPan = function(cbGeneralPan) {
    this.cbGeneralPan = cbGeneralPan;
    return this;
  };

  PanListener.prototype.callStart = function(event) {
    event.startX = this.touchStartPosX = (event.clientX != null ? event.clientX : event.touches[0].clientX);
    event.startY = this.touchStartPosY = (event.clientY != null ? event.clientY : event.touches[0].clientY);
    if (this.cbStart != null) {
      this.cbStart(event);
    }
  };

  PanListener.prototype.callEnd = function(event) {
    event.startX = this.touchStartPosX;
    event.startY = this.touchStartPosY;
    event.totalX = this.touchTotalPosX;
    event.totalY = this.touchTotalPosY;
    if (this.cbEnd != null) {
      this.cbEnd(event);
    }
    this.touchPosX = this.touchTotalPosX = this.touchStartPosX = 0;
    this.touchPosY = this.touchTotalPosY = this.touchStartPosY = 0;
  };

  PanListener.prototype.callGeneralEnd = function(event) {
    event.startX = this.touchStartPosX;
    event.startY = this.touchStartPosY;
    event.totalX = this.touchTotalPosX;
    event.totalY = this.touchTotalPosY;
    if (this.cbGeneralEnd != null) {
      this.cbGeneralEnd(event);
    }
    this.touchPosX = this.touchTotalPosX = this.touchStartPosX = 0;
    this.touchPosY = this.touchTotalPosY = this.touchStartPosY = 0;
  };

  PanListener.prototype.callPan = function(event) {
    event.movementX = (event.clientX != null ? event.clientX : event.touches[0].clientX) - this.touchPosX;
    event.movementY = (event.clientY != null ? event.clientY : event.touches[0].clientY) - this.touchPosY;
    event.startX = this.touchStartPosX;
    event.startY = this.touchStartPosY;
    this.touchPosX = (event.clientX != null ? event.clientX : event.touches[0].clientX);
    this.touchPosY = (event.clientY != null ? event.clientY : event.touches[0].clientY);
    this.touchTotalPosX += this.touchPosX;
    this.touchTotalPosY += this.touchPosY;
    event.totalX = this.touchTotalPosX = this.touchStartPosX - this.touchPosX;
    event.totalY = this.touchTotalPosY = this.touchStartPosY - this.touchPosY;
    if (this.cbPan != null) {
      this.cbPan(event);
    }
  };

  PanListener.prototype.callGeneralPan = function(event) {
    event.movementX = (event.clientX != null ? event.clientX : event.touches[0].clientX) - this.touchPosX;
    event.movementY = (event.clientY != null ? event.clientY : event.touches[0].clientY) - this.touchPosY;
    event.startX = this.touchStartPosX;
    event.startY = this.touchStartPosY;
    this.touchPosX = (event.clientX != null ? event.clientX : event.touches[0].clientX);
    this.touchPosY = (event.clientY != null ? event.clientY : event.touches[0].clientY);
    this.touchTotalPosX += this.touchPosX;
    this.touchTotalPosY += this.touchPosY;
    event.totalX = this.touchTotalPosX = this.touchStartPosX - this.touchPosX;
    event.totalY = this.touchTotalPosY = this.touchStartPosY - this.touchPosY;
    if (this.cbGeneralPan != null) {
      this.cbGeneralPan(event);
    }
  };

  return PanListener;

})();

module.exports = new SimpleTouch(document.body);

},{}],77:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? this
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

function getXHR() {
  if (root.XMLHttpRequest
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  this.text = this.xhr.responseText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse && str && str.length
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status || 1223 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    try {
      var res = new Response(self);
      if ('HEAD' == method) res.text = null;
      self.callback(null, res);
    } catch(e) {
      var err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      self.callback(err);
    }
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  if (2 == fn.length) return fn(err, res);
  if (err) return this.emit('error', err);
  fn(res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;
    if (0 == xhr.status) {
      if (self.aborted) return self.timeoutError();
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  if (xhr.upload) {
    xhr.upload.onprogress = function(e){
      e.percent = e.loaded / e.total * 100;
      self.emit('progress', e);
    };
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":78,"reduce":79}],78:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],79:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}]},{},[68])
