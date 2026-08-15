/* DIGIY DRIVER — couche WORLD8 + nettoyage navigation publique — 2026-08-15 */
(function(){
  'use strict';
  function cleanHub(){
    document.querySelectorAll('a[href^="https://digiy-hub.digiylyfe.com/"]').forEach(function(a){a.remove();});
  }
  var s=document.createElement('script');
  s.src='./gallery-world8-core.js?v=20260812-world8-v1';
  s.onload=function(){cleanHub();setTimeout(cleanHub,250);setTimeout(cleanHub,1000);};
  s.onerror=cleanHub;
  document.head.appendChild(s);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',cleanHub,{once:true}); else cleanHub();
})();
