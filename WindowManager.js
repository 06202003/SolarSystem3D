class WindowManager {
  #windows; // Daftar window yang dikelola oleh WindowManager
  #count; // Jumlah window yang telah dibuat
  #id; // ID unik dari window saat ini
  #winData; // Data terkini dari window saat ini
  #winShapeChangeCallback; // Callback untuk perubahan bentuk window
  #winChangeCallback; // Callback untuk perubahan daftar window

  constructor() {
    let that = this;

    // Event listener untuk ketika localStorage diubah dari window lain
    addEventListener('storage', (event) => {
      if (event.key == 'windows') {
        let newWindows = JSON.parse(event.newValue);
        let winChange = that.#didWindowsChange(that.#windows, newWindows);

        that.#windows = newWindows;

        if (winChange) {
          if (that.#winChangeCallback) that.#winChangeCallback();
        }
      }
    });

    // Event listener untuk ketika window saat ini akan ditutup
    window.addEventListener('beforeunload', function (e) {
      let index = that.getWindowIndexFromId(that.#id);

      // Menghapus window ini dari daftar dan memperbarui localStorage
      that.#windows.splice(index, 1);
      that.updateWindowsLocalStorage();
    });
  }

  // Memeriksa apakah ada perubahan pada daftar window
  #didWindowsChange(pWins, nWins) {
    if (pWins.length != nWins.length) {
      return true;
    } else {
      let c = false;

      for (let i = 0; i < pWins.length; i++) {
        if (pWins[i].id != nWins[i].id) c = true;
      }

      return c;
    }
  }

  // Menginisialisasi window saat ini (menambahkan metadata untuk data kustom yang akan disimpan bersama setiap instance window)
  init(metaData) {
    this.#windows = JSON.parse(localStorage.getItem('windows')) || [];
    this.#count = localStorage.getItem('count') || 0;
    this.#count++;

    this.#id = this.#count;
    let shape = this.getWinShape();
    this.#winData = { id: this.#id, shape: shape, metaData: metaData };
    this.#windows.push(this.#winData);

    localStorage.setItem('count', this.#count);
    this.updateWindowsLocalStorage();
  }

  // Mengambil bentuk (posisi dan dimensi) dari window saat ini
  getWinShape() {
    let shape = { x: window.screenLeft, y: window.screenTop, w: window.innerWidth, h: window.innerHeight };
    return shape;
  }

  // Mencari index window dari ID yang diberikan
  getWindowIndexFromId(id) {
    let index = -1;

    for (let i = 0; i < this.#windows.length; i++) {
      if (this.#windows[i].id == id) index = i;
    }

    return index;
  }

  // Memperbarui localStorage dengan daftar window saat ini
  updateWindowsLocalStorage() {
    localStorage.setItem('windows', JSON.stringify(this.#windows));
  }

  // Memeriksa dan memperbarui window saat ini jika terdapat perubahan bentuk
  update() {
    let winShape = this.getWinShape();

    if (winShape.x != this.#winData.shape.x || winShape.y != this.#winData.shape.y || winShape.w != this.#winData.shape.w || winShape.h != this.#winData.shape.h) {
      this.#winData.shape = winShape;

      let index = this.getWindowIndexFromId(this.#id);
      this.#windows[index].shape = winShape;

      if (this.#winShapeChangeCallback) this.#winShapeChangeCallback();
      this.updateWindowsLocalStorage();
    }
  }

  // Setter untuk callback perubahan bentuk window
  setWinShapeChangeCallback(callback) {
    this.#winShapeChangeCallback = callback;
  }

  // Setter untuk callback perubahan daftar window
  setWinChangeCallback(callback) {
    this.#winChangeCallback = callback;
  }

  // Getter untuk mendapatkan daftar window yang dikelola
  getWindows() {
    return this.#windows;
  }

  // Getter untuk mendapatkan data window saat ini
  getThisWindowData() {
    return this.#winData;
  }

  // Getter untuk mendapatkan ID window saat ini
  getThisWindowID() {
    return this.#id;
  }
}

export default WindowManager;
