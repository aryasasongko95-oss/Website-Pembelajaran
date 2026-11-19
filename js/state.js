/* EduPedia - State aplikasi, fungsi bantu, navigasi (go) dan loading. */
/* ---------- State & util ---------- */
let view='dashboard',sel=null,q='',flt='',sort='date-desc',editing=null,sortS='',pg=1,more=false,sideQ='',navItems=[];
const PS=8;
const subj=id=>subjects.find(s=>s.id===id);
const mediaOf=id=>media.filter(m=>m.subject===id).sort((a,b)=>a.order-b.order);
const fmt=d=>{try{return new Date(d+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}catch(e){return d}};
const today=()=>new Date().toISOString().slice(0,10);
const slug=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
function toast(msg,err){const t=document.createElement('div');t.className='toast'+(err?' er':'');t.textContent=msg;$('#toast').append(t);setTimeout(()=>t.remove(),2800)}
function go(v, id) {
  view = v;
  sel = id || null;
  q = '';
  flt = '';
  editing = null;

  pushEduPediaHistory();

  store.set('lastNavigation', {
    view,
    sel,
    selectedMaterial,
    selectedCategory
  });

  render();
  pageIn();
  scrollTo(0, 0);

  if (innerWidth <= 800) {
    document.body.classList.remove('side');
  }
}

let selectedMaterial = null;
let selectedCategory = null;

function openMaterial(id) {
  selectedMaterial = id;
  selectedCategory = null;
  view = 'material';
  q = '';

  pushEduPediaHistory();

  store.set('lastNavigation', {
    view,
    sel,
    selectedMaterial,
    selectedCategory
  });

  render();
  pageIn();
  scrollTo(0, 0);
}

function loading(fn){$('#app').innerHTML='<div class="sk" role="status" aria-label="Memuat"><i></i><i></i><i></i><i></i></div>';setTimeout(fn,180)}

