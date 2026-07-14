/* DIGIY DRIVER — correctif local galerie
   - retire Baptiste et Babacar/Babacard
   - ne crée aucune carte supplémentaire
   - conserve une seule carte Lamine dans la grille
   - force le clic de la carte vers la fiche officielle de Lamine
*/
(function(){
  "use strict";

  var LAMINE_PROFILE = "https://partenaire-lamine.digiylyfe.com/";
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

  function removeRemovedDrivers(){
    document.querySelectorAll("#drivers .driver").forEach(function(card){
      if(isRemovedCard(card)) card.remove();
    });

    var featured = document.getElementById("featuredCardArea");
    if(featured && isRemovedCard(featured)){
      featured.className = "featured-empty";
      featured.textContent = "Ce profil n’est plus disponible. Choisissez un autre chauffeur dans la galerie.";
    }
  }

  function keepOneLamineBusinessCard(){
    /* Supprime toutes les anciennes cartes créées par les correctifs précédents. */
    document.querySelectorAll(".digiy-lamine-card-box").forEach(function(box){
      box.remove();
    });

    /* La vitrine haute reste courte : aucune carte de visite dupliquée ici. */
    document.querySelectorAll("#featuredCardArea .driver-card-box").forEach(function(box){
      box.remove();
    });

    var kept = false;

    document.querySelectorAll("#drivers .driver").forEach(function(card){
      if(!isLamineCard(card)) return;

      var boxes = card.querySelectorAll(".driver-card-box");
      Array.prototype.forEach.call(boxes, function(box){
        if(kept){
          box.remove();
          return;
        }

        kept = true;

        /* Le clic sur la carte ouvre toujours la fiche officielle, jamais l’image seule. */
        var cardLink = box.querySelector(".driver-card-click") || box.querySelector("a:has(img)");
        if(cardLink){
          cardLink.href = LAMINE_PROFILE;
          cardLink.target = "_blank";
          cardLink.rel = "noopener";
          cardLink.title = "Ouvrir la fiche officielle de Lamine";
          cardLink.setAttribute("aria-label", "Ouvrir la fiche officielle de Lamine");
        }
      });
    });
  }

  function genericFeaturedCopy(){
    var title = document.querySelector("#featuredCardWrap .featured-head .title");
    var sub = document.querySelector("#featuredCardWrap .featured-head .sub");

    if(title){
      title.removeAttribute("data-i18n");
      title.textContent = "Chauffeur en vitrine";
    }

    if(sub){
      sub.removeAttribute("data-i18n");
      sub.textContent = "Le premier profil disponible selon les filtres apparaît ici. Ouvrez sa fiche officielle puis contactez-le directement.";
    }
  }

  function refreshCount(){
    var visible = document.querySelectorAll("#drivers .driver").length;
    var count = document.getElementById("countPill");
    if(count) count.textContent = visible + " chauffeur(s)";
  }

  function clean(){
    removeStatic();
    removeRemovedDrivers();
    keepOneLamineBusinessCard();
    genericFeaturedCopy();
    refreshCount();
  }

  var pending = false;

  function schedule(){
    if(pending) return;
    pending = true;

    requestAnimationFrame(function(){
      pending = false;
      clean();
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", schedule);
  }else{
    schedule();
  }

  window.addEventListener("load", schedule);

  if("MutationObserver" in window){
    new MutationObserver(schedule).observe(document.documentElement, {
      childList:true,
      subtree:true
    });
  }

  setTimeout(schedule, 100);
  setTimeout(schedule, 700);
  setTimeout(schedule, 1800);
})();