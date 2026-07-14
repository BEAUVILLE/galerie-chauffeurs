/* DIGIY DRIVER — correctif local galerie
   - retire Baptiste et Babacar/Babacard
   - garde Lamine
   - rend la carte Lamine cliquable et partageable
*/
(function(){
  "use strict";

  var LAMINE_PROFILE = "https://partenaire-lamine.digiylyfe.com/";
  var LAMINE_CARD = "https://partenaire-lamine.digiylyfe.com/carte-visite.png?v=20260714";
  var REMOVED = ["baptiste", "babacar", "babacard"];

  function norm(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function hasRemoved(value){
    var text = norm(value);
    return REMOVED.some(function(name){ return text.indexOf(name) !== -1; });
  }

  function removeStatic(){
    [
      "cardBtnTop",
      "heroCardBtn",
      "cardBtnSection",
      "cardBtnBottom",
      "chauffeur-baptiste",
      "baptisteDirectMain",
      "baptisteDirectAlt"
    ].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.remove();
    });

    document.querySelectorAll("a[href]").forEach(function(a){
      var href = a.getAttribute("href") || "";
      if(hasRemoved(a.textContent) || hasRemoved(href) || norm(href).indexOf("digiy-driver-part-bapt") !== -1){
        a.remove();
      }
    });
  }

  function isRemovedCard(card){
    if(!card) return false;
    if(hasRemoved(card.textContent)) return true;
    return Array.prototype.some.call(card.querySelectorAll("a[href]"), function(a){
      return hasRemoved(a.getAttribute("href"));
    });
  }

  function isLamineCard(card){
    if(!card) return false;
    var text = norm(card.textContent);
    var links = Array.prototype.slice.call(card.querySelectorAll("a[href]"));
    return text.indexOf("lamine") !== -1 || links.some(function(a){
      return norm(a.getAttribute("href")).indexOf("partenaire-lamine") !== -1;
    });
  }

  function shareLamine(){
    var text = "Lamine — Chauffeur privé à Saly\nFiche officielle : " + LAMINE_PROFILE + "\nCarte de visite : https://partenaire-lamine.digiylyfe.com/carte-visite.png";
    var data = {title:"Lamine — Chauffeur privé à Saly", text:text, url:LAMINE_PROFILE};

    if(navigator.share){
      navigator.share(data).catch(function(err){
        if(!err || err.name !== "AbortError"){
          window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
        }
      });
      return;
    }

    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){
        alert("Le lien de la fiche et de la carte a été copié.");
      }).catch(function(){
        window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
      });
      return;
    }

    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
  }

  function enhanceLamine(card){
    if(!card || card.dataset.lamineCardReady === "1") return;
    card.dataset.lamineCardReady = "1";

    var box = document.createElement("div");
    box.className = "digiy-lamine-card-box";
    box.style.cssText = "margin-top:14px;padding:12px;border-radius:18px;border:1px solid rgba(244,201,93,.28);background:rgba(255,255,255,.04);text-align:center";

    var link = document.createElement("a");
    link.href = LAMINE_PROFILE;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Ouvrir la fiche officielle de Lamine");

    var img = document.createElement("img");
    img.src = LAMINE_CARD;
    img.alt = "Carte de visite officielle de Lamine";
    img.loading = "lazy";
    img.style.cssText = "display:block;width:100%;max-width:360px;height:auto;margin:0 auto;border-radius:16px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.24)";
    link.appendChild(img);

    var note = document.createElement("div");
    note.textContent = "🖱️ Cliquez la carte pour ouvrir la fiche officielle de Lamine.";
    note.style.cssText = "margin-top:10px;color:#ffe8a6;font-size:12px;font-weight:900;line-height:1.45";

    var actions = document.createElement("div");
    actions.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px";

    function makeLink(label, href, cls){
      var a = document.createElement("a");
      a.textContent = label;
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "btn " + cls;
      return a;
    }

    actions.appendChild(makeLink("🚗 Ouvrir la fiche", LAMINE_PROFILE, "btn-main"));
    actions.appendChild(makeLink("🖼️ Ouvrir la carte", LAMINE_CARD, "btn-ghost"));

    var share = document.createElement("button");
    share.type = "button";
    share.className = "btn btn-sky";
    share.textContent = "📤 Partager la carte";
    share.addEventListener("click", shareLamine);
    actions.appendChild(share);

    box.appendChild(link);
    box.appendChild(note);
    box.appendChild(actions);
    card.appendChild(box);
  }

  function clean(){
    removeStatic();

    document.querySelectorAll("#drivers .driver").forEach(function(card){
      if(isRemovedCard(card)){
        card.remove();
        return;
      }
      if(isLamineCard(card)) enhanceLamine(card);
    });

    var featured = document.getElementById("featuredCardArea");
    if(featured){
      if(isRemovedCard(featured)){
        featured.className = "featured-empty";
        featured.textContent = "Ce profil n’est plus disponible. Choisissez un autre chauffeur dans la galerie.";
      }else if(isLamineCard(featured)){
        enhanceLamine(featured);
      }
    }

    var title = document.querySelector("#featuredCardWrap .featured-head .title");
    var sub = document.querySelector("#featuredCardWrap .featured-head .sub");
    if(title){ title.removeAttribute("data-i18n"); title.textContent = "Chauffeur en vitrine"; }
    if(sub){ sub.removeAttribute("data-i18n"); sub.textContent = "Le premier profil disponible selon les filtres apparaît ici. Ouvrez sa fiche officielle puis contactez-le directement."; }

    var visible = document.querySelectorAll("#drivers .driver").length;
    var count = document.getElementById("countPill");
    if(count) count.textContent = visible + " chauffeur(s)";
  }

  var pending = false;
  function schedule(){
    if(pending) return;
    pending = true;
    requestAnimationFrame(function(){ pending = false; clean(); });
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  else schedule();

  window.addEventListener("load", schedule);

  if("MutationObserver" in window){
    new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
  }

  setTimeout(schedule, 100);
  setTimeout(schedule, 700);
  setTimeout(schedule, 1800);
})();
