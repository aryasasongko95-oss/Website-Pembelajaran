/* EduPedia - Render halaman dan render ulang hasil pencarian. */
/* ---------- Render ---------- */
function render(){
  $('#ttl').textContent=view==='subject'?(subj(sel)?.name||'Mata Pelajaran'):view==='material'?'Materi':titles[view];
  sidebar();
  const pages={dashboard:pgDashboard,subjects:pgSubjects,subject:pgSubject,material:pgMaterial,category:pgCategory,media:()=>pgMedia(false),favs:()=>pgMedia(true),about:pgAbout,admin:pgAdmin};
  $('#app').innerHTML=pages[view]();hero();
  $('#who').textContent=isAdmin?'Admin':'Pengunjung';
  $('#adm').textContent=isAdmin?'Keluar mode admin':'Masuk mode admin';
}
function liveRender(){ // perbarui hasil tanpa kehilangan fokus input
  const p={dashboard:pgDashboard,subjects:pgSubjects,subject:pgSubject,media:()=>pgMedia(false),favs:()=>pgMedia(true)}[view];
  if(!p)return;const t=document.createElement('div');t.innerHTML=p();$('#dyn').innerHTML=$('#dyn',t).innerHTML;
}

