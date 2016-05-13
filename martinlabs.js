"use strict";
(function (factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require("jquery"), require("moment"));
    } else if (typeof define === 'function' && define.amd) {
        define("martinlabs", ["jquery", "moment"], factory);
    } else {
        window.martinlabs = factory(window.jQuery, window.moment);
    }
}(function ($, moment) {

    var martinlabs = {};
    
    martinlabs.bodyRequest = function(url, data, success) { 
        $.ajax({
            type: "POST",
            url: url,
            processData: false,
            contentType: 'application/json',
            data: encodeURI(JSON.stringify(data)),
            success: success
        });
    };

    martinlabs.cookie = {
        set: function(name,value,exdays){
                
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value=escape(value) + ((exdays==null) ? "" : ";expires="+exdate.toUTCString()) + ";path=/";
            document.cookie=name + "=" + c_value.replace("@", "%40");
        },
        get: function(name){
            var i, x, y, ARRcookies = document.cookie.split(";");
            for(i = 0; i<ARRcookies.length; i++){
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                x = x.replace(/^\s+|\s+$/g,"");
                if (x == name){
                    return unescape(y).replace("%40", "@");
                }
            }
        },
        del: function (name) {
            document.cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/";
        }
    };

    martinlabs.url = function (str) {
      var o   = martinlabs.url.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

      while (i--) uri[o.key[i]] = m[i] || "";

      uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
      });

      return uri;
    };

    martinlabs.url.options = {
      strictMode: false,
      key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
      q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };

    martinlabs.getParam = function(parameter) {  
        var loc = location.search.substring(1, location.search.length);   
        var param_value = null;   
        var params = loc.split("&");   
        for (var i = 0; i < params.length; i++) {   
            var param_name = params[i].substring(0,params[i].indexOf('='));   
            if (param_name === parameter) {                       
                param_value = params[i].substring(params[i].indexOf('=')+1)   
            }   
        }    

        if (param_value) {
          return decodeURIComponent(param_value);
        } else {
          return param_value;
        }
    };

    martinlabs.hash = {
        
        get: function(parameter) {  
            var loc = location.hash.substring(1, location.hash.length);   
            var param_value = null;   
            var params = loc.split("&");   
            for (var i = 0; i < params.length; i++) {   
                var param_name = params[i].substring(0,params[i].indexOf('='));   
                if (param_name === parameter) {               
                    param_value = params[i].substring(params[i].indexOf('=')+1); 
                }   
            }   

            if (param_value && param_value.length) {
                param_value = decodeURI(param_value);
            }

            return param_value;
        },
        
        set: function(name, value) {
            if (!location.hash.length) {
                location.hash = name + "=" + value;
                return;
            }
            
            if (location.hash.indexOf(name) === -1) {
                location.hash += "&" + name + "=" + value;
                return;
            }
            
            var regex = new RegExp("("+name+"=)[^&]*(&|$)");
            
            location.hash = location.hash.replace(regex, name + "=" + value + "&");
        }
    
    };
    
    martinlabs.format = {
        dataToInt: function(d) {
            //qtd de dias
            return moment(d).diff(moment(0, "HH"), "days");
        },

        data: function(d)
        {
            moment.locale("pt");
            return moment(d).format("ddd, DD/MMMM");
        },

        dataHora: function(d)
        {
            moment.locale("pt");
            return moment(d).format("ddd, DD/MMMM HH:mm");
        },

        dataHoraMinuto: function(d)
        {
            moment.locale("pt");
            return moment(d).format("DD/MM/YY HH:mm");
        },

        hora: function(d)
        {
            moment.locale("pt");
            return moment(d).format("HH:mm");
        },

        dias: function(d)
        {
            return this.diasInt(this.dataToInt(d));
        },

        diasInt: function(dias)
        {

            if (dias === 0)
            {
                return "hoje";
            }
            else if (dias === 1)
            {
                return "amanhã";
            }
            else if (dias === -1)
            {
                return "ontem";
            }
            else if (dias < 0)
            {
                return Math.abs(dias) + " dias atrás";
            }
            else
            {
                return dias + " dias";
            }
        },

        diasOuData: function(d) 
        {
            var dias = this.dataToInt(d);

            if (dias > 6 || dias < -6) {
              return this.data(d);
            } else {
              return this.diasInt(dias);
            }
        },

        diasHoraOuDataHora: function(d) 
        {
            var dias = this.dataToInt(d);

            if (dias > 6) {
              return this.dataHora(d);
            } else {
              return this.diasInt(dias) + " " + this.hora(d);
            }
        },

        horaOuDiaHoraOuDataHora: function(d) 
        {
            var dias = this.dataToInt(d);

            if (dias === 0) {
              return this.hora(d);
            } else {
              return this.diasHoraOuDataHora(d);
            }
        },

        preco: function(preco)
        {

            return "R$" + preco.toFixed(2).replace(".", ",").replace(/\d(?=(\d{3})+\,)/g, '$&.');
        },

        peso: function(peso)
        {
            if (peso > 1000)
            {
                return (peso / 1000).toFixed(2).replace(".", ",") + "T";
            }
            else
            {
                return peso.toFixed(2).replace(".", ",") + "Kg";
            }
        },
        
        endereco: function(endereco)
        {
            return endereco.Rua + " " + endereco.Numero + ", " + endereco.Cidade + " - " + endereco.Estado;
        },

        telefone: function(tel)
        {
            return tel.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }
    };

    martinlabs.type = {
        
        /**
         * check if param is a function
         * @param {any} functionToCheck
         * @returns {boolean}
         */
        isFunction: function(functionToCheck){
            return functionToCheck != null && {}.toString.call(functionToCheck) === '[object Function]';
        },

        /**
         * check if param is a string
         * @param {any} stringToCheck
         * @returns {boolean}
         */
        isString: function(stringToCheck){
            return typeof stringToCheck == 'string' || stringToCheck instanceof String;
        },

        /**
         * check if param is an valid number
         * @param {any} numberToCheck
         * @returns {boolean}
         */
        isNumber: function(numberToCheck) {
            return !isNaN(parseFloat(numberToCheck)) && isFinite(numberToCheck);
        },

        /**
        * check if param is an array
         * @param {any} arrayToCheck
         * @returns {boolean}
        */
        isArray: function(arrayToCheck){
            return arrayToCheck != null && {}.toString.call(arrayToCheck) === '[object Array]';
        },

        /**
        * check if param is an object
         * @param {any} objectToCheck
         * @returns {boolean}
        */
        isObject: function(objectToCheck){
            return objectToCheck != null 
            && typeof objectToCheck === 'object' 
            && !isFunction(objectToCheck) 
            && !isString(objectToCheck)
            && !isNumber(objectToCheck)
            && !isArray(objectToCheck);
        },
        
        isValidEmail: function(email) { 
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        
        isValidCpf: function(cpf){
            if (cpf.replace) {
                cpf = cpf.replace(/\./g, "");
                cpf = cpf.replace(/\-/g, "");
            }
            
            var numeros, digitos, soma, i, resultado, digitos_iguais;
            digitos_iguais = 1;
            if (cpf.length < 11)
                  return false;
            for (i = 0; i < cpf.length - 1; i++)
                  if (cpf.charAt(i) != cpf.charAt(i + 1))
                        {
                        digitos_iguais = 0;
                        break;
                        }
            if (!digitos_iguais)
                  {
                  numeros = cpf.substring(0,9);
                  digitos = cpf.substring(9);
                  soma = 0;
                  for (i = 10; i > 1; i--)
                        soma += numeros.charAt(10 - i) * i;
                  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                  if (resultado != digitos.charAt(0))
                        return false;
                  numeros = cpf.substring(0,10);
                  soma = 0;
                  for (i = 11; i > 1; i--)
                        soma += numeros.charAt(11 - i) * i;
                  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                  if (resultado != digitos.charAt(1))
                        return false;
                  return true;
                  }
            else
                return false;
        },
        
        isValidCnpj: function(cnpj) {
            cnpj = cnpj.replace(/[^\d]+/g,'');
 
            if(cnpj == '') return false;

            if (cnpj.length != 14)
                return false;

            // Elimina CNPJs invalidos conhecidos
            if (cnpj == "00000000000000" || 
                cnpj == "11111111111111" || 
                cnpj == "22222222222222" || 
                cnpj == "33333333333333" || 
                cnpj == "44444444444444" || 
                cnpj == "55555555555555" || 
                cnpj == "66666666666666" || 
                cnpj == "77777777777777" || 
                cnpj == "88888888888888" || 
                cnpj == "99999999999999")
                return false;

            // Valida DVs
            var tamanho = cnpj.length - 2
            var numeros = cnpj.substring(0,tamanho);
            var digitos = cnpj.substring(tamanho);
            var soma = 0;
            var pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
              soma += numeros.charAt(tamanho - i) * pos--;
              if (pos < 2)
                    pos = 9;
            }
            
            var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (var i = tamanho; i >= 1; i--) {
              soma += numeros.charAt(tamanho - i) * pos--;
              if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                  return false;

            return true;
        },
        
        isValidTel: function(tel) {
            if (!tel || !tel.length)
                return false;

            tel = tel.replace(/-/g, "");
            return this.isNumber(tel);
        }
    };

    martinlabs.sha1 = (function(){

        var sha1 = {};  // Sha1 namespace

        /**
         * Generates SHA-1 hash of string
         *
         * @param {String} msg                String to be hashed
         * @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
         * @returns {String}                  Hash of msg as hex character string
         */
        sha1.hash = function(msg, utf8encode) {
          utf8encode =  (typeof utf8encode === 'undefined') ? true : utf8encode;

          // convert string to UTF-8, as SHA only deals with byte-streams
          if (utf8encode) msg = Utf8.encode(msg);

          // constants [§4.2.1]
          var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

          // PREPROCESSING 

          msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

          // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
          var l = msg.length/4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length
          var N = Math.ceil(l/16);   // number of 16-integer-blocks required to hold 'l' ints
          var M = new Array(N);

          for (var i=0; i<N; i++) {
            M[i] = new Array(16);
            for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
              M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
                (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
            } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
          }
          // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
          // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
          // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
          M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
          M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

          // set initial hash value [§5.3.1]
          var H0 = 0x67452301;
          var H1 = 0xefcdab89;
          var H2 = 0x98badcfe;
          var H3 = 0x10325476;
          var H4 = 0xc3d2e1f0;

          // HASH COMPUTATION [§6.1.2]

          var W = new Array(80); var a, b, c, d, e;
          for (var i=0; i<N; i++) {

            // 1 - prepare message schedule 'W'
            for (var t=0;  t<16; t++) W[t] = M[i][t];
            for (var t=16; t<80; t++) W[t] = sha1.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);

            // 2 - initialise five working variables a, b, c, d, e with previous hash value
            a = H0; b = H1; c = H2; d = H3; e = H4;

            // 3 - main loop
            for (var t=0; t<80; t++) {
              var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
              var T = (sha1.ROTL(a,5) + sha1.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
              e = d;
              d = c;
              c = sha1.ROTL(b, 30);
              b = a;
              a = T;
            }

            // 4 - compute the new intermediate hash value
            H0 = (H0+a) & 0xffffffff;  // note 'addition modulo 2^32'
            H1 = (H1+b) & 0xffffffff; 
            H2 = (H2+c) & 0xffffffff; 
            H3 = (H3+d) & 0xffffffff; 
            H4 = (H4+e) & 0xffffffff;
          }

          return sha1.toHexStr(H0) + sha1.toHexStr(H1) + 
            sha1.toHexStr(H2) + sha1.toHexStr(H3) + sha1.toHexStr(H4);
        };

        //
        // function 'f' [§4.1.1]
        //
        sha1.f = function(s, x, y, z)  {
          switch (s) {
          case 0: return (x & y) ^ (~x & z);           // Ch()
          case 1: return x ^ y ^ z;                    // Parity()
          case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
          case 3: return x ^ y ^ z;                    // Parity()
          }
        };

        //
        // rotate left (circular left shift) value x by n positions [§3.2.5]
        //
        sha1.ROTL = function(x, n) {
          return (x<<n) | (x>>>(32-n));
        };

        //
        // hexadecimal representation of a number 
        //   (note toString(16) is implementation-dependant, and  
        //   in IE returns signed numbers when used on full words)
        //
        sha1.toHexStr = function(n) {
          var s="", v;
          for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
          return s;
        };


        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
        /*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
        /*              single-byte character encoding (c) Chris Veness 2002-2010                         */
        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

        var Utf8 = {};  // Utf8 namespace

        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        Utf8.encode = function(strUni) {
          // use regular expressions & String.replace callback function for better efficiency 
          // than procedural approaches
          var strUtf = strUni.replace(
              /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
              function(c) { 
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
            );
          strUtf = strUtf.replace(
              /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
              function(c) { 
                var cc = c.charCodeAt(0); 
                return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
            );
          return strUtf;
        };

        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        Utf8.decode = function(strUtf) {
          // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
          var strUni = strUtf.replace(
              /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
              function(c) {  // (note parentheses for precence)
                var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
                return String.fromCharCode(cc); }
            );
          strUni = strUni.replace(
              /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
              function(c) {  // (note parentheses for precence)
                var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
                return String.fromCharCode(cc); }
            );
          return strUni;
        };
        
        return sha1;

    }());

    //JQUERY PLUGINS

    $.fn.message = function(opt){
        
        var el = $("<div></div>");
        el.html(opt.text);
        el.hide();
        
        if (opt.class) {
            el.addClass(opt.class);
        }
        
        if (opt.position === "before") {
            $(this).before(el);
        } else if (opt.position === "prepend") {
            $(this).prepend(el);
        } else if (opt.position === "append") {
            $(this).append(el);
        } else {
            $(this).after(el);
        }
        
        el.slideDown();
        
        if (opt.timeout) {
            setTimeout(function(){
                el.slideUp(function(){
                    el.remove();
                });
            }, opt.timeout);
        }
    };

    $.message = function(opt) {

      var el = $("<div></div>");
        el.html(opt.text || opt.Message);
        el.hide();
        
        if (opt.class) {
            el.addClass(opt.class);
        } else if (opt.Success === true) {
            el.addClass("success");
        } else if (opt.Success === false) {
            el.addClass("error");
        }

        el.addClass("fixed");
        
        $("body").append(el);
        
        el.slideDown();
        
        if (opt.timeout !== 0) {
            //timeout padrão é 5000, só n tem timeout se colocar zero
            setTimeout(function(){
                el.slideUp(function(){
                    el.remove();
                });
            }, opt.timeout || 5000);
        }

    };
    
    martinlabs.dialog = function(opt){
        
        var el = $("<div class='popup'><div class='window'>"+opt.text+"<div class='actionbar'></div></div></div>");
        
        for (var i in opt) {
            if (i === "text") {
                continue;
            }
            
            var cb = opt[i];
            
            var b = $("<input type='button' value='"+i+"' style='margin-right: 10px;'/>");
            if (cb === "close") {
                b.click(function(){
                    el.remove();
                });
            } else {
                b.click(function(){
                    cb.apply(el);
                });
            }
            
            el.find(".actionbar").append(b);
        }
        
        $("body").append(el);
        
        return el;
    };
    
    $.fn.precoAutoFormat = function(){
        
        var view = $(this);
        view.blur(function(){
            var nro = parseFloat(
                    view.val()
                    .replace(",", "."));
            
            if (!nro) {
                nro = 0;
            }
            
            view.val(nro.toFixed(2)
                .replace(".", ","));
        });
        
    };

    return martinlabs;

}));