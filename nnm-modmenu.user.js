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

if (document.querySelector('.menutable').innerText.indexOf('Вход') > 0 || (document.body.innerText.indexOf('Вы можете модерировать этот форум') < 0 && document.location.href.indexOf('tracker.php') < 0)) return;

// Potential usage - onclick="transferTopic(this.parentNode.parentNode.parentNode);"
var defval = '<span class="gensmall"><a href="modcp.php?t=%topicid%&mode=delete&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_delete.gif" alt="Удалить тему" title="Удалить тему" border="0"></a>&nbsp;<a href="modcp.php?t=%topicid%&mode=move&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_move.gif" alt="Перенести тему" title="Перенести тему" border="0"></a>&nbsp;%closeoropen%<a href="modcp.php?t=%topicid%&mode=split&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_split.gif" alt="Разделить тему" title="Разделить тему" border="0"></a>&nbsp;<a href="merge.php?t=%topicid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_merge.gif" alt="Склейка тем" title="Склейка тем" border="0"></a>&nbsp;<a href="modcp.php?t=%topicid%&mode=unset_download&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_normal.gif" alt="Not Download" title="Not Download" border="0"></a>&nbsp;<a href="javascript:;" class="image_rename" onclick="rename(this.parentNode.parentNode.parentNode.parentNode);" title="Переименовать тему\n(С этой страницы)"></a></span>';

var openval = '<a href="modcp.php?t=%topicid%&mode=unlock&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_unlock.gif" alt="Вновь открыть тему" title="Вновь открыть тему" border="0"></a>&nbsp;';
var closeval = '<a href="modcp.php?t=%topicid%&mode=lock&sid=%sid%"><img src="//assets'+url()+'.nnm-club.ws/forum/templates/smartBlue/images/topic_lock.gif" alt="Закрыть тему" title="Закрыть тему" border="0"></a>&nbsp;';

function url(){
 return (document.location.href.indexOf('http:') < 0) ? '-ssl' : '';
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
    if (document.getElementById('nnmmodmenurenamer')) document.getElementById('nnmmodmenurenamer').remove();
    if (document.getElementById('nnmmodmenuiframe')) document.getElementById('nnmmodmenuiframe').remove();
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
