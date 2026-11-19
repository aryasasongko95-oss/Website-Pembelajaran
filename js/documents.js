
const docDB = {
  db: null,

  async init() {
    this.db = await new Promise((resolve, reject) => {
      const req = indexedDB.open('EduPediaFiles', 1);

      req.onupgradeneeded = () => {
        req.result.createObjectStore('documents', {
          keyPath: 'id'
        });
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async save(id, file) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('documents', 'readwrite');
      tx.objectStore('documents').put({
        id,
        name: file.name,
        type: file.type,
        blob: file
      });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  },

  async get(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('documents', 'readonly');
      const req = tx.objectStore('documents').get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async remove(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('documents', 'readwrite');
      tx.objectStore('documents').delete(id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }
};

docDB.init();
