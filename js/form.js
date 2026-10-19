// Form kontak: DOM, event listener (submit, input, blur, reset), dan validasi
const form = document.getElementById("form-kontak");
const pesanEl = document.getElementById("pesan");
const hitungEl = document.getElementById("hitung-pesan");
const hasilKosong = document.getElementById("hasil-kosong");
const hasilDaftar = document.getElementById("hasil-daftar");

const MAKS_PESAN = 200;

// Aturan validasi tiap field: mengembalikan teks error, atau "" jika valid
const aturan = {
  nama(v) {
    if (!v) return "Nama wajib diisi.";
    if (v.length < 3) return "Nama minimal 3 karakter.";
    if (!/^[A-Za-z\s.'-]+$/.test(v)) return "Nama hanya boleh berisi huruf.";
    return "";
  },
  email(v) {
    if (!v) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Format email belum benar, contoh: nama@email.com.";
    return "";
  },
  hp(v) {
    if (!v) return "Nomor HP wajib diisi.";
    if (!/^(08|\+628)\d{8,11}$/.test(v)) return "Gunakan format 08xxxxxxxxxx (10-13 digit).";
    return "";
  },
  topik(v) {
    return v ? "" : "Pilih salah satu topik.";
  },
  pesan(v) {
    if (!v) return "Pesan wajib diisi.";
    if (v.length < 10) return "Pesan minimal 10 karakter.";
    return "";
  },
  setuju(checked) {
    return checked ? "" : "Centang kotak ini sebelum mengirim.";
  },
};

function ambilNilai(el) {
  return el.type === "checkbox" ? el.checked : el.value.trim();
}

function validasiField(el) {
  const pesanError = aturan[el.name](ambilNilai(el));
  const errEl = document.getElementById("err-" + el.name);
  errEl.textContent = pesanError;
  el.classList.toggle("is-invalid", pesanError !== "");
  el.classList.toggle("is-valid", pesanError === "" && el.type !== "checkbox");
  return pesanError === "";
}

function tambahHasil(data) {
  hasilKosong.hidden = true;

  const li = document.createElement("li");
  const judul = document.createElement("strong");
  judul.textContent = `${data.nama} (${data.topik})`;

  const isi = document.createElement("div");
  isi.textContent = data.pesan;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `${data.email} | ${data.hp} | ${data.waktu}`;

  li.append(judul, isi, meta);
  hasilDaftar.prepend(li);
}

// Event: validasi langsung saat mengetik / berpindah field
form.addEventListener("input", (e) => {
  if (e.target.name in aturan) validasiField(e.target);
});
form.addEventListener("focusout", (e) => {
  if (e.target.name in aturan) validasiField(e.target);
});

// Event: penghitung karakter pesan
pesanEl.addEventListener("input", () => {
  hitungEl.textContent = pesanEl.value.length;
  hitungEl.parentElement.classList.toggle("is-limit", pesanEl.value.length >= MAKS_PESAN);
});

// Event: kirim form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fields = Array.from(form.elements).filter((el) => el.name in aturan);
  const hasil = fields.map(validasiField);
  const semuaValid = hasil.every(Boolean);

  if (!semuaValid) {
    fields[hasil.indexOf(false)].focus();
    return;
  }

  tambahHasil({
    nama: form.nama.value.trim(),
    email: form.email.value.trim(),
    hp: form.hp.value.trim(),
    topik: form.topik.value,
    pesan: form.pesan.value.trim(),
    waktu: new Date().toLocaleString("id-ID"),
  });

  form.reset();
});

// Event: bersihkan tampilan error dan penghitung saat form dikosongkan
form.addEventListener("reset", () => {
  form.querySelectorAll(".is-invalid, .is-valid").forEach((el) => el.classList.remove("is-invalid", "is-valid"));
  form.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  hitungEl.textContent = "0";
  hitungEl.parentElement.classList.remove("is-limit");
});
