const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(m=>m[1]).find(s=>s.includes('function renderDrivers('));
assert.ok(script,'Gallery renderer exists');

async function page(apiResponse,lang='fr'){
  const gallery={
    innerHTML:'',textContent:'',
    attributes:new Map(),
    setAttribute(k,v){this.attributes.set(k,v)},
    removeAttribute(k){this.attributes.delete(k)}
  };
  const document={
    documentElement:{lang:'fr',dir:'ltr'},title:'',
    getElementById(id){return id==='driverGallery'?gallery:null},
    querySelectorAll(){return []},
    querySelector(){return null}
  };
  const storage=new Map();
  const sandbox={
    document,URL,URLSearchParams,
    location:{href:'https://galerie-chauffeurs.digiylyfe.com/?lang='+lang,search:'?lang='+lang},
    history:{replaceState(){}},
    localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},
    fetch:async()=>apiResponse instanceof Error
      ?Promise.reject(apiResponse)
      :({ok:apiResponse.ok!==false,json:async()=>apiResponse.data})
  };
  vm.runInNewContext(script,sandbox,{timeout:5000});
  // JS gallery requests API on load asynchronously; resolve promise chain.
  await new Promise(resolve=>setImmediate(resolve));
  await new Promise(resolve=>setImmediate(resolve));
  return {gallery,document,sandbox};
}

test('valid Lamine card and WhatsApp link stay directly reachable',async()=>{
  const {gallery}=await page({data:[{
    slug:'lamine-driver-saly',display_name:'Lamine',bio:'Chauffeur privé',
    city:'Saly',zones:['Saly','AIBD'],tags:['Sur réservation'],
    phone:'+221 78 441 36 80',whatsapp:'+221 78 441 36 80',
    profile_url:'https://driver.digiylyfe.com/chauffeur.html?slug=lamine-driver-saly',
    photo_url:'https://example.org/lamine.jpg'
  }]});
  assert.match(gallery.innerHTML,/chauffeur\.html\?slug=lamine-driver-saly/);
  assert.match(gallery.innerHTML,/https:\/\/wa\.me\/221784413680/);
  assert.match(gallery.innerHTML,/tel:\+221784413680/);
  assert.match(gallery.innerHTML,/Saly/);
});
test('missing WhatsApp or profile never produces generic wa.me or blank href',async()=>{
  const {gallery}=await page({data:[{
    slug:'unknown-driver',display_name:'Chauffeur Test',city:'Saly',
    zones:'Saly',tags:null,whatsapp:'',profile_url:'',phone:''
  }]},'en');
  assert.match(gallery.innerHTML,/WhatsApp not provided/);
  assert.match(gallery.innerHTML,/Profile unavailable/);
  assert.doesNotMatch(gallery.innerHTML,/href="https:\/\/wa\.me\/"/);
  assert.doesNotMatch(gallery.innerHTML,/href=""/);
});
test('untrusted javascript profile URL is never clickable',async()=>{
  const {gallery}=await page({data:[{
    slug:'test',display_name:'Test',profile_url:'javascript:alert(1)',
    whatsapp:'not-a-number',photo_url:'javascript:alert(2)'
  }]});
  assert.doesNotMatch(gallery.innerHTML,/href="javascript:/);
  assert.doesNotMatch(gallery.innerHTML,/src="javascript:/);
  assert.match(gallery.innerHTML,/Fiche indisponible/);
});
test('API failures or invalid JSON show a useful status instead of an empty gallery',async()=>{
  const cases=[{ok:false,data:[]},{ok:true,data:{error:'source unavailable'}},new Error('network')];
  for(const c of cases){
    const {gallery}=await page(c);
    assert.match(gallery.textContent,/momentanément indisponibles/);
    assert.equal(gallery.attributes.get('role'),'status');
  }
});
test('genuinely empty member list is distinguished from a failed request in Wolof',async()=>{
  const {gallery}=await page({ok:true,data:[]},'wo');
  assert.match(gallery.textContent,/Amagul dawalkat/);
  assert.equal(gallery.attributes.get('role'),'status');
});
test('all 10 language availability and approved price remain intact',()=>{
  for(const lang of ['fr','en','es','pt','it','de','nl','ar','wo','zh']){
    assert.match(script,new RegExp('\\b'+lang+':\\{empty:'));
  }
  assert.match(html,/12 000 FCFA \/ mois/);
  assert.doesNotMatch(html,/19 900 FCFA \/ mois/);
});
