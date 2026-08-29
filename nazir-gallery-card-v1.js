/* DIGIY DRIVER — NAZIR GALLERY CARD V1
 * Validation humaine : 29 août 2026.
 * Carte galerie = visage. Fiche Nazir = moteur.
 */
(function(){
'use strict';
if(window.DIGIY_NAZIR_GALLERY_CARD_V1)return;
window.DIGIY_NAZIR_GALLERY_CARD_V1=true;
var T={
fr:{member:'ADHÉRENT DIGIYLYFE',role:'Chauffeur · Saly · Mbour · AIBD · Multi-région',area:'📍 Saly · Mbour · AIBD · Petite Côte',c1:'Trajets directs',c2:'Transferts aéroport',c3:'Déplacements régionaux',c4:'Mise à disposition',contact:'📞 Contact direct',payment:'💳 Paiement direct',toDriver:'au chauffeur',commission:'commission DIGIYLYFE',open:'VOIR LA FICHE →',wa:'WhatsApp direct'},
en:{member:'DIGIYLYFE MEMBER',role:'Driver · Saly · Mbour · AIBD · Multi-region',area:'📍 Saly · Mbour · AIBD · Petite Côte',c1:'Direct trips',c2:'Airport transfers',c3:'Regional trips',c4:'Driver on demand',contact:'📞 Direct contact',payment:'💳 Direct payment',toDriver:'to the driver',commission:'DIGIYLYFE commission',open:'VIEW PAGE →',wa:'Direct WhatsApp'},
es:{member:'MIEMBRO DIGIYLYFE',role:'Conductor · Saly · Mbour · AIBD · Multirregión',area:'📍 Saly · Mbour · AIBD · Petite Côte',c1:'Trayectos directos',c2:'Traslados aeropuerto',c3:'Desplazamientos regionales',c4:'Puesta a disposición',contact:'📞 Contacto directo',payment:'💳 Pago directo',toDriver:'al conductor',commission:'comisión DIGIYLYFE',open:'VER FICHA →',wa:'WhatsApp directo'},
pt:{member:'MEMBRO DIGIYLYFE',role:'Motorista · Saly · Mbour · AIBD · Multirregião',area:'📍 Saly · Mbour · AIBD · Petite Côte',c1:'Trajetos diretos',c2:'Transfers aeroporto',c3:'Deslocações regionais',c4:'Disponibilidade',contact:'📞 Contacto direto',payment:'💳 Pagamento direto',toDriver:'ao motorista',commission:'comissão DIGIYLYFE',open:'VER FICHA →',wa:'WhatsApp direto'},
it:{member:'MEMBRO DIGIYLYFE',role:'Autista · Saly · Mbour · AIBD · Multiregione',area:'📍 Saly · Mbour · AIBD · Petite Côte',c1:'Tragitti diretti',c2:'Transfer aeroporto',c3:'Spostamenti regionali',c4:'Disponibilità',contact:'📞 Contatto diretto',payment:'💳 Pagamento diretto',toDriver:'all’autista',commission:'commissione DIGIYLYFE',open:'VEDI SCHEDA →',wa:'WhatsApp diretto'},
de:{member:'DIGIYLYFE-MITGLIED',role:'Fahrer · Saly · Mbour · AIBD · Mehrere Regionen',area:'📍 Saly · Mbour · AIBD · Petite Côte',c1:'Direkte Fahrten',c2:'Flughafentransfers',c3:'Regionale Fahrten',c4:'Bereitstellung',contact:'📞 Direkter Kontakt',payment:'💳 Direkte Zahlung',toDriver:'an den Fahrer',commission:'DIGIYLYFE-Provision',open:'SEITE ANSEHEN →',wa:'WhatsApp direkt'},
nl:{member:'DIGIYLYFE LID',role:'Chauffeur · Saly · Mbour · AIBD · Meerdere regio’s',area:'📍 Saly · Mbour · AIBD · Petite Côte',c1:'Directe ritten',c2:'Luchthaventransfers',c3:'Regionale ritten',c4:'Beschikbaar op aanvraag',contact:'📞 Direct contact',payment:'💳 Rechtstreekse betaling',toDriver:'aan de chauffeur',commission:'DIGIYLYFE-commissie',open:'BEKIJK FICHE →',wa:'WhatsApp direct'},
ar:{member:'عضو DIGIYLYFE',role:'سائق · Saly · Mbour · AIBD · مناطق متعددة',area:'📍 Saly · Mbour · AIBD · Petite Côte',c1:'رحلات مباشرة',c2:'نقل المطار',c3:'تنقلات إقليمية',c4:'تحت التصرف',contact:'📞 تواصل مباشر',payment:'💳 دفع مباشر',toDriver:'للسائق',commission:'عمولة DIGIYLYFE',open:'فتح الصفحة ←',wa:'واتساب مباشر'}
};
function lang(){var l=(document.documentElement.lang||'fr').slice(0,2).toLowerCase();return T[l]?l:'fr';}
function render(){
  var section=document.getElementById('chauffeurs'); if(!section)return;
  var x=T[lang()];
  var card=document.getElementById('nazir-driver-gallery');
  if(!card){
    card=document.createElement('article'); card.className='listing'; card.id='nazir-driver-gallery';
    var note=section.querySelector('.note'); if(note)section.insertBefore(card,note); else section.appendChild(card);
  }
  card.innerHTML='<a class="photo" href="https://galerie-chauffeurs.digiylyfe.com/nazir-driver.html" target="_blank" rel="noopener"><img src="https://galerie-chauffeurs.digiylyfe.com/nazir-driver-card.svg" alt="Nazir Driver"></a>'+
  '<div class="info"><p class="eyebrow">'+x.member+'</p><h3 class="name">Nazir Driver</h3><p class="designation">'+x.role+'</p><span class="area">'+x.area+'</span>'+
  '<div class="chips"><span class="chip">'+x.c1+'</span><span class="chip">'+x.c2+'</span><span class="chip">'+x.c3+'</span><span class="chip">'+x.c4+'</span></div>'+
  '<div class="direct"><div><b>'+x.contact+'</b>+221 77 831 02 98</div><div><b>'+x.payment+'</b><span>'+x.toDriver+'</span></div><div><b>0 %</b><span>'+x.commission+'</span></div></div>'+
  '<div class="actions"><a class="btn-primary" href="https://galerie-chauffeurs.digiylyfe.com/nazir-driver.html" target="_blank" rel="noopener">'+x.open+'</a><a class="btn-outline" href="https://wa.me/221778310298" target="_blank" rel="noopener">'+x.wa+'</a></div></div>';
}
function boot(){render();document.querySelectorAll('.langBtn').forEach(function(b){b.addEventListener('click',function(){setTimeout(render,0);setTimeout(render,80);});});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
