/* EduPedia - Event klik/input/submit, pintasan keyboard, dan inisialisasi */
/* ---------- Riwayat Navigasi EduPedia ---------- */

function pushEduPediaHistory() {
  history.pushState({
    edupediaNavigation: true,
    view,
    sel,
    selectedMaterial,
    selectedCategory
  }, '', location.href);
}
/* ---------- Konfigurasi Upload ---------- */

/* ---------- Konfigurasi Upload ---------- */

const uploadAPI =
  'https://script.google.com/macros/s/AKfycbwcvSbavl3tjOuzfrhEYBB5WPwOceEz9Q3Uvp65HYVNe5A-0fZSAyZ1IT3MwgruPoPh7Q/exec';

const uploadKey = 'EduPediaUpload2026';
/* ---------- Konversi File ---------- */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result.split(',')[1]);
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

/* ---------- Upload Google Drive ---------- */

/* ---------- Upload Google Drive ---------- */

async function uploadToGoogleDrive(file, mediaData) {
  const base64 = await fileToBase64(file);

  const payload = {
    key: uploadKey,
    action: 'upload',
    base64: base64,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    name: mediaData.name,
    subject: mediaData.subject,
    material: mediaData.material,
    category: mediaData.category,
    description: mediaData.desc
  };

  console.log('Mengirim file ke Google Apps Script:', file.name);
  console.log('Ukuran file:', file.size);
  console.log('Kategori:', mediaData.category);

  return fetch(uploadAPI, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });
}

/* ---------- Event Klik ---------- */

document.addEventListener('click', e => {
  const t = e.target.closest(
    '[data-vp],[data-vn],[data-vf],[data-vz],[data-bd],[data-install],[data-pg],[data-more],[data-go],[data-subj],[data-addfile],[data-open],[data-material],[data-category],[data-fav],[data-es],[data-ds],[data-em],[data-dm],[data-mv],[data-cancel],[data-back],[data-home]'
  );

  if (!t) {
    if (!e.target.closest('.prof')) {
      $('#pm').classList.remove('on');
    }
    return;
  }

  const d = t.dataset;

  if (d.go) {
    go(d.go);
  }

  else if (d.subj) {
    loading(() => go('subject', d.subj));
  }

  else if (d.material) {
    openMaterial(d.material);
  }

  else if (d.category) {
    selectedCategory = d.category;
    view = 'category';

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

  else if (t.hasAttribute('data-addfile')) {
    const form = $('#fm');

    if (form) {
      form.hidden = !form.hidden;

      if (!form.hidden) {
        form.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  else if (d.open) {
    openMedia(d.open);
  }

  else if ('vp' in d) {
    nav(-1);
  }

  else if ('vn' in d) {
    nav(1);
  }

  else if ('bd' in d) {
    document.body.classList.remove('side');
  }

  else if ('vf' in d) {
    const id = $('#viewer').dataset.id;

    favs = favs.includes(id)
      ? favs.filter(x => x !== id)
      : [...favs, id];

    persist();

    t.textContent =
      (favs.includes(id) ? '★' : '☆') + ' Favorit';

    toast(
      favs.includes(id)
        ? 'Ditambahkan ke favorit'
        : 'Dihapus dari favorit'
    );
  }

  else if ('vz' in d) {
    const f = $('#viewer iframe');

    const r = (
      f.requestFullscreen ||
      f.webkitRequestFullscreen ||
      (() => 0)
    ).call(f);

    if (r && r.catch) {
      r.catch(() => toast('Layar penuh diblokir browser', 'er'));
    }
  }

  else if (d.pg) {
    pg = d.pg === '-1'
      ? pg - 1
      : d.pg === '+1'
        ? pg + 1
        : +d.pg;

    liveRender();
  }

  else if ('more' in d) {
    more = !more;
    render();

    if (more) {
      countUp();
    }
  }

  else if (d.fav) {
    favs = favs.includes(d.fav)
      ? favs.filter(x => x !== d.fav)
      : [...favs, d.fav];

    persist();

    toast(
      favs.includes(d.fav)
        ? 'Ditambahkan ke favorit'
        : 'Dihapus dari favorit'
    );

    const y = scrollY;

    render();
    scrollTo(0, y);
  }

else if ('back' in d) {
  if (history.state?.edupediaViewer) {
    history.back();
  } else {
    closeViewer();
  }
}
else if ('home' in d) {
  store.set('lastMedia', null);

  if (history.state?.edupediaViewer) {
    history.back();
  }

  go('dashboard');
}

  else if (d.es) {
    editing = {
      t: 's',
      id: d.es
    };

    render();
    scrollTo(0, 0);
  }

  else if (d.em) {
    editing = {
      t: 'm',
      id: d.em
    };

    render();
    scrollTo(0, 0);
  }

  else if ('cancel' in d) {
    editing = null;
    render();
  }

  else if (d.ds) {
    const s = subj(d.ds);

    if (confirm(`Hapus "${s.name}" beserta ${mediaOf(s.id).length} medianya?`)) {
      subjects = subjects.filter(x => x.id !== d.ds);
      media = media.filter(m => m.subject !== d.ds);

      persist();
      toast('Mata pelajaran dihapus');
      render();
    }
  }

else if (d.dm) {
  if (confirm('Hapus media ini?')) {
    const target = media.find(m => m.id === d.dm);

    if (!target) {
      toast('Media tidak ditemukan', 'er');
      return;
    }

    // Hapus dari database online jika memiliki ID online
    if (!String(target.id).startsWith('m')) {
      try {
        await fetch(uploadAPI, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            key: uploadKey,
            action: 'delete',
            id: target.id
          })
        });
      } catch (error) {
        console.error('Gagal mengirim permintaan hapus:', error);
        toast('Gagal mengirim permintaan hapus', 'er');
        return;
      }
    }

    media = media.filter(m => m.id !== d.dm);
    favs = favs.filter(x => x !== d.dm);

    persist();
    toast('Permintaan penghapusan dikirim');
    render();
  }
}

  else if (d.mv) {
    const [id, dir] = d.mv.split(':');
    const m = media.find(x => x.id === id);
    const g = mediaOf(m.subject);

    const i = g.indexOf(m);
    const j = i + +dir;

    if (j < 0 || j >= g.length) {
      toast(
        'Sudah di posisi paling ' +
        (dir < 0 ? 'atas' : 'bawah'),
        true
      );
      return;
    }

    [g[i], g[j]] = [g[j], g[i]];

    g.forEach((x, k) => {
      x.order = k;
    });

    persist();
    render();
  }
});

/* ---------- Event Input ---------- */

document.addEventListener('input', e => {
  if (e.target.id === 'q') {
    q = e.target.value;
    pg = 1;
    liveRender();
  }

  if (e.target.id === 'sq') {
    sideQ = e.target.value;
    $('#sl').innerHTML = sideList();
  }
});

/* ---------- Event Change ---------- */

document.addEventListener('change', e => {

  if (e.target.id === 'mediaSubject') {
    const subjectId = e.target.value;
    const materialSelect = $('#mediaMaterial');

    const list = materials.filter(
      m => m.subject === subjectId
    );

    materialSelect.innerHTML = list.map(m => `
      <option value="${esc(m.id)}">${esc(m.name)}</option>
    `).join('');

    if (!list.length) {
      materialSelect.innerHTML =
        '<option value="">Belum ada materi</option>';
    }
  }

  if (e.target.id === 'flt') {
    flt = e.target.value;
    liveRender();
  }

  if (e.target.id === 'srt') {
    sort = e.target.value;
    liveRender();
  }

  if (e.target.id === 'ss') {
    sortS = e.target.value;
    pg = 1;
    liveRender();
  }
});

/* ---------- Event Submit ---------- */

document.addEventListener('submit', async e => {
  e.preventDefault();

  const f = e.target;
  const d = Object.fromEntries(new FormData(f));

  /* ---------- Form Mata Pelajaran ---------- */

  if (f.id === 'fs') {

    if (!d.name.trim()) {
      toast('Nama wajib diisi', 'er');
      return;
    }

    if (editing?.t === 's') {
      Object.assign(subj(editing.id), {
        name: d.name.trim(),
        icon: d.icon || '📘',
        desc: d.desc
      });

      toast('Mata pelajaran diperbarui');
    }

    else {
      let id = slug(d.name);
      let n = 2;

      while (subj(id)) {
        id = slug(d.name) + '-' + n++;
      }

      subjects.push({
        id,
        name: d.name.trim(),
        icon: d.icon || '📘',
        desc: d.desc
      });

      toast('Mata pelajaran ditambahkan');
    }
  }

  /* ---------- Form Media ---------- */

  if (f.id === 'fm') {

    const documentFile = f.document?.files?.[0];
    const files = [...(f.folder?.files || [])];

    const materialId = d.material;

    let category = 'WEB';
    let html;

    /* ---------- Tentukan Kategori Dokumen ---------- */

    if (documentFile) {
      const ext = documentFile.name
        .split('.')
        .pop()
        .toLowerCase();

      if (ext === 'pdf') {
        category = 'PDF';
      }

      else if (['ppt', 'pptx'].includes(ext)) {
        category = 'PPT';
      }

      else if (['doc', 'docx'].includes(ext)) {
        category = 'DOKUMEN';
      }

      else {
        toast('Format dokumen tidak didukung', 'er');
        return;
      }

      await docDB.init();

      const documentId = 'doc-' + Date.now();

      await docDB.save(documentId, documentFile);

      f.dataset.documentId = documentId;
      f.dataset.documentName = documentFile.name;
    }

    /* ---------- Proses Folder WEB ---------- */

    if (files.length) {

      const main = files
        .filter(x => /(^|\/)index\.html?$/i.test(x.webkitRelativePath))
        .sort(
          (a, b) =>
            a.webkitRelativePath.length -
            b.webkitRelativePath.length
        )[0];

      if (!main) {
        toast('Folder tidak memiliki index.html', 'er');
        return;
      }

      html = await main.text();
      category = 'WEB';

      const find = p => files.find(x =>
        x.webkitRelativePath.endsWith(
          '/' + p.replace(/^\.\//, '')
        )
      );

      /* ---------- Masukkan CSS ---------- */

      html = html.replace(
        /<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi,
        (a, p) => {
          const x = find(p);

          return x
            ? '<style data-src="' + p + '">' +
              '@@' + files.indexOf(x) + '@@' +
              '</style>'
            : a;
        }
      );

      /* ---------- Ganti Placeholder CSS ---------- */

      for (const m of html.matchAll(/@@(\d+)@@/g)) {
        html = html.replace(
          m[0],
          await files[+m[1]].text()
        );
      }

      /* ---------- Masukkan JavaScript ---------- */

      const js = [...html.matchAll(
        /<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/gi
      )];

      for (const m of js) {
        const x = find(m[1]);

        if (x) {
          html = html.replace(
            m[0],
            '<script>' +
            (await x.text()).replace(
              /<\/script/gi,
              '<\\/script'
            ) +
            '<\/script>'
          );
        }
      }
    }

    /* ---------- Validasi Kategori ---------- */

    if (
      f.hasAttribute('data-category-form') &&
      category.toUpperCase() !==
      String(selectedCategory).toUpperCase()
    ) {
      toast(
        'Jenis file tidak sesuai dengan kategori yang dibuka',
        'er'
      );
      return;
    }

    /* ---------- Validasi Mata Pelajaran ---------- */

    if (!d.subject || !materialId) {
      toast(
        'Pilih mata pelajaran dan materi terlebih dahulu',
        'er'
      );
      return;
    }

    const selectedMaterial = materials.find(
      m => m.id === materialId
    );

    if (
      !selectedMaterial ||
      selectedMaterial.subject !== d.subject
    ) {
      toast(
        'Materi tidak sesuai dengan mata pelajaran',
        'er'
      );
      return;
    }

    /* ---------- Data Media ---------- */

    const mediaData = {
      name: d.name.trim(),
      subject: d.subject,
      material: materialId,
      category,
      desc: d.desc,
      url: d.url.trim(),
      docId: f.dataset.documentId || '',
      fileName: f.dataset.documentName || '',
      html,
      upload: !!html
    };

    /* ---------- Upload Dokumen ---------- */

    if (documentFile) {

      try {
        toast('Mengirim file ke Google Drive...');

        await uploadToGoogleDrive(
          documentFile,
          mediaData
        );

        console.log(
          'Request upload dikirim:',
          documentFile.name
        );

        toast('Permintaan upload dokumen dikirim');

      }

      catch (error) {
        console.error('Upload gagal:', error);

        toast(
          'Gagal mengirim dokumen ke Google Drive',
          'er'
        );

        return;
      }
    }

    /* ---------- Simpan Media ---------- */

    if (editing?.t === 'm') {

      const m = media.find(
        x => x.id === editing.id
      );

      Object.assign(m, mediaData);

      toast('Media diperbarui');
    }

    else {

      media.push({
        ...mediaData,
        id: 'm' + Date.now(),
        date: today(),
        order: media.length
      });

      toast('Media ditambahkan');
    }
  }

  /* ---------- Selesai ---------- */

  editing = null;

  persist();
  render();
});

/* ---------- Toggle Sidebar ---------- */

$('#tg').onclick = () => {
  const c = innerWidth <= 800
    ? 'side'
    : 'noside';

  document.body.classList.toggle(c);
};

/* ---------- Toggle Tema ---------- */

$('#th').onclick = () => {
  document.documentElement.classList.add('tt');

  setTimeout(() => {
    document.documentElement.classList.remove('tt');
  }, 350);

  const n =
    document.documentElement.dataset.theme === 'dark'
      ? 'light'
      : 'dark';

  document.documentElement.dataset.theme = n;

  store.set('theme', n);
};

/* ---------- Profil ---------- */

$('#pf').onclick = e => {
  e.stopPropagation();
  $('#pm').classList.toggle('on');
};

/* ---------- Admin ---------- */

$('#adm').onclick = () => {

  $('#pm').classList.remove('on');

  if (isAdmin) {
    isAdmin = false;

    if (view === 'admin') {
      view = 'dashboard';
    }

    toast('Mode admin dinonaktifkan');
    render();

    return;
  }

  const overlay = document.createElement('div');

  overlay.className = 'viewer';

  overlay.innerHTML = `
    <div class="card" style="width:min(360px,90%);margin:auto;padding:24px">
      <h2>Login Admin</h2>

      <form id="adminLogin">
        <label>ID Admin
          <input
            class="in"
            name="adminId"
            type="password"
            placeholder="Masukkan ID Admin"
            required
            autofocus
          >
        </label>

        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn" type="submit">
            Masuk
          </button>

          <button
            class="btn g"
            type="button"
            id="cancelAdmin"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  $('#cancelAdmin').onclick = () => {
    overlay.remove();
  };

  $('#adminLogin').onsubmit = e => {
    e.preventDefault();

    const id = new FormData(e.target).get('adminId');

    if (id === '00208') {

      isAdmin = true;

      store.set('admin', true);

      overlay.remove();

      toast('Mode admin aktif');

      render();
    }

    else {
      toast('ID Admin salah', 'er');

      e.target.reset();

      e.target.adminId.focus();
    }
  };
};

/* ---------- Keyboard ---------- */

document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {
    closeViewer();
  }

  if (
    (
      e.key === '/' ||
      (
        e.key === 'k' &&
        (e.ctrlKey || e.metaKey)
      )
    ) &&
    !/INPUT|TEXTAREA|SELECT/.test(
      document.activeElement.tagName
    )
  ) {
    const i = $('#q');

    if (i) {
      e.preventDefault();
      i.focus();
    }
  }

  if ($('#viewer')) {
    if (e.key === 'ArrowRight') {
      nav(1);
    }

    if (e.key === 'ArrowLeft') {
      nav(-1);
    }
  }
});

/* ---------- Inisialisasi Tema ---------- */

document.documentElement.dataset.theme =
  store.get('theme', 'dark');

if (innerWidth <= 800) {
  document.body.classList.remove('side');
}

/* ---------- Navigasi Terakhir ---------- */

const lastNavigation = store.get(
  'lastNavigation',
  null
);

if (lastNavigation) {

  const validViews = [
    'dashboard',
    'subjects',
    'subject',
    'material',
    'category',
    'media',
    'favs',
    'about',
    'admin'
  ];

  if (validViews.includes(lastNavigation.view)) {
    view = lastNavigation.view;
    sel = lastNavigation.sel;
    selectedMaterial = lastNavigation.selectedMaterial;
    selectedCategory = lastNavigation.selectedCategory;
  }
}
history.replaceState({
  edupediaNavigation: true,
  view,
  sel,
  selectedMaterial,
  selectedCategory
}, '', location.href);

/* ---------- Render Awal ---------- */

loading(async () => {
  render();
});