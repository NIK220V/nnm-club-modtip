// ==UserScript==
// @name         NNM ModMenu Tip
// @namespace    none
// @version      0.03
// @description  Скрипт, который будет показывать удобную менюшку при наведении на название темы в форумах, которые вы модерируете.
// @author       NIK220V
// @match        *://*.nnmclub.to/forum/viewforum.php?f=*
// @match        *://*.nnm-club.me/forum/viewforum.php?f=*
// @match        *://*.nnm-club.i2p.onion/forum/viewforum.php?f=*
// @match        *://*.nnmclub5toro7u65.onion/forum/viewforum.php?f=*
// @match        *://*.nnmclub.to/forum/tracker.php*
// @match        *://*.nnm-club.me/forum/tracker.php*
// @match        *://*.nnm-club.i2p.onion/forum/tracker.php*
// @match        *://*.nnmclub5toro7u65.onion/forum/tracker.php*
// @homepage     https://github.com/NIK220V/nnm-club-modtip
// @updateURL    https://github.com/NIK220V/nnm-club-modtip/raw/master/nnm-modmenu.meta.js
// @downloadURL  https://github.com/NIK220V/nnm-club-modtip/raw/master/nnm-modmenu.user.js
// @grant        none
// ==/UserScript==

if (document.body.innerText.indexOf('Вход') > -1 || (document.body.innerText.indexOf('Вы можете модерировать этот форум') < 0 && document.location.href.indexOf('tracker.php') < 0)) return;

var defval = '<span class="gensmall"><a href="javascript:;" onclick="transferTopic(this.parentNode.parentNode.parentNode);"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_delete.gif" alt="Удалить тему" title="Удалить тему" border="0"></a>&nbsp;<a href="modcp.php?t=%topicid%&mode=move&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_move.gif" alt="Перенести тему" title="Перенести тему" border="0"></a>&nbsp;%closeoropen%<a href="modcp.php?t=%topicid%&mode=split&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_split.gif" alt="Разделить тему" title="Разделить тему" border="0"></a>&nbsp;<a href="merge.php?t=%topicid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_merge.gif" alt="Склейка тем" title="Склейка тем" border="0"></a>&nbsp;<a href="modcp.php?t=%topicid%&mode=unset_download&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_normal.gif" alt="Not Download" title="Not Download" border="0"></a>&nbsp;<a href="javascript:;" class="image_rename" onclick="rename(this.parentNode.parentNode.parentNode.parentNode);" title="Переименовать тему\n(С этой страницы)"></a></span>';

var moveval = 'new_forum=%forumto%&insert_msg=&reason_move_bot=%reason%&sid=%sid%&mode=move&f=%forumfrom%&t=%topicid%&confirm=%confirm%';

var openval = '<a href="modcp.php?t=%topicid%&mode=unlock&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_unlock.gif" alt="Вновь открыть тему" title="Вновь открыть тему" border="0"></a>&nbsp;';
var closeval = '<a href="modcp.php?t=%topicid%&mode=lock&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_lock.gif" alt="Закрыть тему" title="Закрыть тему" border="0"></a>&nbsp;';

// ID Форума в который будет переносить удаленную тему. Сейчас у Мусорки ID 670.
var garbageid = 670;

// Is Script busy, sending some requests?
var busy = false;

function url(){
 return (document.location.href.indexOf('http:') < 0) ? '-ssl' : '';
}

var DMap = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 1027: 129, 8225: 135, 1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 1028: 170, 160: 160, 1040: 192, 1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182, 183: 183, 8221: 148, 187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 1060: 212, 1030: 178, 1061: 213, 1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223, 1072: 224, 8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 1076: 228, 1077: 229, 8211: 150, 1078: 230, 1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237, 1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246, 1054: 206, 1095: 247, 1096: 248, 8249: 139, 1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147, 1101: 253, 8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190};

function encodeString(s) {
    var L = [];
    for (var i=0; i<s.length; i++) {
        var ord = s.charCodeAt(i);
        if (!(ord in DMap))
            throw "Character "+s.charAt(i)+" isn't supported by win1251!";
        L.push('%'+DMap[ord].toString(16));
    }
    return L.join('').toUpperCase();
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    while (target.indexOf(search) > 0)
        target = target.replace(search, replacement);
    return target;
};

var sid = document.querySelectorAll('.mainmenu')[12].href.substring(document.querySelectorAll('.mainmenu')[12].href.indexOf('&sid=')+5);

var css = document.createElement('style');
css.id = 'nnmtipcss';
css.innerText = '.topictitle:hover .nnmtip{display:block} .topicpremod:hover .nnmtip{display:block} .nnmtip{display:none;background:#e8eff7;margin-left:15px;margin-top:5px;padding:6px;position:absolute;z-index:1000;width:155px;height:19px;border:1px solid #aec9e4;border-radius:15px;opacity:0.75}'+
    ".image_rename{display:inline-block;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAAKvSURBVHjalJRPSFRRFMZ/b3rk2ItpynGwf6YZmEVWFGNEJOUiEqGVmxb9XQRCuwJt1yqCcFEQuOifEIHuIyGpNJCC0lzUSOrozJg5ozUzzsyb994Mp4X5GnWM+uAs7j33+/jOOfdeRURYjmhCl8d9wzx68wl/ZN7eP7yjlGZfNS0NtWjFxcoKoogsibauPtl05a60dfXJ4MS0JNNpO/r9IcnPL+cq+c6udvZKYDrK/UunKFnvJGdZFELMyNHysIfKzaXcO9dgO7TFrnb2SiwW41HLGQzLImdZuFyugmKJRALTNLnw4OVSQRGh651faq51SDKdlng8LvF4XIBVY/FMKBSSmmsd0u8PiYjgAHjyapCbzfUFe2n9LjW/Ny6XC9M0cTqdXKzfT0fPOwAc0YQuA4EojfvK7R6Zpsm/4nSFxvPP30jpujhe+4M07tliJ03TxOPxrCBls9lVBau8GxgMzqFORGK43W5ylvXPjsbGxigqKrLXXm0tA1+nFnqWX9pyV6qq/lU4lU4DUOF146jwuglMR/kfLLoyDAOA8dkEmzdoOBr3lTMQiJLJZMhkMqsK5Ds0DAPDMNB1ncjMDP7IPEeqynBoxcXK2aN7eDY0hWEYhMNhwuEwiqLYAaxYA0SiUboCJq1NPlRVVVSAy/V7abjVzXFvHZ6SEgBGR0cLOtR1HYDZuTlGv//k6YcJJu6cXLhnAAd2lCmtTT4udg8xGQzahNUwGQzyaSxM25spbjcfo7x0o7LkbQLc6O6Xjt4hbtVvZVfZRjRNQ1u3zp5aKpUilUwyPJ2g/eMPWpt8XG+qW/nQF9H9fkTaX3wgPp/k0PYSdjv/DGXg5xrGZxPs9Lg4f+Igzb7qJX+aUuhzBHg7EpbnwwFefQmRy2ZZo6qcqNlOY20lx6q3KYU4vwYAJZiGjrIzMuIAAAAASUVORK5CYII=');width:19px;height:18px;}";
document.head.appendChild(css);
var topics = (document.location.href.indexOf('tracker.php') < 0) ?  document.querySelectorAll('h2[class~="topictitle"]') : ([].slice.call(document.querySelectorAll('a[class~="topictitle"]')).concat([].slice.call(document.querySelectorAll('a[class~="topicpremod"]'))));
for (var i = 0; i < topics.length; i++){
topics[i].onmouseover = function(){showInfo(this);};
}

window.rename = function(topic){
    var text = topic.children[0].innerText;
    topic.children[0].innerText = '';
    topic.children[1].remove();
    var topicid = (topic.tagName == 'A') ? topic.href.substring(topic.href.indexOf('=')+1) : topic.children[0].href.substring(topic.children[0].href.indexOf('=')+1);
    if (topic.tagName == 'A') topic.href = 'javascript:;';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE){
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.className = 'topicpremod';
            var doc = document.createElement('div');
            doc.innerHTML = xhr.responseText;
            textarea.rtopicid = topicid;
            textarea.topicid = doc.querySelector('.name').children[0].name;
            textarea.maxlength = 200;
            topic.appendChild(textarea);
            topic.children[1].onchange = function(){textarea.disabled = true; renamer(this);};
        }
    };
    xhr.open('GET', '//'+document.domain+'/forum/modcp.php?t=%topicid%&mode=split&sid=%sid%'.replaceAll('%topicid%', topicid).replaceAll('%sid%', sid), false);
    xhr.send();
};

function renamer(textarea){
    var topic = textarea.topicid;
    var newname = textarea.value;
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'nnmmodmenuiframe';
    var renamer = document.createElement('form');
    renamer.action = 'posting.php';
    renamer.method = 'POST';
    renamer.enctype = 'multipart/form-data';
    renamer.style.display = 'none';
    renamer.id = 'nnmmodmenurenamer';
    renamer.target = iframe.name;
    var accepted = Array('subject', 'topic_desc', 'fontFace', 'codeSize', 'codeAlign', 'codeList', 'codeColor', 'helpbox', 'message', 'open_edit_days', 'fp_pinned', 'topictype', 'topic_dl_type', 'topictypegold', 'add_attachment_body', 'posted_attachments_body', 'attachment_list[]', 'filename_list[]', 'extension_list[]', 'mimetype_list[]', 'filesize_list[]', 'filetime_list[]', 'attach_id_list[]', 'attach_thumbnail_list[]', 'fileupload', 'comment_list[]', 'poll_choice', 'poll_choices_option', 'poll_choices_number', 'poll_title', 'add_poll_option_text', 'poll_length', 'mode', 'sid', 'p', 'post');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE){
            var doc = document.createElement('div');
            doc.innerHTML = xhr.responseText;
            var form = doc.querySelector('form[action="posting.php"]');
            var c1 = [].slice.call(doc.querySelectorAll('input')), c2 = [].slice.call(doc.querySelectorAll('textarea')), c3 = [].slice.call(doc.querySelectorAll('select')), inputs = c1.concat(c2).concat(c3);
            for (var i = inputs.length; i--;){
                if (accepted.indexOf(inputs[i].name) >=0){
                    var input = inputs[i];
                    if (input.name == 'subject') input.value = newname;
                    renamer.appendChild(input);
                }
            }
            document.body.appendChild(renamer);
            document.body.appendChild(iframe);
            iframe.onload = function(){
                textarea.parentNode.children[0].innerText = newname;
                if (textarea.parentNode.tagName == 'A') textarea.parentNode.href = 'viewtopic.php?t='+textarea.rtopicid;
                console.log(textarea.parentNode.onmouseover);
                textarea.parentNode.onmouseover = function(){showInfo(this);};
                textarea.remove();
                renamer.remove();
                iframe.remove();
            };
            document.getElementById('nnmmodmenurenamer').querySelector('input[value="Отправить"]').click();
        }
    };
    xhr.open('GET', '//'+document.domain+'/forum/posting.php?mode=editpost&p='+topic, false);
    xhr.send();
}

function showInfo(elem){
    if (elem.children.length > 1) return;
    elem.onmouseover = '';
    var tipparent = document.createElement('span');
    tipparent.style.position ='relative';
    var tip = document.createElement('span');
    var topicid = (elem.tagName == 'A') ? elem.href.substring(elem.href.indexOf('=')+1) : elem.children[0].href.substring(elem.children[0].href.indexOf('=')+1);
    tipparent.topicid = topicid;
    tip.innerHTML = defval.replaceAll('%topicid%', topicid).replaceAll('%sid%', sid).replaceAll('%closeoropen%', (document.location.href.indexOf('tracker.php') < 0) ? (elem.parentNode.parentNode.children[0].children[0].src.indexOf('folder_lock') > 0) ? openval.replaceAll('%topicid%', topicid).replaceAll('%sid%', sid) : closeval.replaceAll('%topicid%', topicid).replaceAll('%sid%', sid) : '');
    tip.className = 'nnmtip';
    tip.style.left = '-15px';
    tip.style.top = '-105%';
    tipparent.appendChild(tip);
    elem.appendChild(tipparent);
}
window.transferTopic = function(elem) {
    if (busy) return;
    busy = true;
    var topicid = elem.topicid;
    var menuItems = document.querySelectorAll('a.mainmenu');
    var user = menuItems[menuItems.length - 1].text.split(' ')[2];
    var uri = '';
    if (document.location.href.indexOf('tracker.php') < 0) {
        uri = document.location.href;
    } else {
        uri = elem.parentNode.parentNode.parentNode.children[1].children[0].href;
    }
    var indexofe = uri.indexOf('=')+1;
    var match = uri.substring(indexofe).match(/\D/);
    var indexofnonnumber = (match === null) ? uri.length : match.index;
    var fromid = uri.substring(indexofe, indexofnonnumber+indexofe);
    var data = moveval.replaceAll('%reason%', encodeString('Удаление темы')).replaceAll('%forumto%', garbageid).replaceAll('%forumfrom%', fromid).replaceAll('%topicid%', topicid).replaceAll('%sid%', sid).replaceAll('%confirm%', encodeString('Да'));
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE){
            window.open('//'+document.domain+'/forum/viewtopic.php?t='+topicid, '_blank');
            location.reload();
        }
    };
    xhr.open('POST', '//'+document.domain+'/forum/modcp.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
};
