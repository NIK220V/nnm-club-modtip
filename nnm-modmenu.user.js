// ==UserScript==
// @name         NNM ModMenu Tip
// @namespace    none
// @version      0.01
// @description  Скрипт, который будет показывать удобную менюшку при наведении на название темы в форумах, которые вы модерируете.
// @author       NIK220V
// @match        http://nnmclub.to/forum/viewforum.php?f=*
// @match        https://nnmclub.to/forum/viewforum.php?f=*
// @run-at       document-start
// @grant        none
// ==/UserScript==

if (document.body.innerText.indexOf('Вход') > -1 || document.body.innerText.indexOf('Вы можете модерировать этот форум') < 0) return;

var defval = '<span class="gensmall"><a href="modcp.php?t=%topicid%&mode=delete&sid=%sid%"><img src="//assets.nnm-club.ws/forum/templates/smartBlue/images/topic_delete.gif" alt="Удалить тему" title="Удалить тему" border="0"></a>&nbsp;<a href="modcp.php?t=%topicid%&mode=move&sid=%sid%"><img src="//assets.nnm-club.ws/forum/templates/smartBlue/images/topic_move.gif" alt="Перенести тему" title="Перенести тему" border="0"></a>&nbsp;%closeoropen%&nbsp;<a href="modcp.php?t=%topicid%&mode=split&sid=%sid%"><img src="//assets.nnm-club.ws/forum/templates/smartBlue/images/topic_split.gif" alt="Разделить тему" title="Разделить тему" border="0"></a>&nbsp;<a href="merge.php?t=%topicid%"><img src="//assets.nnm-club.ws/forum/templates/smartBlue/images/topic_merge.gif" alt="Склейка тем" title="Склейка тем" border="0"></a>&nbsp;<a href="modcp.php?t=%topicid%&mode=unset_download&sid=%sid%"><img src="//assets.nnm-club.ws/forum/templates/smartBlue/images/topic_normal.gif" alt="Not Download" title="Not Download" border="0"></a>&nbsp;</span>';

var openval = '<a href="modcp.php?t=%topicid%&mode=unlock&sid=%sid%"><img src="//assets-ssl.nnm-club.ws/forum/templates/smartBlue/images/topic_unlock.gif" alt="Вновь открыть тему" title="Вновь открыть тему" border="0"></a>';
var closeval = '<a href="modcp.php?t=%topicid%&mode=lock&sid=%sid%"><img src="//assets.nnm-club.ws/forum/templates/smartBlue/images/topic_lock.gif" alt="Закрыть тему" title="Закрыть тему" border="0"></a>';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    while (target.indexOf(search) > 0)
        target = target.replace(search, replacement);
    return target;
};

var sid = document.querySelectorAll('.mainmenu')[12].href.substring(document.querySelectorAll('.mainmenu')[12].href.indexOf('&sid=')+5);

var css = document.createElement('style');
css.id = 'nnmtipcss';
css.innerText = '.topictitle:hover .nnmtip{display:block}.nnmtip{display:none;background:#e8eff7;margin-left:10px;padding:10px;position:absolute;z-index:1000;width:130px;height:19px;border:1px solid #aec9e4;border-radius:15px;opacity:0.75}';
document.head.appendChild(css);

var topics = document.querySelectorAll('h2[class~="topictitle"]');
for (var i = 0; i < topics.length; i++){
topics[i].onmouseover = function(){showInfo(this);};
}

function showInfo(elem){
    if (elem.children.length > 1) return;
    elem.onmouseover = '';
    var tipparent = document.createElement('span');
    tipparent.style.position ='relative';
    var tip = document.createElement('span');
    var topicid = elem.children[0].href.substring(elem.children[0].href.indexOf('=')+1);
    tip.innerHTML = defval.replaceAll('%topicid%', topicid).replaceAll('%sid%', sid).replaceAll('%closeoropen%', (elem.parentNode.parentNode.children[0].children[0].src.indexOf('folder_lock') > 0) ? openval.replaceAll('%topicid%', topicid).replaceAll('%sid%', sid) : closeval.replaceAll('%topicid%', topicid).replaceAll('%sid%', sid));
    tip.className = 'nnmtip';
    tip.style.left = '-15px';
    tip.style.top = '-105%';
    tipparent.appendChild(tip);
    elem.appendChild(tipparent);
}
