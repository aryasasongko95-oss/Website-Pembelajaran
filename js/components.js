/* EduPedia - Komponen: sidebar, kartu, bar info, hero, helper UI. */
/* ---------- Komponen ---------- */
const titles={dashboard:'Dashboard',subjects:'Mata Pelajaran',media:'Semua Media',favs:'Favorit',about:'Tentang EduPedia',admin:'Kelola Admin',subject:'Mata Pelajaran'};
function sidebar(){
  const items=[['dashboard','▦','Dashboard'],['subjects','📚','Mata Pelajaran'],['media','🎞️','Semua Media'],['favs','★','Favorit'],['about','ℹ️','Tentang EduPedia']];
  if(isAdmin)items.push(['admin','⚙️','Kelola Admin']);
  $('#side').innerHTML=(navItems=items,'')+
   `<button class="sl" data-go="subjects">Mata Pelajaran</button><input class="sq" id="sq" type="search" placeholder="Pencarian..." aria-label="Cari mata pelajaran" value="${esc(sideQ)}"><div id="sl" class="sls">${sideList()}</div><div class="cnt">Total: ${subjects.length} Mata Pelajaran</div>`;
}
const code=s=>s.id.slice(0,3).toUpperCase()+'-'+String(subjects.indexOf(s)+1).padStart(3,'0');
const sideList=()=>subjects.filter(s=>s.name.toLowerCase().includes(sideQ.toLowerCase())).map(s=>`<button class="si ${view==='subject'&&sel===s.id?'on':''}" data-subj="${esc(s.id)}"><b>${esc(s.name)}</b></button>`).join('')||'<div class="mut" style="padding:8px 4px">Tidak ditemukan</div>';
function subjectCard(s){const l=mediaOf(s.id),n=[...l].sort((a,b)=>b.date.localeCompare(a.date))[0];
 return `<button class="cc" data-subj="${esc(s.id)}"><span class="ci">${esc(s.icon)}</span><h3>${esc(s.name)}</h3><small>${l.length} Materi</small><span class="go">↗</span></button>`}
const sortedS=()=>{let l=[...subjects];if(sortS==='az')l.sort((a,b)=>a.name.localeCompare(b.name));if(sortS==='cnt')l.sort((a,b)=>mediaOf(b.id).length-mediaOf(a.id).length);return l};
function subjectBlock(l){const n=Math.max(1,Math.ceil(l.length/PS));pg=Math.min(Math.max(1,pg),n);
 return `<div style="display:flex;align-items:center;justify-content:space-between"><h2>Mata Pelajaran</h2>${n>1?`<div class="pgr"><button data-pg="-1" aria-label="Sebelumnya">‹</button>${Array.from({length:n},(_,i)=>`<button class="${pg===i+1?'on':''}" data-pg="${i+1}">${i+1}</button>`).join('')}<button data-pg="+1" aria-label="Berikutnya">›</button></div>`:''}</div>${l.length?`<div class="grid">${l.slice((pg-1)*PS,pg*PS).map(subjectCard).join('')}</div>`:empty('Belum ada mata pelajaran','Admin dapat menambahkannya di menu Kelola Admin.')}`}
function infoBar(){const l=[...media].sort((a,b)=>b.date.localeCompare(a.date)),m=l[0];
 return `<button class="info" data-more aria-expanded="${more}"><span>▦</span> <b style="flex:1;text-align:left">Informasi pembelajaran</b><span>${more?'⌃':'⌄'}</span></button>${more?`<div class="card" style="margin-top:10px"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">${navItems.filter(x=>!['dashboard','subjects'].includes(x[0])).map(([v,i,t])=>`<button class="btn g s" data-go="${v}">${i} ${t}</button>`).join('')}</div>${recent.map(id=>media.find(m=>m.id===id)).filter(Boolean).length?`<div class="mut" style="margin-bottom:6px">Terakhir dibuka</div>${recent.map(id=>media.find(m=>m.id===id)).filter(Boolean).slice(0,3).map(mediaRow).join('')}<div style="height:10px"></div>`:''}<div class="mut" style="margin-bottom:6px">Media terbaru</div>${l.slice(0,3).map(mediaRow).join('')||'<span class="mut">Belum ada media</span>'}</div>`:''}`}
function pageIn(){const a=$('#app');a.classList.remove('pt');void a.offsetWidth;a.classList.add('pt')}
function countUp(){document.querySelectorAll('.big').forEach(e=>{const n=+e.textContent;if(!n||matchMedia('(prefers-reduced-motion:reduce)').matches)return;let t0;const f=t=>{t0=t0||t;const p=Math.min((t-t0)/500,1);e.textContent=Math.round(n*p);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
let recent=store.get('recent',[]);
function addRecent(id){recent=[id,...recent.filter(x=>x!==id)].slice(0,5);store.set('recent',recent)}
function nav(dir){const v=$('#viewer');if(!v)return;const m=media.find(x=>x.id===v.dataset.id),g=mediaOf(m.subject),n=g[g.indexOf(m)+dir];if(!n){toast('Tidak ada media '+(dir>0?'berikutnya':'sebelumnya'),true);return}v.remove();openMedia(n.id)}
function hero(){const a=$('#app'),h=$('h1',a);if(!h)return;const d=document.createElement('div');d.className='hero';const l=document.createElement('div');l.append(h,...(view==='dashboard'?['.sub']:['.sub','.crumb']).map(x=>$(x,a)).filter(Boolean));d.append(l);d.insertAdjacentHTML('beforeend','<svg class="hi" width="44" height="38" viewBox="0 0 44 38" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><circle cx="14" cy="14" r="9"/><circle cx="34" cy="10" r="5"/><circle cx="30" cy="28" r="7"/></svg>');a.prepend(d)}
function mediaRow(m){
  const s=subj(m.subject);const f=favs.includes(m.id);
  return `<div class="row"><div class="grow"><b>${esc(m.name)}</b><span class="mut">${esc(s?s.name:'Tanpa mapel')} · ${fmt(m.date)}</span></div>
  <button class="fav ${f?'on':''}" data-fav="${esc(m.id)}" aria-label="${f?'Hapus dari favorit':'Tambah ke favorit'}">${f?'★':'☆'}</button>
  <button class="btn s" data-open="${esc(m.id)}">Buka media</button></div>`;
}
const empty=(t,d)=>`<div class="empty"><b>${t}</b>${d}</div>`;
const crumb=(...p)=>`<div class="crumb"><a data-go="dashboard">Beranda</a>${p.map(x=>' / '+x).join('')}</div>`;

