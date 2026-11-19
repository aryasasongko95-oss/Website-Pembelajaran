/* EduPedia - Utilitas dasar dan penyimpanan preferensi/data ($, esc, store). */
const $=(s,e=document)=>e.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store={
  get(k,d){try{const v=localStorage.getItem('edp_'+k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem('edp_'+k,JSON.stringify(v))}catch(e){}}
};
