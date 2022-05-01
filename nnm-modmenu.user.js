// ==UserScript==
// @name         NNM ModMenu Tip
// @namespace    none
// @version      0.08
// @description  Пак полезных функций.
// @author       NIK220V
// @match        *://*.nnmclub.to/forum/viewforum.php?f=*
// @match        *://*.nnmclub.tv/forum/viewforum.php?f=*
// @match        *://*.nnm-club.lib/forum/viewforum.php?f=*
// @match        *://*.nnm-club.ro/forum/viewforum.php?f=*
// @match        *://*.nnm-club.i2p.onion/forum/viewforum.php?f=*
// @match        *://*.nnmclub5toro7u65.onion/forum/viewforum.php?f=*
// @match        *://*.nnmclub.to/forum/tracker.php*
// @match        *://*.nnmclub.tv/forum/tracker.php*
// @match        *://*.nnm-club.lib/forum/tracker.php*
// @match        *://*.nnm-club.ro/forum/tracker.php*
// @match        *://*.nnm-club.i2p.onion/forum/tracker.php*
// @match        *://*.nnmclub5toro7u65.onion/forum/tracker.php*
// @homepage     https://github.com/NIK220V/nnm-club-modtip
// @updateURL    https://github.com/NIK220V/nnm-club-modtip/raw/master/nnm-modmenu.meta.js
// @downloadURL  https://github.com/NIK220V/nnm-club-modtip/raw/master/nnm-modmenu.user.js
// @grant        none
// ==/UserScript==

if (document.querySelector('.menutable').innerText.indexOf('Вход') >= 0 || (document.body.innerText.indexOf('Вы можете модерировать этот форум') < 0 && document.location.href.indexOf('tracker.php') < 0))
    return;

var defval = '<span class="gensmall"><a href="modcp.php?t=%topicid%&mode=delete&sid=%sid%"><img src="//nnmstatic.win/forum/templates/smartBlue/images/topic_delete.gif" alt="Удалить тему" title="Удалить тему" border="0"></a>&nbsp;<a href="modcp.php?t=%topicid%&mode=move&sid=%sid%"><img src="//nnmstatic.win/forum/templates/smartBlue/images/topic_move.gif" alt="Перенести тему" title="Перенести тему" border="0"></a>&nbsp;%closeoropen%<a href="modcp.php?t=%topicid%&mode=split&sid=%sid%"><img src="//nnmstatic.win/forum/templates/smartBlue/images/topic_split.gif" alt="Разделить тему" title="Разделить тему" border="0"></a>&nbsp;<a href="merge.php?t=%topicid%"><img src="//nnmstatic.win/forum/templates/smartBlue/images/topic_merge.gif" alt="Склейка тем" title="Склейка тем" border="0"></a>&nbsp;<a href="modcp.php?t=%topicid%&mode=unset_download&sid=%sid%"><img src="//nnmstatic.win/forum/templates/smartBlue/images/topic_normal.gif" alt="Not Download" title="Not Download" border="0"></a>&nbsp;<a href="javascript:;" class="image_rename" onclick="rename(this.parentNode.parentNode.parentNode.parentNode);" title="Переименовать тему\n(С этой страницы)"></a></span>';

var openval = '<a href="modcp.php?t=%topicid%&mode=unlock&sid=%sid%"><img src="//nnmstatic.win/forum/templates/smartBlue/images/topic_unlock.gif" alt="Вновь открыть тему" title="Вновь открыть тему" border="0"></a>&nbsp;';
var closeval = '<a href="modcp.php?t=%topicid%&mode=lock&sid=%sid%"><img src="//nnmstatic.win/forum/templates/smartBlue/images/topic_lock.gif" alt="Закрыть тему" title="Закрыть тему" border="0"></a>&nbsp;';


window.SelectedTopics = {};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    while (target.indexOf(search) > 0)
        target = target.replace(search, replacement);
    return target;
};
Array.prototype.remove = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var sid = document.querySelectorAll('.mainmenu')[12].href.substring(document.querySelectorAll('.mainmenu')[12].href.indexOf('&sid=')+5);

var css = document.createElement('style');
css.id = 'nnmtipcss';
css.innerText = '.topictitle:hover .nnmtip{display:block} .topicpremod:hover .nnmtip{display:block} .nnmtip{display:none;background:#e8eff7;margin-left:15px;margin-top:5px;padding:6px;position:absolute;z-index:1000;width:155px;height:19px;border:1px solid #aec9e4;border-radius:15px;opacity:0.75}'+
    ".image_rename{display:inline-block;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAAKvSURBVHjalJRPSFRRFMZ/b3rk2ItpynGwf6YZmEVWFGNEJOUiEqGVmxb9XQRCuwJt1yqCcFEQuOifEIHuIyGpNJCC0lzUSOrozJg5ozUzzsyb994Mp4X5GnWM+uAs7j33+/jOOfdeRURYjmhCl8d9wzx68wl/ZN7eP7yjlGZfNS0NtWjFxcoKoogsibauPtl05a60dfXJ4MS0JNNpO/r9IcnPL+cq+c6udvZKYDrK/UunKFnvJGdZFELMyNHysIfKzaXcO9dgO7TFrnb2SiwW41HLGQzLImdZuFyugmKJRALTNLnw4OVSQRGh651faq51SDKdlng8LvF4XIBVY/FMKBSSmmsd0u8PiYjgAHjyapCbzfUFe2n9LjW/Ny6XC9M0cTqdXKzfT0fPOwAc0YQuA4EojfvK7R6Zpsm/4nSFxvPP30jpujhe+4M07tliJ03TxOPxrCBls9lVBau8GxgMzqFORGK43W5ylvXPjsbGxigqKrLXXm0tA1+nFnqWX9pyV6qq/lU4lU4DUOF146jwuglMR/kfLLoyDAOA8dkEmzdoOBr3lTMQiJLJZMhkMqsK5Ds0DAPDMNB1ncjMDP7IPEeqynBoxcXK2aN7eDY0hWEYhMNhwuEwiqLYAaxYA0SiUboCJq1NPlRVVVSAy/V7abjVzXFvHZ6SEgBGR0cLOtR1HYDZuTlGv//k6YcJJu6cXLhnAAd2lCmtTT4udg8xGQzahNUwGQzyaSxM25spbjcfo7x0o7LkbQLc6O6Xjt4hbtVvZVfZRjRNQ1u3zp5aKpUilUwyPJ2g/eMPWpt8XG+qW/nQF9H9fkTaX3wgPp/k0PYSdjv/DGXg5xrGZxPs9Lg4f+Igzb7qJX+aUuhzBHg7EpbnwwFefQmRy2ZZo6qcqNlOY20lx6q3KYU4vwYAJZiGjrIzMuIAAAAASUVORK5CYII=');width:19px;height:18px;}";
document.head.appendChild(css);
var topics = (document.location.href.indexOf('tracker.php') < 0) ? document.querySelectorAll('h2[class~="topictitle"]') : ([].slice.call(document.querySelectorAll('a[class~="topictitle"]')).concat([].slice.call(document.querySelectorAll('a[class~="topicpremod"]'))));
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

window.trackerMove = function(){
    var p = document.querySelector('.forumline.tablesorter').children[0].children[0];
    var e = document.createElement('th');
    e.style.align = 'center';
    e.style.nowrap = 'nowrap';
    e.title = 'Перенос';
    e.innerHTML = '<b class="tbs-text">Move</b><span class="tbs-icon">&nbsp;&nbsp;</span>';
    p.appendChild(e);
    document.querySelector('.forumline').children[0].children[2].children[0].innerHTML+='<span class="genmed"><input type="button" class="liteoption tit-b" id="nnmsearchselectbtn" onclick="selectAll();return false;" value="Отметить всё"/></span><span class="genmed"><input type="button" class="liteoption tit-b" id="nnmsearchdeselectbtn" onclick="deselectAll();return false;" value="Снять выделение"/></span>';
    var c = document.querySelector('.forumline.tablesorter').children[1].children;
for (var i = c.length;i--;){
    var td = document.createElement('td');
    td.align = 'center';
    td.style.nowrap = 'nowrap';
    td.title = 'Перенос';
    td.className = 'gensmall';
    td.innerHTML = '<input type="checkbox" name="disabledinput'+i+'" onclick="ToggleTopic(IdFromHref(this.parentNode.parentNode.children[2].children[0].href), FIDFromHref(this.parentNode.parentNode.children[1].children[0].href));">';
    c[i].appendChild(td);
}
};

window.IdFromHref = function(href){
    return href.substring(href.indexOf('=')+1);
};

window.FIDFromHref = function(href){
    if (href.indexOf('&nm')>0)
        return href.substring(href.indexOf('=')+1, href.indexOf('&'));
    else
        return href.substring(href.indexOf('=')+1);
};

window.ToggleTopic = function(id, fid){
    if (fid in SelectedTopics === false) SelectedTopics[fid] = [];
    if (SelectedTopics[fid].indexOf(id) >= 0)
        SelectedTopics[fid].remove(id);
    else
        SelectedTopics[fid].push(id);
    if (Object.keys(SelectedTopics[fid]).length < 1) delete SelectedTopics[fid];
    if (Object.keys(SelectedTopics).length > 0){
        if (!document.getElementById('nnmsearchmoverbtn')){
            document.querySelector('.forumline').children[0].children[2].children[0].innerHTML+='<span class="genmed"><input type="button" id="nnmsearchmoverbtn" onclick="openTMove();this.parentNode.remove();return false;" class="liteoption tit-b" value="Открыть перенос"/></span>';
        }
    } else {
        if (document.getElementById('nnmsearchmoverbtn')) document.getElementById('nnmsearchmoverbtn').remove();
    }
};

window.openTMove = function(){
    var id = 0;
    for (var key in SelectedTopics){
        openTmovefr(key, SelectedTopics[key].slice(), id);
        id++;
    }
    setTimeout(function(){
     var v = document.querySelectorAll('input[name*="disabledinput"]');
        for (var i = v.length; i--;) if (v[i].checked) v[i].click();
    }, 500);
};

window.selectAll = function(){
    var a = document.querySelectorAll('input[name*="disabledinput"]');
    for (var i = a.length; i--;){
    if (!a[i].checked) a[i].click();
    }
};

window.deselectAll = function(){
    var a = document.querySelectorAll('input[name*="disabledinput"]');
    for (var i = a.length; i--;){
    if (a[i].checked) a[i].click();
    }
};

function openTmovefr(key, arr, id){
   setTimeout(function(){
       if (document.getElementById('nnmsearchmover'+key))
           document.getElementById('nnmsearchmover'+key).remove();
       var form = document.createElement('form');
       form.id = 'nnmsearchmover'+key;
       form.style.display='none';
       form.target='_blank';
       form.method='POST';
       form.action='modcp.php';
       form.innerHTML = '<input type="hidden" name="sid" value="'+sid+'"><input type="hidden" name="move" value="Переместить"><input type="hidden" name="f" value="'+key+'">';
       for (var i = arr.length; i--;) form.innerHTML+='<input type="hidden" name="topic_id_list[]" value="'+arr[i]+'">';
       document.body.appendChild(form);
       form.submit();
   }, id*2500);
}

if (document.location.href.indexOf('tracker.php')>=0){
    document.querySelector('.forumline').children[0].children[2].children[0].innerHTML+='<span class="genmed"><input type="button" class="liteoption tit-b" onclick="this.parentNode.remove();trackerMove();return false;" value="Масс. перенос"/></span>';
}
