/* 
  IDMetricsCaptureFramework Version - 4.3.0.1 
*/
var _workerCode =''
/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-canvas-devicemotion_deviceorientation-geolocation-getusermedia-webworkers-setclasses !*/
! function(e, n, t) {
  function a(e, n) {
    return typeof e === n
  }

  function o() {
    var e, n, t, o, s, i, l;
    for (var f in c)
      if (c.hasOwnProperty(f)) {
        if (e = [], n = c[f], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
          for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
        for (o = a(n.fn, "function") ? n.fn() : n.fn, s = 0; s < e.length; s++) i = e[s], l = i.split("."), 1 === l.length ? Modernizr[l[0]] = o : (!Modernizr[l[0]] || Modernizr[l[0]] instanceof Boolean || (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])), Modernizr[l[0]][l[1]] = o), r.push((o ? "" : "no-") + l.join("-"))
      }
  }

  function s(e) {
    var n = f.className,
      t = Modernizr._config.classPrefix || "";
    if (d && (n = n.baseVal), Modernizr._config.enableJSClass) {
      var a = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
      n = n.replace(a, "$1" + t + "js$2")
    }
    Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), d ? f.className.baseVal = n : f.className = n)
  }

  function i() {
    return "function" != typeof n.createElement ? n.createElement(arguments[0]) : d ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments)
  }
  var r = [],
    c = [],
    l = {
      _version: "3.6.0",
      _config: {
        classPrefix: "",
        enableClasses: !0,
        enableJSClass: !0,
        usePrefixes: !0
      },
      _q: [],
      on: function(e, n) {
        var t = this;
        setTimeout(function() {
          n(t[e])
        }, 0)
      },
      addTest: function(e, n, t) {
        c.push({
          name: e,
          fn: n,
          options: t
        })
      },
      addAsyncTest: function(e) {
        c.push({
          name: null,
          fn: e
        })
      }
    },
    Modernizr = function() {};
  Modernizr.prototype = l, Modernizr = new Modernizr, Modernizr.addTest("geolocation", "geolocation" in navigator), Modernizr.addTest("devicemotion", "DeviceMotionEvent" in e), Modernizr.addTest("deviceorientation", "DeviceOrientationEvent" in e), Modernizr.addTest("getUserMedia", "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices);
  var f = n.documentElement,
    d = "svg" === f.nodeName.toLowerCase();
  Modernizr.addTest("canvas", function() {
    var e = i("canvas");
    return !(!e.getContext || !e.getContext("2d"))
  }), Modernizr.addTest("webworkers", "Worker" in e), o(), s(r), delete l.addTest, delete l.addAsyncTest;
  for (var u = 0; u < Modernizr._q.length; u++) Modernizr._q[u]();
  e.Modernizr = Modernizr
}(window, document);

/*!
 * UAParser.js v0.7.20
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2019 Faisal Salman <f@faisalman.com>
 * Licensed under MIT License
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.20',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var mergedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    mergedRegexes[i] = regexes[i];
                }
            }
            return mergedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]*)/i,                                             // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            ], [NAME, VERSION], [

            /(konqueror)\/([\w\.]+)/i                                           // Konqueror
            ], [[NAME, 'Konqueror'], VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i                          // Microsoft Edge
            ], [[NAME, 'Edge'], VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
            ], [[NAME, 'Puffin'], VERSION], [

            /(focus)\/([\w\.]+)/i                                               // Firefox Focus
            ], [[NAME, 'Firefox Focus'], VERSION], [

            /(opt)\/([\w\.]+)/i                                                 // Opera Touch
            ], [[NAME, 'Opera Touch'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i         // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(windowswechat qbcore)\/([\w\.]+)/i                                // WeChat Desktop for Windows Built-in Browser
            ], [[NAME, 'WeChat(Win) Desktop'], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /(brave)\/([\w\.]+)/i                                              // Brave browser
            ], [[NAME, 'Brave'], VERSION], [

            /(qqbrowserlite)\/([\w\.]+)/i                                       // QQBrowserLite
            ], [NAME, VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
            ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
            ], [NAME, VERSION], [

            /(BIDUBrowser)[\/\s]?([\w\.]+)/i                                    // Baidu Browser
            ], [NAME, VERSION], [

            /(2345Explorer)[\/\s]?([\w\.]+)/i                                   // 2345 Browser
            ], [NAME, VERSION], [

            /(MetaSr)[\/\s]?([\w\.]+)/i                                         // SouGouBrowser
            ], [NAME], [

            /(LBBROWSER)/i                                      // LieBao Browser
            ], [NAME], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android
            ], [VERSION, [NAME, 'Facebook']], [

            /safari\s(line)\/([\w\.]+)/i,                                       // Line App for iOS
            /android.+(line)\/([\w\.]+)\/iab/i                                  // Line App for Android
            ], [NAME, VERSION], [

            /headlesschrome(?:\/([\w\.]+)|\s)/i                                 // Chrome Headless
            ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
            ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(sailfishbrowser)\/([\w\.]+)/i                                     // Sailfish Browser
            ], [[NAME, 'Sailfish Browser'], VERSION], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
            ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i  // Google Search Appliance on iOS
            ], [[NAME, 'GSA'], VERSION], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,

                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]*)/i,                                         // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]
        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i                        // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/.+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i                         // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [
            /android.+aft([bms])\sbuild/i                                       // Fire TV
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, SMARTTV]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i,                        // HTC
            /(zte)-(\w*)/i,                                                     // ZTE
            /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i
                                                                                // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,
            /(nexus\s6p)/i                                                      // Huawei
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w*)/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w*)/i                                                        // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]*)/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i                   // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
            ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w*)/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i             // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [
            /(lenovo)[_\s-]?([\w-]+)/i
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)[\s)]/i                                       // Google Pixel C
            ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel( [23])?( xl)?)[\s)]/i                              // Google Pixel
            ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+;\s(\w+)\s+build\/hm\1/i,                                 // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,               // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,
                                                                                // Xiaomi Mi
            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i       // Redmi Phones
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i            // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
            /(mz)-([\w-]{2,})/i
            ], [[VENDOR, 'Meizu'], MODEL, [TYPE, MOBILE]], [

            /android.+a000(1)\s+build/i,                                        // OnePlus
            /android.+oneplus\s(a\d{4})\s+build/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i                      // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i     // Barnes & Noble Tablet
            ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+;\s(k88)\sbuild/i                                         // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i        // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i                            // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i                    // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i                     // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+;\s(PH-1)\s/i
            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [                // Essential PH-1

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i          // Le Pan Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i                         // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            /android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i                      // Gigaset Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /[\s\/\(](smart-?tv)[;\)]/i                                         // SmartTV
            ], [[TYPE, SMARTTV]], [

            /(android[\w\.\s\-]{0,9});.+build/i                                 // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /webkit\/537\.36.+chrome\/(?!27)/i                                  // Blink
            ], [[NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
                                                                                // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9}).+(gecko)/i                                       // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,                   // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]*)/i,                                     // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki/Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i                  // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w*)/i,                                            // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]*)/i,                                        // Hurd/Linux
            /(gnu)\s?([\w\.]*)/i                                                // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.\d]*)/i                                            // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i                    // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                   // Haiku
            ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i             // iOS
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]*)/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,                             // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,                                // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS/Fuchsia
            /(unix)\s?([\w\.]*)/i                                               // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////
    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

        this.getBrowser = function () {
            var browser = { name: undefined, version: undefined };
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            var cpu = { architecture: undefined };
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            var device = { vendor: undefined, model: undefined, type: undefined };
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            var engine = { name: undefined, version: undefined };
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            var os = { name: undefined, version: undefined };
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };

    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        // if (typeof(define) === 'function' && define.amd) {
        //     define(function () {
        //         return UAParser;
        //     });
        // } else if (window) {
            // browser env
            window.UAParser = UAParser;
        // }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if (typeof $ !== UNDEF_TYPE && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);

"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DocumentSettings =
/*#__PURE__*/
function () {
    function DocumentSettings() {
        this.captureMode = "Manual";
        this.nativeFrontFocusThreshold = 0;
        this.nativeBackFocusThreshold = 0;
        this.nativeFrontGlareThreshold = 0;
        this.nativeBackGlareThreshold = 0;
        this.frontFocusThreshold = 0;
        this.backFocusThreshold = 0;
        this.frontGlareThreshold = 0;
        this.backGlareThreshold = 0;
        this.frontCaptureAttempts = 4;
        this.backCaptureAttempts = 4;
        this.enableFaceDetection = true;
        this.compressionQuality = 50;
        this.overlayText = "Align ID and Tap Screen<br/> to capture.";
        this.overlayColor = "yellow";
        this.compressionQuality = 50;
        this.compressionType = "JPEG";
        this.isBarcodeDetectedEnabled = true;
        _classCallCheck(this, DocumentSettings);
    }

    _createClass(DocumentSettings, [{
        key: "documentType",

        /*Get and Set the type of the document i.e. License or Passport*/
        get: function get() {
            return this._documentType;
        },
        set: function set(val) {
            this._documentType = val;
        }
        /*Get and Set the side of the document i.e. Front or Back*/

    }, {
        key: "documentSide",
        get: function get() {
            return this._documentSide;
        },
        set: function set(val) {
            this._documentSide = val;
        }
        /*Displays the mode from which the document is captured. It can be either Auto or Manual*/

    }, {
        key: "isBarcodeDetectedEnabled",
        get: function get() {
            return this._isBarcodeDetectedEnabled;
        },
        set: function set(val) {
            this._isBarcodeDetectedEnabled = val;
        }
        /*Displays the mode from which the document is captured. It can be either Auto or Manual*/

    }, {
        key: "captureMode",
        get: function get() {
            return this._captureMode;
        },
        set: function set(val) {
            this._captureMode = val;
        }
        /*Get and Set the front focus threshold of the document*/

    }, {
        key: "frontFocusThreshold",
        get: function get() {
            return this._frontFocusThreshold;
        },
        set: function set(val) {
            this._frontFocusThreshold = val;
        }
        /*Get and Set the back focus threshold of the document*/

    }, {
        key: "backFocusThreshold",
        get: function get() {
            return this._backFocusThreshold;
        },
        set: function set(val) {
            this._backFocusThreshold = val;
        }
        /*Get and Set the glare of the document*/

    }, {
        key: "frontGlareThreshold",
        get: function get() {
            return this._frontGlareThreshold;
        },
        set: function set(val) {
            this._frontGlareThreshold = val;
        }
    }, {
        key: "backGlareThreshold",
        get: function get() {
            return this._backGlareThreshold;
        },
        set: function set(val) {
            this._backGlareThreshold = val;
        }
        /*Displays the final cropped images. As the default supported format is JPEG therefore final images will be compressed in the JPEG format only.*/

    }, {
        key: "compressionType",
        get: function get() {
            return this._compressionType;
        },
        set: function set(val) {
            this._compressionType = val;
        }
        /*Get and Set the compression quality of the captured image*/

    }, {
        key: "compressionQuality",
        get: function get() {
            return this._compressionQuality;
        },
        set: function set(val) {
            this._compressionQuality = val;
        }
        /*Get and Set the front capture attempts of the document*/

    }, {
        key: "PassportFrontCaptureAttempts",
        get: function get() {
            return this._PassportFrontCaptureAttempts;
        },
        set: function set(val) {
            this._PassportFrontCaptureAttempts = val;
        }
        /*Get and Set the front capture attempts of the document*/

    }, {
        key: "frontCaptureAttempts",
        get: function get() {
            return this._frontCaptureAttempts;
        },
        set: function set(val) {
            this._frontCaptureAttempts = val;
        }
        /*Get and Set the back capture attempts of the document*/

    }, {
        key: "backCaptureAttempts",
        get: function get() {
            return this._backCaptureAttempts;
        },
        set: function set(val) {
            this._backCaptureAttempts = val;
        }
    }, {
        key: "overlayText",
        set: function set(f) {
            this._overlayText = f;
        },
        get: function get() {
            return this._overlayText;
        }
    }, {
        key: "overlayColor",
        set: function set(f) {
            this._overlayColor = f;
        },
        get: function get() {
            return this._overlayColor;
        }
    }, {
        key: "enableFaceDetection",
        set: function set(f) {
            this._enableFaceDetection = f;
        },
        get: function get() {
            return this._enableFaceDetection;
        }
    },{
        key: "nativeFrontFocusThreshold",
        set: function set(f) {
            this._nativeFrontFocusThreshold = f;
        },
        get: function get() {
            return this._nativeFrontFocusThreshold;
        }
    }, {
        key: "nativeBackFocusThreshold",
        set: function set(f) {
            this._nativeBackFocusThreshold = f;
        },
        get: function get() {
            return this._nativeBackFocusThreshold;
        }
    }, {
        key: "nativeFrontGlareThreshold",
        set: function set(f) {
            this._nativeFrontGlareThreshold = f;
        },
        get: function get() {
            return this._nativeFrontGlareThreshold;
        }
    }, {
        key: "nativeBackGlareThreshold",
        set: function set(f) {
            this._nativeBackGlareThreshold = f;
        },
        get: function get() {
            return this._nativeBackGlareThreshold;
        }
    }]);

    return DocumentSettings;
}();

"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CaptureResult =
/*#__PURE__*/
function () {
    function CaptureResult() {
      this.isFaceDetected = "No";
      this.isBarcodeDetected = "No";
        _classCallCheck(this, CaptureResult);
    }

    _createClass(CaptureResult, [{
        key: "setOnAborted",
        value: function setOnAborted(f) {
            this._onAborted = f;
        }
    }, {
        key: "abort",
        value: function abort(e) {
            this._isAborted = false;

            this._onAborted(e);
        }
    }, {
        key: "setOnCaptureModeChange",
        value: function setOnCaptureModeChange(f) {
          this._onCaptureModeChange = f;
        }
    },{
        key: "fireOnCaptureModeChange",
        value: function fireOnCaptureModeChange(e, config) {
          if (this._onCaptureModeChange != null) {
            this._onCaptureModeChange(e, config);
          }

          return config;
        }
    }, {
        key: "setOnEvent",
        value: function setOnEvent(f) {
            this._onEvent = f;
        }
    }, {
        key: "fireUiEvent",
        value: function fireUiEvent(errorCode, errorDesc, data) {
            this._onEvent(errorCode, errorDesc, data);
        }
    }, {
        key: "setOnFinish",
        value: function setOnFinish(f) {
            this._onFinish = f;
        }
    }, {
        key: "callOnFinish",
        value: function callOnFinish() {
            this._isSuccess = true;
            if (window.captureFrameworkDebug != null) console.log("Image Size : "+this._result.length)
            this._onFinish();
        }
    }, {
        key: "continue",
        value: function _continue() {
          if (this._continueFunction != null) {
            this._continueFunction();
          }
        }
    }, {
        key: "isCompleted",
        get: function get() {
            if (typeof this._completed == "undefined") return false;
            return this._completed;
        },
        set: function set(val) {
            this._completed = val;
        }
    }, {
        key: "result",
        get: function get() {
            return this._result;
        },
        set: function set(f) {
            this._result = f;
        }
    }, {
        key: "frontImage",
        get: function get() {
            return this._frontImage;
        },
        set: function set(f) {
            this._frontImage = f;
        }
    }, {
        key: "backImage",
        get: function get() {
            return this._backImage;
        },
        set: function set(f) {
            this._backImage = f;
        }
    }, {
        key: "frontFocus",
        get: function get() {
            return this._frontFocus;
        },
        set: function set(f) {
            this._frontFocus = f;
        }
    }, {
        key: "backFocus",
        get: function get() {
            return this._backFocus;
        },
        set: function set(f) {
            this._backFocus = f;
        }
    }, {
        key: "frontGlare",
        get: function get() {
            return this._frontGlare;
        },
        set: function set(f) {
            this._frontGlare = f;
        }
    }, {
        key: "backGlare",
        get: function get() {
            return this._backGlare;
        },
        set: function set(f) {
            this._backGlare = f;
        }
    }, {
        key: "isFaceDetected",
        get: function get() {
            return this._isFaceDetected;
        },
        set: function set(f) {
            this._isFaceDetected = f;
        }
    },{
        key: "isBarcodeDetected",
        get: function get() {
            return this._isBarcodeDetected;
        },
        set: function set(f) {
            this._isBarcodeDetected = f;
        }
    },{
        key: "isError",
        get: function get() {
            return this._isError;
        },
        set: function set(f) {
            this._isError = f;
        }
    }, {
        key: "isAborted",
        get: function get() {
            return this._isAborted;
        },
        set: function set(f) {
            this._isAborted = f;
        }
    }, {
        key: "onAborted",
        set: function set(f) {
            return this._onAborted = f;
        },
        get: function get() {
            return this._onAborted;
        }
    }, {
        key: "isSuccess",
        get: function get() {
            return this._isSuccess;
        },
        set: function set(f) {
            this._isSuccess = f;
        }
    }, {
        key: "continueFunction",
        set: function set(c) {
            this._continueFunction = c;
        },
        get: function get() {
            return this._continueFunction;
        }
    }]);

    return CaptureResult;
}();

"use strict";

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var SelfieSettings =
  /*#__PURE__*/
  function() {
    function SelfieSettings() {
      this.captureMode = "Manual";
      this.compressionQuality = 50;
      this.useBackCamera = false;
      this.enableFarSelfie = false;
      this.overlayText = "Align face and capture";
      this.overlayColor = "#808080";
      this.orientationErrorText = "Landscape orientation is not supported. Kindly rotate your device to Portrait orientation.";
      this.enableFaceDetection = true;
      this.captureAttempts = 4;
      _classCallCheck(this, SelfieSettings);
    }

    _createClass(SelfieSettings, [{
      key: "captureMode",

      /*Displays the mode from which the document is captured. It can be either Auto or Manual*/
      get: function get() {
        return this._captureMode;
      },
      set: function set(val) {
        this._captureMode = val;
      }
      /*Get and Set the compression quality of the captured selfie image*/

    }, {
      key: "compressionQuality",
      get: function get() {
        return this._compressionQuality;
      },
      set: function set(val) {
        this._compressionQuality = val;
      }
      /*Get and Set the value to decide either use back camera for selfie or not*/

    }, {
      key: "useBackCamera",
      get: function get() {
        return this._useBackCamera;
      },
      set: function set(val) {
        this._useBackCamera = val;
      }
      /*Get and Set the boolean value to enable/disable the far selfie*/

    }, {
      key: "enableFarSelfie",
      get: function get() {
        return this._enableFarSelfie;
      },
      set: function set(val) {
        this._enableFarSelfie = val;
      }
    }, {
      key: "overlayText",
      set: function set(f) {
        this._overlayText = f;
      },
      get: function get() {
        return this._overlayText;
      }
    }, {
      key: "overlayColor",
      set: function set(f) {
        this._overlayColor = f;
      },
      get: function get() {
        return this._overlayColor;
      }
    }, {
      key: "orientationErrorText",
      set: function set(f) {
        this._orientationErrorText = f;
      },
      get: function get() {
        return this._orientationErrorText;
      }
    }, {
      key: "enableFaceDetection",
      set: function set(f) {
        this._enableFaceDetection = f;
      },
      get: function get() {
        return this._enableFaceDetection;
      }
    }, {
      key: "captureAttempts",
      set: function set(f) {
        this._captureAttempts = f;
      },
      get: function get() {
        return this._captureAttempts;
      }
    }]);

    return SelfieSettings;
  }();

(function(exports) {
  exports.platform = '';
  exports.deviceVersion = '';
  exports.browserName = '';
  exports.isNativeCamera = false;
  exports.deviceId = {
    user: "",
    environment: ""
  };

  String.prototype.myStartsWith = function(str) {
    if (this.indexOf(str) === 0) {
      return true;
    } else {
      return false;
    }
  };

  $(document).ready(function() {
    if (navigator.userAgent.indexOf('Linux') != -1) {
      exports.platform = "Android";

      if (navigator.userAgent.indexOf('SamsungBrowser') != -1) {
        exports.browserName = "SamsungBrowser";
      }
    } else if (navigator.userAgent.indexOf('Android') != -1) {
      exports.platform = "Android";
    } else if (navigator.userAgent.indexOf('iPhone') != -1) {
      exports.platform = "iPhone";
    } else if (navigator.userAgent.indexOf('iPad') != -1) {
      exports.platform = "iPad";
    } else if (navigator.userAgent.indexOf('Windows') != -1) {
      exports.platform = "Windows";
    } else if (navigator.userAgent.indexOf('Macintosh') != -1) {
      exports.platform = "Macintosh";
    }


    if (exports.platform == "Android") {
      var splitUserAgent = navigator.userAgent.split('Android ');
      if (splitUserAgent.length > 1) {
        exports.deviceVersion = splitUserAgent[1].split(';')[0];
      }
    } else if (exports.platform == "Windows") {
      var splitUserAgent = navigator.userAgent.split('Windows NT ');
      if (splitUserAgent.length > 1) {
        var versionSubStr = splitUserAgent[1];

        if (versionSubStr.myStartsWith('5.0')) {
          exports.deviceVersion = '2000';
        } else if (versionSubStr.myStartsWith('5.1')) {
          exports.deviceVersion = 'XP';
        } else if (versionSubStr.myStartsWith('5.2')) {
          exports.deviceVersion = 'Server';
        } else if (versionSubStr.myStartsWith('6.0')) {
          exports.deviceVersion = 'Vista';
        } else if (versionSubStr.myStartsWith('6.1')) {
          exports.deviceVersion = '7';
        } else if (versionSubStr.myStartsWith('6.2')) {
          exports.deviceVersion = '8';
        } else if (versionSubStr.myStartsWith('6.3')) {
          exports.deviceVersion = '8.1';
        } else if (versionSubStr.myStartsWith('10.0')) {
          exports.deviceVersion = '10';
        }
      }
    } else if (exports.platform == "iPhone" || exports.platform == "iPad") {
      var splitUserAgent = navigator.userAgent.split('OS ');
      if (splitUserAgent.length > 1) {
        var unformattedVersion = splitUserAgent[1].split(' ')[0];
        exports.deviceVersion = unformattedVersion.split('_').join('.');
      }
    } else if (exports.platform == "Macintosh") {
      var splitUserAgent = navigator.userAgent.split('Mac OS X ');
      if (splitUserAgent.length > 1) {
        var endOfVersion = splitUserAgent[1].indexOf(';');
        var firstParantheses = splitUserAgent[1].indexOf(')');
        if (firstParantheses > -1 && (firstParantheses < endOfVersion || endOfVersion == -1)) {
          endOfVersion = firstParantheses;
        }

        var unformattedVersion = splitUserAgent[1].substring(0, endOfVersion);
        exports.deviceVersion = unformattedVersion.split('_').join('.');
      }
    }
  });

  function isLoggable() {
    return (window.captureFrameworkDebug != null);
  }

  function log(msg) {
    if (isLoggable()) {
      if (window.LE) {
        window.LE.log(msg);
      }

      console.log(msg);
    }
  }

  /*Returns the platform of the device based.*/
  exports.getDevicePlatform = function() {
    return exports.platform;
  }

  /*Returns the version of the device based on the platform.*/
  exports.getDeviceVersion = function() {
    return exports.deviceVersion;
  }

  exports.checkPlatform = function() {
    return new Promise(function(resolve, reject) {
      try {
        var result = UAParser(navigator.userAgent);

        if (window.Modernizr.getusermedia) {
          navigator.mediaDevices.enumerateDevices().then(function(devices) {
            if (devices.some(device => 'videoinput' === device.kind)) {
              exports.selectDeviceId(devices, "user").then(function(deviceId) {
                log("user " + deviceId);

                exports.deviceId.user = deviceId;
                exports.selectDeviceId(devices, "environment").then(function(deviceId) {
                  log("environment " + deviceId);

                  exports.deviceId.environment = deviceId;
                  exports.isNativeCamera = false
                  resolve(true);
                }, function() {
                  exports.isNativeCamera = true;
                  resolve(true);
                });
              }, function() {
                exports.isNativeCamera = true;
                resolve(true);
              });
            } else if (result.device.type === "mobile" || result.device.type === "tablet") {
              exports.isNativeCamera = true;
              resolve(true);
            } else {
              resolve(false);
            }
          }, function(err) {
            if (result.device.type === "mobile" || result.device.type === "tablet") {
              exports.isNativeCamera = true
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          if (result.device.type === "mobile" || result.device.type === "tablet") {
            exports.isNativeCamera = true
            resolve(true);
          } else {
            resolve(false);
          }
        }
      } catch (e) {
        if (result.device.type === "mobile" || result.device.type === "tablet") {
          exports.isNativeCamera = true
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  }

  exports.selectDeviceId = function(devices, facingMode) {
    return new Promise(function(resolve, reject) {
      try {
        var videoFilteredDevices = devices.filter(function(device) {
          return device.kind === "videoinput";
        });

        if (videoFilteredDevices.length > 2) {
          var videoDevices = videoFilteredDevices.filter(function(device) {
            if (device.getCapabilities != null) {
              var deviceCapabilities = device.getCapabilities();
              if (deviceCapabilities.facingMode != null) {
                if (deviceCapabilities.facingMode.includes(facingMode)) {
                    return true;
                }
              } else {
                return true;
              }
            } else {
              if (device.deviceId != "") {
                return true;
              }
            }

            return false;
          });

          if (videoDevices.length > 1) {
            log(JSON.stringify(videoDevices));

            exports.pickACamera(videoDevices,0, facingMode, resolve, reject);
          } else {
            resolve("");
          }
        } else {
          resolve("");
        }
      } catch (e) {
        log(e);
      }
    });
  }

  exports.pickACamera = function(videoDevices, index, facingMode, resolve, reject) {
    var _videoDevices = videoDevices;
    var _resolve = resolve;
    var _reject = reject;
    var _index = index;
    var _facingMode = facingMode;
    if (index === videoDevices.length)
      _reject("");
    var device = _videoDevices[index];

    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: device.deviceId
      }
    }).then(function(stream) {
      setTimeout(function() {
        try {
          if (stream.getVideoTracks != null && stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].getCapabilities != null && stream.getVideoTracks()[0].getCapabilities().focusMode != null && stream.getVideoTracks()[0].getCapabilities() != null) {
            let caps = stream.getVideoTracks()[0].getCapabilities();
            log(JSON.stringify(caps));

            if (caps.focusMode.includes("continuous") && caps.facingMode.includes(_facingMode)) {
              stream.getVideoTracks()[0].stop();
              _resolve(device.deviceId);
            } else {
              stream.getVideoTracks()[0].stop();
              exports.pickACamera(_videoDevices, _index + 1, _facingMode, _resolve, _reject);
            }
          } else {
            _resolve("");
          }
        } catch (e) {
          log(e);
        }
      }, 500);
    }, function(error) {
      log(error);

      _resolve("");
    });
  }

  exports.isShowNativeCamera = function() {
    return   exports.isNativeCamera;
    // return true;
  }
})(typeof exports === 'undefined' ? this['DeviceInfo'] = {} : exports);

var imageWorker;
//DeviceInfo.checkPlatform().then(function(res){if(res) {
! function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('IDMetricsCaptureFramework', function(UAParser) {
      return (root.IDMetricsCaptureFramework = factory(UAParser));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.IDMetricsCaptureFramework = factory();
  }
}(this, function(UAParser) {
  if (window.jQuery) {
    DeviceInfo.checkPlatform().then(function(res) {
      if (res) {
        if (typeof _workerCode != "undefined" && _workerCode != null) {
          var blob = new Blob([
            _workerCode
          ], {
            type: "text/javascript"
          })

          // Note: window.webkitURL.createObjectURL() in Chrome 10+.
          imageWorker = new Worker(window.URL.createObjectURL(blob));
        } else {
          imageWorker = new Worker("../dist/js/ImageProcessor-min.js");
        }

        $(document).ready(function() {
          if (imageWorker == null) {
            if (window.onCaptureFrameworkLoadFailed != null && typeof window.onCaptureFrameworkLoadFailed == 'function') {
              window.onCaptureFrameworkLoadFailed.call()
            }
          } else {
            if (window.loadIDMDeviceThresholds) {
              window.loadIDMDeviceThresholds.call().then(function(deviceThresholds) {
                if (deviceThresholds == null) {
                  window.deviceThreshold = {
                    DLFrontFocus: 30,
                    DLFrontGlare: 2.5,
                    DLBackFocus: 30,
                    DLBackGlare: 2.5,
                    PassportFrontFocus: 40,
                    PassportFrontGlare: 1.5
                  }
                } else {
                  let uaInfo = window.UAParser(navigator.userAgent);
                  var dt = null;

                  try {
                    if (deviceThresholds != null || deviceThresholds.length > 0) {
                      if (uaInfo.os.name === "iOS") {
                        dt = deviceThresholds[uaInfo.device.model];
                      } else if (uaInfo.os.name === "Android") {
                        var match = /android\s.+;\s.+AppleWebKit/gmi.exec(navigator.userAgent);
                        var model = match[0].replace(/Android.+;\s/gmi, "").replace(/\) AppleWebKit/gmi, "");
                        dt = deviceThresholds[model];
                      } else if (uaInfo.os.name === "Windows") {
                        dt = deviceThresholds["Microsoft Edge"];
                      }
                    }
                  } catch (error) {
                    log("Unable to load deviceThresholds " + error);
                  }

                  if (dt == null) {
                    window.deviceThreshold = {
                      DLFrontFocus: 30,
                      DLFrontGlare: 2.5,
                      DLBackFocus: 30,
                      DLBackGlare: 15,
                      PassportFrontFocus: 40,
                      PassportFrontGlare: 15
                    };
                  } else {
                    window.deviceThreshold = {
                      DLFrontFocus: dt.DLFrontFocus != null ? dt.DLFrontFocus : 30,
                      DLFrontGlare: dt.DLFrontGlare != null ? dt.DLFrontGlare : 2.5,
                      DLBackFocus: dt.DLBackFocus != null ? dt.DLBackFocus : 30,
                      DLBackGlare: dt.DLBackGlare != null ? dt.DLBackGlare : 15,
                      PassportFrontFocus: dt.PassportFrontFocus != null ? dt.PassportFrontFocus : 40,
                      PassportFrontGlare: dt.PassportFrontGlare != null ? dt.PassportFrontGlare : 15,
                    };
                  }
                }

                if (window.onCaptureFrameworkLoaded != null && typeof window.onCaptureFrameworkLoaded == 'function') {
                  window.onCaptureFrameworkLoaded.call();
                }
              }, function(error) {
                window.deviceThreshold = {
                  DLFrontFocus: 30,
                  DLFrontGlare: 2.5,
                  DLBackFocus: 30,
                  DLBackGlare: 15,
                  PassportFrontFocus: 40,
                  PassportFrontGlare: 15
                }

                if (window.onCaptureFrameworkLoaded != null && typeof window.onCaptureFrameworkLoaded == 'function') {
                  window.onCaptureFrameworkLoaded.call();
                }
              })
            } else {
              if (window.onCaptureFrameworkLoaded != null && typeof window.onCaptureFrameworkLoaded == 'function') {
                window.onCaptureFrameworkLoaded.call();
              }
            }

            imageWorker.onmessage = window.WebSDKUI.imageProcessorOnSuccess;
            imageWorker.onerror = window.WebSDKUI.imageProcessorOnError;
          }
        });

        function isLoggable() {
          return (window.captureFrameworkDebug != null);
        }

        function log(msg) {
          if (isLoggable()) {
            if (window.LE) {
              window.LE.log(msg);
            }

            console.log(msg);
          }
        }

        this.GetSDKVersion = function(callback) {
          callback(window.WebSDKUI.getSDKVersion());
        };

        this.scanDocument = function(documentSettings, callback, error) {
          var settings;
          var captureResult;

          if (documentSettings.constructor.name === "DocumentSettings") {
            settings = documentSettings;
          } else {
            settings = new DocumentSettings();
            settings.captureMode = documentSettings.captureMode != null ? documentSettings.captureMode : settings.captureMode;
            settings.nativeFrontFocusThreshold = documentSettings.nativeFrontFocusThreshold != null ? documentSettings.nativeFrontFocusThreshold : settings.nativeFrontFocusThreshold;
            settings.nativeBackFocusThreshold = documentSettings.nativeBackFocusThreshold != null ? documentSettings.nativeBackFocusThreshold : settings.nativeBackFocusThreshold;
            settings.nativeFrontGlareThreshold = documentSettings.nativeFrontGlareThreshold != null ? documentSettings.nativeFrontGlareThreshold : settings.nativeFrontGlareThreshold;
            settings.nativeBackGlareThreshold = documentSettings.nativeBackGlareThreshold != null ? documentSettings.nativeBackGlareThreshold : settings.nativeBackGlareThreshold;
            settings.frontFocusThreshold = documentSettings.frontFocusThreshold != null ? documentSettings.frontFocusThreshold : settings.frontFocusThreshold;
            settings.backFocusThreshold = documentSettings.backFocusThreshold != null ? documentSettings.backFocusThreshold : settings.backFocusThreshold;
            settings.frontGlareThreshold = documentSettings.frontGlareThreshold != null ? documentSettings.frontGlareThreshold : settings.frontGlareThreshold;
            settings.backGlareThreshold = documentSettings.backGlareThreshold != null ? documentSettings.backGlareThreshold : settings.backGlareThreshold;
            settings.frontCaptureAttempts = documentSettings.frontCaptureAttempts != null ? documentSettings.frontCaptureAttempts : settings.frontCaptureAttempts;
            settings.backCaptureAttempts = documentSettings.backCaptureAttempts != null ? documentSettings.backCaptureAttempts : settings.backCaptureAttempts;
            settings.enableFaceDetection = documentSettings.enableFaceDetection != null ? documentSettings.enableFaceDetection : settings.enableFaceDetection;
            settings.compressionQuality = documentSettings.compressionQuality != null ? documentSettings.compressionQuality : settings.compressionQuality;
            settings.overlayText = documentSettings.overlayText != null ? documentSettings.overlayText : settings.overlayText;
            settings.overlayColor = documentSettings.overlayColor != null ? documentSettings.overlayColor : settings.overlayColor;
            settings.compressionQuality = documentSettings.compressionQuality != null ? documentSettings.compressionQuality : settings.compressionQuality;
            settings.compressionType = documentSettings.compressionType != null ? documentSettings.compressionType : settings.compressionType;
            settings.isBarcodeDetectedEnabled = documentSettings.isBarcodeDetectedEnabled != null ? documentSettings.isBarcodeDetectedEnabled : settings.isBarcodeDetectedEnabled;
          }

          if (callback.constructor.name === "CaptureResult") {
            captureResult = callback;
          } else {
            captureResult = new CaptureResult();
            captureResult.setOnAborted(function(e) {
              if (error != null) {
                error.call(error, e.errorType, e.error);
              }
            });

            captureResult.setOnEvent(function(errorCode, errorDesc, data) {
              if (callback != null) {
                callback.call(callback, errorCode, errorDesc, {
                  desc: errorDesc,
                  result: captureResult.result,
                  frontfocus: captureResult.frontfocus,
                  backfocus: captureResult.backfocus,
                  frontGlare: captureResult.frontGlare,
                  backGlare: captureResult.backGlare,
                  isFaceDetected: captureResult.isFaceDetected
                });
              }
            });
            captureResult.setOnFinish(function() {
              if (callback != null) {
                callback.call(callback, 0, "Done", {
                  desc: 'done',
                  result: captureResult.result,
                  frontfocus: captureResult.frontfocus,
                  backfocus: captureResult.backfocus,
                  frontGlare: captureResult.frontGlare,
                  backGlare: captureResult.backGlare,
                  isFaceDetected: captureResult.isFaceDetected
                });
              }
            });
            captureResult.setOnCaptureModeChange(function(captureMode, config) {
              if (callback != null) {
                callback.call(callback, -1, "Capture Mode Change", {
                  desc: "captureModeChange",
                  captureMode: captureMode,
                  configuration: config
                });
              }
            })
          }

          window.WebSDKUI.setupDocumentCamera(settings, captureResult);
        };

        this.scanSelfie = function(selfieSettings, callback, error) {
          var settings;
          var captureResult;

          if (selfieSettings.constructor.name === "SelfieSettings") {
            settings = selfieSettings;
          } else {
            settings = new SelfieSettings();
            settings.captureMode = selfieSettings.captureMode != null ? selfieSettings.captureMode : settings.captureMode;
            settings.compressionQuality = selfieSettings.compressionQuality != null ? selfieSettings.compressionQuality : settings.compressionQuality;
            settings.useBackCamera = selfieSettings.useBackCamera != null ? selfieSettings.useBackCamera : settings.useBackCamera;
            settings.enableFarSelfie = selfieSettings.enableFarSelfie != null ? selfieSettings.enableFarSelfie : settings.enableFarSelfie;
            settings.overlayText = selfieSettings.overlayText != null ? selfieSettings.overlayText : settings.overlayText;
            settings.overlayColor = selfieSettings.overlayColor != null ? selfieSettings.overlayColor : settings.overlayColor;
            settings.orientationErrorText = selfieSettings.orientationErrorText != null ? selfieSettings.orientationErrorText : settings.orientationErrorText;
            settings.enableFaceDetection = selfieSettings.enableFaceDetection != null ? selfieSettings.enableFaceDetection : settings.enableFaceDetection;
            settings.captureAttempts = selfieSettings.captureAttempts != null ? selfieSettings.captureAttempts : settings.captureAttempts;
          }

          if (callback.constructor.name === "CaptureResult") {
            captureResult = callback;
          } else {
            captureResult = new CaptureResult();

            captureResult.setOnAborted(function(e) {
              if (error != null) {
                error.call(error, e.errorType, e.error);
              }
            });
            captureResult.setOnEvent(function(errorCode, errorDesc, data) {
              if (callback != null) {
                callback.call(callback, errorCode, {
                  desc: errorDesc,
                  result: captureResult.result,
                });
              }
            });

            captureResult.setOnFinish(function() {
              if (callback != null) {
                callback.call(callback, 0, {
                  desc: 'done',
                  result: captureResult.result,
                });
              }
            });

            captureResult.setOnCaptureModeChange(function(captureMode, config) {
              if (callback != null) {
                callback.call(callback, -1, {
                  desc: "captureModeChange",
                  captureMode: captureMode,
                  configuration: config
                });
              }
            });
          }

          window.WebSDKUI.setupSelfieCapture(settings, captureResult);
        };

        this.isOverlaySupported = function() {
          return !DeviceInfo.isShowNativeCamera();
        };

        this.continue = function() {
          return window.WebSDKUI.continueFunction();;
        };

      } else {
        $(document).ready(function() {
          if (window.onCaptureFrameworkLoadFailed != null && typeof window.onCaptureFrameworkLoadFailed == 'function') {
            window.onCaptureFrameworkLoadFailed.call()
          }
        });
      }
    });
  } else {
    if (window.onCaptureFrameworkLoadFailed != null && typeof window.onCaptureFrameworkLoadFailed == 'function') {
      window.onCaptureFrameworkLoadFailed.call()
    }
  }

  return this;
});

/* piexifjs

The MIT License (MIT)

Copyright (c) 2014, 2015 hMatoba(https://github.com/hMatoba)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    "use strict";
    var that = {};
    that.version = "1.0.4";

    that.remove = function (jpeg) {
        var b64 = false;
        if (jpeg.slice(0, 2) == "\xff\xd8") {
        } else if (jpeg.slice(0, 23) == "data:image/jpeg;base64," || jpeg.slice(0, 22) == "data:image/jpg;base64,") {
            jpeg = atob(jpeg.split(",")[1]);
            b64 = true;
        } else {
            throw new Error("Given data is not jpeg.");
        }

        var segments = splitIntoSegments(jpeg);
        var newSegments = segments.filter(function(seg){
          return  !(seg.slice(0, 2) == "\xff\xe1" &&
                   seg.slice(4, 10) == "Exif\x00\x00");
        });

        var new_data = newSegments.join("");
        if (b64) {
            new_data = "data:image/jpeg;base64," + btoa(new_data);
        }

        return new_data;
    };

    that.insert = function (exif, xmp, jpeg) {
        var b64 = false;
        if (exif.slice(0, 6) != "\x45\x78\x69\x66\x00\x00") {
            throw new Error("Given data is not exif.");
        }
        if (jpeg.slice(0, 2) == "\xff\xd8") {
        } else if (jpeg.slice(0, 23) == "data:image/jpeg;base64," || jpeg.slice(0, 22) == "data:image/jpg;base64,") {
            jpeg = atob(jpeg.split(",")[1]);
            b64 = true;
        } else {
            throw new Error("Given data is not jpeg.");
        }

        var exifStr = "\xff\xe1" + pack(">H", [exif.length + 2]) + exif;
        var segments = splitIntoSegments(jpeg);
        var new_data = mergeSegments(segments, exifStr, xmp);
        if (b64) {
            new_data = "data:image/jpeg;base64," + btoa(new_data);
        }

        return new_data;
    };

    that.load = function (data) {
        var input_data;
        if (typeof (data) == "string") {
            if (data.slice(0, 2) == "\xff\xd8") {
                input_data = data;
            } else if (data.slice(0, 23) == "data:image/jpeg;base64," || data.slice(0, 22) == "data:image/jpg;base64,") {
                input_data = atob(data.split(",")[1]);
            } else if (data.slice(0, 4) == "Exif") {
                input_data = data.slice(6);
            } else {
                throw new Error("'load' gots invalid file data.");
            }
        } else {
            throw new Error("'load' gots invalid type argument.");
        }

        var exifReader = new ExifReader(input_data);

        var exifDict = {};
        var exif_dict = {
            "0th": {},
            "Exif": {},
            "GPS": {},
            "Interop": {},
            "1st": {},
            "thumbnail": null
        };

        if (exifReader.tiftag === null) {
            return exif_dict;
        }

        if (exifReader.tiftag.slice(0, 2) == "\x49\x49") {
            exifReader.endian_mark = "<";
        } else {
            exifReader.endian_mark = ">";
        }

        var pointer = unpack(exifReader.endian_mark + "L",
            exifReader.tiftag.slice(4, 8))[0];
        exif_dict["0th"] = exifReader.get_ifd(pointer, "0th");

        var first_ifd_pointer = exif_dict["0th"]["first_ifd_pointer"];
        delete exif_dict["0th"]["first_ifd_pointer"];

        if (34665 in exif_dict["0th"]) {
            pointer = exif_dict["0th"][34665];
            exif_dict["Exif"] = exifReader.get_ifd(pointer, "Exif");
        }
        if (34853 in exif_dict["0th"]) {
            pointer = exif_dict["0th"][34853];
            exif_dict["GPS"] = exifReader.get_ifd(pointer, "GPS");
        }
        if (40965 in exif_dict["Exif"]) {
            pointer = exif_dict["Exif"][40965];
            exif_dict["Interop"] = exifReader.get_ifd(pointer, "Interop");
        }
        if (first_ifd_pointer != "\x00\x00\x00\x00") {
            pointer = unpack(exifReader.endian_mark + "L",
                first_ifd_pointer)[0];
            exif_dict["1st"] = exifReader.get_ifd(pointer, "1st");
            if ((513 in exif_dict["1st"]) && (514 in exif_dict["1st"])) {
                var end = exif_dict["1st"][513] + exif_dict["1st"][514];
                var thumb = exifReader.tiftag.slice(exif_dict["1st"][513], end);
                exif_dict["thumbnail"] = thumb;
            }
        }

        return exif_dict;
    };

    that.dump = function (exif_dict_original) {
        var TIFF_HEADER_LENGTH = 8;

        var exif_dict = copy(exif_dict_original);
        var header = "Exif\x00\x00\x4d\x4d\x00\x2a\x00\x00\x00\x08";
        var exif_is = false;
        var gps_is = false;
        var interop_is = false;
        var first_is = false;

        var zeroth_ifd,
            exif_ifd,
            interop_ifd,
            gps_ifd,
            first_ifd;

        if ("0th" in exif_dict) {
            zeroth_ifd = exif_dict["0th"];
        } else {
            zeroth_ifd = {};
        }

        if ((("Exif" in exif_dict) && (Object.keys(exif_dict["Exif"]).length)) ||
            (("Interop" in exif_dict) && (Object.keys(exif_dict["Interop"]).length))) {
            zeroth_ifd[34665] = 1;
            exif_is = true;
            exif_ifd = exif_dict["Exif"];
            if (("Interop" in exif_dict) && Object.keys(exif_dict["Interop"]).length) {
                exif_ifd[40965] = 1;
                interop_is = true;
                interop_ifd = exif_dict["Interop"];
            } else if (Object.keys(exif_ifd).indexOf(that.ExifIFD.InteroperabilityTag.toString()) > -1) {
                delete exif_ifd[40965];
            }
        } else if (Object.keys(zeroth_ifd).indexOf(that.ImageIFD.ExifTag.toString()) > -1) {
            delete zeroth_ifd[34665];
        }

        if (("GPS" in exif_dict) && (Object.keys(exif_dict["GPS"]).length)) {
            zeroth_ifd[that.ImageIFD.GPSTag] = 1;
            gps_is = true;
            gps_ifd = exif_dict["GPS"];
        } else if (Object.keys(zeroth_ifd).indexOf(that.ImageIFD.GPSTag.toString()) > -1) {
            delete zeroth_ifd[that.ImageIFD.GPSTag];
        }

        if (("1st" in exif_dict) &&
            ("thumbnail" in exif_dict) &&
            (exif_dict["thumbnail"] != null)) {
            first_is = true;
            exif_dict["1st"][513] = 1;
            exif_dict["1st"][514] = 1;
            first_ifd = exif_dict["1st"];
        }

        var zeroth_set = _dict_to_bytes(zeroth_ifd, "0th", 0);
        var zeroth_length = (zeroth_set[0].length + exif_is * 12 + gps_is * 12 + 4 +
            zeroth_set[1].length);

        var exif_set,
            exif_bytes = "",
            exif_length = 0,
            gps_set,
            gps_bytes = "",
            gps_length = 0,
            interop_set,
            interop_bytes = "",
            interop_length = 0,
            first_set,
            first_bytes = "",
            thumbnail;
        if (exif_is) {
            exif_set = _dict_to_bytes(exif_ifd, "Exif", zeroth_length);
            exif_length = exif_set[0].length + interop_is * 12 + exif_set[1].length;
        }
        if (gps_is) {
            gps_set = _dict_to_bytes(gps_ifd, "GPS", zeroth_length + exif_length);
            gps_bytes = gps_set.join("");
            gps_length = gps_bytes.length;
        }
        if (interop_is) {
            var offset = zeroth_length + exif_length + gps_length;
            interop_set = _dict_to_bytes(interop_ifd, "Interop", offset);
            interop_bytes = interop_set.join("");
            interop_length = interop_bytes.length;
        }
        if (first_is) {
            var offset = zeroth_length + exif_length + gps_length + interop_length;
            first_set = _dict_to_bytes(first_ifd, "1st", offset);
            thumbnail = _get_thumbnail(exif_dict["thumbnail"]);
            if (thumbnail.length > 64000) {
                throw new Error("Given thumbnail is too large. max 64kB");
            }
        }

        var exif_pointer = "",
            gps_pointer = "",
            interop_pointer = "",
            first_ifd_pointer = "\x00\x00\x00\x00";
        if (exif_is) {
            var pointer_value = TIFF_HEADER_LENGTH + zeroth_length;
            var pointer_str = pack(">L", [pointer_value]);
            var key = 34665;
            var key_str = pack(">H", [key]);
            var type_str = pack(">H", [TYPES["Long"]]);
            var length_str = pack(">L", [1]);
            exif_pointer = key_str + type_str + length_str + pointer_str;
        }
        if (gps_is) {
            var pointer_value = TIFF_HEADER_LENGTH + zeroth_length + exif_length;
            var pointer_str = pack(">L", [pointer_value]);
            var key = 34853;
            var key_str = pack(">H", [key]);
            var type_str = pack(">H", [TYPES["Long"]]);
            var length_str = pack(">L", [1]);
            gps_pointer = key_str + type_str + length_str + pointer_str;
        }
        if (interop_is) {
            var pointer_value = (TIFF_HEADER_LENGTH +
                zeroth_length + exif_length + gps_length);
            var pointer_str = pack(">L", [pointer_value]);
            var key = 40965;
            var key_str = pack(">H", [key]);
            var type_str = pack(">H", [TYPES["Long"]]);
            var length_str = pack(">L", [1]);
            interop_pointer = key_str + type_str + length_str + pointer_str;
        }
        if (first_is) {
            var pointer_value = (TIFF_HEADER_LENGTH + zeroth_length +
                exif_length + gps_length + interop_length);
            first_ifd_pointer = pack(">L", [pointer_value]);
            var thumbnail_pointer = (pointer_value + first_set[0].length + 24 +
                4 + first_set[1].length);
            var thumbnail_p_bytes = ("\x02\x01\x00\x04\x00\x00\x00\x01" +
                pack(">L", [thumbnail_pointer]));
            var thumbnail_length_bytes = ("\x02\x02\x00\x04\x00\x00\x00\x01" +
                pack(">L", [thumbnail.length]));
            first_bytes = (first_set[0] + thumbnail_p_bytes +
                thumbnail_length_bytes + "\x00\x00\x00\x00" +
                first_set[1] + thumbnail);
        }

        var zeroth_bytes = (zeroth_set[0] + exif_pointer + gps_pointer +
            first_ifd_pointer + zeroth_set[1]);
        if (exif_is) {
            exif_bytes = exif_set[0] + interop_pointer + exif_set[1];
        }

        return (header + zeroth_bytes + exif_bytes + gps_bytes +
            interop_bytes + first_bytes);
    };

    that.extractSegments = function(data) {
        var input_data;
        if (typeof (data) == "string") {
            if (data.slice(0, 2) == "\xff\xd8") {
                input_data = data;
            } else if (data.slice(0, 23) == "data:image/jpeg;base64," || data.slice(0, 22) == "data:image/jpg;base64,") {
                input_data = atob(data.split(",")[1]);
            } else if (data.slice(0, 4) == "Exif") {
                input_data = data.slice(6);
            } else {
                throw new Error("'load' gots invalid file data.");
            }
        } else {
            throw new Error("'load' gots invalid type argument.");
        }

        var segments,
            app1;
        if (input_data.slice(0, 2) == "\xff\xd8") { // JPEG
            segments = splitIntoSegments(input_data);
        }

        return segments;
    }

    function copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function _get_thumbnail(jpeg) {
        var segments = splitIntoSegments(jpeg);
        while (("\xff\xe0" <= segments[1].slice(0, 2)) && (segments[1].slice(0, 2) <= "\xff\xef")) {
            segments = [segments[0]].concat(segments.slice(2));
        }
        return segments.join("");
    }

    function _pack_byte(array) {
        return pack(">" + nStr("B", array.length), array);
    }

    function _pack_short(array) {
        return pack(">" + nStr("H", array.length), array);
    }

    function _pack_long(array) {
        return pack(">" + nStr("L", array.length), array);
    }

    function _value_to_bytes(raw_value, value_type, offset) {
        var four_bytes_over = "";
        var value_str = "";
        var length,
            new_value,
            num,
            den;

        if (value_type == "Byte") {
            length = raw_value.length;
            if (length <= 4) {
                value_str = (_pack_byte(raw_value) +
                    nStr("\x00", 4 - length));
            } else {
                value_str = pack(">L", [offset]);
                four_bytes_over = _pack_byte(raw_value);
            }
        } else if (value_type == "Short") {
            length = raw_value.length;
            if (length <= 2) {
                value_str = (_pack_short(raw_value) +
                    nStr("\x00\x00", 2 - length));
            } else {
                value_str = pack(">L", [offset]);
                four_bytes_over = _pack_short(raw_value);
            }
        } else if (value_type == "Long") {
            length = raw_value.length;
            if (length <= 1) {
                value_str = _pack_long(raw_value);
            } else {
                value_str = pack(">L", [offset]);
                four_bytes_over = _pack_long(raw_value);
            }
        } else if (value_type == "Ascii") {
            new_value = raw_value + "\x00";
            length = new_value.length;
            if (length > 4) {
                value_str = pack(">L", [offset]);
                four_bytes_over = new_value;
            } else {
                value_str = new_value + nStr("\x00", 4 - length);
            }
        } else if (value_type == "Rational") {
            if (typeof (raw_value[0]) == "number") {
                length = 1;
                num = raw_value[0];
                den = raw_value[1];
                new_value = pack(">L", [num]) + pack(">L", [den]);
            } else {
                length = raw_value.length;
                new_value = "";
                for (var n = 0; n < length; n++) {
                    num = raw_value[n][0];
                    den = raw_value[n][1];
                    new_value += (pack(">L", [num]) +
                        pack(">L", [den]));
                }
            }
            value_str = pack(">L", [offset]);
            four_bytes_over = new_value;
        } else if (value_type == "SRational") {
            if (typeof (raw_value[0]) == "number") {
                length = 1;
                num = raw_value[0];
                den = raw_value[1];
                new_value = pack(">l", [num]) + pack(">l", [den]);
            } else {
                length = raw_value.length;
                new_value = "";
                for (var n = 0; n < length; n++) {
                    num = raw_value[n][0];
                    den = raw_value[n][1];
                    new_value += (pack(">l", [num]) +
                        pack(">l", [den]));
                }
            }
            value_str = pack(">L", [offset]);
            four_bytes_over = new_value;
        } else if (value_type == "Undefined") {
            length = raw_value.length;
            if (length > 4) {
                value_str = pack(">L", [offset]);
                four_bytes_over = raw_value;
            } else {
                value_str = raw_value + nStr("\x00", 4 - length);
            }
        }

        var length_str = pack(">L", [length]);

        return [length_str, value_str, four_bytes_over];
    }

    function _dict_to_bytes(ifd_dict, ifd, ifd_offset) {
        var TIFF_HEADER_LENGTH = 8;
        var tag_count = Object.keys(ifd_dict).length;
        var entry_header = pack(">H", [tag_count]);
        var entries_length;
        if (["0th", "1st"].indexOf(ifd) > -1) {
            entries_length = 2 + tag_count * 12 + 4;
        } else {
            entries_length = 2 + tag_count * 12;
        }
        var entries = "";
        var values = "";
        var key;

        for (var key in ifd_dict) {
            if (typeof (key) == "string") {
                key = parseInt(key);
            }
            if ((ifd == "0th") && ([34665, 34853].indexOf(key) > -1)) {
                continue;
            } else if ((ifd == "Exif") && (key == 40965)) {
                continue;
            } else if ((ifd == "1st") && ([513, 514].indexOf(key) > -1)) {
                continue;
            }

            var raw_value = ifd_dict[key];
            var key_str = pack(">H", [key]);
            var value_type = TAGS[ifd][key]["type"];
            var type_str = pack(">H", [TYPES[value_type]]);

            if (typeof (raw_value) == "number") {
                raw_value = [raw_value];
            }
            var offset = TIFF_HEADER_LENGTH + entries_length + ifd_offset + values.length;
            var b = _value_to_bytes(raw_value, value_type, offset);
            var length_str = b[0];
            var value_str = b[1];
            var four_bytes_over = b[2];

            entries += key_str + type_str + length_str + value_str;
            values += four_bytes_over;
        }

        return [entry_header + entries, values];
    }

    function ExifReader(data) {
        var segments,
            app1;
        if (data.slice(0, 2) == "\xff\xd8") { // JPEG
            segments = splitIntoSegments(data);
            app1 = getExifSeg(segments);
            if (app1) {
                this.tiftag = app1.slice(10);
            } else {
                this.tiftag = null;
            }
        } else if (["\x49\x49", "\x4d\x4d"].indexOf(data.slice(0, 2)) > -1) { // TIFF
            this.tiftag = data;
        } else if (data.slice(0, 4) == "Exif") { // Exif
            this.tiftag = data.slice(6);
        } else {
            throw new Error("Given file is neither JPEG nor TIFF.");
        }
    }

    ExifReader.prototype = {
        get_ifd: function (pointer, ifd_name) {
            var ifd_dict = {};
            var tag_count = unpack(this.endian_mark + "H",
                this.tiftag.slice(pointer, pointer + 2))[0];
            var offset = pointer + 2;
            var t;
            if (["0th", "1st"].indexOf(ifd_name) > -1) {
                t = "Image";
            } else {
                t = ifd_name;
            }

            for (var x = 0; x < tag_count; x++) {
                pointer = offset + 12 * x;
                var tag = unpack(this.endian_mark + "H",
                    this.tiftag.slice(pointer, pointer + 2))[0];
                var value_type = unpack(this.endian_mark + "H",
                    this.tiftag.slice(pointer + 2, pointer + 4))[0];
                var value_num = unpack(this.endian_mark + "L",
                    this.tiftag.slice(pointer + 4, pointer + 8))[0];
                var value = this.tiftag.slice(pointer + 8, pointer + 12);

                var v_set = [value_type, value_num, value];
                if (tag in TAGS[t]) {
                    ifd_dict[tag] = this.convert_value(v_set);
                }
            }

            if (ifd_name == "0th") {
                pointer = offset + 12 * tag_count;
                ifd_dict["first_ifd_pointer"] = this.tiftag.slice(pointer, pointer + 4);
            }

            return ifd_dict;
        },

        convert_value: function (val) {
            var data = null;
            var t = val[0];
            var length = val[1];
            var value = val[2];
            var pointer;

            if (t == 1) { // BYTE
                if (length > 4) {
                    pointer = unpack(this.endian_mark + "L", value)[0];
                    data = unpack(this.endian_mark + nStr("B", length),
                        this.tiftag.slice(pointer, pointer + length));
                } else {
                    data = unpack(this.endian_mark + nStr("B", length), value.slice(0, length));
                }
            } else if (t == 2) { // ASCII
                if (length > 4) {
                    pointer = unpack(this.endian_mark + "L", value)[0];
                    data = this.tiftag.slice(pointer, pointer + length - 1);
                } else {
                    data = value.slice(0, length - 1);
                }
            } else if (t == 3) { // SHORT
                if (length > 2) {
                    pointer = unpack(this.endian_mark + "L", value)[0];
                    data = unpack(this.endian_mark + nStr("H", length),
                        this.tiftag.slice(pointer, pointer + length * 2));
                } else {
                    data = unpack(this.endian_mark + nStr("H", length),
                        value.slice(0, length * 2));
                }
            } else if (t == 4) { // LONG
                if (length > 1) {
                    pointer = unpack(this.endian_mark + "L", value)[0];
                    data = unpack(this.endian_mark + nStr("L", length),
                        this.tiftag.slice(pointer, pointer + length * 4));
                } else {
                    data = unpack(this.endian_mark + nStr("L", length),
                        value);
                }
            } else if (t == 5) { // RATIONAL
                pointer = unpack(this.endian_mark + "L", value)[0];
                if (length > 1) {
                    data = [];
                    for (var x = 0; x < length; x++) {
                        data.push([unpack(this.endian_mark + "L",
                                this.tiftag.slice(pointer + x * 8, pointer + 4 + x * 8))[0],
                                   unpack(this.endian_mark + "L",
                                this.tiftag.slice(pointer + 4 + x * 8, pointer + 8 + x * 8))[0]
                                   ]);
                    }
                } else {
                    data = [unpack(this.endian_mark + "L",
                            this.tiftag.slice(pointer, pointer + 4))[0],
                            unpack(this.endian_mark + "L",
                            this.tiftag.slice(pointer + 4, pointer + 8))[0]
                            ];
                }
            } else if (t == 7) { // UNDEFINED BYTES
                if (length > 4) {
                    pointer = unpack(this.endian_mark + "L", value)[0];
                    data = this.tiftag.slice(pointer, pointer + length);
                } else {
                    data = value.slice(0, length);
                }
            } else if (t == 9) { // SLONG
                if (length > 1) {
                    pointer = unpack(this.endian_mark + "L", value)[0];
                    data = unpack(this.endian_mark + nStr("l", length),
                        this.tiftag.slice(pointer, pointer + length * 4));
                } else {
                    data = unpack(this.endian_mark + nStr("l", length),
                        value);
                }
            } else if (t == 10) { // SRATIONAL
                pointer = unpack(this.endian_mark + "L", value)[0];
                if (length > 1) {
                    data = [];
                    for (var x = 0; x < length; x++) {
                        data.push([unpack(this.endian_mark + "l",
                                this.tiftag.slice(pointer + x * 8, pointer + 4 + x * 8))[0],
                                   unpack(this.endian_mark + "l",
                                this.tiftag.slice(pointer + 4 + x * 8, pointer + 8 + x * 8))[0]
                                  ]);
                    }
                } else {
                    data = [unpack(this.endian_mark + "l",
                            this.tiftag.slice(pointer, pointer + 4))[0],
                            unpack(this.endian_mark + "l",
                            this.tiftag.slice(pointer + 4, pointer + 8))[0]
                           ];
                }
            } else {
                throw new Error("Exif might be wrong. Got incorrect value " +
                    "type to decode. type:" + t);
            }

            if ((data instanceof Array) && (data.length == 1)) {
                return data[0];
            } else {
                return data;
            }
        },
    };

    if (typeof window !== "undefined" && typeof window.btoa === "function") {
        var btoa = window.btoa;
    }
    if (typeof btoa === "undefined") {
        var btoa = function (input) {        var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);

            }

            return output;
        };
    }


    if (typeof window !== "undefined" && typeof window.atob === "function") {
        var atob = window.atob;
    }
    if (typeof atob === "undefined") {
        var atob = function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            return output;
        };
    }

    function getImageSize(imageArray) {
        var segments = slice2Segments(imageArray);
        var seg,
            width,
            height,
            SOF = [192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207];

        for (var x = 0; x < segments.length; x++) {
            seg = segments[x];
            if (SOF.indexOf(seg[1]) >= 0) {
                height = seg[5] * 256 + seg[6];
                width = seg[7] * 256 + seg[8];
                break;
            }
        }
        return [width, height];
    }

    function pack(mark, array) {
        if (!(array instanceof Array)) {
            throw new Error("'pack' error. Got invalid type argument.");
        }
        if ((mark.length - 1) != array.length) {
            throw new Error("'pack' error. " + (mark.length - 1) + " marks, " + array.length + " elements.");
        }

        var littleEndian;
        if (mark[0] == "<") {
            littleEndian = true;
        } else if (mark[0] == ">") {
            littleEndian = false;
        } else {
            throw new Error("");
        }
        var packed = "";
        var p = 1;
        var val = null;
        var c = null;
        var valStr = null;

        while (c = mark[p]) {
            if (c.toLowerCase() == "b") {
                val = array[p - 1];
                if ((c == "b") && (val < 0)) {
                    val += 0x100;
                }
                if ((val > 0xff) || (val < 0)) {
                    throw new Error("'pack' error.");
                } else {
                    valStr = String.fromCharCode(val);
                }
            } else if (c == "H") {
                val = array[p - 1];
                if ((val > 0xffff) || (val < 0)) {
                    throw new Error("'pack' error.");
                } else {
                    valStr = String.fromCharCode(Math.floor((val % 0x10000) / 0x100)) +
                        String.fromCharCode(val % 0x100);
                    if (littleEndian) {
                        valStr = valStr.split("").reverse().join("");
                    }
                }
            } else if (c.toLowerCase() == "l") {
                val = array[p - 1];
                if ((c == "l") && (val < 0)) {
                    val += 0x100000000;
                }
                if ((val > 0xffffffff) || (val < 0)) {
                    throw new Error("'pack' error.");
                } else {
                    valStr = String.fromCharCode(Math.floor(val / 0x1000000)) +
                        String.fromCharCode(Math.floor((val % 0x1000000) / 0x10000)) +
                        String.fromCharCode(Math.floor((val % 0x10000) / 0x100)) +
                        String.fromCharCode(val % 0x100);
                    if (littleEndian) {
                        valStr = valStr.split("").reverse().join("");
                    }
                }
            } else {
                throw new Error("'pack' error.");
            }

            packed += valStr;
            p += 1;
        }

        return packed;
    }

    function unpack(mark, str) {
        if (typeof (str) != "string") {
            throw new Error("'unpack' error. Got invalid type argument.");
        }
        var l = 0;
        for (var markPointer = 1; markPointer < mark.length; markPointer++) {
            if (mark[markPointer].toLowerCase() == "b") {
                l += 1;
            } else if (mark[markPointer].toLowerCase() == "h") {
                l += 2;
            } else if (mark[markPointer].toLowerCase() == "l") {
                l += 4;
            } else {
                throw new Error("'unpack' error. Got invalid mark.");
            }
        }

        if (l != str.length) {
            throw new Error("'unpack' error. Mismatch between symbol and string length. " + l + ":" + str.length);
        }

        var littleEndian;
        if (mark[0] == "<") {
            littleEndian = true;
        } else if (mark[0] == ">") {
            littleEndian = false;
        } else {
            throw new Error("'unpack' error.");
        }
        var unpacked = [];
        var strPointer = 0;
        var p = 1;
        var val = null;
        var c = null;
        var length = null;
        var sliced = "";

        while (c = mark[p]) {
            if (c.toLowerCase() == "b") {
                length = 1;
                sliced = str.slice(strPointer, strPointer + length);
                val = sliced.charCodeAt(0);
                if ((c == "b") && (val >= 0x80)) {
                    val -= 0x100;
                }
            } else if (c == "H") {
                length = 2;
                sliced = str.slice(strPointer, strPointer + length);
                if (littleEndian) {
                    sliced = sliced.split("").reverse().join("");
                }
                val = sliced.charCodeAt(0) * 0x100 +
                    sliced.charCodeAt(1);
            } else if (c.toLowerCase() == "l") {
                length = 4;
                sliced = str.slice(strPointer, strPointer + length);
                if (littleEndian) {
                    sliced = sliced.split("").reverse().join("");
                }
                val = sliced.charCodeAt(0) * 0x1000000 +
                    sliced.charCodeAt(1) * 0x10000 +
                    sliced.charCodeAt(2) * 0x100 +
                    sliced.charCodeAt(3);
                if ((c == "l") && (val >= 0x80000000)) {
                    val -= 0x100000000;
                }
            } else {
                throw new Error("'unpack' error. " + c);
            }

            unpacked.push(val);
            strPointer += length;
            p += 1;
        }

        return unpacked;
    }

    function nStr(ch, num) {
        var str = "";
        for (var i = 0; i < num; i++) {
            str += ch;
        }
        return str;
    }

    function splitIntoSegments(data) {
        if (data.slice(0, 2) != "\xff\xd8") {
            throw new Error("Given data isn't JPEG.");
        }

        var head = 2;
        var segments = ["\xff\xd8"];
        while (true) {
            if (data.slice(head, head + 2) == "\xff\xda") {
                segments.push(data.slice(head));
                break;
            } else {
                var length = unpack(">H", data.slice(head + 2, head + 4))[0];
                var endPoint = head + length + 2;
                segments.push(data.slice(head, endPoint));
                head = endPoint;
            }

            if (head >= data.length) {
                throw new Error("Wrong JPEG data.");
            }
        }
        return segments;
    }

    function getExifSeg(segments) {
        var seg;
        for (var i = 0; i < segments.length; i++) {
            seg = segments[i];
            if (seg.slice(0, 2) == "\xff\xe1" &&
                   seg.slice(4, 10) == "Exif\x00\x00") {
                return seg;
            }
        }
        return null;
    }

    function mergeSegments(segments, exif, xmp) {
        var hasExifSegment = false;
        var additionalAPP1ExifSegments = [];
        var exifLocation = 0;

        segments.forEach(function(segment, i) {
            // Replace first occurence of APP1:Exif segment
            if (segment.slice(0, 2) == "\xff\xe1" &&
                segment.slice(4, 10) == "Exif\x00\x00"
            ) {
                if (!hasExifSegment) {
                    exifLocation = i;
                    segments[i] = exif;
                    hasExifSegment = true;
                } else {
                    additionalAPP1ExifSegments.unshift(i);
                }
            }
        });

        // Remove additional occurences of APP1:Exif segment
        additionalAPP1ExifSegments.forEach(function(segmentIndex) {
            segments.splice(segmentIndex, 1);
        });

        if (!hasExifSegment && exif) {
            exifLocation = 1;
            segments = [segments[0], exif].concat(segments.slice(1));
        }
        var start = '\xFF\xE1\x07\xD0';
        var end = 'http://ns.adobe.com/xap/1.0/\x00' +
        '<?xpacket begin="<feff>" id="W5M0MpCehiHzreSzNTczkc9d"?>' +
        '<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 6.1.10">' +
        '  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '    <rdf:Description rdf:about=""' +
        '        xmlns:IDM="IDMetrics/"' +
        '';
        for (var xmpProperty in xmp) {
          end = end + ' IDM:' + xmpProperty + ' = "' + xmp[xmpProperty] + '" ';
        }

        end = end + '/>' +
        '  </rdf:RDF>' +
        '</x:xmpmeta>';

        var len = 2002 - (start.length + end.length + '<?xpacket end="w"?>'.length);

        end = end + ''.padEnd(len, ' ') +
        '<?xpacket end="w"?>';

        var xmp = start + end;

        segments.splice(exifLocation + 1, 0, xmp);
        return segments.join("")
    }


    function toHex(str) {
        var hexStr = "";
        for (var i = 0; i < str.length; i++) {
            var h = str.charCodeAt(i);
            var hex = ((h < 10) ? "0" : "") + h.toString(16);
            hexStr += hex + " ";
        }
        return hexStr;
    }


    var TYPES = {
        "Byte": 1,
        "Ascii": 2,
        "Short": 3,
        "Long": 4,
        "Rational": 5,
        "Undefined": 7,
        "SLong": 9,
        "SRational": 10
    };


    var TAGS = {
        'Image': {
            11: {
                'name': 'ProcessingSoftware',
                'type': 'Ascii'
            },
            254: {
                'name': 'NewSubfileType',
                'type': 'Long'
            },
            255: {
                'name': 'SubfileType',
                'type': 'Short'
            },
            256: {
                'name': 'ImageWidth',
                'type': 'Long'
            },
            257: {
                'name': 'ImageLength',
                'type': 'Long'
            },
            258: {
                'name': 'BitsPerSample',
                'type': 'Short'
            },
            259: {
                'name': 'Compression',
                'type': 'Short'
            },
            262: {
                'name': 'PhotometricInterpretation',
                'type': 'Short'
            },
            263: {
                'name': 'Threshholding',
                'type': 'Short'
            },
            264: {
                'name': 'CellWidth',
                'type': 'Short'
            },
            265: {
                'name': 'CellLength',
                'type': 'Short'
            },
            266: {
                'name': 'FillOrder',
                'type': 'Short'
            },
            269: {
                'name': 'DocumentName',
                'type': 'Ascii'
            },
            270: {
                'name': 'ImageDescription',
                'type': 'Ascii'
            },
            271: {
                'name': 'Make',
                'type': 'Ascii'
            },
            272: {
                'name': 'Model',
                'type': 'Ascii'
            },
            273: {
                'name': 'StripOffsets',
                'type': 'Long'
            },
            274: {
                'name': 'Orientation',
                'type': 'Short'
            },
            277: {
                'name': 'SamplesPerPixel',
                'type': 'Short'
            },
            278: {
                'name': 'RowsPerStrip',
                'type': 'Long'
            },
            279: {
                'name': 'StripByteCounts',
                'type': 'Long'
            },
            282: {
                'name': 'XResolution',
                'type': 'Rational'
            },
            283: {
                'name': 'YResolution',
                'type': 'Rational'
            },
            284: {
                'name': 'PlanarConfiguration',
                'type': 'Short'
            },
            290: {
                'name': 'GrayResponseUnit',
                'type': 'Short'
            },
            291: {
                'name': 'GrayResponseCurve',
                'type': 'Short'
            },
            292: {
                'name': 'T4Options',
                'type': 'Long'
            },
            293: {
                'name': 'T6Options',
                'type': 'Long'
            },
            296: {
                'name': 'ResolutionUnit',
                'type': 'Short'
            },
            301: {
                'name': 'TransferFunction',
                'type': 'Short'
            },
            305: {
                'name': 'Software',
                'type': 'Ascii'
            },
            306: {
                'name': 'DateTime',
                'type': 'Ascii'
            },
            315: {
                'name': 'Artist',
                'type': 'Ascii'
            },
            316: {
                'name': 'HostComputer',
                'type': 'Ascii'
            },
            317: {
                'name': 'Predictor',
                'type': 'Short'
            },
            318: {
                'name': 'WhitePoint',
                'type': 'Rational'
            },
            319: {
                'name': 'PrimaryChromaticities',
                'type': 'Rational'
            },
            320: {
                'name': 'ColorMap',
                'type': 'Short'
            },
            321: {
                'name': 'HalftoneHints',
                'type': 'Short'
            },
            322: {
                'name': 'TileWidth',
                'type': 'Short'
            },
            323: {
                'name': 'TileLength',
                'type': 'Short'
            },
            324: {
                'name': 'TileOffsets',
                'type': 'Short'
            },
            325: {
                'name': 'TileByteCounts',
                'type': 'Short'
            },
            330: {
                'name': 'SubIFDs',
                'type': 'Long'
            },
            332: {
                'name': 'InkSet',
                'type': 'Short'
            },
            333: {
                'name': 'InkNames',
                'type': 'Ascii'
            },
            334: {
                'name': 'NumberOfInks',
                'type': 'Short'
            },
            336: {
                'name': 'DotRange',
                'type': 'Byte'
            },
            337: {
                'name': 'TargetPrinter',
                'type': 'Ascii'
            },
            338: {
                'name': 'ExtraSamples',
                'type': 'Short'
            },
            339: {
                'name': 'SampleFormat',
                'type': 'Short'
            },
            340: {
                'name': 'SMinSampleValue',
                'type': 'Short'
            },
            341: {
                'name': 'SMaxSampleValue',
                'type': 'Short'
            },
            342: {
                'name': 'TransferRange',
                'type': 'Short'
            },
            343: {
                'name': 'ClipPath',
                'type': 'Byte'
            },
            344: {
                'name': 'XClipPathUnits',
                'type': 'Long'
            },
            345: {
                'name': 'YClipPathUnits',
                'type': 'Long'
            },
            346: {
                'name': 'Indexed',
                'type': 'Short'
            },
            347: {
                'name': 'JPEGTables',
                'type': 'Undefined'
            },
            351: {
                'name': 'OPIProxy',
                'type': 'Short'
            },
            512: {
                'name': 'JPEGProc',
                'type': 'Long'
            },
            513: {
                'name': 'JPEGInterchangeFormat',
                'type': 'Long'
            },
            514: {
                'name': 'JPEGInterchangeFormatLength',
                'type': 'Long'
            },
            515: {
                'name': 'JPEGRestartInterval',
                'type': 'Short'
            },
            517: {
                'name': 'JPEGLosslessPredictors',
                'type': 'Short'
            },
            518: {
                'name': 'JPEGPointTransforms',
                'type': 'Short'
            },
            519: {
                'name': 'JPEGQTables',
                'type': 'Long'
            },
            520: {
                'name': 'JPEGDCTables',
                'type': 'Long'
            },
            521: {
                'name': 'JPEGACTables',
                'type': 'Long'
            },
            529: {
                'name': 'YCbCrCoefficients',
                'type': 'Rational'
            },
            530: {
                'name': 'YCbCrSubSampling',
                'type': 'Short'
            },
            531: {
                'name': 'YCbCrPositioning',
                'type': 'Short'
            },
            532: {
                'name': 'ReferenceBlackWhite',
                'type': 'Rational'
            },
            700: {
                'name': 'XMLPacket',
                'type': 'Byte'
            },
            18246: {
                'name': 'Rating',
                'type': 'Short'
            },
            18249: {
                'name': 'RatingPercent',
                'type': 'Short'
            },
            32781: {
                'name': 'ImageID',
                'type': 'Ascii'
            },
            33421: {
                'name': 'CFARepeatPatternDim',
                'type': 'Short'
            },
            33422: {
                'name': 'CFAPattern',
                'type': 'Byte'
            },
            33423: {
                'name': 'BatteryLevel',
                'type': 'Rational'
            },
            33432: {
                'name': 'Copyright',
                'type': 'Ascii'
            },
            33434: {
                'name': 'ExposureTime',
                'type': 'Rational'
            },
            34377: {
                'name': 'ImageResources',
                'type': 'Byte'
            },
            34665: {
                'name': 'ExifTag',
                'type': 'Long'
            },
            34675: {
                'name': 'InterColorProfile',
                'type': 'Undefined'
            },
            34853: {
                'name': 'GPSTag',
                'type': 'Long'
            },
            34857: {
                'name': 'Interlace',
                'type': 'Short'
            },
            34858: {
                'name': 'TimeZoneOffset',
                'type': 'Long'
            },
            34859: {
                'name': 'SelfTimerMode',
                'type': 'Short'
            },
            37387: {
                'name': 'FlashEnergy',
                'type': 'Rational'
            },
            37388: {
                'name': 'SpatialFrequencyResponse',
                'type': 'Undefined'
            },
            37389: {
                'name': 'Noise',
                'type': 'Undefined'
            },
            37390: {
                'name': 'FocalPlaneXResolution',
                'type': 'Rational'
            },
            37391: {
                'name': 'FocalPlaneYResolution',
                'type': 'Rational'
            },
            37392: {
                'name': 'FocalPlaneResolutionUnit',
                'type': 'Short'
            },
            37393: {
                'name': 'ImageNumber',
                'type': 'Long'
            },
            37394: {
                'name': 'SecurityClassification',
                'type': 'Ascii'
            },
            37395: {
                'name': 'ImageHistory',
                'type': 'Ascii'
            },
            37397: {
                'name': 'ExposureIndex',
                'type': 'Rational'
            },
            37398: {
                'name': 'TIFFEPStandardID',
                'type': 'Byte'
            },
            37399: {
                'name': 'SensingMethod',
                'type': 'Short'
            },
            40091: {
                'name': 'XPTitle',
                'type': 'Byte'
            },
            40092: {
                'name': 'XPComment',
                'type': 'Byte'
            },
            40093: {
                'name': 'XPAuthor',
                'type': 'Byte'
            },
            40094: {
                'name': 'XPKeywords',
                'type': 'Byte'
            },
            40095: {
                'name': 'XPSubject',
                'type': 'Byte'
            },
            50341: {
                'name': 'PrintImageMatching',
                'type': 'Undefined'
            },
            50706: {
                'name': 'DNGVersion',
                'type': 'Byte'
            },
            50707: {
                'name': 'DNGBackwardVersion',
                'type': 'Byte'
            },
            50708: {
                'name': 'UniqueCameraModel',
                'type': 'Ascii'
            },
            50709: {
                'name': 'LocalizedCameraModel',
                'type': 'Byte'
            },
            50710: {
                'name': 'CFAPlaneColor',
                'type': 'Byte'
            },
            50711: {
                'name': 'CFALayout',
                'type': 'Short'
            },
            50712: {
                'name': 'LinearizationTable',
                'type': 'Short'
            },
            50713: {
                'name': 'BlackLevelRepeatDim',
                'type': 'Short'
            },
            50714: {
                'name': 'BlackLevel',
                'type': 'Rational'
            },
            50715: {
                'name': 'BlackLevelDeltaH',
                'type': 'SRational'
            },
            50716: {
                'name': 'BlackLevelDeltaV',
                'type': 'SRational'
            },
            50717: {
                'name': 'WhiteLevel',
                'type': 'Short'
            },
            50718: {
                'name': 'DefaultScale',
                'type': 'Rational'
            },
            50719: {
                'name': 'DefaultCropOrigin',
                'type': 'Short'
            },
            50720: {
                'name': 'DefaultCropSize',
                'type': 'Short'
            },
            50721: {
                'name': 'ColorMatrix1',
                'type': 'SRational'
            },
            50722: {
                'name': 'ColorMatrix2',
                'type': 'SRational'
            },
            50723: {
                'name': 'CameraCalibration1',
                'type': 'SRational'
            },
            50724: {
                'name': 'CameraCalibration2',
                'type': 'SRational'
            },
            50725: {
                'name': 'ReductionMatrix1',
                'type': 'SRational'
            },
            50726: {
                'name': 'ReductionMatrix2',
                'type': 'SRational'
            },
            50727: {
                'name': 'AnalogBalance',
                'type': 'Rational'
            },
            50728: {
                'name': 'AsShotNeutral',
                'type': 'Short'
            },
            50729: {
                'name': 'AsShotWhiteXY',
                'type': 'Rational'
            },
            50730: {
                'name': 'BaselineExposure',
                'type': 'SRational'
            },
            50731: {
                'name': 'BaselineNoise',
                'type': 'Rational'
            },
            50732: {
                'name': 'BaselineSharpness',
                'type': 'Rational'
            },
            50733: {
                'name': 'BayerGreenSplit',
                'type': 'Long'
            },
            50734: {
                'name': 'LinearResponseLimit',
                'type': 'Rational'
            },
            50735: {
                'name': 'CameraSerialNumber',
                'type': 'Ascii'
            },
            50736: {
                'name': 'LensInfo',
                'type': 'Rational'
            },
            50737: {
                'name': 'ChromaBlurRadius',
                'type': 'Rational'
            },
            50738: {
                'name': 'AntiAliasStrength',
                'type': 'Rational'
            },
            50739: {
                'name': 'ShadowScale',
                'type': 'SRational'
            },
            50740: {
                'name': 'DNGPrivateData',
                'type': 'Byte'
            },
            50741: {
                'name': 'MakerNoteSafety',
                'type': 'Short'
            },
            50778: {
                'name': 'CalibrationIlluminant1',
                'type': 'Short'
            },
            50779: {
                'name': 'CalibrationIlluminant2',
                'type': 'Short'
            },
            50780: {
                'name': 'BestQualityScale',
                'type': 'Rational'
            },
            50781: {
                'name': 'RawDataUniqueID',
                'type': 'Byte'
            },
            50827: {
                'name': 'OriginalRawFileName',
                'type': 'Byte'
            },
            50828: {
                'name': 'OriginalRawFileData',
                'type': 'Undefined'
            },
            50829: {
                'name': 'ActiveArea',
                'type': 'Short'
            },
            50830: {
                'name': 'MaskedAreas',
                'type': 'Short'
            },
            50831: {
                'name': 'AsShotICCProfile',
                'type': 'Undefined'
            },
            50832: {
                'name': 'AsShotPreProfileMatrix',
                'type': 'SRational'
            },
            50833: {
                'name': 'CurrentICCProfile',
                'type': 'Undefined'
            },
            50834: {
                'name': 'CurrentPreProfileMatrix',
                'type': 'SRational'
            },
            50879: {
                'name': 'ColorimetricReference',
                'type': 'Short'
            },
            50931: {
                'name': 'CameraCalibrationSignature',
                'type': 'Byte'
            },
            50932: {
                'name': 'ProfileCalibrationSignature',
                'type': 'Byte'
            },
            50934: {
                'name': 'AsShotProfileName',
                'type': 'Byte'
            },
            50935: {
                'name': 'NoiseReductionApplied',
                'type': 'Rational'
            },
            50936: {
                'name': 'ProfileName',
                'type': 'Byte'
            },
            50937: {
                'name': 'ProfileHueSatMapDims',
                'type': 'Long'
            },
            50938: {
                'name': 'ProfileHueSatMapData1',
                'type': 'Float'
            },
            50939: {
                'name': 'ProfileHueSatMapData2',
                'type': 'Float'
            },
            50940: {
                'name': 'ProfileToneCurve',
                'type': 'Float'
            },
            50941: {
                'name': 'ProfileEmbedPolicy',
                'type': 'Long'
            },
            50942: {
                'name': 'ProfileCopyright',
                'type': 'Byte'
            },
            50964: {
                'name': 'ForwardMatrix1',
                'type': 'SRational'
            },
            50965: {
                'name': 'ForwardMatrix2',
                'type': 'SRational'
            },
            50966: {
                'name': 'PreviewApplicationName',
                'type': 'Byte'
            },
            50967: {
                'name': 'PreviewApplicationVersion',
                'type': 'Byte'
            },
            50968: {
                'name': 'PreviewSettingsName',
                'type': 'Byte'
            },
            50969: {
                'name': 'PreviewSettingsDigest',
                'type': 'Byte'
            },
            50970: {
                'name': 'PreviewColorSpace',
                'type': 'Long'
            },
            50971: {
                'name': 'PreviewDateTime',
                'type': 'Ascii'
            },
            50972: {
                'name': 'RawImageDigest',
                'type': 'Undefined'
            },
            50973: {
                'name': 'OriginalRawFileDigest',
                'type': 'Undefined'
            },
            50974: {
                'name': 'SubTileBlockSize',
                'type': 'Long'
            },
            50975: {
                'name': 'RowInterleaveFactor',
                'type': 'Long'
            },
            50981: {
                'name': 'ProfileLookTableDims',
                'type': 'Long'
            },
            50982: {
                'name': 'ProfileLookTableData',
                'type': 'Float'
            },
            51008: {
                'name': 'OpcodeList1',
                'type': 'Undefined'
            },
            51009: {
                'name': 'OpcodeList2',
                'type': 'Undefined'
            },
            51022: {
                'name': 'OpcodeList3',
                'type': 'Undefined'
            }
        },
        'Exif': {
            33434: {
                'name': 'ExposureTime',
                'type': 'Rational'
            },
            33437: {
                'name': 'FNumber',
                'type': 'Rational'
            },
            34850: {
                'name': 'ExposureProgram',
                'type': 'Short'
            },
            34852: {
                'name': 'SpectralSensitivity',
                'type': 'Ascii'
            },
            34855: {
                'name': 'ISOSpeedRatings',
                'type': 'Short'
            },
            34856: {
                'name': 'OECF',
                'type': 'Undefined'
            },
            34864: {
                'name': 'SensitivityType',
                'type': 'Short'
            },
            34865: {
                'name': 'StandardOutputSensitivity',
                'type': 'Long'
            },
            34866: {
                'name': 'RecommendedExposureIndex',
                'type': 'Long'
            },
            34867: {
                'name': 'ISOSpeed',
                'type': 'Long'
            },
            34868: {
                'name': 'ISOSpeedLatitudeyyy',
                'type': 'Long'
            },
            34869: {
                'name': 'ISOSpeedLatitudezzz',
                'type': 'Long'
            },
            36864: {
                'name': 'ExifVersion',
                'type': 'Undefined'
            },
            36867: {
                'name': 'DateTimeOriginal',
                'type': 'Ascii'
            },
            36868: {
                'name': 'DateTimeDigitized',
                'type': 'Ascii'
            },
            37121: {
                'name': 'ComponentsConfiguration',
                'type': 'Undefined'
            },
            37122: {
                'name': 'CompressedBitsPerPixel',
                'type': 'Rational'
            },
            37377: {
                'name': 'ShutterSpeedValue',
                'type': 'SRational'
            },
            37378: {
                'name': 'ApertureValue',
                'type': 'Rational'
            },
            37379: {
                'name': 'BrightnessValue',
                'type': 'SRational'
            },
            37380: {
                'name': 'ExposureBiasValue',
                'type': 'SRational'
            },
            37381: {
                'name': 'MaxApertureValue',
                'type': 'Rational'
            },
            37382: {
                'name': 'SubjectDistance',
                'type': 'Rational'
            },
            37383: {
                'name': 'MeteringMode',
                'type': 'Short'
            },
            37384: {
                'name': 'LightSource',
                'type': 'Short'
            },
            37385: {
                'name': 'Flash',
                'type': 'Short'
            },
            37386: {
                'name': 'FocalLength',
                'type': 'Rational'
            },
            37396: {
                'name': 'SubjectArea',
                'type': 'Short'
            },
            37500: {
                'name': 'MakerNote',
                'type': 'Undefined'
            },
            37510: {
                'name': 'UserComment',
                'type': 'Ascii'
            },
            37520: {
                'name': 'SubSecTime',
                'type': 'Ascii'
            },
            37521: {
                'name': 'SubSecTimeOriginal',
                'type': 'Ascii'
            },
            37522: {
                'name': 'SubSecTimeDigitized',
                'type': 'Ascii'
            },
            40960: {
                'name': 'FlashpixVersion',
                'type': 'Undefined'
            },
            40961: {
                'name': 'ColorSpace',
                'type': 'Short'
            },
            40962: {
                'name': 'PixelXDimension',
                'type': 'Long'
            },
            40963: {
                'name': 'PixelYDimension',
                'type': 'Long'
            },
            40964: {
                'name': 'RelatedSoundFile',
                'type': 'Ascii'
            },
            40965: {
                'name': 'InteroperabilityTag',
                'type': 'Long'
            },
            41483: {
                'name': 'FlashEnergy',
                'type': 'Rational'
            },
            41484: {
                'name': 'SpatialFrequencyResponse',
                'type': 'Undefined'
            },
            41486: {
                'name': 'FocalPlaneXResolution',
                'type': 'Rational'
            },
            41487: {
                'name': 'FocalPlaneYResolution',
                'type': 'Rational'
            },
            41488: {
                'name': 'FocalPlaneResolutionUnit',
                'type': 'Short'
            },
            41492: {
                'name': 'SubjectLocation',
                'type': 'Short'
            },
            41493: {
                'name': 'ExposureIndex',
                'type': 'Rational'
            },
            41495: {
                'name': 'SensingMethod',
                'type': 'Short'
            },
            41728: {
                'name': 'FileSource',
                'type': 'Undefined'
            },
            41729: {
                'name': 'SceneType',
                'type': 'Undefined'
            },
            41730: {
                'name': 'CFAPattern',
                'type': 'Undefined'
            },
            41985: {
                'name': 'CustomRendered',
                'type': 'Short'
            },
            41986: {
                'name': 'ExposureMode',
                'type': 'Short'
            },
            41987: {
                'name': 'WhiteBalance',
                'type': 'Short'
            },
            41988: {
                'name': 'DigitalZoomRatio',
                'type': 'Rational'
            },
            41989: {
                'name': 'FocalLengthIn35mmFilm',
                'type': 'Short'
            },
            41990: {
                'name': 'SceneCaptureType',
                'type': 'Short'
            },
            41991: {
                'name': 'GainControl',
                'type': 'Short'
            },
            41992: {
                'name': 'Contrast',
                'type': 'Short'
            },
            41993: {
                'name': 'Saturation',
                'type': 'Short'
            },
            41994: {
                'name': 'Sharpness',
                'type': 'Short'
            },
            41995: {
                'name': 'DeviceSettingDescription',
                'type': 'Undefined'
            },
            41996: {
                'name': 'SubjectDistanceRange',
                'type': 'Short'
            },
            42016: {
                'name': 'ImageUniqueID',
                'type': 'Ascii'
            },
            42032: {
                'name': 'CameraOwnerName',
                'type': 'Ascii'
            },
            42033: {
                'name': 'BodySerialNumber',
                'type': 'Ascii'
            },
            42034: {
                'name': 'LensSpecification',
                'type': 'Rational'
            },
            42035: {
                'name': 'LensMake',
                'type': 'Ascii'
            },
            42036: {
                'name': 'LensModel',
                'type': 'Ascii'
            },
            42037: {
                'name': 'LensSerialNumber',
                'type': 'Ascii'
            },
            42240: {
                'name': 'Gamma',
                'type': 'Rational'
            }
        },
        'GPS': {
            0: {
                'name': 'GPSVersionID',
                'type': 'Byte'
            },
            1: {
                'name': 'GPSLatitudeRef',
                'type': 'Ascii'
            },
            2: {
                'name': 'GPSLatitude',
                'type': 'Rational'
            },
            3: {
                'name': 'GPSLongitudeRef',
                'type': 'Ascii'
            },
            4: {
                'name': 'GPSLongitude',
                'type': 'Rational'
            },
            5: {
                'name': 'GPSAltitudeRef',
                'type': 'Byte'
            },
            6: {
                'name': 'GPSAltitude',
                'type': 'Rational'
            },
            7: {
                'name': 'GPSTimeStamp',
                'type': 'Rational'
            },
            8: {
                'name': 'GPSSatellites',
                'type': 'Ascii'
            },
            9: {
                'name': 'GPSStatus',
                'type': 'Ascii'
            },
            10: {
                'name': 'GPSMeasureMode',
                'type': 'Ascii'
            },
            11: {
                'name': 'GPSDOP',
                'type': 'Rational'
            },
            12: {
                'name': 'GPSSpeedRef',
                'type': 'Ascii'
            },
            13: {
                'name': 'GPSSpeed',
                'type': 'Rational'
            },
            14: {
                'name': 'GPSTrackRef',
                'type': 'Ascii'
            },
            15: {
                'name': 'GPSTrack',
                'type': 'Rational'
            },
            16: {
                'name': 'GPSImgDirectionRef',
                'type': 'Ascii'
            },
            17: {
                'name': 'GPSImgDirection',
                'type': 'Rational'
            },
            18: {
                'name': 'GPSMapDatum',
                'type': 'Ascii'
            },
            19: {
                'name': 'GPSDestLatitudeRef',
                'type': 'Ascii'
            },
            20: {
                'name': 'GPSDestLatitude',
                'type': 'Rational'
            },
            21: {
                'name': 'GPSDestLongitudeRef',
                'type': 'Ascii'
            },
            22: {
                'name': 'GPSDestLongitude',
                'type': 'Rational'
            },
            23: {
                'name': 'GPSDestBearingRef',
                'type': 'Ascii'
            },
            24: {
                'name': 'GPSDestBearing',
                'type': 'Rational'
            },
            25: {
                'name': 'GPSDestDistanceRef',
                'type': 'Ascii'
            },
            26: {
                'name': 'GPSDestDistance',
                'type': 'Rational'
            },
            27: {
                'name': 'GPSProcessingMethod',
                'type': 'Undefined'
            },
            28: {
                'name': 'GPSAreaInformation',
                'type': 'Undefined'
            },
            29: {
                'name': 'GPSDateStamp',
                'type': 'Ascii'
            },
            30: {
                'name': 'GPSDifferential',
                'type': 'Short'
            },
            31: {
                'name': 'GPSHPositioningError',
                'type': 'Rational'
            }
        },
        'Interop': {
            1: {
                'name': 'InteroperabilityIndex',
                'type': 'Ascii'
            }
        },
    };
    TAGS["0th"] = TAGS["Image"];
    TAGS["1st"] = TAGS["Image"];
    that.TAGS = TAGS;


    that.ImageIFD = {
        ProcessingSoftware:11,
        NewSubfileType:254,
        SubfileType:255,
        ImageWidth:256,
        ImageLength:257,
        BitsPerSample:258,
        Compression:259,
        PhotometricInterpretation:262,
        Threshholding:263,
        CellWidth:264,
        CellLength:265,
        FillOrder:266,
        DocumentName:269,
        ImageDescription:270,
        Make:271,
        Model:272,
        StripOffsets:273,
        Orientation:274,
        SamplesPerPixel:277,
        RowsPerStrip:278,
        StripByteCounts:279,
        XResolution:282,
        YResolution:283,
        PlanarConfiguration:284,
        GrayResponseUnit:290,
        GrayResponseCurve:291,
        T4Options:292,
        T6Options:293,
        ResolutionUnit:296,
        TransferFunction:301,
        Software:305,
        DateTime:306,
        Artist:315,
        HostComputer:316,
        Predictor:317,
        WhitePoint:318,
        PrimaryChromaticities:319,
        ColorMap:320,
        HalftoneHints:321,
        TileWidth:322,
        TileLength:323,
        TileOffsets:324,
        TileByteCounts:325,
        SubIFDs:330,
        InkSet:332,
        InkNames:333,
        NumberOfInks:334,
        DotRange:336,
        TargetPrinter:337,
        ExtraSamples:338,
        SampleFormat:339,
        SMinSampleValue:340,
        SMaxSampleValue:341,
        TransferRange:342,
        ClipPath:343,
        XClipPathUnits:344,
        YClipPathUnits:345,
        Indexed:346,
        JPEGTables:347,
        OPIProxy:351,
        JPEGProc:512,
        JPEGInterchangeFormat:513,
        JPEGInterchangeFormatLength:514,
        JPEGRestartInterval:515,
        JPEGLosslessPredictors:517,
        JPEGPointTransforms:518,
        JPEGQTables:519,
        JPEGDCTables:520,
        JPEGACTables:521,
        YCbCrCoefficients:529,
        YCbCrSubSampling:530,
        YCbCrPositioning:531,
        ReferenceBlackWhite:532,
        XMLPacket:700,
        Rating:18246,
        RatingPercent:18249,
        ImageID:32781,
        CFARepeatPatternDim:33421,
        CFAPattern:33422,
        BatteryLevel:33423,
        Copyright:33432,
        ExposureTime:33434,
        ImageResources:34377,
        ExifTag:34665,
        InterColorProfile:34675,
        GPSTag:34853,
        Interlace:34857,
        TimeZoneOffset:34858,
        SelfTimerMode:34859,
        FlashEnergy:37387,
        SpatialFrequencyResponse:37388,
        Noise:37389,
        FocalPlaneXResolution:37390,
        FocalPlaneYResolution:37391,
        FocalPlaneResolutionUnit:37392,
        ImageNumber:37393,
        SecurityClassification:37394,
        ImageHistory:37395,
        ExposureIndex:37397,
        TIFFEPStandardID:37398,
        SensingMethod:37399,
        XPTitle:40091,
        XPComment:40092,
        XPAuthor:40093,
        XPKeywords:40094,
        XPSubject:40095,
        PrintImageMatching:50341,
        DNGVersion:50706,
        DNGBackwardVersion:50707,
        UniqueCameraModel:50708,
        LocalizedCameraModel:50709,
        CFAPlaneColor:50710,
        CFALayout:50711,
        LinearizationTable:50712,
        BlackLevelRepeatDim:50713,
        BlackLevel:50714,
        BlackLevelDeltaH:50715,
        BlackLevelDeltaV:50716,
        WhiteLevel:50717,
        DefaultScale:50718,
        DefaultCropOrigin:50719,
        DefaultCropSize:50720,
        ColorMatrix1:50721,
        ColorMatrix2:50722,
        CameraCalibration1:50723,
        CameraCalibration2:50724,
        ReductionMatrix1:50725,
        ReductionMatrix2:50726,
        AnalogBalance:50727,
        AsShotNeutral:50728,
        AsShotWhiteXY:50729,
        BaselineExposure:50730,
        BaselineNoise:50731,
        BaselineSharpness:50732,
        BayerGreenSplit:50733,
        LinearResponseLimit:50734,
        CameraSerialNumber:50735,
        LensInfo:50736,
        ChromaBlurRadius:50737,
        AntiAliasStrength:50738,
        ShadowScale:50739,
        DNGPrivateData:50740,
        MakerNoteSafety:50741,
        CalibrationIlluminant1:50778,
        CalibrationIlluminant2:50779,
        BestQualityScale:50780,
        RawDataUniqueID:50781,
        OriginalRawFileName:50827,
        OriginalRawFileData:50828,
        ActiveArea:50829,
        MaskedAreas:50830,
        AsShotICCProfile:50831,
        AsShotPreProfileMatrix:50832,
        CurrentICCProfile:50833,
        CurrentPreProfileMatrix:50834,
        ColorimetricReference:50879,
        CameraCalibrationSignature:50931,
        ProfileCalibrationSignature:50932,
        AsShotProfileName:50934,
        NoiseReductionApplied:50935,
        ProfileName:50936,
        ProfileHueSatMapDims:50937,
        ProfileHueSatMapData1:50938,
        ProfileHueSatMapData2:50939,
        ProfileToneCurve:50940,
        ProfileEmbedPolicy:50941,
        ProfileCopyright:50942,
        ForwardMatrix1:50964,
        ForwardMatrix2:50965,
        PreviewApplicationName:50966,
        PreviewApplicationVersion:50967,
        PreviewSettingsName:50968,
        PreviewSettingsDigest:50969,
        PreviewColorSpace:50970,
        PreviewDateTime:50971,
        RawImageDigest:50972,
        OriginalRawFileDigest:50973,
        SubTileBlockSize:50974,
        RowInterleaveFactor:50975,
        ProfileLookTableDims:50981,
        ProfileLookTableData:50982,
        OpcodeList1:51008,
        OpcodeList2:51009,
        OpcodeList3:51022,
        NoiseProfile:51041,
    };


    that.ExifIFD = {
        ExposureTime:33434,
        FNumber:33437,
        ExposureProgram:34850,
        SpectralSensitivity:34852,
        ISOSpeedRatings:34855,
        OECF:34856,
        SensitivityType:34864,
        StandardOutputSensitivity:34865,
        RecommendedExposureIndex:34866,
        ISOSpeed:34867,
        ISOSpeedLatitudeyyy:34868,
        ISOSpeedLatitudezzz:34869,
        ExifVersion:36864,
        DateTimeOriginal:36867,
        DateTimeDigitized:36868,
        ComponentsConfiguration:37121,
        CompressedBitsPerPixel:37122,
        ShutterSpeedValue:37377,
        ApertureValue:37378,
        BrightnessValue:37379,
        ExposureBiasValue:37380,
        MaxApertureValue:37381,
        SubjectDistance:37382,
        MeteringMode:37383,
        LightSource:37384,
        Flash:37385,
        FocalLength:37386,
        SubjectArea:37396,
        MakerNote:37500,
        UserComment:37510,
        SubSecTime:37520,
        SubSecTimeOriginal:37521,
        SubSecTimeDigitized:37522,
        FlashpixVersion:40960,
        ColorSpace:40961,
        PixelXDimension:40962,
        PixelYDimension:40963,
        RelatedSoundFile:40964,
        InteroperabilityTag:40965,
        FlashEnergy:41483,
        SpatialFrequencyResponse:41484,
        FocalPlaneXResolution:41486,
        FocalPlaneYResolution:41487,
        FocalPlaneResolutionUnit:41488,
        SubjectLocation:41492,
        ExposureIndex:41493,
        SensingMethod:41495,
        FileSource:41728,
        SceneType:41729,
        CFAPattern:41730,
        CustomRendered:41985,
        ExposureMode:41986,
        WhiteBalance:41987,
        DigitalZoomRatio:41988,
        FocalLengthIn35mmFilm:41989,
        SceneCaptureType:41990,
        GainControl:41991,
        Contrast:41992,
        Saturation:41993,
        Sharpness:41994,
        DeviceSettingDescription:41995,
        SubjectDistanceRange:41996,
        ImageUniqueID:42016,
        CameraOwnerName:42032,
        BodySerialNumber:42033,
        LensSpecification:42034,
        LensMake:42035,
        LensModel:42036,
        LensSerialNumber:42037,
        Gamma:42240,
    };


    that.GPSIFD = {
        GPSVersionID:0,
        GPSLatitudeRef:1,
        GPSLatitude:2,
        GPSLongitudeRef:3,
        GPSLongitude:4,
        GPSAltitudeRef:5,
        GPSAltitude:6,
        GPSTimeStamp:7,
        GPSSatellites:8,
        GPSStatus:9,
        GPSMeasureMode:10,
        GPSDOP:11,
        GPSSpeedRef:12,
        GPSSpeed:13,
        GPSTrackRef:14,
        GPSTrack:15,
        GPSImgDirectionRef:16,
        GPSImgDirection:17,
        GPSMapDatum:18,
        GPSDestLatitudeRef:19,
        GPSDestLatitude:20,
        GPSDestLongitudeRef:21,
        GPSDestLongitude:22,
        GPSDestBearingRef:23,
        GPSDestBearing:24,
        GPSDestDistanceRef:25,
        GPSDestDistance:26,
        GPSProcessingMethod:27,
        GPSAreaInformation:28,
        GPSDateStamp:29,
        GPSDifferential:30,
        GPSHPositioningError:31,
    };


    that.InteropIFD = {
        InteroperabilityIndex:1,
    };

    that.GPSHelper = {
        degToDmsRational:function (degFloat) {
            var degAbs = Math.abs(degFloat);
            var minFloat = degAbs % 1 * 60;
            var secFloat = minFloat % 1 * 60;
            var deg = Math.floor(degAbs);
            var min = Math.floor(minFloat);
            var sec = Math.round(secFloat * 100);

            return [[deg, 1], [min, 1], [sec, 100]];
        },

        dmsRationalToDeg:function (dmsArray, ref) {
            var sign = (ref === 'S' || ref === 'W') ? -1.0 : 1.0;
            var deg = dmsArray[0][0] / dmsArray[0][1] +
                      dmsArray[1][0] / dmsArray[1][1] / 60.0 +
                      dmsArray[2][0] / dmsArray[2][1] / 3600.0;

            return deg * sign;
        }
    };


    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = that;
        }
        exports.piexif = that;
    } else {
        window.piexif = that;
    }

})();

(function(exports) {
  var _currentOptions = null;
  var uaInfo;
  var gps;

  uaInfo = UAParser(navigator.userAgent);

  exports.imageProcessorOnError = function(event) {
    log("imageProcessorOnError " + JSON.stringify(event));
    if (DeviceInfo.isShowNativeCamera() === false) {
      setTimeout(processImage, 250);
    }
  }

  exports.imageProcessorOnSuccess = function(event) {
    if (_currentOptions === null)
      return;

    var currentFrame = event.data.frame;

    if (event.data.logs != null && event.data.logs.length > 0) {
      event.data.logs.forEach(function(logEntry) {
        log(logEntry);
      });
    }

    _currentOptions.data.result.toProcess.shift();
    _currentOptions.data.result.processed.push(currentFrame);

    if (_currentOptions.data.result.processed.length > 10) {
      _currentOptions.data.result.processed.shift();
    }

    if (_currentOptions.data.configuration.processingPaused === false) {
      if (_currentOptions.data.configuration.captureType === "Document") {
        if (DeviceInfo.isShowNativeCamera() === false) {
          if (_currentOptions.data.configuration.captureSubType === "Front") {
            processDocumentFrontEvent();
          } else if (_currentOptions.data.configuration.captureSubType === "Back") {
            processDocumentBackEvent();
          }
        } else {
          selectDocument();
        }
      } else if (_currentOptions.data.configuration.captureType === "Selfie") {
        if (DeviceInfo.isShowNativeCamera() === false) {
          if (_currentOptions.data.configuration.captureSubType === "Near") {
            processSelfieNearEvent();
          } else if (_currentOptions.data.configuration.captureSubType === "Far") {
            processSelfieFarEvent();
          }
        } else {
          selectSelfie();
        }
      }
    }

    if (DeviceInfo.isShowNativeCamera() === false && _currentOptions != null) {
      setTimeout(function(event) {
        processImage();
      }, 200);
    }
  }

  exports.setupDocumentCamera = function(docSettings, callback) {
    // Options
    _currentOptions = {
      data: {
        configuration: {
          nativeFrontFocusThreshold: docSettings.nativeFrontFocusThreshold == null ? 0 : parseFloat(docSettings.nativeFrontFocusThreshold),
          nativeBackFocusThreshold: docSettings.nativeBackFocusThreshold == null ? 0 : parseFloat(docSettings.nativeBackFocusThreshold),
          nativeFrontGlareThreshold: docSettings.nativeFrontFocusThreshold == null ? 0 : parseFloat(docSettings.nativeFrontFocusThreshold),
          nativeBackGlareThreshold: docSettings.nativeFrontFocusThreshold == null ? 0 : parseFloat(docSettings.nativeFrontFocusThreshold),
          captureMode: docSettings.captureMode,
          documentType: docSettings.documentType,
          captureType: "Document",
          captureSubType: docSettings.documentSide,
          frontFocusThreshold: docSettings.frontFocusThreshold == null ? 0 : parseFloat(docSettings.frontFocusThreshold),
          backFocusThreshold: docSettings.backFocusThreshold == null ? 0 : parseFloat(docSettings.backFocusThreshold),
          frontGlareThreshold: docSettings.frontGlareThreshold == null ? 0 : parseFloat(docSettings.frontGlareThreshold),
          backGlareThreshold: docSettings.backGlareThreshold == null ? 0 : parseFloat(docSettings.backGlareThreshold),
          frontCaptureAttempts: docSettings.frontCaptureAttempts == null ? 0 : parseInt(docSettings.frontCaptureAttempts),
          backCaptureAttempts: docSettings.backCaptureAttempts == null ? 0 : parseInt(docSettings.backCaptureAttempts),
          setManualTimeout: docSettings.setManualTimeout == null ? 15 : parseInt(docSettings.setManualTimeout),
          showCaptureModeText: docSettings.showCaptureModeText == null ? false : docSettings.showCaptureModeText,
          overlayTextAuto: docSettings.overlayTextAuto == null ? "Align ID within box and Hold" : docSettings.overlayTextAuto,
          overlayTextManual: docSettings.overlayText == null ? "" : docSettings.overlayText,
          overlayTextManualADA: docSettings.overlayTextManualADA == null ? "Align ID and click when you hear notification" : docSettings.overlayTextManualADA,
          overlayTextAutoADA: docSettings.overlayTextAutoADA == null ? "Align ID and hold till you hear notification" : docSettings.overlayTextAutoADA,
          overlayColor: docSettings.overlayColor = null ? "yellow" : docSettings.overlayColor,
          goodImageFoundADA: docSettings.goodImageFoundADA == null ? "Good Image Found, Double Tap to capture image" : docSettings.goodImageFoundADA,
          notGoodImageADA: docSettings.notGoodImageADA == null ? "Captured image is not good" : docSettings.notGoodImageADA,
          notificationADA: docSettings.notificationADA == null ? "Valid image selected" : docSettings.notificationADA,
          focusModeToggleTimeout: docSettings.focusModeToggleTimeout == null ? 5 : parseFloat(docSettings.focusModeToggleTimeout),
          nativeCameraFocusMultiplier: docSettings.nativeCameraFocusMultiplier == null ? 9 : parseFloat(docSettings.nativeCameraFocusMultiplier),
          passportFaceDetectionProportionMin: docSettings.passportFaceDetectionProportionMin == null ? 1 : parseFloat(docSettings.passportFaceDetectionProportionMin),
          passportFaceDetectionProportionMax: docSettings.passportFaceDetectionProportionMax == null ? 4 : parseFloat(docSettings.passportFaceDetectionProportionMax),
          licenseFaceDetectionProportionMin: docSettings.licenseFaceDetectionProportionMin == null ? 1.8 : parseFloat(docSettings.licenseFaceDetectionProportionMin),
          licenseFaceDetectionProportionMax: docSettings.licenseFaceDetectionProportionMax == null ? 7 : parseFloat(docSettings.licenseFaceDetectionProportionMax),
          captureStartTime: new Date().getTime(),
          refocusing: false,
          processingPaused: false,
          debug: isLoggable(),
          headerSize: 72,
          footerSize: 72,
          borderSize: 5,
          borderWidth: 5,
          cancelButtonPaddingSize: 20
        },
        result: {
          unsuccessfulEventCount: 0,
          captureTime: new Date().getTime(),
          focusValue: 0,
          glareValue: 0,
          faceDetectionValue: false,
          autoModeStartTime: null,
          eventCount: 1,
          toProcess: [],
          processed: []
        }
      },
      callback: callback
    }

    if (docSettings.documentSide === "Front") {
      _currentOptions.data.configuration.enableFaceDetection = docSettings.enableFaceDetection === null ? true : docSettings.enableFaceDetection;
      _currentOptions.data.configuration.autoCaptureCheckNFrames = docSettings.autoCaptureCheckNFrames == null ? 3 : parseFloat(docSettings.autoCaptureCheckNFrames);
      _currentOptions.data.configuration.enableLocationDetection = docSettings.enableLocationDetection === null ? false : docSettings.enableLocationDetection;
    } else {
      _currentOptions.data.configuration.enableBarcodeDetection = docSettings.isBarcodeDetectedEnabled === null ? true : docSettings.isBarcodeDetectedEnabled;
      if (_currentOptions.data.configuration.enableBarcodeDetection) {
        _currentOptions.data.configuration.autoCaptureCheckNFrames = docSettings.autoCaptureCheckNFrames == null ? 1 : parseFloat(docSettings.autoCaptureCheckNFrames);
      } else {
        _currentOptions.data.configuration.autoCaptureCheckNFrames = docSettings.autoCaptureCheckNFrames == null ? 3 : parseFloat(docSettings.autoCaptureCheckNFrames);
      }
      _currentOptions.data.configuration.enableLocationDetection = docSettings.enableLocationDetection === null ? false : docSettings.enableLocationDetection;
    }

    if (callback != null) {
      callback.continueFunction = function() {
        if (DeviceInfo.isShowNativeCamera() === false) {
          _currentOptions.data.configuration.processingPaused = false;

          jQuery("#aidDivDocumentCamera #aidOverlayMessage").text((_currentOptions.data.configuration.captureMode === "Manual" ? _currentOptions.data.configuration.overlayTextManualADA : _currentOptions.data.configuration.overlayTextAutoADA));

          jQuery("#aidDivDocumentCamera").one('click', function() {
            selectDocument();
          });
        } else {
          renderNativeDocumentCapture();
        }
      };
    }

    if (_currentOptions.data.configuration.enableLocationDetection) {
      navigator.geolocation.getCurrentPosition(function(data) {
        log("User Agent " + JSON.stringify(uaInfo));
        log("Orientation " + deviceOrientation())
        log("GPS Info " + JSON.stringify(data.coords));

        gps = data;
      }, function(error) {
        gps = null;
        log("User Agent " + JSON.stringify(uaInfo));
        log("Orientation " + deviceOrientation())
        log("GPS Info Failed to retrieve " + error.message);
      });
    }

    if (DeviceInfo.isShowNativeCamera()) {
      renderNativeDocumentCapture();
    } else {
      videoConstraints('environment').then(function(constraints) {
        setupVideoStream(constraints).then(function(stream) {
          renderDocumentCapture();

          jQuery("#aidDivDocumentCamera #aidDocumentCamera").get(0).srcObject = stream.stream;

          setTimeout(function() {
            processImage();
          }, 200);
        }, function(error) {
          if (error.message != "") {
            stopWebCam();
            jQuery("#aidDivDocumentCamera").remove();
            _currentOptions.callback.abort({
              "errorType": "camera-permission",
              'error': error
            });
          }
        });
      }, function(error) {
      });
    }
  }

  exports.setupSelfieCapture = function(selfieSettings, callback) {
    // Options
    _currentOptions = {
      data: {
        configuration: {
          captureMode: selfieSettings.captureMode,
          captureType: "Selfie",
          captureSubType: selfieSettings.enableFarSelfie ? "Far" : "Near",
          captureAttempts: selfieSettings.captureAttempts == null ? 0 : parseInt(selfieSettings.captureAttempts),
          enableFaceDetection: selfieSettings.enableFaceDetection == null ? true : selfieSettings.enableFaceDetection,
          enableLocationDetection: selfieSettings.enableLocationDetection === null ? false : selfieSettings.enableLocationDetection,
          setManualTimeout: selfieSettings.setManualTimeout == null ? 15 : parseInt(selfieSettings.setManualTimeout),
          showCaptureModeText: selfieSettings.showCaptureModeText == null ? false : selfieSettings.showCaptureModeText,
          overlayTextAuto: selfieSettings.overlayTextAuto == null ? "Align Face and Hold" : selfieSettings.overlayTextAuto,
          overlayTextManual: selfieSettings.overlayText == null ? "Align Face and Hold" : selfieSettings.overlayText,
          overlayTextManualADA: selfieSettings.overlayTextManualADA == null ? "Align ID and click when you hear notification" : selfieSettings.overlayTextManualADA,
          overlayTextAutoADA: selfieSettings.overlayTextAutoADA == null ? "Align ID and hold till you hear notification" : selfieSettings.overlayTextAutoADA,
          overlayColor: selfieSettings.overlayColor == null ? "yellow" : selfieSettings.overlayColor,
          orientationErrorText: selfieSettings.orientationErrorText == null ? "Landscape orientation is not supported. Kindly rotate your device to Portrait orientation." : selfieSettings.orientationErrorText,
          useBackCamera: selfieSettings.useBackCamera == null ? false : selfieSettings.useBackCamera,
          goodImageFoundADA: selfieSettings.goodImageFoundADA == null ? "Good Image Found" : selfieSettings.goodImageFoundADA,
          notGoodImageADA: selfieSettings.notGoodImageADA == null ? "Captured Image is not good" : selfieSettings.notGoodImageADA,
          notificationADA: selfieSettings.notificationADA == null ? "Valid image selected" : selfieSettings.notificationADA,
          captureStartTime: new Date().getTime(),
          focusModeToggleTimeout: selfieSettings.focusModeToggleTimeout == null ? 5 : parseFloat(selfieSettings.focusModeToggleTimeout),
          refocusing: false,
          processingPaused: false,
          debug: isLoggable(),
          headerSize: 20,
          messageSize: 48,
          borderSize: 5,
          borderWidth: 5,
          cancelButtonPaddingSize: 20
        },
        result: {
          unsuccessfulEventCount: 0,
          captureTime: new Date().getTime(),
          faceDetectionValue: false,
          autoModeStartTime: null,
          eventCount: 1,
          toProcess: [],
          processed: []
        }
      },
      callback: callback
    };

    if (_currentOptions.data.configuration.captureSubType === "Far") {
      _currentOptions.data.configuration.farSelfieFaceDetectionProportionMin = selfieSettings.farSelfieFaceDetectionProportionMin == null ? 30 : parseFloat(selfieSettings.farSelfieFaceDetectionProportionMin);
      _currentOptions.data.configuration.farSelfieFaceDetectionProportionMax = selfieSettings.farSelfieFaceDetectionProportionMax == null ? 60 : parseFloat(selfieSettings.farSelfieFaceDetectionProportionMax);
      _currentOptions.data.configuration.autoCaptureCheckNFrames = selfieSettings.autoCaptureCheckNFrames == null ? 3 : parseFloat(selfieSettings.autoCaptureCheckNFrames);
    } else {
      _currentOptions.data.configuration.nearSelfieFaceDetectionProportionMin = selfieSettings.nearSelfieFaceDetectionProportionMin == null ? 30 : parseFloat(selfieSettings.nearSelfieFaceDetectionProportionMin);
      _currentOptions.data.configuration.nearSelfieFaceDetectionProportionMax = selfieSettings.nearSelfieFaceDetectionProportionMax == null ? 50 : parseFloat(selfieSettings.nearSelfieFaceDetectionProportionMax);
      _currentOptions.data.configuration.autoCaptureCheckNFrames = selfieSettings.autoCaptureCheckNFrames == null ? 3 : parseFloat(selfieSettings.autoCaptureCheckNFrames);
    }

    if (callback != null) {
      _currentOptions.callback.continueFunction = function() {
        if (DeviceInfo.isShowNativeCamera() === false) {
          _currentOptions.data.configuration.processingPaused = false;

          jQuery("#aidDivDocumentCamera #aidOverlayMessage").text((_currentOptions.data.configuration.captureMode === "Manual" ? _currentOptions.data.configuration.overlayTextManualADA : _currentOptions.data.configuration.overlayTextAutoADA));

          jQuery("#aidDivDocumentCamera #aidBtnCapture").one('click', function() {
            selectSelfie();
          });
        } else {
          renderNativeSelfieCapture();
        }
      };
    }

    if (_currentOptions.data.configuration.enableLocationDetection) {
      navigator.geolocation.getCurrentPosition(function(data) {
        log("User Agent " + JSON.stringify(uaInfo));
        log("Orientation " + deviceOrientation())
        log("GPS Info " + JSON.stringify(data.coords));

        gps = data;
      }, function(error) {
        gps = null;
        log("User Agent " + JSON.stringify(uaInfo));
        log("Orientation " + deviceOrientation())
        log("GPS Info Failed to retrieve " + error.message);
      });
    }

    if (DeviceInfo.isShowNativeCamera()) {
      renderNativeSelfieCapture();
    } else {
      if (isPortrait()) {
        videoConstraints(_currentOptions.data.configuration.useBackCamera ? 'environment' : 'user').then(function(constraints) {
          setupVideoStream(constraints).then(function(stream) {
            renderSelfieCapture();

            jQuery("#aidDivDocumentCamera #aidDocumentCamera").get(0).srcObject = stream.stream;

            setTimeout(function() {
              processImage();
            }, 200);
          }, function(error) {
            if (error.message != "") {
              stopWebCam();
              jQuery("#aidDivDocumentCamera").remove();
              _currentOptions.callback.abort({
                errorType: "camera-permission",
                error: error
              });
            }
          });
        }, function() {});
      } else {
        renderSelfieCapture();
      }
    }
  }

  exports.getSDKVersion = function() {
    return getSDKVersion();
  }

  function isLoggable() {
    return (window.captureFrameworkDebug != null);
  }

  function log(msg) {
    if (isLoggable()) {
      if (window.LE) {
        window.LE.log(msg);
      }

      console.log(msg);
    }
  }

  function isIOS() {
    return uaInfo.os.name === "iOS";
  }

  function isAndroid() {
    return uaInfo.os.name === "Android";
  }

  function isWindows() {
    return uaInfo.os.name === "Windows";
  }

  function isSamsung() {
    return uaInfo.device.vendor === "Samsung";
  }

  function isPortrait() {
    return deviceOrientation().startsWith("portrait");
  }

  function isLandscape() {
    return deviceOrientation().startsWith("landscape");
  }

  function isDesktop() {
    return ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) === false;
  }

  function getMql () {
    if (typeof window.matchMedia != 'function') {
      return {};
    }
    return window.matchMedia('(orientation: landscape)');
  }

  function deviceSpecificAspectRatio() {
    var bodyHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var bodyWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (isSamsung()) {
      // return isPortrait() ? (16 / 9) : (9 / 16);
      return 16 / 9;
    } else {
      return 16 / 9;
    }
  }

  function deviceOrientation() {
    var orientationMap = {
        '90': 'landscape-primary',
        '-90': 'landscape-secondary',
        '0': 'portrait-primary',
        '180': 'portrait-secondary'
      };
    var orientation;

    if (typeof window.ScreenOrientation === 'function' &&
      screen.orientation instanceof ScreenOrientation &&
      typeof screen.orientation.addEventListener == 'function' &&
      screen.orientation.onchange === null &&
      typeof screen.orientation.type === 'string') {
      orientation = screen.orientation;
    } else {
      orientation = {
        type: screen.msOrientation || screen.mozOrientation || orientationMap[window.orientation + ''] || (getMql().matches ? 'landscape-primary' : 'portrait-primary')
      }
    }

    return orientation.type;
  }

  function videoConstraints(facingMode) {
    return new Promise(function(resolve, reject) {
      var result;

      if (facingMode === "environment") {
        result = {
          audio: false,
          video: {
            facingMode: facingMode,
            aspectRatio: deviceSpecificAspectRatio(),
            frameRate: {
              max: 30
            },
            width: {
              min: 1280,
              max: 1280
            },
            height: {
              min: 720,
              max: 720
            }
          }
        };
      } else {
        result = {
          audio: false,
          video: {
            facingMode: facingMode,
            frameRate: {
              max: 30
            }
          }
        };
      }

      if (DeviceInfo.deviceId[facingMode] != "") {
        result.video.deviceId = DeviceInfo.deviceId[facingMode];
      }

      resolve(result);
    });
  }

  function focusVideoStream(currentConfig, mediaStream) {
    currentConfig.refocusing = true;

    log("Refocusing");

    var cons = {
      focusMode: "continuous",
      exposureMode: "continous",
      focusDistance: 1
    };

    mediaStream.applyConstraints({
      advanced: [cons]
    }).then(function() {
      log("Refocused Success " + currentConfig.refocusStartTime);
      currentConfig.refocusing = false;
    }, function() {
      log("Refocusing Failed " + currentConfig.refocusStartTime);
      currentConfig.refocusing = false;
    });
  }

  function focusVideoStreamLoop(mediaStream) {
    if (DeviceInfo.isShowNativeCamera()) {
      return;
    }

    if (_currentOptions != null && _currentOptions.data.configuration.captureType === "Document" && _currentOptions.data.result.processed.length > 1) {
      var currentConfig = _currentOptions.data.configuration;
      var currentFrame = _currentOptions.data.result.processed[_currentOptions.data.result.processed.length - 2]

      if (currentConfig.processingPaused === false) {
        if (currentConfig.refocusStartTime + (currentConfig.focusModeToggleTimeout * 1000) <= new Date().getTime() && currentConfig.refocusing == false) {
          if ((currentConfig.captureSubType === "Front" && currentFrame.focus > currentConfig.frontFocusThreshold) ||
            (currentConfig.captureSubType === "Back" && currentFrame.focus > currentConfig.backFocusThreshold)) {
            currentConfig.refocusStartTime = new Date().getTime();
          } else {
            currentConfig.refocusStartTime = new Date().getTime();

            if (mediaStream.getCapabilities != null) {
              var caps = mediaStream.getCapabilities();

              if (caps.focusMode != null && caps.focusMode.includes("continuous")) {
                setTimeout(function() {
                  focusVideoStream(currentConfig, mediaStream);
                }, 500);
              }
            } else {
              log("Refocus device incapable of refocusing");
            }
          }
        }
      }

      setTimeout(function() {
        focusVideoStreamLoop(mediaStream);
      }, 1000);
    } else {
      if (_currentOptions != null) {
        setTimeout(function() {
          focusVideoStreamLoop(mediaStream);
        }, 1000);
      }
    }
  }

  function setupVideoStream(constraints) {
    return new Promise(function(resolve, reject) {
      log("Setting up Video Stream " + JSON.stringify(constraints));

      navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        _currentOptions.data.result.DocumentStream = stream;
        _currentOptions.data.result.MediaStream = stream.getVideoTracks()[0];
        _currentOptions.data.configuration.refocusStartTime = new Date().getTime();

        setTimeout(function() {
          focusVideoStreamLoop(_currentOptions.data.result.MediaStream);
        }, 500);

        resolve({
          stream: stream,
          track: stream.getVideoTracks()[0]
        });
      }, function(error) {
        log(error);
        reject(error);
      });
    });
  }

  jQuery(window).on("resize", function(event) {
    // If we are using Video and not Native Camera Capture
    if (DeviceInfo.isShowNativeCamera() === false) {
      if (_currentOptions !== null) {
      if (jQuery("#aidDivDocumentCamera #aidSetupCamera").length > 0) {
        jQuery("#aidDivDocumentCamera #aidSetupCamera").css("display", "flex");
      }

      setTimeout(function() {
        log("Orientation Changed " + window.innerHeight + "/" + window.innerWidth);

        _currentOptions.data.result.processingPaused = true;

        if (_currentOptions.data.configuration.captureType === "Document") {
          if (jQuery("#aidDivDocumentCamera video").length > 0) {
            stopWebCam();

            videoConstraints('environment').then(function(constraints) {
              setupVideoStream(constraints).then(function(videoStream) {
                renderDocumentCapture();

                jQuery("#aidDivDocumentCamera #aidDocumentCamera").get(0).srcObject = videoStream.stream;
              }, function() {});
            }, function() {});
          }
        } else {
          if (isPortrait()) {
            if (jQuery("#aidDivDocumentCamera video").length > 0) {
              stopWebCam();
            } else {
              jQuery("#aidDivDocumentCamera p").remove();
              jQuery("#aidDivDocumentCamera #aidSetupCamera").css("display", "flex");
            }

            videoConstraints(_currentOptions.data.configuration.useBackCamera ? 'environment' : 'user').then(function(constraints) {
              setupVideoStream(constraints).then(function(videoStream) {
                renderSelfieCapture();

                jQuery("#aidDivDocumentCamera #aidDocumentCamera").get(0).srcObject = videoStream.stream;

                setTimeout(function() {
                  processImage();
                }, 200);
              }, function() {});
            }, function() {});
          } else {
            if (jQuery("#aidDivDocumentCamera video").length > 0) {
              stopWebCam();
            }

            renderSelfieCapture();
          }
        }
      }, 0);
    }
    }
  });

  function renderDocumentCapture() {
    var bodyHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var bodyWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var videoHeight = bodyHeight;
    // var videoWidth = bodyHeight * (isPortrait() ? 9 / 16 : 16 / 9);
    var videoWidth = bodyHeight * (isPortrait() ? (1 / deviceSpecificAspectRatio()) : deviceSpecificAspectRatio());
    var videoCenter = (bodyWidth - videoWidth) / 2;

    jQuery("body").css("overflow", "hidden");

    jQuery("#aidDivDocumentCamera").remove();

    jQuery("body").append("" +
      "<div id='aidDivDocumentCamera' style='display: block; height: 100%; position: fixed; left: 0px; right: 0px; background-color: rgb(0, 0, 0); z-index: 16777000; top: 0px;'>" +
      "  <style>" +
      "    @-webkit-keyframes rotate {" +
      "    from {" +
      "    -webkit-transform: rotate(0deg);" +
      "    }" +
      "    to { " +
      "    -webkit-transform: rotate(360deg);" +
      "    }" +
      "    }" +
      "" +
      "    svg.rotate" +
      "    {" +
      "      -webkit-animation-name:             rotate;" +
      "      -webkit-animation-duration:         0.5s; " +
      "      -webkit-animation-iteration-count:  infinite;" +
      "      -webkit-animation-timing-function: linear;" +
      "    }" +
      "  </style>" +
      "  <span id='aidOverlayMessage' aria-live='assertive' role='alert' style='display: block; position: absolute; bottom: -200px;'>" +
      (_currentOptions.data.configuration.captureMode === "Manual" ? _currentOptions.data.configuration.overlayTextManualADA : _currentOptions.data.configuration.overlayTextAutoADA) +
      "  </span>" +
      "  <div id='aidSetupCamera' aria-hidden='true' style='display: flex;flex-direction: row;justify-content: center;align-items: center;background: black;color: white;height: 100%;width: 100%;position: fixed;top: 0px;left: 0px;right: 0px;z-index: 16776999;'>" +
      "Setting up Camera" +
      "  </div>" +
      "  <div style='z-index: 16776998;'>" +
      "    <video id='aidDocumentCamera' autoplay='' muted='' playsinline='true' style='position: fixed; border: 0px; top: 0px; height: " + videoHeight + "px; width: " + videoWidth + "px; left: " + videoCenter + "px;'>" +
      "    </video>" +
      "    <canvas id='aidCroppedImage' style='display: none'></canvas>" +
      "    <canvas id='aidScaledImage' style='display: none'></canvas>" +
      "    <div id='aidCaptureArea'>" +
      "      <div id='aidHeader' role='button' aria-label='Selection'>" +
      "        <div id='aidInfoHidden' aria-hidden='true'>" +
      (_currentOptions.data.configuration.debug ? (
        "          <div id='aidFocusValue' style='color:red; padding-right: 10px;'>Focus : 0</div>" +
        "          <div id='aidGlareValue' style='color:red; padding-right: 10px;'>Glare : 0</div>" +
        "          <div id='aidDetectionValue' style='color:red; padding-right: 10px'>" +
        (_currentOptions.data.configuration.captureSubType === 'Front' ? ' Face : No' : ' Barcode : No') +
        "          </div>"
      ) : "") +
      "        </div>" +
      "        <div id='aidAutoMode' aria-hidden='true'>" +
      (_currentOptions.data.configuration.showCaptureModeText ? (_currentOptions.data.configuration.captureMode === "Auto" ? "Auto" : "Manual") : "") +
      "        </div>" +
      "      </div>" +
      "      <div id='aidVideoContent' role='button' aria-label='Selection'>" +
      "        <div id='aidVideoContentBorderBackground'>" +
      "        </div>" +
      "        <div id='aidVideoContentBorder' class='statusColoring'>" +
      "          <div id='aidPassportLine' class='statusColoring'>" +
      "          </div>" +
      "          <div id='aidVisibleMessageLine' aria-hidden='true'>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "      <div id='aidFooter'>" +
      "        <div id='aidBtnCancelCapture' role='button' aria-label='Cancel'>" +
      "          <svg width='32px' height='32px' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>" +
      "            <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' stroke-linecap='square'>" +
      "              <path d='M28.5,3.5 L3.5,28.5' id='Line' stroke='#FFFFFF' stroke-width='3'></path>" +
      "              <path d='M3.5,3.5 L28.5,28.5' id='Line' stroke='#FFFFFF' stroke-width='3'></path>" +
      "            </g>" +
      "          </svg>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "    <div id='aidBtnCaptureDocLoading' style='display: none; bottom: 0%;'>" +
      "      <svg class='rotate' version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 213.333 213.333' style='enable-background:new 0 0 213.333 213.333;' xml:space='preserve'>" +
      "        <path style='fill: #2D50A7;' d='M203.636,101.818h-38.788c-5.355,0-9.697,4.342-9.697,9.697s4.342,9.697,9.697,9.697h38.788c5.355,0,9.697-4.342,9.697-9.697S208.992,101.818,203.636,101.818z'/>" +
      "        <path style='fill: #73A1FB;' d='M48.485,101.818H9.697c-5.355,0-9.697,4.342-9.697,9.697s4.342,9.697,9.697,9.697h38.788c5.355,0,9.697-4.342,9.697-9.697S53.84,101.818,48.485,101.818z'/>" +
      "        <path style='fill: #355EC9;' d='M168.378,36.09l-27.428,27.428c-3.787,3.786-3.787,9.926,0,13.713c1.893,1.894,4.375,2.841,6.856,2.841c2.482,0,4.964-0.946,6.857-2.841l27.428-27.428c3.787-3.786,3.787-9.926,0-13.713C178.305,32.303,172.165,32.303,168.378,36.09z'/>" +
      "        <path style='fill: #C4D9FD;' d='M106.667,169.697c-5.355,0-9.697,4.342-9.697,9.697v19.394c0,5.355,4.342,9.697,9.697,9.697c5.355,0,9.697-4.342,9.697-9.697v-19.394C116.364,174.039,112.022,169.697,106.667,169.697z'/>" +
      "        <path style='fill: #C4D9FD;' d='M58.669,145.799l-27.427,27.428c-3.787,3.787-3.787,9.926,0,13.713c1.893,1.893,4.375,2.84,6.857,2.84c2.482,0,4.964-0.947,6.856-2.84l27.427-27.428c3.787-3.787,3.787-9.926,0-13.713C68.596,142.012,62.456,142.012,58.669,145.799z'/>" +
      "        <path style='fill: #3D6DEB;' d='M106.667,4.848c-5.355,0-9.697,4.342-9.697,9.697v38.788c0,5.355,4.342,9.697,9.697,9.697c5.355,0,9.697-4.342,9.697-9.697V14.545C116.364,9.19,112.022,4.848,106.667,4.848z'/>" +
      "        <path style='fill: #5286FA;' d='M44.956,36.09c-3.786-3.787-9.926-3.787-13.713,0c-3.787,3.787-3.787,9.926,0,13.713l27.427,27.428c1.893,1.894,4.375,2.841,6.857,2.841c2.481,0,4.964-0.947,6.856-2.841c3.787-3.786,3.787-9.926,0-13.713L44.956,36.09z'/>" +
      "      </svg>" +
      "    </div>" +
      "  </div>" +
      "</div>");
    jQuery("body").scrollTop(0);

    setTimeout(function() {
      renderDocumentCaptureLayout();
    }, 100);
  }

  function renderNativeDocumentCapture() {
    jQuery("body").css("overflow", "hidden");
    jQuery("#aidDivDocumentCamera").remove();
    jQuery("body").append("" +
      "<div id='aidDivDocumentCamera' style='display: block; height: 100%; position: fixed; left: 0px; right: 0px; background-color: rgb(0, 0, 0); z-index: 16777000; top: 0px;'>" +
      "  <style>" +
      "    @-webkit-keyframes rotate {" +
      "    from {" +
      "    -webkit-transform: rotate(0deg);" +
      "    }" +
      "    to { " +
      "    -webkit-transform: rotate(360deg);" +
      "    }" +
      "    }" +
      "" +
      "    svg.rotate" +
      "    {" +
      "      -webkit-animation-name:             rotate;" +
      "      -webkit-animation-duration:         0.5s; " +
      "      -webkit-animation-iteration-count:  infinite;" +
      "      -webkit-animation-timing-function: linear;" +
      "    }" +
      "  </style>" +
      "  <input id='aidCameraInput' style='display: block' type='file' capture='environment' accept='image/*'>" +
      "  </input>" +
      "  <img id='aidImageContainer' style='display: none; position: absolute; top: 0px; left: 0px'>" +
      "  </img>" +
      "  <canvas id='aidScaledImage' style='display: none'>" +
      "  </canvas>" +
      "  <canvas id='aidCanvas1' style='display: none'>" +
      "  </canvas>" +
      "  <canvas id='aidCanvas2' style='display: none'>" +
      "  </canvas>" +
      "  <div id='aidLoadingIcon' style='display: none; top: 0px;left: 0px;width: 100%;height: 100%;'>" +
      "    <div id='aidLoadingIconDiv' style='display: block; top: calc(50% - 25px);width: 50px;height: 50px;position: absolute;left: calc(50% - 25px);'>" +
      "      <svg class='rotate' version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 213.333 213.333' style='enable-background:new 0 0 213.333 213.333;' xml:space='preserve'>" +
      "        <path style='fill: #2D50A7;' d='M203.636,101.818h-38.788c-5.355,0-9.697,4.342-9.697,9.697s4.342,9.697,9.697,9.697h38.788c5.355,0,9.697-4.342,9.697-9.697S208.992,101.818,203.636,101.818z'/>" +
      "        <path style='fill: #73A1FB;' d='M48.485,101.818H9.697c-5.355,0-9.697,4.342-9.697,9.697s4.342,9.697,9.697,9.697h38.788c5.355,0,9.697-4.342,9.697-9.697S53.84,101.818,48.485,101.818z'/>" +
      "        <path style='fill: #355EC9;' d='M168.378,36.09l-27.428,27.428c-3.787,3.786-3.787,9.926,0,13.713c1.893,1.894,4.375,2.841,6.856,2.841c2.482,0,4.964-0.946,6.857-2.841l27.428-27.428c3.787-3.786,3.787-9.926,0-13.713C178.305,32.303,172.165,32.303,168.378,36.09z'/>" +
      "        <path style='fill: #C4D9FD;' d='M106.667,169.697c-5.355,0-9.697,4.342-9.697,9.697v19.394c0,5.355,4.342,9.697,9.697,9.697c5.355,0,9.697-4.342,9.697-9.697v-19.394C116.364,174.039,112.022,169.697,106.667,169.697z'/>" +
      "        <path style='fill: #C4D9FD;' d='M58.669,145.799l-27.427,27.428c-3.787,3.787-3.787,9.926,0,13.713c1.893,1.893,4.375,2.84,6.857,2.84c2.482,0,4.964-0.947,6.856-2.84l27.427-27.428c3.787-3.787,3.787-9.926,0-13.713C68.596,142.012,62.456,142.012,58.669,145.799z'/>" +
      "        <path style='fill: #3D6DEB;' d='M106.667,4.848c-5.355,0-9.697,4.342-9.697,9.697v38.788c0,5.355,4.342,9.697,9.697,9.697c5.355,0,9.697-4.342,9.697-9.697V14.545C116.364,9.19,112.022,4.848,106.667,4.848z'/>" +
      "        <path style='fill: #5286FA;' d='M44.956,36.09c-3.786-3.787-9.926-3.787-13.713,0c-3.787,3.787-3.787,9.926,0,13.713l27.427,27.428c1.893,1.894,4.375,2.841,6.857,2.841c2.481,0,4.964-0.947,6.856-2.841c3.787-3.786,3.787-9.926,0-13.713L44.956,36.09z'/>" +
      "      </svg>" +
      "    </div>" +
      "  </div>" +
      "</div>"
    );

    jQuery("#aidDivDocumentCamera #aidCameraInput").focus();
    jQuery("#aidDivDocumentCamera #aidCameraInput").click();

    setTimeout(function() {
      renderNativeDocumentCaptureLayout(0);
    }, 100);
  }

  function renderSelfieCapture() {
    var bodyHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var bodyWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var isNear = _currentOptions.data.configuration.captureSubType === "Near" ? true : false;
    var videoHeight = bodyHeight * (isNear ? 1 : 1.4);
    var videoWidth = videoHeight * (3 / 4);
    var videoCenterLeft = (bodyWidth - videoWidth) / 2;
    var videoCenterTop = (bodyHeight - videoHeight) / 2;

    jQuery("body").css("overflow", "hidden");

    jQuery("#aidDivDocumentCamera").remove();

    if (isPortrait()) {
      jQuery("body").append("" +
        "<div id='aidDivDocumentCamera' style='display: block; height: 100%; position: fixed; left: 0px; right: 0px; background-color: rgb(0, 0, 0); z-index: 16777000; top: 0px;'>" +
        "  <style>" +
        "    @-webkit-keyframes rotate {" +
        "    from {" +
        "    -webkit-transform: rotate(0deg);" +
        "    }" +
        "    to { " +
        "    -webkit-transform: rotate(360deg);" +
        "    }" +
        "    }" +
        "" +
        "    svg.rotate" +
        "    {" +
        "      -webkit-animation-name:             rotate;" +
        "      -webkit-animation-duration:         0.5s; " +
        "      -webkit-animation-iteration-count:  infinite;" +
        "      -webkit-animation-timing-function: linear;" +
        "    }" +
        "    #aidCaptureArea {" +
        "      *," +
        "      *:before," +
        "      *:after {" +
        "        -webkit-box-sizing: content-box;" +
        "        -moz-box-sizing: content-box;" +
        "        box-sizing: content-box;" +
        "      }" +
        "    }" +
        "  </style>" +
        "  <span id='aidOverlayMessage' aria-live='assertive' role='alert' style='display: block; position: absolute; bottom: -200px;'>" +
        (_currentOptions.data.configuration.captureMode === "Manual" ? _currentOptions.data.configuration.overlayTextManualADA : _currentOptions.data.configuration.overlayTextAutoADA) +
        "  </span>" +
        "  <div id='aidSetupCamera' aria-hidden='true' style='display: flex;flex-direction: row;justify-content: center;align-items: center;background: black;color: white;height: 100%;width: 100%;position: fixed;top: 0px;left: 0px;right: 0px;z-index: 16776999;'>" +
        "Setting up Camera" +
        "  </div>" +
        "  <div style='z-index: 16776998;'>" +
        "    <video id='aidDocumentCamera' autoplay='' muted='' playsinline='true' style='" + (_currentOptions.data.configuration.useBackCamera ? "" : "transform: scaleX(-1) !important;") +
        "position: fixed; border: 0px; " +
        "top: " + videoCenterTop + "px; " +
        "height: " + videoHeight + "px; " +
        "width: " + videoWidth + "px; " +
        "left: " + videoCenterLeft + "px;'>" +
        "    </video>" +
        "    <canvas id='aidCroppedImage' style='display: none'></canvas>" +
        "    <canvas id='aidScaledImage' style='display: none'></canvas>" +
        "    <div id='aidCaptureArea'>" +
        "      <div id='aidHeader' style='width: 100%;height: 20px;background: white;display: flex;flex-direction: row;justify-content: start;align-items: center'>" +
        "        <div id='aidInfoHidden' aria-hidden='true' style='width: 50%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center'>" +
        (_currentOptions.data.configuration.debug ? (
          "          <div id='aidDetectionValue' style='color:red; padding-left: 10px'>" +
          ' Face : No' +
          "          </div>"
        ) : "") +
        "        </div>" +
        "          <div id='aidAutoMode' style='display: flex;flex-direction: row;justify-content: flex-end;align-items: center;width: 100%;'>" +
        (_currentOptions.data.configuration.showCaptureModeText ? (_currentOptions.data.configuration.captureMode === "Auto" ? "Auto" : "Manual") : "") +
        "          </div>" +
        "      </div>" +
        "      <div id='aidVideoContent'>" +
        "        <div id='aidVideoContentBorder'>" +
        "          <canvas id='aidMaskCanvas' style='top: 48px; bottom: calc(20%); left: 0px; right: 0px'></canvas>" +
        "        </div>" +
        "        <div id='aidVisibleMessageLine' aria-hidden='true'>" +
        "        </div>" +
        "      </div>" +
        "      <div id='aidFooter'>" +
        "        <span id='aidPhotoLabel' style='color: #F7C700; text-align: center; font-size: 9px; padding-bottom: 10px'>PHOTO</span>" +
        "        <div id='aidFooterButtons' style='display: flex; flex-direction: row; justify-content: flex-start; align-items: stretch'>" +
        "          <div id='aidBtnCancelCapture' role='button' aria-label='Cancel' style='display: flex;flex-direction: row;justify-content: flex-start;align-items: center;width: 50%; height: 100%'>" +
        "            <span id='aidCancelSpan' style='display: flex; flex-direction: row; align-items: center'>Cancel</span>" +
        "          </div>" +
        "          <div id='aidBtnCapture' role='button' aria-label='Capture' style='display: flex;flex-direction: row;justify-content: flex-start;align-items: center;width: 80px; height: 80px'>" +
        "            <svg width='80px' height='80px' viewBox='0 0 80 80' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>" +
        "              <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>" +
        "                  <circle id='Oval' fill='#FFFFFF' cx='40' cy='40' r='30'></circle>" +
        "                  <circle id='Oval' stroke='#FFFFFF' stroke-width='8' cx='40' cy='40' r='36'></circle>" +
        "              </g>" +
        "            </svg>" +
        "          </div>" +
        "          <div id='aidBtnRotateCamera' style='display: flex;flex-direction: row;justify-content: flex-end;align-items: center;width: 100%; height: 32px'>" +
        "            <svg height='32px' viewBox='0 0 128 98' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>" +
        "              <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>" +
        "                <g transform='translate(64.117312, 48.986933) scale(-1, 1) rotate(-180.000000) translate(-64.117312, -48.986933) translate(0.117312, -0.013067)' fill='#FFFFFF' fill-rule='nonzero'>" +
        "                  <path d='M47.1527495,97.6223733 C45.2079837,97.0970933 43.5108758,96.24776 41.9154379,95.0469333 C40.0449695,93.62136 39.5457434,92.9222933 37.6752749,89.1708533 L36.0537678,85.89504 L23.9576375,85.7696 C10.6140937,85.6193333 11.2371487,85.69512 7.8703055,83.9441867 C5.65050916,82.7694933 2.83242363,79.8438667 1.68537678,77.4931733 C-0.036496945,73.9690933 0.0128880291,75.3437067 0.0128880291,42.8652 C0.0128880291,14.5366667 0.0378004073,13.5370667 0.512260692,11.662 C1.93433809,6.06162667 6.04936864,1.93648 11.6360081,0.510906667 C13.5312424,0.0104533333 14.6039919,0.0104533333 63.8644399,0.0104533333 C113.124888,0.0104533333 114.196334,0.0104533333 116.092872,0.510906667 C121.829409,1.96130667 126.14387,6.46146667 127.341752,12.1376267 C127.890509,14.7378933 127.890509,71.2943467 127.341752,73.8697867 C126.269002,78.99584 122.028839,83.5966133 116.865825,85.2965867 C116.117637,85.54616 112.750794,85.6716 103.771242,85.7722133 L91.675112,85.8976533 L90.0275356,89.2453333 C88.2313646,92.89616 87.1846843,94.22112 84.739389,95.7956533 C83.9416701,96.3209333 82.59389,96.9951733 81.7466395,97.3205333 L80.2007332,97.8954667 L64.3623625,97.94512 C50.9692872,97.9973867 48.3258656,97.9464267 47.1527495,97.6223733 Z M79.7015071,89.4204267 C80.4001629,89.0950667 81.1483503,88.6207467 81.3725458,88.3698667 C81.6215071,88.09416 82.6942566,86.0191733 83.7670061,83.7690933 C85.8864358,79.36824 86.5603259,78.4927733 88.181833,78.04328 C88.8296538,77.8681867 93.4191446,77.76888 101.550143,77.76888 C115.243014,77.76888 115.292546,77.76888 117.164318,76.1682133 C117.68831,75.6925867 118.461263,74.7178133 118.860122,73.9926133 L119.60831,72.6428267 L119.682607,43.53944 C119.756904,10.0848533 119.906802,12.6602933 117.512342,10.23512 C115.06835,7.78512 120.330428,8.00986667 63.8631365,8.00986667 C7.39454175,8.00986667 12.6579226,7.78512 10.2139308,10.23512 C7.81947047,12.6616 7.96936864,10.08616 8.04496945,43.5407467 L8.1192668,72.6441333 L8.86745418,73.99392 C9.26631365,74.71912 10.0392668,75.6938933 10.5632587,76.16952 C12.4337271,77.7701867 12.5093279,77.7701867 26.0523014,77.7701867 C33.5602444,77.7701867 38.7232587,77.8708 39.420611,78.0445867 C40.043666,78.1948533 40.8674542,78.5946933 41.2415479,78.9697067 C41.6404073,79.34472 42.8382892,81.4954933 43.9358045,83.7455733 C45.0333198,86.02048 46.1060692,88.0954667 46.3550305,88.3463467 C46.5792261,88.6207467 47.3521792,89.0963733 48.0260692,89.4217333 L49.2734827,90.0214933 L63.8644399,90.0214933 L78.4553971,90.0214933 L79.7015071,89.4204267 Z'></path>" +
        "                  <path d='M58.6010591,73.39416 C54.6359267,72.6441333 50.3449287,70.7690667 47.2270468,68.4183733 C45.3318126,66.9928 42.0392668,63.5432 40.8674542,61.7426133 C39.3958452,59.51736 37.9985336,56.5172533 37.3011813,54.1417333 C36.5529939,51.5414667 36.5282281,50.9665333 37.1760489,49.5906133 C38.0246029,47.7155467 40.094501,46.89104 42.065336,47.6410667 C43.4874134,48.1663467 44.2603666,49.2156 44.7843585,51.2409333 C46.6052953,58.3661867 52.4161303,63.8672533 59.6998778,65.4430933 C62.3693686,65.9932 66.6342974,65.7684533 69.2281874,64.9178133 C71.6474134,64.14296 74.3416701,62.6677333 75.8380448,61.3179467 L76.9603259,60.2922133 L74.2921385,57.5913333 L71.5978819,54.8904533 L82.6968635,51.9151733 C88.8074949,50.2648533 93.8453768,48.9895467 93.8962118,49.0405067 C93.9457434,49.09016 92.6735642,54.0907733 91.0533605,60.1419467 C89.4331568,66.19312 88.0853768,71.1937333 88.0853768,71.2682133 C88.060611,71.3178667 86.8379633,70.168 85.3663544,68.6927733 L82.6720978,66.0180267 L81.2004888,67.2933333 C78.0826069,69.9432533 74.2165377,71.9189333 70.1015071,73.0191467 C67.3303462,73.7443467 61.4191446,73.9442667 58.6010591,73.39416 Z'></path>" +
        "                  <path d='M85.0639511,41.9649067 C83.8921385,41.1404 83.3681466,40.3394133 82.9445214,38.63944 C82.0216701,35.01344 79.4773116,30.9627733 76.6344603,28.6133867 C72.9678208,25.5884533 69.0769857,24.2125333 64.2385336,24.1877067 C60.7713238,24.1877067 58.4772301,24.68816 55.733442,26.0876 C54.0624033,26.93824 50.8949898,29.13736 50.8949898,29.46272 C50.8949898,29.5633333 52.0915682,30.8373333 53.5631772,32.31256 L56.2065988,34.96248 L55.1090835,35.2630133 C44.2590631,38.2134667 33.8092057,40.964 33.7580312,40.91304 C33.7088391,40.8633867 39.0960489,20.4610933 39.5692057,18.91008 C39.6943381,18.5350667 40.1922607,18.91008 42.412057,21.1353333 L45.0815479,23.8113867 L47.3013442,22.0356267 C59.0989817,12.5348533 76.6826884,14.7339733 85.9112016,26.83632 C89.7016701,31.8369333 91.9214664,38.6381333 90.4003259,40.6882933 C89.5270061,41.8878133 88.3551935,42.5137139 87.0582485,42.5137139 C86.261833,42.5150133 85.638778,42.33992 85.0639511,41.9649067 Z'></path>" +
        "                </g>" +
        "              </g>" +
        "            </svg>" +
        "          </div>" +
        "        </div>" +
        "      </div>" +
        "      <div id='aidDebugEllipse'>" +
        "      </div>" +
        "    </div>" +
        "    <div id='aidBtnCaptureDocLoading' style='display: none; bottom: 0%;'>" +
        "      <svg class='rotate' version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 213.333 213.333' style='enable-background:new 0 0 213.333 213.333;' xml:space='preserve'>" +
        "        <path style='fill: #2D50A7;' d='M203.636,101.818h-38.788c-5.355,0-9.697,4.342-9.697,9.697s4.342,9.697,9.697,9.697h38.788c5.355,0,9.697-4.342,9.697-9.697S208.992,101.818,203.636,101.818z'/>" +
        "        <path style='fill: #73A1FB;' d='M48.485,101.818H9.697c-5.355,0-9.697,4.342-9.697,9.697s4.342,9.697,9.697,9.697h38.788c5.355,0,9.697-4.342,9.697-9.697S53.84,101.818,48.485,101.818z'/>" +
        "        <path style='fill: #355EC9;' d='M168.378,36.09l-27.428,27.428c-3.787,3.786-3.787,9.926,0,13.713c1.893,1.894,4.375,2.841,6.856,2.841c2.482,0,4.964-0.946,6.857-2.841l27.428-27.428c3.787-3.786,3.787-9.926,0-13.713C178.305,32.303,172.165,32.303,168.378,36.09z'/>" +
        "        <path style='fill: #C4D9FD;' d='M106.667,169.697c-5.355,0-9.697,4.342-9.697,9.697v19.394c0,5.355,4.342,9.697,9.697,9.697c5.355,0,9.697-4.342,9.697-9.697v-19.394C116.364,174.039,112.022,169.697,106.667,169.697z'/>" +
        "        <path style='fill: #C4D9FD;' d='M58.669,145.799l-27.427,27.428c-3.787,3.787-3.787,9.926,0,13.713c1.893,1.893,4.375,2.84,6.857,2.84c2.482,0,4.964-0.947,6.856-2.84l27.427-27.428c3.787-3.787,3.787-9.926,0-13.713C68.596,142.012,62.456,142.012,58.669,145.799z'/>" +
        "        <path style='fill: #3D6DEB;' d='M106.667,4.848c-5.355,0-9.697,4.342-9.697,9.697v38.788c0,5.355,4.342,9.697,9.697,9.697c5.355,0,9.697-4.342,9.697-9.697V14.545C116.364,9.19,112.022,4.848,106.667,4.848z'/>" +
        "        <path style='fill: #5286FA;' d='M44.956,36.09c-3.786-3.787-9.926-3.787-13.713,0c-3.787,3.787-3.787,9.926,0,13.713l27.427,27.428c1.893,1.894,4.375,2.841,6.857,2.841c2.481,0,4.964-0.947,6.856-2.841c3.787-3.786,3.787-9.926,0-13.713L44.956,36.09z'/>" +
        "      </svg>" +
        "    </div>" +
        "  </div>" +
        "</div>"
      );

      jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").focus();

      renderSelfieCaptureLayout();
    } else {
      jQuery("body").append("" +
        "<div id='aidDivDocumentCamera' style='display: flex; height: 100%; position: fixed; left: 0px; right: 0px; background-color: rgb(0, 0, 0); z-index: 16777000; top: 0px;flex-direciton: row;justify-content: center; align-items: center'>" +
        "  <div id='aidSetupCamera' aria-hidden='true' style='display: none;flex-direction: row;justify-content: center;align-items: center;background: black;color: white;height: 100%;width: 100%;position: fixed;top: 0px;left: 0px;right: 0px;z-index: 16776999;'>" +
        "Setting up Camera" +
        "  </div>" +
        "  <p style='color: white'>" + _currentOptions.data.configuration.orientationErrorText + "</p>" +
        "</div>"
      );
    }

    jQuery("body").scrollTop(0);

  }

  function renderNativeSelfieCapture() {
    jQuery("body").css("overflow", "hidden");
    jQuery("#aidDivDocumentCamera").remove();
    jQuery("body").append("" +
      "<div id='aidDivDocumentCamera' style='display: block; height: 100%; position: fixed; left: 0px; right: 0px; background-color: rgb(0, 0, 0); z-index: 16777000; top: 0px;'>" +
      "  <style>" +
      "    @-webkit-keyframes rotate {" +
      "    from {" +
      "    -webkit-transform: rotate(0deg);" +
      "    }" +
      "    to { " +
      "    -webkit-transform: rotate(360deg);" +
      "    }" +
      "    }" +
      "" +
      "    svg.rotate" +
      "    {" +
      "      -webkit-animation-name:             rotate;" +
      "      -webkit-animation-duration:         0.5s; " +
      "      -webkit-animation-iteration-count:  infinite;" +
      "      -webkit-animation-timing-function: linear;" +
      "    }" +
      "  </style>" +
      "  <input id='aidCameraInput' style='display: block' type='file' capture='" + (_currentOptions.data.configuration.useBackCamera ? "environment" : "user") + "' accept='image/*'>" +
      "  </input>" +
      "  <img id='aidImageContainer' style='display: none; position: absolute; top: 0px; left: 0px'>" +
      "  </img>" +
      "  <canvas id='aidCanvas1' style='display: none'></canvas>" +
      "  <canvas id='aidCanvas2' style='display: none'></canvas>" +
      "  <canvas id='aidScaledImage' style='display: none'></canvas>" +
      "  <div id='aidLoadingIcon' style='display: none; top: 0px;left: 0px;width: 100%;height: 100%;'>" +
      "    <div id='aidLoadingIconDiv' style='display: block; top: calc(50% - 25px);width: 50px;height: 50px;position: absolute;left: calc(50% - 25px);'>" +
      "      <svg class='rotate' version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 213.333 213.333' style='enable-background:new 0 0 213.333 213.333;' xml:space='preserve'>" +
      "        <path style='fill: #2D50A7;' d='M203.636,101.818h-38.788c-5.355,0-9.697,4.342-9.697,9.697s4.342,9.697,9.697,9.697h38.788c5.355,0,9.697-4.342,9.697-9.697S208.992,101.818,203.636,101.818z'/>" +
      "        <path style='fill: #73A1FB;' d='M48.485,101.818H9.697c-5.355,0-9.697,4.342-9.697,9.697s4.342,9.697,9.697,9.697h38.788c5.355,0,9.697-4.342,9.697-9.697S53.84,101.818,48.485,101.818z'/>" +
      "        <path style='fill: #355EC9;' d='M168.378,36.09l-27.428,27.428c-3.787,3.786-3.787,9.926,0,13.713c1.893,1.894,4.375,2.841,6.856,2.841c2.482,0,4.964-0.946,6.857-2.841l27.428-27.428c3.787-3.786,3.787-9.926,0-13.713C178.305,32.303,172.165,32.303,168.378,36.09z'/>" +
      "        <path style='fill: #C4D9FD;' d='M106.667,169.697c-5.355,0-9.697,4.342-9.697,9.697v19.394c0,5.355,4.342,9.697,9.697,9.697c5.355,0,9.697-4.342,9.697-9.697v-19.394C116.364,174.039,112.022,169.697,106.667,169.697z'/>" +
      "        <path style='fill: #C4D9FD;' d='M58.669,145.799l-27.427,27.428c-3.787,3.787-3.787,9.926,0,13.713c1.893,1.893,4.375,2.84,6.857,2.84c2.482,0,4.964-0.947,6.856-2.84l27.427-27.428c3.787-3.787,3.787-9.926,0-13.713C68.596,142.012,62.456,142.012,58.669,145.799z'/>" +
      "        <path style='fill: #3D6DEB;' d='M106.667,4.848c-5.355,0-9.697,4.342-9.697,9.697v38.788c0,5.355,4.342,9.697,9.697,9.697c5.355,0,9.697-4.342,9.697-9.697V14.545C116.364,9.19,112.022,4.848,106.667,4.848z'/>" +
      "        <path style='fill: #5286FA;' d='M44.956,36.09c-3.786-3.787-9.926-3.787-13.713,0c-3.787,3.787-3.787,9.926,0,13.713l27.427,27.428c1.893,1.894,4.375,2.841,6.857,2.841c2.481,0,4.964-0.947,6.856-2.841c3.787-3.786,3.787-9.926,0-13.713L44.956,36.09z'/>" +
      "      </svg>" +
      "    </div>" +
      "  </div>" +
      "</div>"
    );

    jQuery("#aidDivDocumentCamera #aidCameraInput").focus();
    jQuery("#aidDivDocumentCamera #aidCameraInput").click();

    setTimeout(function() {
      renderNativeSelfieCaptureLayout(0);
    }, 100);
  }

  function renderDocumentCaptureLayout() {
    var bodyHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var bodyWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var _options = _currentOptions;
    var videoWidth = jQuery("#aidDivDocumentCamera #aidDocumentCamera").width() + (isIOS() ? 1 : 0);
    var videoHeight = jQuery("#aidDivDocumentCamera #aidDocumentCamera").height() > bodyHeight ? bodyHeight : jQuery("#aidDivDocumentCamera #aidDocumentCamera").height() + (isIOS() ? 1 : 0); // This is needed because when you rotate the screen the header and footer of the browser change the height of the browser
    var rendered = false;
    var headerSize = _options.data.configuration.headerSize;
    var footerSize = _options.data.configuration.footerSize;
    var borderSize = _options.data.configuration.borderSize;
    var borderWidth = _options.data.configuration.borderWidth;
    var cancelButtonPaddingSize = _options.data.configuration.cancelButtonPaddingSize;

    setTimeout(function() {
      jQuery("body").scrollTop(0);

      var docTypeProportion = (_options.data.configuration.documentType === "Passport" ? 1.3 : 1.5);
      var inverseDocTypeProportion = (_options.data.configuration.documentType === "Passport" ? 1 / 1.3 : 1 / 1.5);

      if (isPortrait()) { // Portrait
        if (videoHeight < bodyHeight) {
          rendered = false;

          _options.data.configuration.videoHeight = -1;
          _options.data.configuration.videoWidth = -1;
          _options.data.configuration.videoTop = -1;
          _options.data.configuration.videoLeft = -1;
        } else {
          var divHeight = bodyHeight - (headerSize + footerSize);
          var divWidth = bodyWidth;
          var marginHorizontalSize = Math.round((divWidth - videoWidth) / 2);
          var marginVerticalSize = Math.round((divHeight - (videoHeight - (headerSize + footerSize))) / 2);
          var proportionalHeight = Math.round(docTypeProportion * (divWidth - ((marginHorizontalSize * 2) + (borderSize * 2))))
          var proportionalWidth = Math.round(inverseDocTypeProportion * (divHeight - (marginVerticalSize * 2)));
          var visibleVideoWidth = Math.round(videoWidth);
          var visibleVideoHeight = Math.round(videoHeight - (headerSize + footerSize));
          var finalWidth;
          var finalHeight;
          var borderVeriticalSize = 0;
          var borderHorizontalSize = borderSize;
          var passportMRZSize = 0;

          // if (divWidth > proportionalWidth) {
          if (videoWidth > proportionalWidth) {
            finalWidth = proportionalWidth;
            finalHeight = (divHeight - (marginVerticalSize * 2));

            borderVeriticalSize = ((divHeight - finalHeight) / 2) - marginVerticalSize;
            borderHorizontalSize = ((divWidth - finalWidth) / 2) - marginHorizontalSize;
          // } else if (divHeight > proportionalHeight) {
          } else if (videoHeight > proportionalHeight) {
            finalWidth = (divWidth - ((marginHorizontalSize * 2) + (borderSize * 2)))
            finalHeight = proportionalHeight;

            borderVeriticalSize = ((divHeight - finalHeight) / 2) - marginVerticalSize;
            borderHorizontalSize = ((divWidth - finalWidth) / 2) - marginHorizontalSize;
          }

          passportMRZSize = Math.round(finalWidth * 0.18)

          log("body H/W " + bodyHeight + "/" + bodyWidth +
            " div H/W " + divHeight + "/" + divWidth +
            " video H/W " + videoHeight + "/" + videoWidth +
            " margin H/V " + marginVerticalSize + "/" + marginHorizontalSize +
            " proportional H/W " + proportionalHeight + "/" + proportionalWidth +
            " border H/W " + borderVeriticalSize + "/" + borderHorizontalSize +
            " final H/W " + finalHeight + "/" + finalWidth +
            " passport " + passportMRZSize
          );

          jQuery("#aidDivDocumentCamera #aidCaptureArea").css({
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "start",
            "align-items": "stretch",
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": bodyWidth,
            "height": bodyHeight
          });
          jQuery("#aidDivDocumentCamera #aidHeader").css({
            "min-height": headerSize,
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "flex-start",
            "align-items": "center",
            "background": "black",
            "height": headerSize,
            "align-content": "stretch"
          });
          jQuery("#aidDivDocumentCamera #aidInfoHidden").css({
            "color": "white",
            "background": "black",
            "font-size": 10,
            "font-weight": 500,
            "z-index": 16776995,
            "width": "50%",
            "padding-left": 20,
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "flex-start",
            "align-items": "center"
          });
          jQuery("#aidDivDocumentCamera #aidAutoMode").css({
            "z-index": 16776995,
            "width": "50%",
            "padding-right": 20,
            "color": "white",
            "background": "black",
            "text-align": "end"
          });
          jQuery("#aidDivDocumentCamera #aidAutoMode").text((_currentOptions.data.configuration.showCaptureModeText ? (_currentOptions.data.configuration.captureMode === "Auto" ? "Auto" : "Manual") : ""));
          jQuery("#aidDivDocumentCamera #aidVideoContent").css({
            "height": divHeight - ((marginVerticalSize * 2) + (borderVeriticalSize * 2)),
            "width": divWidth + (isAndroid() ? 1 : 0) - ((marginHorizontalSize * 2) + (borderHorizontalSize * 2)),
            "margin-left": marginHorizontalSize,
            "margin-right": marginHorizontalSize,
            "border-style": "solid",
            "border-color": "black",
            "border-left-width": borderHorizontalSize,
            "border-right-width": borderHorizontalSize,
            "border-top-width": borderVeriticalSize,
            "border-bottom-width": borderVeriticalSize,
            "box-sizing": "content-box"
          });
          if (_options.data.configuration.documentType === "Passport") {
            jQuery("#aidDivDocumentCamera #aidVideoContentBorderBackground").css({
              "position": "absolute",
              "top": headerSize + marginVerticalSize + borderVeriticalSize,
              "left": marginHorizontalSize + borderHorizontalSize,
              "height": finalHeight,
              "width": finalWidth,
              "border": (borderWidth + 1) + "px solid white",
              "display": "none"
            });
          } else {
            jQuery("#aidDivDocumentCamera #aidVideoContentBorderBackground").css({
              "display": "none"
            });
          }
          jQuery("#aidDivDocumentCamera #aidVideoContentBorder").css({
            "height": divHeight - ((marginVerticalSize * 2) + (borderVeriticalSize * 2) + (borderWidth * 2)),
            "width": divWidth + (isAndroid() ? 1 : 0) - ((marginHorizontalSize * 2) + (borderHorizontalSize * 2) + (borderWidth * 2)),
            "border": borderWidth + "px solid red",
            "border-top-left-radius": (_options.data.configuration.documentType === "Passport" ? 15 : 0),
            "border-bottom-left-radius": (_options.data.configuration.documentType === "Passport" ? 15 : 0),
            "box-sizing": "content-box"
          });
          if (_options.data.configuration.documentType === "Passport") {
            jQuery("#aidDivDocumentCamera #aidPassportLine").css({
              "display": "block",
              "border": "2px solid red",
              "position": "relative",
              "height": "100%",
              "left": passportMRZSize,
              "width": 0
            });
          } else {
            jQuery("#aidDivDocumentCamera #aidPassportLine").css({
              "display": "none",
            });
          }
          jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").css({
            "position": "absolute",
            "transform": "rotate(90deg)",
            "color": _options.data.configuration.overlayColor,
            "top": headerSize + marginVerticalSize + borderVeriticalSize + borderWidth,
            "left": marginHorizontalSize + borderHorizontalSize + borderWidth + (_options.data.configuration.documentType === "Passport" ? passportMRZSize : 0),
            "height": finalHeight - (borderWidth * 2),
            "width": finalWidth - ((borderWidth * 2) + (_options.data.configuration.documentType === "Passport" ? passportMRZSize : 0)) + (isAndroid() ? 1 : 0),
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "center",
            "align-items": "center",
            "text-align": "center",
            "font-size": 24
          });
          jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").html(_options.data.configuration.captureMode === "Auto" ? _options.data.configuration.overlayTextAuto : _options.data.configuration.overlayTextManual);
          jQuery("#aidDivDocumentCamera #aidFooter").css({
            "min-height": footerSize,
            "width": "100%",
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "flex-end",
            "align-items": "center",
            "background": "black",
            "height": footerSize
          });
          jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").css({
            "margin-right": cancelButtonPaddingSize
          });

          jQuery("#aidDivDocumentCamera #aidSetupCamera").css("display", "none");

          _options.data.configuration.videoHeight = jQuery("#aidDivDocumentCamera #aidVideoContentBorder").height() + (borderHorizontalSize * 2);
          _options.data.configuration.videoWidth = divWidth - (marginHorizontalSize * 2);
          _options.data.configuration.videoTop = (headerSize + marginVerticalSize + borderVeriticalSize) - borderHorizontalSize;
          _options.data.configuration.videoLeft = 0;

          _currentOptions.data.result.autoModeStartTime = new Date();
          updateAutoMode(_currentOptions.data.configuration.captureMode);

          jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").focus();

          if (_currentOptions.data.configuration.captureMode !== "Auto") {
            jQuery("#aidDivDocumentCamera").one('click', function() {
              selectDocument();
            });
          }

          jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").one('click', function() {
            var callback = _currentOptions.callback;
            stopWebCam();

            jQuery("body").css("overflow", "");
            jQuery("#aidDivDocumentCamera").remove();
            _currentOptions = null;

            callback.abort({
              "errorType": "user-cancel"
            })
          });

          rendered = true;
        }
      } else {
        if (videoHeight < bodyHeight) {
          rendered = false;
        } else {
          var divHeight = bodyHeight;
          var divWidth = bodyWidth - (headerSize + footerSize);
          var marginHorizontalSize = divWidth > videoWidth ? Math.round((divWidth - videoWidth) / 2) : 0;
          var marginVerticalSize = divHeight > videoHeight ? Math.round((divHeight - videoHeight) / 2) : 0;
          var proportionalHeight = Math.round(inverseDocTypeProportion * (divWidth - ((marginHorizontalSize * 2))));
          var proportionalWidth = Math.round(docTypeProportion * (divHeight - ((marginVerticalSize * 2) + (borderSize * 2))));
          var visibleVideoWidth = Math.round(videoWidth);
          var visibleVideoHeight = Math.round(videoHeight);
          var finalWidth;
          var finalHeight;
          var borderVeriticalSize = borderSize;
          var borderHorizontalSize = 0;
          var passportMRZSize = 0;

          if (divWidth > proportionalWidth && divHeight <= proportionalHeight) {
            finalWidth = proportionalWidth;
            finalHeight = (divHeight - ((marginVerticalSize * 2) + (borderSize * 2)));

            borderVeriticalSize = ((divHeight - finalHeight) / 2) - marginVerticalSize;
            borderHorizontalSize = ((divWidth - finalWidth) / 2) - marginHorizontalSize;
          } else if (divHeight > proportionalHeight && divWidth <= proportionalWidth) {
            finalWidth = (divWidth - (marginHorizontalSize * 2));
            finalHeight = proportionalHeight;

            borderVeriticalSize = ((divHeight - finalHeight) / 2) - marginVerticalSize;
            borderHorizontalSize = ((divWidth - finalWidth) / 2) - marginHorizontalSize;
          }

          passportMRZSize = Math.round(finalHeight * 0.25)

          log("body H/W " + bodyHeight + "/" + bodyWidth +
            " div H/W " + divHeight + "/" + divWidth +
            " video H/W " + videoHeight + "/" + videoWidth +
            " margin H/V " + marginHorizontalSize + "/" + marginVerticalSize +
            " proportional H/W " + proportionalHeight + "/" + proportionalWidth +
            " border H/W " + borderVeriticalSize + "/" + borderHorizontalSize +
            " final H/W " + finalHeight + "/" + finalWidth +
            " passport " + passportMRZSize
          );

          jQuery("#aidDivDocumentCamera #aidCaptureArea").css({
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "start",
            "align-items": "stretch",
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": bodyWidth,
            "height": bodyHeight
          });
          jQuery("#aidDivDocumentCamera #aidHeader").css({
            "width": 72,
            "min-width": 72,
            "display": "flex",
            "flex-direction": "column",
            "align-content": "stretch",
            "justify-content": "flex-end",
            "align-items": "center",
            "background": "black",
            "padding-top": 20,
            "padding-bottom": 20
          });
          jQuery("#aidDivDocumentCamera #aidInfoHidden").css({
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "flex-start",
            "align-items": "center",
            "height": "50%",
            "color": "white",
            "background": "black",
            "font-size": 10,
            "font-weight": 500,
            "z-index": 16776995
          });
          jQuery("#aidDivDocumentCamera #aidAutoMode").css({
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "flex-end",
            "align-items": "flex-end",
            "height": "50%",
            "color": "white",
            "background": "black",
            "text-align": "center",
            "z-index": 16776995
          });
          jQuery("#aidDivDocumentCamera #aidAutoMode").text((_currentOptions.data.configuration.showCaptureModeText ? (_currentOptions.data.configuration.captureMode === "Auto" ? "Auto" : "Manual") : ""));
          jQuery("#aidDivDocumentCamera #aidVideoContent").css({
            "height": divHeight - ((marginVerticalSize * 2) + (borderVeriticalSize * 2)),
            "width": divWidth + (isAndroid() ? 1 : 0) - ((marginHorizontalSize * 2) + (borderHorizontalSize * 2)),
            "margin-left": marginHorizontalSize,
            "margin-right": marginHorizontalSize,
            "border-style": "solid",
            "border-color": "black",
            "border-left-width": borderHorizontalSize,
            "border-right-width": borderHorizontalSize,
            "border-top-width": borderVeriticalSize,
            "border-bottom-width": borderVeriticalSize,
            "box-sizing": "content-box"
          });
          if (_options.data.configuration.documentType === "Passport") {
            jQuery("#aidDivDocumentCamera #aidVideoContentBorderBackground").css({
              "position": "absolute",
              "top": borderSize,
              "left": headerSize + marginHorizontalSize + borderHorizontalSize,
              "height": finalHeight,
              "width": finalWidth,
              "border": (borderWidth + 1) + "px solid white",
              "display": "none"
            });
          } else {
            jQuery("#aidDivDocumentCamera #aidVideoContentBorderBackground").css({
              "display": "none"
            });
          }
          jQuery("#aidDivDocumentCamera #aidVideoContentBorder").css({
            "height": divHeight - ((marginVerticalSize * 2) + (borderVeriticalSize * 2) + (borderWidth * 2)),
            "width": divWidth + (isAndroid() ? 1 : 0) - ((marginHorizontalSize * 2) + (borderHorizontalSize * 2) + (borderWidth * 2)),
            "border": borderWidth + "px solid red",
            "border-bottom-left-radius": (_options.data.configuration.documentType === "Passport" ? 15 : 0),
            "border-bottom-right-radius": (_options.data.configuration.documentType === "Passport" ? 15 : 0),
            "box-sizing": "content-box"
          });
          if (_options.data.configuration.documentType === "Passport") {
            jQuery("#aidDivDocumentCamera #aidPassportLine").css({
              "display": "block",
              "border": "2px solid red",
              "position": "relative",
              "width": "100%",
              "top": (finalHeight - passportMRZSize),
              "height": 0
            });
          } else {
            jQuery("#aidDivDocumentCamera #aidPassportLine").css({
              "display": "none",
            });
          }
          jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").css({
            "position": "absolute",
            "color": _options.data.configuration.overlayColor,
            "top": marginVerticalSize + borderVeriticalSize + borderWidth,
            "left": headerSize + marginHorizontalSize + borderHorizontalSize + borderWidth,
            "height": finalHeight - ((borderWidth * 2) + (_options.data.configuration.documentType === "Passport" ? passportMRZSize : 0)), // 8 is the size of the border
            "width": finalWidth - (borderWidth * 2),
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "center",
            "align-items": "center",
            "text-align": "center",
            "font-size": 24
          });
          jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").html(_options.data.configuration.captureMode === "Auto" ? _options.data.configuration.overlayTextAuto : _options.data.configuration.overlayTextManual);
          jQuery("#aidDivDocumentCamera #aidFooter").css({
            "width": footerSize,
            "min-width": footerSize,
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "center",
            "align-items": "flex-end",
            "background": "black",
            "height": "100%",
            "padding-bottom": 20
          });
          jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").css({
            "margin-right": cancelButtonPaddingSize
          });

          jQuery("#aidDivDocumentCamera #aidSetupCamera").css("display", "none");

          _options.data.configuration.videoHeight = jQuery("#aidDivDocumentCamera #aidVideoContent").height() + (borderVeriticalSize * 2);
          _options.data.configuration.videoWidth = jQuery("#aidDivDocumentCamera #aidVideoContent").width() + +(borderWidth * 2) + (borderVeriticalSize * 2);
          _options.data.configuration.videoTop = 0;
          _options.data.configuration.videoLeft = (jQuery("#aidDivDocumentCamera #aidDocumentCamera").width() - jQuery("#aidDivDocumentCamera #aidVideoContent").width()) / 2;

          _currentOptions.data.result.autoModeStartTime = new Date();
          updateAutoMode(_currentOptions.data.configuration.captureMode);

          jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").focus();

          if (_currentOptions.data.configuration.captureMode !== "Auto") {
            jQuery("#aidDivDocumentCamera").one('click', function() {
              selectDocument();
            });
          }

          jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").one('click', function() {
            var callback = _currentOptions.callback;
            stopWebCam();

            jQuery("body").css("overflow", "");
            jQuery("#aidDivDocumentCamera").remove();
            _currentOptions = null;

            callback.abort({
              "errorType": "user-cancel"
            })
          });

          rendered = true;
        }
      }

      if (rendered === false) {
        setTimeout(renderDocumentCaptureLayout(), 100);
      }
    }, 100);
  }

  function renderNativeDocumentCaptureLayout(counter) {
    var _options = _currentOptions;
    var cameraInput = jQuery("#aidDivDocumentCamera #aidCameraInput");
    var _cameraInput = cameraInput.get(0);
    var activeElement = document.activeElement;

    if (counter === 0) {
      cameraInput.hide();
      setTimeout(function() {
        jQuery("#aidDivDocumentCamera #aidLoadingIcon").show();

        renderNativeDocumentCaptureLayout(counter + 1);
      }, 100);
    } else {
      setTimeout(function() {
        jQuery("#aidDivDocumentCamera").show();

        if (counter > 200 || _cameraInput.files.length > 0) { // This is a random number, which has been tested on both Android/iOS
          if (_cameraInput.files.length > 0) {
            processNativeDocumentCapture(_cameraInput.files[0]);
          } else {
            jQuery("#aidDivDocumentCamera").remove();
            _options.callback.abort({
              "errorType": "user-cancel"
            });
          }
        } else {
          renderNativeDocumentCaptureLayout(counter + 1);
        }
      }, 100);
    }
  }

  function renderSelfieCaptureLayout() {
    var bodyHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var bodyWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var _options = _currentOptions;
    var videoWidth = jQuery("#aidDivDocumentCamera #aidDocumentCamera").width() + (isIOS() ? 1 : 0);
    var videoHeight = jQuery("#aidDivDocumentCamera #aidDocumentCamera").height() > bodyHeight ? bodyHeight : jQuery("#aidDivDocumentCamera #aidDocumentCamera").height() + (isIOS() ? 1 : 0); // This is needed because when you rotate the screen the header and footer of the browser change the height of the browser
    var rendered = false;
    var headerSize = _options.data.configuration.headerSize;
    var footerSize = bodyHeight * .2;
    var messageSize = _options.data.configuration.messageSize;
    var borderSize = _options.data.configuration.borderSize;
    var borderWidth = _options.data.configuration.borderWidth;
    var cancelButtonPaddingSize = _options.data.configuration.cancelButtonPaddingSize;
    var orientation = window.orientation;

    setTimeout(function() {
      jQuery("body").scrollTop(0);

      if (_options.data.configuration.captureSubType === "Near") {
        jQuery("#aidDivDocumentCamera #aidSetupCamera").css("display", "none");

        jQuery("#aidDivDocumentCamera #aidCaptureArea").css({
          "display": "flex",
          "flex-direction": "column",
          "background": "transparent",
          "z-index": 16776996,
          "width": "100%",
          "height": "100%",
          "position": "absolute"
        })
        jQuery("#aidDivDocumentCamera #aidHeader").css({
          "width": "100%",
          "height": headerSize,
          "background": "white"
        });
        jQuery("#aidDivDocumentCamera #aidVideoContent").css({
          "height": bodyHeight - (headerSize + footerSize),
          "width": "100%",
          "box-sizing": "content-box"
        });
        jQuery("#aidDivDocumentCamera #aidVideoContentBorder").css({
          "width": bodyWidth,
          "height": (bodyHeight - (headerSize + footerSize + messageSize)),
          "box-sizing": "content-box"
        });
        jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").css({
          "height": messageSize,
          "width": bodyWidth,
          "background": "white",
          "color": "black",
          "text-align": "center"
        });
        jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").html(_options.data.configuration.captureMode === "Auto" ? _options.data.configuration.overlayTextAuto : _options.data.configuration.overlayTextManual);
        jQuery("#aidDivDocumentCamera #aidMaskCanvas").css({
          "top": headerSize,
          "left": 0,
          "width": "100%",
          "height": "100%"
        });
        jQuery("#aidDivDocumentCamera #aidMaskCanvas").attr("width", bodyWidth);
        jQuery("#aidDivDocumentCamera #aidMaskCanvas").attr("height", bodyHeight - (headerSize + footerSize + messageSize));
        jQuery("#aidDivDocumentCamera #aidFooter").css({
          "height": footerSize,
          "width": bodyWidth - 20,
          "background": "black",
          "color": "white",
          "display": "flex",
          "flex-direction": "column",
          "padding": "5px 10px"
        });
        jQuery("#aidDivDocumentCamera #aidFooterButtons").css({
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "flex-start",
          "align-items": "center"
        });
        jQuery("#aidDivDocumentCamera #aidCancelSpan").css({
          width: (bodyWidth - 100) / 2
        });
        jQuery("#aidDivDocumentCamera #aidBtnCapture").css({})

        _currentOptions.data.result.autoModeStartTime = new Date();
        updateAutoMode(_currentOptions.data.configuration.captureMode);

        jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").one('click', function() {
          var callback = _currentOptions.callback;
          stopWebCam();

          jQuery("body").css("overflow", "");
          jQuery("#aidDivDocumentCamera").remove();
          _currentOptions = null;

          callback.abort({
            "errorType": "user-cancel"
          })
        });

        jQuery("#aidDivDocumentCamera #aidBtnRotateCamera").one('click', function() {
          _currentOptions.data.configuration.useBackCamera = _currentOptions.data.configuration.useBackCamera ? false : true;
          stopWebCam();

          videoConstraints(_currentOptions.data.configuration.useBackCamera ? 'environment' : 'user').then(function(constraints) {
            setupVideoStream(constraints).then(function(videoStream) {
              renderSelfieCapture();

              jQuery("#aidDivDocumentCamera #aidDocumentCamera").get(0).srcObject = videoStream.stream;

              setTimeout(function() {
                processImage();
              }, 200);
            }, function() {});
          }, function() {});
        });

        if (_currentOptions.data.configuration.captureMode !== "Auto") {
          jQuery("#aidDivDocumentCamera #aidBtnCapture").one('click', function() {
            selectSelfie();
          });
        }
      } else {
        jQuery("#aidDivDocumentCamera #aidSetupCamera").css("display", "none");

        jQuery("#aidDivDocumentCamera #aidCaptureArea").css({
          "display": "flex",
          "flex-direction": "column",
          "background": "transparent",
          "z-index": 16776996,
          "width": "100%",
          "height": "100%",
          "position": "absolute"
        })
        jQuery("#aidDivDocumentCamera #aidHeader").css({
          "width": "100%",
          "height": headerSize,
          "background": "white"
        });
        jQuery("#aidDivDocumentCamera #aidVideoContent").css({
          "height": bodyHeight - (headerSize + footerSize),
          "width": "100%",
          "box-sizing": "content-box"
        });
        jQuery("#aidDivDocumentCamera #aidVideoContentBorder").css({
          "width": bodyWidth,
          "height": (bodyHeight - (headerSize + footerSize + messageSize)),
          "box-sizing": "content-box"
        });
        jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").css({
          "height": messageSize,
          "width": bodyWidth,
          "background": "white",
          "color": "black",
          "text-align": "center"
        });
        jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").html(_options.data.configuration.captureMode === "Auto" ? _options.data.configuration.overlayTextAuto : _options.data.configuration.overlayTextManual);
        jQuery("#aidDivDocumentCamera #aidMaskCanvas").css({
          "top": headerSize,
          "left": 0,
          "width": "100%",
          "height": "100%"
        });
        jQuery("#aidDivDocumentCamera #aidMaskCanvas").attr("width", bodyWidth);
        jQuery("#aidDivDocumentCamera #aidMaskCanvas").attr("height", bodyHeight - (headerSize + footerSize + messageSize));
        jQuery("#aidDivDocumentCamera #aidFooter").css({
          "height": footerSize,
          "width": bodyWidth - 20,
          "background": "black",
          "color": "white",
          "display": "flex",
          "flex-direction": "column",
          "padding": "5px 10px"
        });
        jQuery("#aidDivDocumentCamera #aidFooterButtons").css({
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "flex-start",
          "align-items": "center"
        });
        jQuery("#aidDivDocumentCamera #aidCancelSpan").css({
          width: (bodyWidth - 100) / 2
        });
        jQuery("#aidDivDocumentCamera #aidBtnCapture").css({})

        _currentOptions.data.result.autoModeStartTime = new Date();
        updateAutoMode(_currentOptions.data.configuration.captureMode);

        jQuery("#aidDivDocumentCamera #aidBtnCancelCapture").one('click', function() {
          var callback = _currentOptions.callback;
          stopWebCam();

          jQuery("body").css("overflow", "");
          jQuery("#aidDivDocumentCamera").remove();
          _currentOptions = null;

          callback.abort({
            "errorType": "user-cancel"
          })
        });

        if (_currentOptions.data.configuration.captureMode !== "Auto") {
          jQuery("#aidDivDocumentCamera #aidBtnCapture").one('click', function() {
            selectSelfie();
          });
        }
      }

      drawSelfieEllipse("red");
    }, 100);
  }

  function renderNativeSelfieCaptureLayout(counter) {
    var _options = _currentOptions;
    var cameraInput = jQuery("#aidDivDocumentCamera #aidCameraInput");
    var _cameraInput = cameraInput.get(0);
    var activeElement = document.activeElement;

    log(counter + " " + _cameraInput.files.length + " " + activeElement.tagName.toUpperCase());

    if (counter === 0) {
      cameraInput.hide();
      setTimeout(function() {
        jQuery("#aidDivDocumentCamera #aidLoadingIcon").show();

        renderNativeSelfieCaptureLayout(counter + 1);
      }, 100);
    } else {
      setTimeout(function() {
        jQuery("#aidDivDocumentCamera").show();

        if (counter > 200 || _cameraInput.files.length > 0) { // This is a random number, which has been tested on both Android/iOS
          if (_cameraInput.files.length > 0) {
            processNativeSelfieCapture(_cameraInput.files[0]);
          } else {
            jQuery("#aidDivDocumentCamera").remove();
            _options.data.configuration.callback.abort({
              "errorType": "user-cancel"
            });
          }
        } else {
          renderNativeSelfieCaptureLayout(counter + 1);
        }
      }, 100);
    }
  }

  function processImage() {
    var _options = _currentOptions;

    if (_options === null)
      return;

    if (_options.data.configuration.captureType === "Selfie") {
      if (isLandscape()) {
        return;
      }
    }

    if (_options.data.configuration.processingPaused) {
      setTimeout(function() {
        processImage();
      }, 200);
      return;
    }

    if (_options.data.configuration.captureMode === "Auto") {
      var currentTime = new Date().getTime();

      if ((_options.data.configuration.captureStartTime + (_options.data.configuration.setManualTimeout * 1000)) < currentTime) {
        updateAutoMode("Manual");
      }
    }

    var croppedImage = jQuery("#aidDivDocumentCamera #aidCroppedImage").length > 0 ? jQuery("#aidDivDocumentCamera #aidCroppedImage").get(0) : null;
    var scaledImage = jQuery("#aidDivDocumentCamera #aidScaledImage").length > 0 ? jQuery("#aidDivDocumentCamera #aidScaledImage").get(0) : null;

    if (croppedImage != null && scaledImage != null) {
      var croppedImageContext = croppedImage.getContext('2d');
      var scaledImageContext = scaledImage.getContext('2d');
      var croppedImageData;
      var croppedImageData2, croppedImageData2Width, croppedImageData2Height, scaledImageData2;

      if (_options.data.configuration.captureType === "Document") {
        if (_options.data.configuration.videoHeight < 0) {
          setTimeout(function() {
            processImage()
          }, 200);
        } else {
          var docCamera = jQuery("#aidDivDocumentCamera #aidDocumentCamera").get(0);
          if (docCamera != null) {
            var videoHeightMultiplier = docCamera.videoHeight / jQuery("#aidDivDocumentCamera #aidDocumentCamera").height();
            var videoWidthMultiplier = docCamera.videoWidth / jQuery("#aidDivDocumentCamera #aidDocumentCamera").width();

            if (videoHeightMultiplier > 0 && videoWidthMultiplier > 0) {
              if (isPortrait()) {
                var fullVideoWidth = docCamera.videoWidth;
                var fullVideoHeight = docCamera.videoHeight;
                var srcVideoX = _options.data.configuration.videoLeft * videoWidthMultiplier;
                var srcVideoY = _options.data.configuration.videoTop * videoHeightMultiplier;
                var srcVideoWidth = _options.data.configuration.videoWidth * videoWidthMultiplier;
                var srcVideoHeight = _options.data.configuration.videoHeight * videoHeightMultiplier;
                var destCanvasX = 0;
                var destCanvasY = 0;
                var destCanvasWidth = fullVideoWidth > (_options.data.configuration.videoWidth * videoHeightMultiplier) ? _options.data.configuration.videoWidth * videoHeightMultiplier : fullVideoWidth;
                var destCanvasHeight = fullVideoHeight > (_options.data.configuration.videoHeight * videoWidthMultiplier) ? _options.data.configuration.videoHeight * videoWidthMultiplier : fullVideoHeight;
                var canvasDim = getCanvasDimension(destCanvasWidth, destCanvasHeight, deviceOrientation(), _options);
                destCanvasWidth = canvasDim.width;
                destCanvasHeight = canvasDim.height;
                var scaledDim = getScaledCanvasDimension(destCanvasWidth, destCanvasHeight, deviceOrientation(), _options);

                try {
                  croppedImage.width = destCanvasWidth;
                  croppedImage.height = destCanvasHeight;

                  croppedImageContext.save();
                  croppedImageContext.clearRect(0, 0, croppedImage.width, croppedImage.height);

                  croppedImageContext.drawImage(docCamera,
                    srcVideoX,
                    srcVideoY,
                    fullVideoWidth > srcVideoWidth ? srcVideoWidth : fullVideoWidth,
                    fullVideoHeight > srcVideoHeight ? srcVideoHeight : fullVideoHeight,
                    destCanvasX,
                    destCanvasY,
                    destCanvasWidth,
                    destCanvasHeight
                  );

                  croppedImageContext.restore();

                  croppedImageData2 = croppedImageContext.getImageData(0, 0, croppedImage.width, croppedImage.height).data;
                  croppedImageData2Width = croppedImage.width;
                  croppedImageData2Height = croppedImage.height;

                  scaledImage.width = scaledDim.width;
                  scaledImage.height = scaledDim.height;

                  scaledImageContext.clearRect(0, 0, scaledImage.width, scaledImage.height);
                  scaledImageContext.drawImage(croppedImage, 0, 0, scaledImage.width, scaledImage.height);

                  scaledImageData2 = scaledImageContext.canvas.toDataURL('image/jpeg')

                  // Secondary Image
                  croppedImage.width = destCanvasHeight;
                  croppedImage.height = destCanvasWidth;

                  croppedImageContext.save();
                  croppedImageContext.clearRect(0, 0, croppedImage.width, croppedImage.height);

                  croppedImageContext.translate(destCanvasWidth / 2, destCanvasWidth / 2);
                  croppedImageContext.rotate(-90 * Math.PI / 180);
                  croppedImageContext.translate(-destCanvasWidth / 2, -destCanvasWidth / 2);

                  croppedImageContext.drawImage(docCamera,
                    srcVideoX,
                    srcVideoY,
                    fullVideoWidth > srcVideoWidth ? srcVideoWidth : fullVideoWidth,
                    fullVideoHeight > srcVideoHeight ? srcVideoHeight : fullVideoHeight,
                    destCanvasX,
                    destCanvasY,
                    destCanvasWidth,
                    destCanvasHeight
                  );
                  croppedImageContext.restore();

                  scaledImage.width = scaledDim.height;
                  scaledImage.height = scaledDim.width;

                  scaledImageContext.clearRect(0, 0, scaledImage.width, scaledImage.height);
                  scaledImageContext.drawImage(croppedImage, 0, 0, scaledImage.width, scaledImage.height);

                  croppedImageData = croppedImageContext.getImageData(0, 0, croppedImage.width, croppedImage.height).data;
                } catch (e) {
                  croppedImageData = null;
                }
              } else {
                var fullVideoWidth = docCamera.videoWidth;
                var fullVideoHeight = docCamera.videoHeight;
                var srcVideoX = _options.data.configuration.videoLeft * videoWidthMultiplier;
                var srcVideoY = _options.data.configuration.videoTop * videoHeightMultiplier;
                var srcVideoWidth = _options.data.configuration.videoWidth * videoWidthMultiplier;
                var srcVideoHeight = _options.data.configuration.videoHeight * videoHeightMultiplier;
                var destCanvasX = 0;
                var destCanvasY = 0;
                var destCanvasWidth = fullVideoWidth > (_options.data.configuration.videoWidth * videoHeightMultiplier) ? _options.data.configuration.videoWidth * videoHeightMultiplier : fullVideoWidth;
                var destCanvasHeight = fullVideoHeight > (_options.data.configuration.videoHeight * videoWidthMultiplier) ? _options.data.configuration.videoHeight * videoWidthMultiplier : fullVideoHeight;
                var canvasDim = getCanvasDimension(destCanvasWidth, destCanvasHeight, deviceOrientation(), _options);
                destCanvasWidth = canvasDim.width;
                destCanvasHeight = canvasDim.height;
                var scaledDim = getScaledCanvasDimension(destCanvasWidth, destCanvasHeight, deviceOrientation(), _options);

                try {
                  croppedImage.width = destCanvasHeight;
                  croppedImage.height = destCanvasWidth;

                  croppedImageContext.save();
                  croppedImageContext.clearRect(0, 0, croppedImage.width, croppedImage.height);

                  croppedImageContext.translate(destCanvasHeight / 2, destCanvasHeight / 2);
                  croppedImageContext.rotate(90 * Math.PI / 180);
                  croppedImageContext.translate(-destCanvasHeight / 2, -destCanvasHeight / 2);

                  croppedImageContext.drawImage(docCamera,
                    srcVideoX,
                    srcVideoY,
                    fullVideoWidth > srcVideoWidth ? srcVideoWidth : fullVideoWidth,
                    fullVideoHeight > srcVideoHeight ? srcVideoHeight : fullVideoHeight,
                    destCanvasX,
                    destCanvasY,
                    destCanvasWidth,
                    destCanvasHeight
                  );

                  croppedImageContext.restore();

                  croppedImageData2 = croppedImageContext.getImageData(0, 0, croppedImage.width, croppedImage.height).data;
                  croppedImageData2Width = croppedImage.width;
                  croppedImageData2Height = croppedImage.height;

                  scaledImage.width = scaledDim.height;
                  scaledImage.height = scaledDim.width;

                  scaledImageContext.clearRect(0, 0, scaledImage.width, scaledImage.height);
                  scaledImageContext.drawImage(croppedImage, 0, 0, scaledImage.width, scaledImage.height);

                  scaledImageData2 = scaledImageContext.canvas.toDataURL('image/jpeg')

                  // Secondary Image
                  croppedImage.width = destCanvasWidth;
                  croppedImage.height = destCanvasHeight;

                  croppedImageContext.clearRect(0, 0, croppedImage.width, croppedImage.height);
                  croppedImageContext.drawImage(docCamera,
                    srcVideoX,
                    srcVideoY,
                    srcVideoWidth,
                    srcVideoHeight,
                    destCanvasX,
                    destCanvasY,
                    destCanvasWidth,
                    destCanvasHeight
                  );

                  scaledImage.width = scaledDim.width;
                  scaledImage.height = scaledDim.height;

                  scaledImageContext.clearRect(0, 0, scaledImage.width, scaledImage.height);
                  scaledImageContext.drawImage(croppedImage, 0, 0, scaledImage.width, scaledImage.height);

                  croppedImageData = croppedImageContext.getImageData(0, 0, croppedImage.width, croppedImage.height).data;
                } catch (e) {
                  croppedImageData = null;
                }
              }

              if (croppedImageData !== null) {
                _options.data.result.toProcess.push({
                  canvasContext: scaledImageContext.canvas.toDataURL('image/jpeg'),
                  image1: croppedImageData,
                  h1: croppedImage.height,
                  w1: croppedImage.width,
                  canvasContext2: scaledImageData2,
                  image2: croppedImageData2,
                  h2: croppedImageData2Height,
                  w2: croppedImageData2Width
                });

                postMessage();
              } else {
                setTimeout(function() {
                  processImage();
                }, 200);
              }
            } else {
              setTimeout(function() {
                processImage();
              }, 200);
            }
          } else {
            setTimeout(function() {
              processImage();
            }, 200);
          }
        }
      } else {
        if (_options.data.configuration.videoHeight < 0) {
          setTimeout(function() {
            processImage()
          }, 200);
        } else {
          var docCamera = jQuery("#aidDivDocumentCamera #aidDocumentCamera").get(0);
          if (docCamera != null) {
            var videoHeightMultiplier = docCamera.videoHeight / jQuery("#aidDivDocumentCamera #aidDocumentCamera").height();
            var videoWidthMultiplier = docCamera.videoWidth / jQuery("#aidDivDocumentCamera #aidDocumentCamera").width();

            if (videoHeightMultiplier > 0 && videoWidthMultiplier > 0) {
              if (isPortrait()) {
                var fullVideoWidth = docCamera.videoWidth;
                var fullVideoHeight = docCamera.videoHeight;
                var bodyWidth = jQuery("#aidDivDocumentCamera #aidCaptureArea").width();
                var bodyHeight = jQuery("#aidDivDocumentCamera #aidCaptureArea").height();
                var videoHeightRatio = fullVideoHeight / parseFloat(jQuery("#aidDivDocumentCamera #aidDocumentCamera").height());
                var videoWidthRatio = fullVideoWidth / parseFloat(jQuery("#aidDivDocumentCamera #aidDocumentCamera").width());
                var docLeft = parseFloat(jQuery("#aidDivDocumentCamera #aidDocumentCamera").css("left").replace("px",""));
                var docTop = parseFloat(jQuery("#aidDivDocumentCamera #aidDocumentCamera").css("top").replace("px",""));
                var isNear = _options.data.configuration.captureSubType === "Near" ? true : false;
                var videoAreaWidth = parseFloat(jQuery("#aidDivDocumentCamera #aidDebugEllipse").css("width").replace("px",""));
                var videoAreaHeight = parseFloat(jQuery("#aidDivDocumentCamera #aidDebugEllipse").css("height").replace("px",""));
                var videoAreaLeft = (parseFloat(jQuery("#aidDivDocumentCamera #aidDebugEllipse").css("margin-left").replace("px","")) + 2);
                var videoAreaTop = (parseFloat(jQuery("#aidDivDocumentCamera #aidDebugEllipse").css("margin-top").replace("px","")) + 2) + _options.data.configuration.headerSize;
                var destCanvasWidth = fullVideoWidth;
                var destCanvasHeight = fullVideoHeight;
                var canvasDim = getCanvasDimension(destCanvasWidth, destCanvasHeight, deviceOrientation(), _options);
                var imageData = null;

                destCanvasWidth = canvasDim.width;
                destCanvasHeight = canvasDim.height;
                var scaledDim = getScaledCanvasDimension(destCanvasWidth, destCanvasHeight, deviceOrientation(), _options);

                croppedImage.width = destCanvasWidth;
                croppedImage.height = destCanvasHeight;

                try {
                  croppedImageContext.clearRect(0, 0, croppedImage.width, croppedImage.height);
                  croppedImageContext.drawImage(docCamera, 0, 0, destCanvasWidth, destCanvasHeight);

                  scaledImage.width = scaledDim.width;
                  scaledImage.height = scaledDim.height;

                  scaledImageContext.clearRect(0, 0, scaledImage.width, scaledImage.height);
                  scaledImageContext.drawImage(croppedImage, 0, 0, scaledImage.width, scaledImage.height);

                  croppedImage.width = videoAreaWidth * videoWidthRatio;
                  croppedImage.height = videoAreaHeight * videoHeightRatio

                  croppedImageContext.clearRect(0, 0, croppedImage.width, croppedImage.height);
                  croppedImageContext.drawImage(docCamera,
                    videoAreaLeft * videoWidthRatio,
                    videoAreaTop * videoHeightRatio,
                    videoAreaWidth * videoWidthRatio,
                    videoAreaHeight * videoHeightRatio,
                    0,
                    0,
                    videoAreaWidth * videoWidthRatio,
                    videoAreaHeight * videoHeightRatio
                  );

                  croppedImageData = croppedImageContext.getImageData(0, 0, croppedImage.width, croppedImage.height).data;
                } catch (e) {
                  croppedImageData = null;
                }
              } else {
                croppedImageData = null;
              }

              if (croppedImageData !== null) {
                _options.data.result.toProcess.push({
                  canvasContext: scaledImageContext.canvas.toDataURL('image/jpeg'),
                  image1: croppedImageData,
                  h1: croppedImage.height,
                  w1: croppedImage.width
                });

                postMessage();
              } else {
                setTimeout(function() {
                  processImage();
                }, 200);
              }
            } else {
              setTimeout(function() {
                processImage();
              }, 200);
            }
          } else {
            setTimeout(function() {
              processImage();
            }, 200);
          }
        }
      }
    } else {
      setTimeout(function() {
        processImage();
      }, 200);
    }
  }

  function processNativeDocumentCapture(file) {
    var reader = new FileReader();

    reader.onload = (function(file) {
      return function(e) {
        rotateImage(e.target.result, true).then(function(canvasArray) {
          var canvas = canvasArray[0];
          var canvas2 = canvasArray[1];
          var context = canvas.getContext('2d');
          var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

          if (_currentOptions.data.configuration.captureSubType === "Front") {
            _currentOptions.data.result.toProcess.push({
              "canvasContext": context.canvas.toDataURL('image/jpeg'),
              "canvasContext2": canvas2.getContext('2d').canvas.toDataURL('image/jpeg'),
              image1: data,
              h1: canvas.height,
              w1: canvas.width,
              image2: canvas2.getContext('2d').getImageData(0, 0, canvas2.width, canvas2.height).data,
              h2: canvas2.height,
              w2: canvas2.width
            });

            postMessage();
          } else {
            _currentOptions.data.result.toProcess.push({
              "canvasContext": context.canvas.toDataURL('image/jpeg'),
              "canvasContext2": canvas2.getContext('2d').canvas.toDataURL('image/jpeg'),
              image1: data,
              h1: canvas.height,
              w1: canvas.width,
              image2: canvas2.getContext('2d').getImageData(0, 0, canvas2.width, canvas2.height).data,
              h2: canvas2.height,
              w2: canvas2.width
            });

            postMessage();
          }
        }, function(error) {
          log("Image Loading Error");
        });
      }
    })(file);

    reader.readAsDataURL(file);
  }

  function processNativeSelfieCapture(file) {
    var reader = new FileReader();

    reader.onload = (function(file) {
      return function(e) {
        rotateImage(e.target.result, false).then(function(canvasArray) {
          var canvas = canvasArray[0];
          var canvas2 = canvasArray[1];
          var context = canvas.getContext('2d');
          var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

          if (_currentOptions.data.configuration.captureSubType === "Near") {
            _currentOptions.data.result.toProcess.push({
              "canvasContext": context.canvas.toDataURL('image/jpeg'),
              image1: data,
              h1: canvas.height,
              w1: canvas.width,
            });

            postMessage();
          } else {
            _currentOptions.data.result.toProcess.push({
              "canvasContext": context.canvas.toDataURL('image/jpeg'),
              image1: data,
              h1: canvas.height,
              w1: canvas.width,
            });

            postMessage();
          }
        }, function(error) {
          log("Image Loading Error");
        });
      }
    })(file);

    reader.readAsDataURL(file);
  }

  function processDocumentFrontEvent() {
    var currentFrame = _currentOptions.data.result.processed[_currentOptions.data.result.processed.length - 1];
    var currentConfig = _currentOptions.data.configuration;
    var bulkFrames = _currentOptions.data.result.processed.slice(_currentOptions.data.result.processed.length > currentConfig.autoCaptureCheckNFrames ? _currentOptions.data.result.processed.length - currentConfig.autoCaptureCheckNFrames : 0, _currentOptions.data.result.processed.length)
    var failType = -1;
    var faceDetectedStatus = isDocumentFaceDetected(currentConfig, currentFrame);
    var focusStatus = isDocumentFocused(currentConfig.frontFocusThreshold, currentFrame);
    var glareStatus = isDocumentGlared(currentConfig.frontGlareThreshold, currentFrame);

    if (faceDetectedStatus === "Yes") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : Yes (" + currentFrame.faceDetectionProportion.toFixed(0) + ")");
      }
    } else if (faceDetectedStatus === "No") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "red");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : No (" + (currentFrame.faceDetectionProportion != null ? currentFrame.faceDetectionProportion.toFixed(0) : "-") + ")");
      }

      currentFrame.faceDetected = false;
      failType = 1;
    } else {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : Disabled");
      }
    }

    if (focusStatus === "Yes") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidFocusValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidFocusValue").text("Focus : " + currentFrame.focus.toFixed(2));
      }
    } else {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidFocusValue").css("color", "red");
        jQuery("#aidDivDocumentCamera #aidFocusValue").text("Focus : " + currentFrame.focus.toFixed(2));
      }

      failType = 2;
    }

    if (glareStatus === "Yes") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidGlareValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidGlareValue").text("Glare : " + currentFrame.glare.toFixed(2));
      }
    } else {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidGlareValue").css("color", "red");
        jQuery("#aidDivDocumentCamera #aidGlareValue").text("Glare : " + currentFrame.glare.toFixed(2));
      }

      failType = 3;
    }

    if (failType > 0) {
      notifyImageQuailityStatus(false);

      jQuery("#aidDivDocumentCamera .statusColoring").css("border-color", "red");
    } else {
      jQuery("#aidDivDocumentCamera .statusColoring").css("border-color", "green");

      if (currentConfig.captureMode === "Manual") {
        notifyImageQuailityStatus(true);
      } else {
        if (bulkFrames.length === currentConfig.autoCaptureCheckNFrames) {
          if (isDocumentFrontStable(currentConfig, bulkFrames)) {
            selectDocument(currentFrame);
          }
        }
      }
    }
  }

  function processDocumentBackEvent() {
    var currentFrame = _currentOptions.data.result.processed[_currentOptions.data.result.processed.length - 1];
    var currentConfig = _currentOptions.data.configuration;
    var bulkFrames = _currentOptions.data.result.processed.slice(_currentOptions.data.result.processed.length > currentConfig.autoCaptureCheckNFrames ? _currentOptions.data.result.processed.length - currentConfig.autoCaptureCheckNFrames : 0, _currentOptions.data.result.processed.length)
    var failType = -1;
    var barcodeDetectedStatus = isDocumentBarcodeDetected(currentConfig, currentFrame);
    var focusStatus = isDocumentFocused(currentConfig.backFocusThreshold, currentFrame);
    var glareStatus = isDocumentGlared(currentConfig.backGlareThreshold, currentFrame);

    if (currentConfig.enableBarcodeDetection && barcodeDetectedStatus === "Yes") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Barcode : Yes");
      }
    } else {
      if (focusStatus === "Yes") {
        if (isLoggable()) {
          jQuery("#aidDivDocumentCamera #aidFocusValue").css("color", "green");
          jQuery("#aidDivDocumentCamera #aidFocusValue").text("Focus : " + currentFrame.focus.toFixed(2));
        }
      } else {
        if (isLoggable()) {
          jQuery("#aidDivDocumentCamera #aidFocusValue").css("color", "red");
          jQuery("#aidDivDocumentCamera #aidFocusValue").text("Focus : " + currentFrame.focus.toFixed(2));
        }

        failType = 2;
      }

      if (glareStatus === "Yes") {
        if (isLoggable()) {
          jQuery("#aidDivDocumentCamera #aidGlareValue").css("color", "green");
          jQuery("#aidDivDocumentCamera #aidGlareValue").text("Glare : " + currentFrame.glare.toFixed(2));
        }
      } else {
        if (isLoggable()) {
          jQuery("#aidDivDocumentCamera #aidGlareValue").css("color", "red");
          jQuery("#aidDivDocumentCamera #aidGlareValue").text("Glare : " + currentFrame.glare.toFixed(2));
        }

        failType = 3;
      }

      if (barcodeDetectedStatus === "Yes") {
        if (isLoggable()) {
          jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
          jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Barcode : Yes");
        }
      } else if (barcodeDetectedStatus === "No") {
        if (isLoggable()) {
          jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "red");
          jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Barcode : No");
        }

        failType = 4;
      } else {
        if (isLoggable()) {
          jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
          jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Barcode : Disabled");
        }
      }
    }

    if (failType > 0) {
      notifyImageQuailityStatus(false);
      jQuery("#aidDivDocumentCamera .statusColoring").css("border-color", "red");
    } else {
      jQuery("#aidDivDocumentCamera .statusColoring").css("border-color", "green");

      if (currentConfig.captureMode === "Manual") {
        notifyImageQuailityStatus(true);
      } else {
        if (bulkFrames.length === currentConfig.autoCaptureCheckNFrames) {
          if (isDocumentBackStable(currentConfig, bulkFrames)) {
            setTimeout(function() {
              selectDocument(currentFrame);
            }, 600);
          }
        }
      }
    }
  }

  function processSelfieNearEvent() {
    var currentFrame = _currentOptions.data.result.processed[_currentOptions.data.result.processed.length - 1];
    var currentConfig = _currentOptions.data.configuration;
    var bulkFrames = _currentOptions.data.result.processed.slice(_currentOptions.data.result.processed.length > currentConfig.autoCaptureCheckNFrames ? _currentOptions.data.result.processed.length - currentConfig.autoCaptureCheckNFrames : 0, _currentOptions.data.result.processed.length)
    var failType = -1;
    var faceDetectedStatus = isSelfieFaceDetected(currentConfig, currentFrame);

    if (faceDetectedStatus === "Yes") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : Yes (" + currentFrame.faceDetectionProportion.toFixed(0) + ")");
      }
    } else if (faceDetectedStatus === "No") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "red");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : No (" + (currentFrame.faceDetectionProportion == null ? "-" : currentFrame.faceDetectionProportion.toFixed(0)) + ")");
      }

      // currentFrame.faceDetected = false;
      failType = 1;
    } else {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : Disabled");
      }
    }

    if (failType > 0) {
      notifyImageQuailityStatus(false);
      drawSelfieEllipse("red");
    } else {
      drawSelfieEllipse("green");

      if (currentConfig.captureMode === "Manual") {
        notifyImageQuailityStatus(true);
      } else {
        if (bulkFrames.length === currentConfig.autoCaptureCheckNFrames) {
          if (isSelfieNearStable(currentConfig, bulkFrames)) {
            selectSelfie();
          }
        }
      }
    }
  }

  function processSelfieFarEvent() {
    var currentFrame = _currentOptions.data.result.processed[_currentOptions.data.result.processed.length - 1];
    var currentConfig = _currentOptions.data.configuration;
    var bulkFrames = _currentOptions.data.result.processed.slice(_currentOptions.data.result.processed.length > currentConfig.autoCaptureCheckNFrames ? _currentOptions.data.result.processed.length - currentConfig.autoCaptureCheckNFrames : 0, _currentOptions.data.result.processed.length)
    var failType = -1;
    var faceDetectedStatus = isSelfieFaceDetected(currentConfig, currentFrame);

    if (faceDetectedStatus === "Yes") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : Yes (" + currentFrame.faceDetectionProportion.toFixed(0) + ")");
      }
    } else if (faceDetectedStatus === "No") {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "red");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : No (" + (currentFrame.faceDetectionProportion == null ? "-" : currentFrame.faceDetectionProportion.toFixed(0)) + ")");
      }

      // currentFrame.faceDetected = false;
      failType = 1;
    } else {
      if (isLoggable()) {
        jQuery("#aidDivDocumentCamera #aidDetectionValue").css("color", "green");
        jQuery("#aidDivDocumentCamera #aidDetectionValue").text("Face : Disabled");
      }
    }

    if (failType > 0) {
      notifyImageQuailityStatus(false);
      drawSelfieEllipse("red");
    } else {
      drawSelfieEllipse("green");

      if (currentConfig.captureMode === "Manual") {
        notifyImageQuailityStatus(true);
      } else {
        if (bulkFrames.length === currentConfig.autoCaptureCheckNFrames) {
          if (isSelfieFarStable(currentConfig, bulkFrames)) {
            selectSelfie();
          }
        }
      }
    }
  }

  function drawSelfieEllipse(color) {
    var bodyHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var bodyWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var _options = _currentOptions;
    var headerSize = _options.data.configuration.headerSize;
    var footerSize = bodyHeight * .2;
    var messageSize = _options.data.configuration.messageSize;
    var borderSize = _options.data.configuration.borderSize;
    var borderWidth = _options.data.configuration.borderWidth;
    var cancelButtonPaddingSize = _options.data.configuration.cancelButtonPaddingSize;

    var context = jQuery("#aidDivDocumentCamera #aidMaskCanvas").get(0).getContext('2d');
    context.clearRect(0, 0, jQuery("#aidDivDocumentCamera #aidMaskCanvas").width(), jQuery("#aidDivDocumentCamera #aidMaskCanvas").height());
    context.fillStyle = "white";
    context.fillRect(0, 0, jQuery("#aidDivDocumentCamera #aidMaskCanvas").width(), jQuery("#aidDivDocumentCamera #aidMaskCanvas").height());

    context.globalCompositeOperation = 'xor';
    var centerX = bodyWidth / 2;
    var centerY = (bodyHeight - (headerSize + footerSize + messageSize)) / 2;
    var radiusY = ((bodyHeight - (headerSize + footerSize + messageSize)) * 0.75) / 2;
    var radiusX = ((bodyHeight - (headerSize + footerSize + messageSize)) * 0.55) / 2;
    context.ellipse(centerX, centerY, radiusX, radiusY, Math.PI / 1, 0, 2 * Math.PI);
    context.fill();
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 5;
    context.strokeStyle = color;
    context.ellipse(centerX, centerY, radiusX + 5, radiusY + 5, Math.PI / 1, 0, 2 * Math.PI);
    context.stroke()

    var docLeft = parseFloat(jQuery("#aidDivDocumentCamera #aidDocumentCamera").css("left").replace("px",""));
    var docTop = parseFloat(jQuery("#aidDivDocumentCamera #aidDocumentCamera").css("top").replace("px",""));

    jQuery("#aidDivDocumentCamera #aidDebugEllipse").css({
      position: "absolute",
      top: headerSize + docTop,
      left: docLeft,
      width: (radiusX * 2) - 4 + 10,
      height: (radiusY * 2) - 4 + 10,
      border: "2px solid red",
      "margin-top": ((((bodyHeight - (headerSize + footerSize + messageSize)) - (radiusY * 2)) / 2) + -docTop) - 5,
      "margin-bottom": ((((bodyHeight - (headerSize + footerSize + messageSize)) - (radiusY * 2)) / 2) + -docTop) - 5,
      "margin-left": (((bodyWidth - (radiusX * 2)) / 2) + -docLeft) - 5,
      "margin-right": (((bodyWidth - (radiusX * 2)) / 2) + -docLeft) - 5,
      display: "none"
    })
  }

  function rotateImage(imageData, shouldSwap) {
    return new Promise(function(resolve, reject) {
      var exif = piexif.load(imageData);
      var segments = piexif.extractSegments(imageData);
      var image = new Image();
      var _shouldSwap = shouldSwap;

      image.onload = function() {
        var orientation = exif["0th"][piexif.ImageIFD.Orientation];
        log("Orientation " + orientation + " W/H " + image.width + "/" + image.height);

        var scaledImage = jQuery("#aidDivDocumentCamera #aidScaledImage").get(0);
        var canvas = jQuery("#aidDivDocumentCamera #aidCanvas1").get(0);
        var canvas2 = jQuery("#aidDivDocumentCamera #aidCanvas2").get(0);
        var scaledImageContext = scaledImage.getContext('2d');
        var ctx = canvas.getContext('2d');
        var ctx2 = canvas2.getContext('2d');

        var multiplier = Math.max((Math.min(image.width, image.height) / 1440), (Math.max(image.width, image.height) / 2560));
        scaledImage.width = image.width * (1 / multiplier);
        scaledImage.height = image.height * (1 / multiplier);
        scaledImageContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, (image.width * (1 / multiplier)), (image.height * (1 / multiplier)));

        var x = 0;
        var y = 0;
        var swap = false;

        canvas.width = scaledImage.width;
        canvas.height = scaledImage.height;

        ctx.save();
        if (orientation == 2) {
          x = -canvas.width;
          ctx.scale(-1, 1);
        } else if (orientation == 3) {
          x = -canvas.width;
          y = -canvas.height;
          ctx.scale(-1, -1);
        } else if (orientation == 4) {
          y = -canvas.height;
          ctx.scale(1, -1);
        } else if (orientation == 5) {
          canvas.width = scaledImage.height;
          canvas.height = scaledImage.width;
          ctx.translate(canvas.width, canvas.height / canvas.width);
          ctx.rotate(Math.PI / 2);
          y = -canvas.width;
          ctx.scale(1, -1);
          swap = true;
        } else if (orientation == 6) {
          canvas.width = scaledImage.height;
          canvas.height = scaledImage.width;
          ctx.translate(canvas.width, canvas.height / canvas.width);
          ctx.rotate(Math.PI / 2);
          swap = true;
        } else if (orientation == 7) {
          canvas.width = scaledImage.height;
          canvas.height = scaledImage.width;
          ctx.translate(canvas.width, canvas.height / canvas.width);
          ctx.rotate(Math.PI / 2);
          x = -canvas.height;
          ctx.scale(-1, 1);
          swap = true;
        } else if (orientation == 8) {
          canvas.width = scaledImage.height;
          canvas.height = scaledImage.width;
          ctx.translate(canvas.width, canvas.height / canvas.width);
          ctx.rotate(Math.PI / 2);
          x = -canvas.height;
          y = -canvas.width;
          ctx.scale(-1, -1);
          swap = true;
        }

        ctx.drawImage(scaledImage, x, y);
        ctx.restore();

        ctx2.save()
        canvas2.width = scaledImage.width;
        canvas2.height = scaledImage.height;

        ctx2.drawImage(scaledImage, 0, 0);

        ctx2.restore();

        if (swap) {
          if (_shouldSwap) {
            resolve([canvas2, canvas]);
          } else {
            resolve([canvas, canvas2]);
          }
        } else {
          resolve([canvas, canvas2]);
        }
      }

      image.src = imageData;
    });
  }

  function getScaledCanvasDimension(originalWidth, originalHeight, orientation, _options) {
    if (orientation === "landscape-primary" || orientation === "landscape-secondary") {
      // var maxTargetWidth = _options.data.configuration.documentType === "License" ? (3.75 * 350) : (5 * 350);
      // var maxTargetHeight = _options.data.configuration.documentType === "License" ? (2.5 * 350) : (3.5 * 350);
      var maxTargetWidth = 2560;
      var maxTargetHeight = 1792;
      var widthProp = originalWidth / maxTargetWidth;
      var heightProp = originalHeight / maxTargetHeight;

      return {
        width: originalWidth / Math.min(widthProp, heightProp),
        height: originalHeight / Math.min(widthProp, heightProp),
      };
    } else {
      // var maxTargetWidth = _options.data.configuration.documentType === "License" ? (2.5 * 350) : (3.5 * 350);
      // var maxTargetHeight = _options.data.configuration.documentType === "License" ? (3.75 * 350) : (5 * 350);
      var maxTargetWidth = 1792;
      var maxTargetHeight = 2560;
      var widthProp = originalWidth / maxTargetWidth;
      var heightProp = originalHeight / maxTargetHeight;

      return {
        width: originalWidth / Math.min(widthProp, heightProp),
        height: originalHeight / Math.min(widthProp, heightProp),
      };
    }
  }

  function getCanvasDimension(originalWidth, originalHeight, orientation, currentOptions) {
    if (orientation === "landscape-primary" || orientation === "landscape-secondary") {
      var maxTargetWidth = 1920;
      var maxTargetHeight = 1080;
      var widthProp = originalWidth / maxTargetWidth;
      var heightProp = originalHeight / maxTargetHeight;

      if (originalWidth < maxTargetWidth && originalHeight < maxTargetHeight) {
        // Case 1 : If Input Image width and Hight are smaller than max return original values
        return {
          width: originalWidth,
          height: originalHeight
        };
      } else {
        // Need to resize, so find scale ratio
        if (widthProp > heightProp) {
          // If WidthProp is greater than HeightProp
          if (widthProp < 1) {
            // Case 2 : If width is smaller than max width, then return original sizes
            return {
              width: originalWidth,
              height: originalHeight
            }
          } else {
            // Case 3 : If width is greater than max width, in this case widthProp will be greater than heightProp
            return {
              width: maxTargetWidth,
              height: originalHeight * (1 / widthProp)
            }
          }
        } else if (widthProp < heightProp) {
          // If WidthProp is less than heightProp
          if (heightProp < 1) {
            // Case 4 : If heightProp is less than 1, that mean height is less than maxHeight, then return original size
            return {
              width: originalWidth,
              height: originalHeight
            };
          } else {
            // Case 5 : If heightProp is greater than 1, that means height is greater than maxheigh
            return {
              width: originalWidth * (1 / heightProp),
              height: maxTargetHeight,
            }
          }
        } else {
          return {
            width: maxTargetWidth,
            height: maxTargetHeight
          };
        }
      }
    } else {
      var maxTargetWidth = 1080;
      var maxTargetHeight = 1920;
      var widthProp = originalWidth / maxTargetWidth;
      var heightProp = originalHeight / maxTargetHeight;

      if (originalWidth < maxTargetWidth && originalHeight < maxTargetHeight) {
        // Case 1 : If Input Image width and Hight are smaller than max return original values
        return {
          width: originalWidth,
          height: originalHeight
        };
      } else {
        // Need to resize, so find scale ratio
        if (widthProp > heightProp) {
          // If WidthProp is greater than HeightProp
          if (widthProp < 1) {
            // Case 2 : If width is smaller than max width, then return original sizes
            return {
              width: originalWidth,
              height: originalHeight
            }
          } else {
            // Case 3 : If width is greater than max width, in this case widthProp will be greater than heightProp
            return {
              width: maxTargetWidth,
              height: originalHeight * (1 / widthProp)
            }
          }
        } else if (widthProp < heightProp) {
          // If WidthProp is less than heightProp
          if (heightProp < 1) {
            // Case 4 : If heightProp is less than 1, that mean height is less than maxHeight, then return original size
            return {
              width: originalWidth,
              height: originalHeight
            };
          } else {
            // Case 5 : If heightProp is greater than 1, that means height is greater than maxheigh
            return {
              width: originalWidth * (1 / heightProp),
              height: maxTargetHeight,
            }
          }
        } else {
          return {
            width: maxTargetWidth,
            height: maxTargetHeight
          };
        }
      }
    }
  }

  function selectDocument(_currentFrame) {
    var currentFrame = _currentFrame == null ? _currentOptions.data.result.processed[_currentOptions.data.result.processed.length - 1] : _currentFrame;
    var currentConfig = _currentOptions.data.configuration;

    if (currentFrame != null) {
      if (currentConfig.captureSubType === "Front") {
        var faceDetectedStatus = isDocumentFaceDetected(currentConfig, currentFrame);
        var focusStatus = isDocumentFocused(currentConfig.frontFocusThreshold, currentFrame);
        var glareStatus = isDocumentGlared(currentConfig.frontGlareThreshold, currentFrame);
        var failType = 0;

        if (((faceDetectedStatus === "Yes" || faceDetectedStatus === "Disabled") && focusStatus === "Yes" && glareStatus === "Yes") || (_currentOptions.data.result.eventCount >= currentConfig.frontCaptureAttempts)) {
          _currentOptions.callback.frontFocus = currentFrame.focus.toFixed(0);
          _currentOptions.callback.frontGlare = currentFrame.glare.toFixed(0);
          _currentOptions.callback.isFaceDetected = currentFrame.faceDetected;
          _currentOptions.callback.result = generateExifEnabledImage(currentFrame);

          log("Final ADA Message Set");
          jQuery("#aidDivDocumentCamera #aidOverlayMessage").text((_currentOptions.data.configuration.notificationADA != null ? _currentOptions.data.configuration.notificationADA : ""));

          var currentOptions = _currentOptions;
          setTimeout(function() {
            currentOptions.callback.callOnFinish();
            jQuery("#aidDivDocumentCamera").remove();
            jQuery("body").css("overflow", "");

            if (DeviceInfo.isShowNativeCamera() === false) {
              stopWebCam();
            }

            _currentOptions = null;
          }, 200);
        } else {
          if (faceDetectedStatus === "No") failType = 1;
          if (focusStatus === "No") failType = 2;
          if (glareStatus === "No") failType = 3;

          if (DeviceInfo.isShowNativeCamera() === false) {
            _currentOptions.data.configuration.processingPaused = true;
          }

          _currentOptions.callback.fireUiEvent(
            failType,
            errorMap[failType], {
              focusStatus: focusStatus,
              focusValue: currentFrame.focus,
              glareStatus: glareStatus,
              glareValue: currentFrame.glare,
              faceDetectionStatus: faceDetectedStatus,
              faceDetectionValue: currentFrame.faceDetectionProportion == null ? 0 : currentFrame.faceDetectionProportion,
              eventCount: _currentOptions.data.result.eventCount++,
              image: currentFrame.canvasContext
            }
          );
        }
      } else if (currentConfig.captureSubType === "Back") {
        var barcodeDetectedStatus = isDocumentBarcodeDetected(currentConfig, currentFrame);
        var focusStatus = isDocumentFocused(currentConfig.backFocusThreshold, currentFrame);
        var glareStatus = isDocumentGlared(currentConfig.backGlareThreshold, currentFrame);
        var failType = 0;

        if ((barcodeDetectedStatus === "Yes" && currentConfig.enableBarcodeDetection && currentConfig.captureMode === "Auto") ||
          ((barcodeDetectedStatus === "Yes" || barcodeDetectedStatus === "Disabled") && focusStatus === "Yes" && glareStatus === "Yes") ||
          (_currentOptions.data.result.eventCount >= currentConfig.backCaptureAttempts)) {
          _currentOptions.callback.backfocus = currentFrame.focus.toFixed(0);
          _currentOptions.callback.backGlare = currentFrame.glare.toFixed(0);
          _currentOptions.callback.isBarcodeDetected = currentFrame.barcodeDetected;
          _currentOptions.callback.result = generateExifEnabledImage(currentFrame);

          jQuery("#aidDivDocumentCamera #aidOverlayMessage").text((_currentOptions.data.configuration.notificationADA != null ? _currentOptions.data.configuration.notificationADA : ""));

          var currentOptions = _currentOptions;
          setTimeout(function() {
            currentOptions.callback.callOnFinish();
            jQuery("#aidDivDocumentCamera").remove();
            jQuery("body").css("overflow", "");

            if (DeviceInfo.isShowNativeCamera() === false) {
              stopWebCam();
            }

            _currentOptions = null;
          }, 200);
        } else {
          if (barcodeDetectedStatus === "No") failType = 4;
          if (focusStatus === "No") failType = 2;
          if (glareStatus === "No") failType = 3;

          if (DeviceInfo.isShowNativeCamera() === false) {
            _currentOptions.data.configuration.processingPaused = true;
          }

          _currentOptions.callback.fireUiEvent(
            failType,
            errorMap[failType], {
              focusStatus: focusStatus,
              focusValue: currentFrame.focus,
              glareStatus: glareStatus,
              glareValue: currentFrame.glare,
              barcodeDetectionStatus: barcodeDetectedStatus,
              eventCount: _currentOptions.data.result.eventCount++,
              image: currentFrame.canvasContext
            }
          );
        }
      }
    } else {
      jQuery("#aidDivDocumentCamera").one('click', function() {
        selectDocument();
      });
    }
  }

  function selectSelfie() {
    var currentFrame = _currentOptions.data.result.processed[_currentOptions.data.result.processed.length - 1];
    var currentConfig = _currentOptions.data.configuration;

    if (currentFrame != null) {
      if (currentConfig.captureSubType === "Near") {
        var faceDetectedStatus = isSelfieFaceDetected(currentConfig, currentFrame);
        var failType = 0;

        if ((faceDetectedStatus === "Yes" || faceDetectedStatus === "Disabled") || (_currentOptions.data.result.eventCount >= currentConfig.captureAttempts)) {
          _currentOptions.callback.isFaceDetected = currentFrame.faceDetected;
          _currentOptions.callback.result = generateExifEnabledImage(currentFrame);

          jQuery("#aidDivDocumentCamera #aidOverlayMessage").text((_currentOptions.data.configuration.notificationADA != null ? _currentOptions.data.configuration.notificationADA : ""));

          var currentOptions = _currentOptions;
          setTimeout(function() {
            currentOptions.callback.callOnFinish();
            jQuery("#aidDivDocumentCamera").remove();
            jQuery("body").css("overflow", "");

            if (DeviceInfo.isShowNativeCamera() === false) {
              stopWebCam();
            }

            _currentOptions = null;
          }, 200);
        } else {
          if (faceDetectedStatus === "No") failType = 1;

          if (DeviceInfo.isShowNativeCamera() === false) {
            _currentOptions.data.configuration.processingPaused = true;
          }

          _currentOptions.callback.fireUiEvent(
            failType,
            errorMap[failType], {
              faceDetectionStatus: faceDetectedStatus,
              faceDetectionValue: currentFrame.faceDetectionProportion == null ? 0 : currentFrame.faceDetectionProportion,
              eventCount: _currentOptions.data.result.eventCount++,
              image: currentFrame.canvasContext
            }
          );
        }
      } else {
        var faceDetectedStatus = isSelfieFaceDetected(currentConfig, currentFrame);
        var failType = 0;

        if ((faceDetectedStatus === "Yes" || faceDetectedStatus === "Disabled") || (_currentOptions.data.result.eventCount >= currentConfig.captureAttempts)) {
          _currentOptions.callback.isFaceDetected = currentFrame.faceDetected;
          _currentOptions.callback.result = generateExifEnabledImage(currentFrame);

          jQuery("#aidDivDocumentCamera #aidOverlayMessage").text((_currentOptions.data.configuration.notificationADA != null ? _currentOptions.data.configuration.notificationADA : ""));

          var currentOptions = _currentOptions;
          setTimeout(function() {
            currentOptions.callback.callOnFinish();
            jQuery("#aidDivDocumentCamera").remove();
            jQuery("body").css("overflow", "");

            if (DeviceInfo.isShowNativeCamera() === false) {
              stopWebCam();
            }

            _currentOptions = null;
          }, 200);
        } else {
          if (faceDetectedStatus === "No") failType = 1;

          if (DeviceInfo.isShowNativeCamera() === false) {
            _currentOptions.data.configuration.processingPaused = true;
          }

          _currentOptions.callback.fireUiEvent(
            failType,
            errorMap[failType], {
              faceDetectionStatus: faceDetectedStatus,
              faceDetectionValue: currentFrame.faceDetectionProportion == null ? 0 : currentFrame.faceDetectionProportion,
              eventCount: _currentOptions.data.result.eventCount++,
              image: currentFrame.canvasContext
            }
          );
        }
      }
    } else {
      jQuery("#aidDivDocumentCamera #aidBtnCapture").one('click', function() {
        selectSelfie();
      });
    }
  }

  function isDocumentFrontStable(currentConfig, bulkFrames) {
    var result = 0;
    bulkFrames.forEach(function(currentFrame) {
      var faceDetectedStatus = isDocumentFaceDetected(currentConfig, currentFrame);
      var focusStatus = isDocumentFocused(currentConfig.frontFocusThreshold, currentFrame);
      var glareStatus = isDocumentGlared(currentConfig.frontGlareThreshold, currentFrame);

      if ((faceDetectedStatus === "Yes" || faceDetectedStatus === "Disabled") && focusStatus === "Yes" && glareStatus === "Yes") {
        result += 1;
      }
    });

    return result === bulkFrames.length ? true : false;
  }

  function isDocumentBackStable(currentConfig, bulkFrames) {
    var result = 0;
    bulkFrames.forEach(function(currentFrame) {
      var barcodeDetectedStatus = isDocumentBarcodeDetected(currentConfig, currentFrame);
      var focusStatus = isDocumentFocused(currentConfig.backFocusThreshold, currentFrame);
      var glareStatus = isDocumentGlared(currentConfig.backGlareThreshold, currentFrame);

      if (barcodeDetectedStatus === "Yes" && currentConfig.enableBarcodeDetection && currentConfig.captureMode === "Auto") {
        result += 1;
      } else if ((barcodeDetectedStatus === "Yes" || barcodeDetectedStatus === "Disabled") && focusStatus === "Yes" && glareStatus === "Yes") {
        result += 1;
      }
    });

    return result === bulkFrames.length ? true : false;
  }

  function isSelfieNearStable(currentConfig, bulkFrames) {
    var result = 0;
    bulkFrames.forEach(function(currentFrame) {
      var faceDetectedStatus = isSelfieFaceDetected(currentConfig, currentFrame);

      if ((faceDetectedStatus === "Yes" || faceDetectedStatus === "Disabled")) {
        result += 1;
      }
    });

    return result === bulkFrames.length ? true : false;
  }

  function isSelfieFarStable(currentConfig, bulkFrames) {
    var result = 0;
    bulkFrames.forEach(function(currentFrame) {
      var faceDetectedStatus = isSelfieFaceDetected(currentConfig, currentFrame);

      if ((faceDetectedStatus === "Yes" || faceDetectedStatus === "Disabled")) {
        result += 1;
      }
    });

    return result === bulkFrames.length ? true : false;
  }

  function isDocumentFaceDetected(currentConfig, currentFrame) {
    if (currentConfig.enableFaceDetection) {
      if (currentFrame.faceDetected &&
        (
          (
            currentConfig.documentType == "Passport" &&
            currentFrame.faceDetectionProportion > currentConfig.passportFaceDetectionProportionMin &&
            currentFrame.faceDetectionProportion < currentConfig.passportFaceDetectionProportionMax
          ) ||
          (
            currentConfig.documentType === "License" &&
            currentFrame.faceDetectionProportion > currentConfig.licenseFaceDetectionProportionMin &&
            currentFrame.faceDetectionProportion < currentConfig.licenseFaceDetectionProportionMax
          ) ||
          (
            DeviceInfo.isShowNativeCamera() == true
          )
        )
      ) {
        return "Yes";
      } else {
        return "No";
      }
    } else {
      return "Disabled";
    }
  }

  function isDocumentFocused(focusThreshold, currentFrame) {
    if (DeviceInfo.isShowNativeCamera() === true) {
      currentFrame.focus *= _currentOptions.data.configuration.nativeCameraFocusMultiplier;
    }

    log("isDocumentFocused " + currentFrame.focus + " < " + focusThreshold);

    if (currentFrame.focus > focusThreshold) {
      return "Yes";
    } else {
      return "No";
    }
  }

  function isDocumentGlared(glareThreshold, currentFrame) {
    log("isDocumentGlared " + currentFrame.glare + " < " + glareThreshold);

    if (currentFrame.glare < glareThreshold || glareThreshold === 0) {
      return "Yes";
    } else {
      return "No";
    }
  }

  function isDocumentBarcodeDetected(currentConfig, currentFrame) {
    if (currentConfig.enableBarcodeDetection) {
      if (currentFrame.barcodeDetected) {
        return "Yes";
      } else {
        return "No";
      }
    } else {
      return "Disabled";
    }
  }

  function isSelfieFaceDetected(currentConfig, currentFrame) {
    if (currentConfig.enableFaceDetection) {
      if (DeviceInfo.isShowNativeCamera() === true) {
        return currentFrame.faceDetected ? "Yes" : "No";
      } else {
        if (currentFrame.faceDetected) {
          if (currentConfig.captureSubType === "Near") {
            if (currentFrame.faceDetectionProportion > _currentOptions.data.configuration.nearSelfieFaceDetectionProportionMin && currentFrame.faceDetectionProportion < _currentOptions.data.configuration.nearSelfieFaceDetectionProportionMax) {
              return "Yes";
            } else {
              return "No";
            }
          } else if (currentConfig.captureSubType === "Far") {
            if (currentFrame.faceDetectionProportion > _currentOptions.data.configuration.farSelfieFaceDetectionProportionMin && currentFrame.faceDetectionProportion < _currentOptions.data.configuration.farSelfieFaceDetectionProportionMax) {
              return "Yes";
            } else {
              return "No";
            }
          }
        } else {
          return "No";
        }
      }
    } else {
      return "Disabled";
    }
  }

  function generateExifEnabledImage(currentFrame) {
    var currentOptions = _currentOptions.data.configuration;

    if (currentOptions.captureType === "Document") {
      var date = new Date();
      var xmp = {
        "Xmp.IDM.MobileSDK.CaptureMode": currentOptions.captureMode.toUpperCase(),
        "Xmp.IDM.MobileSDK.DocumentType": currentOptions.documentType.toUpperCase(),
        "Xmp.IDM.MobileSDK.CompressionType": "JPEG",
        "Xmp.IDM.MobileSDK.OS": (isIOS() ? "IOS" : (isAndroid() ? "Android" : (isWindows() ? "Windows" : ""))),
        "Xmp.IDM.MobileSDK.TimeStamp": ("0" + (date.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + (date.getUTCDate())).slice(-2) + "/" + date.getUTCFullYear() + " " + ("0" + (date.getUTCHours())).slice(-2) + ":" + ("0" + (date.getUTCMinutes())).slice(-2) + ":" + ("0" + (date.getUTCSeconds())).slice(-2),
        "Xmp.IDM.MobileSDK.FocusThreshold": (currentOptions.captureSubType === "Front" ? currentOptions.frontFocusThreshold : currentOptions.backFocusThreshold).toString(),
        "Xmp.IDM.MobileSDK.CaptureType": "Live",
        "Xmp.IDM.MobileSDK.GlareThreshold": (currentOptions.captureSubType === "Front" ? currentOptions.frontGlareThreshold : currentOptions.backGlareThreshold).toString(),
        "Xmp.IDM.MobileSDK.TimeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
        "Xmp.IDM.MobileSDK.Height": (currentFrame.h1).toString(),
        "Xmp.IDM.MobileSDK.Width": (currentFrame.w1).toString(),
        "Xmp.IDM.MobileSDK.Source": "Web"
      };

      if (gps != null) {
        xmp["Xmp.IDM.MobileSDK.Lon"] = (gps.coords.longitude).toString();
        xmp["Xmp.IDM.MobileSDK.Lat"] = (gps.coords.latitude).toString();
      }

      var exifObj = piexif.load(currentFrame.canvasContext);
      var exifStr = piexif.dump(exifObj);
      var inserted = piexif.insert(exifStr, xmp, currentFrame.canvasContext);

      return inserted;
    } else {
      return currentFrame.canvasContext;
    }
  }

  function notifyImageQuailityStatus(isGood) {
    try {
      if (jQuery("#aidDivDocumentCamera #aidOverlayMessage").text() !== _currentOptions.data.configuration.notificationADA) {
        if (isGood) {
          if (jQuery("#aidDivDocumentCamera #aidOverlayMessage").text() !== _currentOptions.data.configuration.goodImageFoundADA) {
            log("Good Image ADA Message Set");
            jQuery("#aidDivDocumentCamera #aidOverlayMessage").text(_currentOptions.data.configuration.goodImageFoundADA);
          }
        } else {
          if (jQuery("#aidDivDocumentCamera #aidOverlayMessage").text() !== _currentOptions.data.configuration.notGoodImageADA) {
            log("Wrong Image ADA Message Set");
            jQuery("#aidDivDocumentCamera #aidOverlayMessage").text(_currentOptions.data.configuration.notGoodImageADA);
          }
        }
      }
    } catch (e) {
      log(e);
    }
  }

  function postMessage() {
    imageWorker.postMessage({
      options: {
        configuration: _currentOptions.data.configuration,
        result: {
          processed: _currentOptions.data.result.processed,
          toProcess: _currentOptions.data.result.toProcess
        }
      }
    });
  }

  function updateAutoMode(newAutoMode) {
    log("Auto Mode updated to " + newAutoMode);
    if (_currentOptions.data.configuration.captureMode !== newAutoMode) {
      _currentOptions.data.configuration.captureMode = newAutoMode;

      if (_currentOptions.data.configuration.captureType === "Selfie") {
        jQuery("#aidDivDocumentCamera #aidAutoMode").text((_currentOptions.data.configuration.showCaptureModeText ? (_currentOptions.data.configuration.captureMode === "Auto" ? "Auto" : "Manual") : ""));
        jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").html(_currentOptions.data.configuration.captureMode === "Auto" ? _currentOptions.data.configuration.overlayTextAuto : _currentOptions.data.configuration.overlayTextManual);
        jQuery("#aidDivDocumentCamera #aidOverlayMessage").text(_currentOptions.data.configuration.captureMode === "Auto" ? _currentOptions.data.configuration.overlayTextAutoADA : _currentOptions.data.configuration.overlayTextManualADA);

        if (_currentOptions.data.configuration.captureMode === "Manual") {
          jQuery("#aidDivDocumentCamera #aidBtnCapture").one('click', function() {
            selectSelfie();
          });
        }

        setTimeout(function() {
          _currentOptions.data.configuration = _currentOptions.callback.fireOnCaptureModeChange(_currentOptions.data.configuration.captureMode, _currentOptions.data.configuration);
        }, 100);
      } else {
        jQuery("#aidDivDocumentCamera #aidAutoMode").text((_currentOptions.data.configuration.showCaptureModeText ? (_currentOptions.data.configuration.captureMode === "Auto" ? "Auto" : "Manual") : ""));
        jQuery("#aidDivDocumentCamera #aidVisibleMessageLine").html(_currentOptions.data.configuration.captureMode === "Auto" ? _currentOptions.data.configuration.overlayTextAuto : _currentOptions.data.configuration.overlayTextManual);
        jQuery("#aidDivDocumentCamera #aidOverlayMessage").text(_currentOptions.data.configuration.captureMode === "Auto" ? _currentOptions.data.configuration.overlayTextAutoADA : _currentOptions.data.configuration.overlayTextManualADA);

        // if (_currentOptions.data.configuration.captureMode === "Manual" && (_currentOptions.data.configuration.captureSubType !== "Front")) {
        //   _currentOptions.data.configuration.enableBarcodeDetection = false;
        // }

        if (_currentOptions.data.configuration.captureMode === "Manual") {
          jQuery("#aidDivDocumentCamera").one('click', function() {
            selectDocument();
          });
        }

        setTimeout(function() {
          _currentOptions.data.configuration = _currentOptions.callback.fireOnCaptureModeChange(_currentOptions.data.configuration.captureMode, _currentOptions.data.configuration);
        }, 100);
      }
    }
  }

  function stopWebCam() {
    try {
      if (_currentOptions.data.result.MediaStream != null) {
        _currentOptions.data.result.MediaStream.stop();
      }
    } catch (e) {
      log("Ignored error " + e);
    }
  }

  function getSDKVersion() {
    return "4.3.0.1";
  }
})(typeof exports === 'undefined' ? this['WebSDKUI'] = {} : exports);

/*Inluding the helper files to detect focus, glare and face through opencv.*/
if (typeof WebSdk != "undefined") {
  window.onCaptureFrameworkLoadFailed = function(error) {
    WebSdk.onCaptureFrameworkLoaded();
    return;
  };

  var DLFrontSettings, DLBackSettings, passportSettings, selfieSettings, farSelfieSettings = '',
    capture;
  var isSelfieCaptureStart = false;

  window.onCaptureFrameworkLoaded = function() {
    WebSdk.onCaptureFrameworkLoaded();
    capture = this.IDMetricsCaptureFramework;
    DeviceInfo.isShowNativeCamera = function() {
      if (true) {
        return false;
      }
    }
  };

  function getSDKVersion() {
    try {
      capture.GetSDKVersion(function(sdkVersion) {
        console.log(sdkVersion);
        WebSdk.showSDKVersion(sdkVersion)
        return;
      });
      return true;
    } catch (w) {

    }
  }

  function captureDocument(dc) {
    var captureResult = new CaptureResult();

    captureResult.setOnAborted(function(e) {
      a = correctJson(captureResult);
      WebSdk.onAborted(JSON.stringify(a), e);

    });

    captureResult.setOnEvent(function(erorCode, errorDesc) {
      a = correctJson(captureResult);
      WebSdk.onEvent(JSON.stringify(a), erorCode, errorDesc);
    });

    captureResult.setOnFinish(function() {
      a = correctJson(captureResult);
      WebSdk.onFinish(JSON.stringify(a));

    });
    capture.scanDocument(dc, captureResult);
  }

  function correctJson(captureResult) {
    var a = {};
    try {
      a['frontfocus'] = captureResult.frontfocus;
    } catch (e) {}
    try {
      a['frontGlare'] = captureResult.frontGlare
    } catch (e) {

    }
    try {

      a['backfocus'] = captureResult.backfocus
    } catch (e) {

    }
    try {
      a['backGlare'] = captureResult.backGlare

    } catch (e) {

    }
    try {
      a['isFaceDetected'] = captureResult.isFaceDetected

    } catch (e) {

    }
    try {
      a['result'] = captureResult.result

    } catch (e) {

    }
    return a;
  }

  function captureSelfie(cs) {
    var selfieCaptureResult = new CaptureResult();
    selfieCaptureResult.setOnAborted(function(e) {
      a = correctJson(selfieCaptureResult);
      WebSdk.onAborted(JSON.stringify(a), e);
    });

    selfieCaptureResult.setOnEvent(function(erorCode, errorDesc) {
      a = correctJson(selfieCaptureResult);
      WebSdk.onEvent(JSON.stringify(a), erorCode, errorDesc);
    });

    selfieCaptureResult.setOnFinish(function() {
      a = correctJson(selfieCaptureResult);
      WebSdk.onFinish(JSON.stringify(a));
    });

    capture.scanSelfie(cs, selfieCaptureResult);
  }
}

var errorMap = {
  1: "no faces found",
  2: "bad focus",
  3: 'bad glare',
  4: 'No Barcode'
}