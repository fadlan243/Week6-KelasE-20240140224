// Fetch API: mengambil dan menampilkan data produk dari DummyJSON
const API_URL = "https://dummyjson.com/products";

const daftarEl = document.getElementById("daftar-produk");
const statusEl = document.getElementById("status-produk");
const cariEl = document.getElementById("cari-produk");
const retryBtn = document.getElementById("btn-coba-lagi");

let semuaProduk = [];

function formatHarga(angka) {
  return "$" + Number(angka).toFixed(2);
}

function setStatus(pesan, { error = false, loading = false } = {}) {
  statusEl.textContent = "";
  statusEl.classList.toggle("is-error", error);
  if (loading) {
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    statusEl.appendChild(spinner);
  }
  statusEl.appendChild(document.createTextNode(pesan));
}

function buatKartu(produk) {
  const li = document.createElement("li");
  li.className = "product-item";

  const img = document.createElement("img");
  img.src = produk.thumbnail;
  img.alt = produk.title;
  img.loading = "lazy";

  const nama = document.createElement("h3");
  nama.textContent = produk.title;

  const kategori = document.createElement("span");
  kategori.className = "kategori";
  kategori.textContent = produk.category;

  const harga = document.createElement("span");
  harga.className = "harga";
  harga.textContent = formatHarga(produk.price);

  li.append(img, nama, kategori, harga);
  return li;
}

function tampilkanProduk(daftar) {
  daftarEl.replaceChildren(...daftar.map(buatKartu));
  if (daftar.length === 0) {
    setStatus("Tidak ada produk yang cocok dengan pencarian.");
  } else {
    setStatus(`Menampilkan ${daftar.length} dari ${semuaProduk.length} produk.`);
  }
}

async function muatProduk() {
  retryBtn.hidden = true;
  cariEl.disabled = true;
  daftarEl.replaceChildren();
  setStatus("Memuat data produk...", { loading: true });

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Server membalas dengan status ${response.status}`);
    }
    const data = await response.json();
    semuaProduk = data.products;
    tampilkanProduk(semuaProduk);
    cariEl.disabled = false;
  } catch (err) {
    setStatus(`Data produk gagal dimuat. ${err.message}. Periksa koneksi internet lalu coba lagi.`, { error: true });
    retryBtn.hidden = false;
  }
}

// Event: filter produk saat pengguna mengetik
cariEl.addEventListener("input", () => {
  const kata = cariEl.value.trim().toLowerCase();
  const hasil = semuaProduk.filter((p) => p.title.toLowerCase().includes(kata));
  tampilkanProduk(hasil);
});

retryBtn.addEventListener("click", muatProduk);

muatProduk();
