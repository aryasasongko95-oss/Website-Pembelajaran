/* EduPedia - Halaman: dashboard, mata pelajaran, media, favorit, tentang, admin. */
/* ---------- Halaman ---------- */
function pgDashboard(){
  const latest=[...media].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  const ql=q.toLowerCase();
  const hit=(q||flt)?{s:subjects.filter(s=>(!flt||s.id===flt)&&s.name.toLowerCase().includes(ql)),m:media.filter(m=>(!flt||m.subject===flt)&&m.name.toLowerCase().includes(ql))}:null;
  return `${crumb('Dashboard')}<h1>Dashboard</h1><p class="sub"></p>
  <div class="bar"><input class="in" id="q" type="search" placeholder="Pencarian materi  ( / )" value="${esc(q)}" aria-label="Cari"><select class="in" id="flt" aria-label="Filter mata pelajaran"><option value="">Semua pelajaran</option>${subjects.map(s=>`<option value="${esc(s.id)}" ${flt===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>${infoBar()}
  <div id="dyn">${hit?searchOut(hit):`
  <div class="grid stats" ${more?'':'hidden'}>
    <div class="card"><div class="big">${subjects.length}</div><div class="mut">Total mata pelajaran</div></div>
    <div class="card"><div class="big">${media.length}</div><div class="mut">Total media pembelajaran</div></div>
    <div class="card"><div class="big">${favs.filter(id=>media.some(m=>m.id===id)).length}</div><div class="mut">Media favorit</div></div>
    <div class="card"><div class="big" style="font-size:16px;padding:8px 0">${latest[0]?esc(latest[0].name):'-'}</div><div class="mut">Media terbaru</div></div>
  </div>
  ${subjectBlock(sortedS())}
  `}</div>`;
}
function searchOut(h){
  return `<h2>Mata Pelajaran (${h.s.length})</h2>${h.s.length?`<div class="grid">${h.s.map(subjectCard).join('')}</div>`:empty('Tidak ditemukan','Coba kata kunci lain.')}
  <h2>Media (${h.m.length})</h2>${h.m.length?h.m.map(mediaRow).join(''):empty('Tidak ditemukan','Coba kata kunci lain.')}`;
}
function pgSubjects(){
  const l=subjects.filter(s=>s.name.toLowerCase().includes(q.toLowerCase()));
  return `${crumb('Mata Pelajaran')}<h1>Mata Pelajaran</h1><p class="sub">${subjects.length} mata pelajaran tersedia.</p>
  <div class="bar"><input class="in" id="q" type="search" placeholder="Cari mata pelajaran…" value="${esc(q)}" aria-label="Cari mata pelajaran"></div>
  <div id="dyn">${l.length?`<div class="grid">${l.map(subjectCard).join('')}</div>`:empty('Tidak ada mata pelajaran','Ubah kata kunci pencarian.')}</div>`;
}

function pgSubject(){
  const s = subj(sel);

  if(!s){
    return empty('Mata pelajaran tidak ditemukan','Kembali ke daftar mata pelajaran.');
  }

  const list = materials.filter(m =>
    m.subject === s.id &&
    m.name.toLowerCase().includes(q.toLowerCase())
  );

  return `${crumb('<a data-go="subjects">Mata Pelajaran</a>',esc(s.name))}
    <h1>${esc(s.icon)} ${esc(s.name)}</h1>
    <p class="sub">${esc(s.desc)}</p>


    <div class="bar">
      <input class="in" id="q" type="search"
        placeholder="Cari materi..."
        value="${esc(q)}"
        aria-label="Cari materi">
    </div>

    <div id="dyn">
      ${list.length ? `
        <div class="grid">
          ${list.map(m => `
            <div class="card">
              <b>${esc(m.name)}</b>
              <p class="mut" style="margin:4px 0 12px">
                ${esc(m.desc)}
              </p>
              <button class="btn s" data-material="${esc(m.id)}">
                Buka Materi
              </button>
            </div>
          `).join('')}
        </div>
      ` : empty('Belum ada materi','Materi untuk mata pelajaran ini belum ditambahkan.')}
    </div>`;
}

function pgMaterial(){
  const m = materials.find(x => x.id === selectedMaterial);

  if(!m){
    return empty('Materi tidak ditemukan','Kembali ke mata pelajaran.');
  }

  const categories = [
    ['WEB','🌐','Media berbasis website'],
    ['PPT','📊','Presentasi pembelajaran'],
    ['PDF','📄','Modul dan materi PDF'],
    ['DOKUMEN','📝','Dokumen pembelajaran']
  ];

  return `${crumb('<a data-go="subjects">Mata Pelajaran</a>',esc(m.name))}
    <h1>${esc(m.name)}</h1>
    <p class="sub">${esc(m.desc)}</p>

    <h2>Pilih Jenis Media</h2>

    <div class="grid">
      ${categories.map(([category,icon,desc]) => {
        const total = media.filter(x =>
          x.material === m.id && x.category === category
        ).length;

        return `
          <div class="card">
            <div style="font-size:30px">${icon}</div>
            <b>${category}</b>
            <p class="mut">${desc}</p>
            <span class="tag">${total} media</span>
            <button class="btn s" data-category="${category}">
              Buka
            </button>
          </div>
        `;
      }).join('')}
    </div>`;
}



function pgCategory(){
  const m = materials.find(x => x.id === selectedMaterial);

  if(!m){
    return empty('Materi tidak ditemukan','Kembali ke mata pelajaran.');
  }

  const list = media.filter(x =>
    x.material === m.id && x.category === selectedCategory
  );

  return `${crumb(esc(m.name),selectedCategory)}
    <h1>${selectedCategory}</h1>
    <p class="sub">${esc(m.name)}</p>

    ${isAdmin ? `
      <div style="margin:16px 0">
        <button class="btn" type="button" data-addfile>
          + Tambah File
        </button>
      </div>

      <form class="form" id="fm" data-category-form hidden>
        <input type="hidden" name="subject" value="${esc(m.subject)}">
        <input type="hidden" name="material" value="${esc(m.id)}">

        <label>Nama media
          <input class="in" name="name" required>
        </label>

        <label>Deskripsi
          <textarea class="in" name="desc" rows="2"></textarea>
        </label>

        <label>Alamat media (opsional)
          <input class="in" name="url">
        </label>

        <label>Unggah dokumen (PDF, PPT, PPTX, DOC, DOCX)
          <input class="in" type="file" name="document" accept=".pdf,.ppt,.pptx,.doc,.docx">
        </label>

        <label>Atau unggah folder media interaktif (HTML, CSS, JS, gambar)
          <input class="in" type="file" name="folder" webkitdirectory multiple>
        </label>

        <button class="btn">Tambah Media</button>
      </form>
    ` : ''}

    ${list.length ? `
      <div class="grid">
        ${list.map(x => `
          <div class="card">
            <b>${esc(x.name)}</b>
            <p class="mut">${esc(x.desc || '')}</p>

            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn s" data-open="${esc(x.id)}">
                Buka Media
              </button>

              ${isAdmin ? `
                <button class="btn d s" data-dm="${esc(x.id)}">
                  Hapus
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    ` : empty('Belum ada media',`Belum ada file ${selectedCategory} untuk materi ini.`)}
  `;
}



function filtered(list){
  const ql=q.toLowerCase();
  let l=list.filter(m=>m.name.toLowerCase().includes(ql)&&(!flt||m.subject===flt));
  const[k,d]=sort.split('-');
  l.sort((a,b)=>(k==='name'?a.name.localeCompare(b.name):a.date.localeCompare(b.date))*(d==='asc'?1:-1));
  return l;
}
function pgMedia(favOnly){
  const base=favOnly?media.filter(m=>favs.includes(m.id)):media;
  const l=filtered(base);
  return `${crumb(favOnly?'Favorit':'Semua Media')}<h1>${favOnly?'Favorit':'Semua Media'}</h1><p class="sub">${favOnly?'Media yang kamu tandai dengan bintang.':'Seluruh media dari semua mata pelajaran.'}</p>
  <div class="bar"><input class="in" id="q" type="search" placeholder="Cari nama media…" value="${esc(q)}" aria-label="Cari media">
   <select class="in" id="flt" aria-label="Filter mata pelajaran"><option value="">Semua mata pelajaran</option>${subjects.map(s=>`<option value="${esc(s.id)}" ${flt===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select>
   <select class="in" id="srt" aria-label="Urutkan">${[['date-desc','Terbaru'],['date-asc','Terlama'],['name-asc','Nama A-Z'],['name-desc','Nama Z-A']].map(([v,t])=>`<option value="${v}" ${sort===v?'selected':''}>${t}</option>`).join('')}</select></div>
  <div id="dyn">${l.length?l.map(mediaRow).join(''):favOnly&&!favs.length?empty('Belum ada favorit','Tekan ikon bintang pada media untuk menyimpannya di sini.'):empty('Media tidak ditemukan','Ubah pencarian atau filter.')}</div>`;
}
function pgAbout(){
  return `${crumb('Tentang EduPedia')}<h1>Tentang EduPedia</h1><p class="sub">Portal media pembelajaran digital satu pintu.</p>
  <div class="card" style="max-width:640px;cursor:default"><p>EduPedia mengumpulkan media pembelajaran interaktif dari berbagai mata pelajaran dalam satu website. Cari media, tandai favorit, lalu buka dalam tampilan penuh tanpa kehilangan navigasi utama.</p></div>`;
}
function pgAdmin(){
  if(!isAdmin)return empty('Akses admin diperlukan','Aktifkan mode admin dari menu profil.');
  const es=editing&&editing.t==='s'?subj(editing.id):null, em=editing&&editing.t==='m'?media.find(m=>m.id===editing.id):null;
  return `${crumb('Kelola Admin')}<h1>Kelola Admin</h1><p class="sub">Atur mata pelajaran dan media. Perubahan langsung tampil di portal.</p>
  <h2>Mata Pelajaran</h2>
  <form class="form" id="fs"><label>Nama<input class="in" name="name" required value="${esc(es?.name)}"></label>
   <label>Ikon (emoji)<input class="in" name="icon" maxlength="4" value="${esc(es?.icon||'📘')}"></label>
   <label>Deskripsi<textarea class="in" name="desc" rows="2">${esc(es?.desc)}</textarea></label>
   <div><button class="btn">${es?'Simpan perubahan':'Tambah mata pelajaran'}</button> ${es?'<button type="button" class="btn g" data-cancel>Batal</button>':''}</div></form>
  ${subjects.map(s=>`<div class="row"><span style="font-size:22px">${esc(s.icon)}</span><div class="grow"><b>${esc(s.name)}</b><span class="mut">${mediaOf(s.id).length} media</span></div><button class="btn g s" data-es="${esc(s.id)}">Edit</button><button class="btn d s" data-ds="${esc(s.id)}">Hapus</button></div>`).join('')}
  <h2>Media Pembelajaran</h2>
  <form class="form" id="fm"><label>Nama media<input class="in" name="name" required value="${esc(em?.name)}"></label>
   
<label>Mata pelajaran
  <select class="in" name="subject" id="mediaSubject" required>
    ${subjects.map(s=>`
      <option value="${esc(s.id)}" ${em&&em.subject===s.id?'selected':''}>
        ${esc(s.name)}
      </option>
    `).join('')}
  </select>
</label>

<label>Materi
  <select class="in" name="material" id="mediaMaterial" required>
    ${materials.filter(m=>m.subject===(em?.subject||subjects[0]?.id)).map(m=>`
      <option value="${esc(m.id)}" ${em&&em.material===m.id?'selected':''}>
        ${esc(m.name)}
      </option>
    `).join('')}
  </select>
</label>

   <label>Deskripsi<textarea class="in" name="desc" rows="2">${esc(em?.desc)}</textarea></label>
   <label>Alamat media (opsional)
<input class="in" name="url" value="${esc(em?.url)}"></label>

<label>Unggah dokumen (PDF, PPT, PPTX, DOC, DOCX)
<input class="in" type="file" name="document" accept=".pdf,.ppt,.pptx,.doc,.docx"></label>

<label>Atau unggah folder media interaktif (HTML, CSS, JS, gambar)
<input class="in" type="file" name="folder" webkitdirectory multiple></label>
   <div><button class="btn">${em?'Simpan perubahan':'Tambah media'}</button> ${em?'<button type="button" class="btn g" data-cancel>Batal</button>':''}</div></form>
  ${[...media].sort((a,b)=>a.subject.localeCompare(b.subject)||a.order-b.order).map(m=>`<div class="row"><div class="grow"><b>${esc(m.name)}</b><span class="mut">${esc(subj(m.subject)?.name||'-')}</span></div>
   <button class="btn g s" data-mv="${esc(m.id)}:-1" aria-label="Naik">↑</button><button class="btn g s" data-mv="${esc(m.id)}:1" aria-label="Turun">↓</button>
   <button class="btn g s" data-em="${esc(m.id)}">Edit</button><button class="btn d s" data-dm="${esc(m.id)}">Hapus</button></div>`).join('')||empty('Belum ada media','Tambahkan media lewat formulir di atas.')}`;
}

