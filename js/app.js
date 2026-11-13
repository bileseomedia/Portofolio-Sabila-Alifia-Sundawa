import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ==================== NAVIGASI UI (DARI HTML) ====================
window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const iconOpen = document.getElementById('menuIconOpen');
  const iconClose = document.getElementById('menuIconClose');
  if (!menu) return;
  menu.classList.toggle('hidden');
  iconOpen.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');
};

window.closeMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const iconOpen = document.getElementById('menuIconOpen');
  const iconClose = document.getElementById('menuIconClose');
  if (!menu) return;
  menu.classList.add('hidden');
  iconOpen.classList.remove('hidden');
  iconClose.classList.add('hidden');
};

window.handleEmailContact = function() {
  const email = state?.profile?.email || 'sabila.alifia@placeholder.com';
  window.location.href = `mailto:${email}?subject=Halo Sabila!`;
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('open');
};

window.closeProjectDetail = function() {
  const modal = document.getElementById('projectDetailModal');
  if (modal) modal.classList.remove('open');
};

window.closeStudioModal = function() {
  const modal = document.getElementById('studioModal');
  if (modal) modal.classList.remove('open');
};

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ==================== DATA DEFAULT ====================
const DEFAULT_PROFILE = {
  name: "Sabila Alifia Sundawa",
  headline: "Exploring Business, Digital Creativity & Beyond.",
  heroBio: "Mahasiswa Manajemen yang memiliki ketertarikan pada bidang bisnis, e-commerce, digital marketing, komunikasi, dan pengelolaan media sosial. Memiliki pengalaman dalam administrasi e-commerce, pembuatan konten promosi, live commerce, pengelolaan media sosial, serta kegiatan organisasi kampus.",
  aboutParagraphs: [
    "Halo! Saya Sabila Alifia Sundawa, mahasiswa S1 Manajemen di Pradita University. Bagi saya, dunia bisnis dan pemasaran digital selalu menarik untuk dieksplorasi karena memadukan pengelolaan yang rapi dengan cara berkomunikasi yang kreatif.",
    "Ketertarikan saya pada bisnis, e-commerce, digital marketing, komunikasi, dan media sosial tumbuh dari berbagai pengalaman langsung—mulai dari mengelola administrasi toko online, berinteraksi langsung sebagai host di sesi live commerce, hingga merancang konten promosi dan membaca respons audiens.",
    "Saya senang mempelajari hal baru, mencoba pengalaman berbeda, bekerja sama dalam tim, dan terus mengembangkan kemampuan melalui berbagai project yang saya kerjakan."
  ],
  university: "Pradita University",
  major: "S1 Manajemen",
  period: "2025–sekarang",
  email: "sabila.alifia@placeholder.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  instagramHandle: "@sabila.alifia",
  profilePhoto: "",
  photoZoom: 1,
  photoX: 50,
  photoY: 50
};

const DEFAULT_EXPERIENCES = [
  { id: "exp-1", order: 1, role: "E-Commerce Administrator", tag: "Operasional Toko Online", description: "Pengelolaan administrasi toko online, pengelolaan produk, serta aktivitas operasional pada platform e-commerce.", highlights: ["Pengelolaan Produk", "Administrasi Toko", "Operasional E-Commerce"] },
  { id: "exp-2", order: 2, role: "Live Host", tag: "TikTok Live & Shopee Live", description: "Menjadi host TikTok Live dan Shopee Live, memperkenalkan produk, menjelaskan keunggulan produk, serta membantu meningkatkan interaksi dengan calon pembeli.", highlights: ["TikTok Live", "Shopee Live", "Interaksi Pembeli"] },
  { id: "exp-3", order: 3, role: "Content Promotion", tag: "Pemasaran & Media Sosial", description: "Membuat konten promosi untuk kebutuhan pemasaran produk dan media sosial.", highlights: ["Konten Promosi", "Pemasaran Produk", "Visual Media Sosial"] },
  { id: "exp-4", order: 4, role: "Social Media Management", tag: "Perencanaan & Engagement", description: "Mengelola konten media sosial, menyusun jadwal posting, memperhatikan waktu publikasi, dan memahami strategi engagement.", highlights: ["Jadwal Posting", "Waktu Publikasi", "Strategi Engagement"] },
  { id: "exp-5", order: 5, role: "Article Writer Intern", tag: "Penulisan Konten", description: "Memiliki pengalaman dalam penulisan artikel dan penyusunan konten informatif.", highlights: ["Penulisan Artikel", "Konten Informatif", "Penyusunan Tulisan"] },
  { id: "exp-6", order: 6, role: "Social Media Analyst", tag: "Evaluasi Interaksi", description: "Mempelajari performa konten dan interaksi audiens untuk memahami efektivitas media sosial.", highlights: ["Performa Konten", "Interaksi Audiens", "Evaluasi Media Sosial"] }
];

const DEFAULT_LEADERSHIP = {
  orgName: "Himpunan Mahasiswa Manajemen (HIMAA)",
  orgDivision: "Divisi Publikasi dan Dokumentasi",
  orgDesc: "Terlibat dalam pembuatan konten publikasi kegiatan organisasi serta dokumentasi acara.",
  leadProjectTitle: "Ketua Pelaksana PKKMB Program Studi Manajemen",
  leadProjectTheme: "“Embrace Your Inner Light, Celebrate Your New Journey.”",
  leadProjectDesc: "Memimpin koordinasi kepanitiaan untuk menyukseskan rangkaian penyambutan mahasiswa baru Program Studi Manajemen, sekaligus mengasah kemampuan komunikasi, kerja sama tim, dan kepemimpinan."
};

const PROJECT_CATEGORIES = [
  "Semua", "E-Commerce Management", "Digital Marketing & Social Media", "Content Creation", "Live Commerce", "Organization & Event Management", "Creative Editing & AI Animation"
];

const DEFAULT_PROJECTS = [
  { id: "proj-1", order: 1, title: "Pengelolaan Katalog & Administrasi E-Commerce", category: "E-Commerce Management", goal: "Menjaga kelengkapan informasi produk dan kelancaran operasional harian pada platform e-commerce.", role: "E-Commerce Administrator", process: "Menyusun rincian produk, memperbarui tampilan katalog, serta memastikan alur administrasi toko berjalan teratur.", outcome: "Dokumentasi tampilan etalase toko dan alur kerja dapat ditambahkan di bagian ini.", media: [] },
  { id: "proj-2", order: 2, title: "Perencanaan Konten & Pengelolaan Media Sosial", category: "Digital Marketing & Social Media", goal: "Menjaga konsistensi jadwal publikasi konten serta membangun interaksi yang aktif dengan audiens.", role: "Social Media Management & Analyst", process: "Menyusun jadwal posting, menyesuaikan waktu publikasi, dan mengamati respons audiens pada setiap konten.", outcome: "Dokumentasi jadwal konten, tampilan feed, maupun catatan evaluasi dapat diunggah di sini.", media: [] },
  { id: "proj-3", order: 3, title: "Konten Promosi & Penulisan Artikel Informatif", category: "Content Creation", goal: "Menyampaikan informasi produk dan topik relevan secara jelas melalui materi visual maupun tulisan.", role: "Content Promotion & Article Writer", process: "Menyusun kerangka pesan, menulis naskah artikel atau copy promosi, dan menyesuaikannya dengan format publikasi.", outcome: "Contoh desain konten promosi dan cuplikan artikel dapat ditambahkan pada galeri project.", media: [] },
  { id: "proj-4", order: 4, title: "Sesi Live Commerce TikTok Live & Shopee Live", category: "Live Commerce", goal: "Memperkenalkan keunggulan produk secara langsung dan membantu menjawab pertanyaan calon pembeli.", role: "Live Host", process: "Mempersiapkan poin produk sebelum sesi siaran, mempresentasikan produk secara interaktif, dan menjaga suasana live tetap hidup.", outcome: "Foto maupun cuplikan video dokumentasi sesi live dapat diunggah di sini.", media: [] },
  { id: "proj-5", order: 5, title: "PKKMB Program Studi Manajemen & Publikasi HIMAA", category: "Organization & Event Management", goal: "Menyelenggarakan PKKMB Program Studi Manajemen bertema 'Embrace Your Inner Light, Celebrate Your New Journey' serta mendukung publikasi kegiatan himpunan.", role: "Ketua Pelaksana PKKMB & Divisi Publikasi Dokumentasi HIMAA", process: "Mengkoordinasikan seluruh divisi panitia, menjaga alur komunikasi acara, serta mendokumentasikan rangkaian kegiatan.", outcome: "Foto kegiatan kepanitiaan, publikasi acara, dan momen bersama tim dapat ditambahkan di sini.", media: [] },
  { id: "proj-6", order: 6, title: "Video Editing & Eksplorasi AI-Assisted Visual", category: "Creative Editing & AI Animation", goal: "Mengolah materi video menjadi konten visual yang menarik dengan dukungan perangkat editing modern dan AI.", role: "Creative Video Editor", process: "Menyusun alur klip video, menyesuaikan transisi dan audio, serta mengeksplorasi elemen visual berbantuan AI.", outcome: "Hasil video pendek atau cuplikan visual dapat diunggah untuk melengkapi dokumentasi project.", media: [] }
];

const HARD_SKILLS = [
  { name: "E-Commerce Administration", level: "Administrasi & Katalog" },
  { name: "Social Media Management", level: "Jadwal & Publikasi" },
  { name: "Content Planning", level: "Konsep & Kalender Konten" },
  { name: "Live Commerce", level: "TikTok & Shopee Live" },
  { name: "Content Writing", level: "Artikel & Copy Promosi" },
  { name: "Basic Financial Recording", level: "Pencatatan Dasar" },
  { name: "Video Editing", level: "Penyuntingan Video" },
  { name: "AI-assisted Creative Editing", level: "Visual & Animasi AI" }
];

const SOFT_SKILLS = [
  { name: "Communication", desc: "Komunikasi lisan, tulisan, dan interaksi langsung dengan audiens." },
  { name: "Teamwork", desc: "Terbiasa bekerja sama lintas peran dalam tim maupun kepanitiaan." },
  { name: "Adaptability", desc: "Mudah menyesuaikan diri dengan hal baru dan perubahan situasi." },
  { name: "Leadership", desc: "Pengalaman mengkoordinasikan tim sebagai Ketua Pelaksana PKKMB." },
  { name: "Problem Solving", desc: "Mencari solusi praktis saat menghadapi kendala di lapangan." },
  { name: "Time Management", desc: "Mengatur waktu antara kuliah, project, dan kegiatan organisasi." }
];

// ==================== STATE & FIREBASE ====================
const state = {
  profile: { ...DEFAULT_PROFILE },
  experiences: [...DEFAULT_EXPERIENCES],
  leadership: { ...DEFAULT_LEADERSHIP },
  projects: [...DEFAULT_PROJECTS],
  mediaItems: [],
  activeProjectCategory: "Semua",
  activeStudioTab: "profile",
  activeGalleryFilter: "experience",
  editingProjectId: null,
  pendingGalleryUploads: []
};

let db = null;
let auth = null;
let currentUser = null;
let appId = "default-app-id";
let firebaseEnabled = false;

async function initPersistence() {
  const badge = document.getElementById("storageStatusBadge");
  try {
    if (typeof __firebase_config !== "undefined" && __firebase_config) {
      const firebaseConfig = JSON.parse(__firebase_config);
      appId = typeof __app_id !== "undefined" ? __app_id : "sabila-portfolio-app";
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);

      if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
      currentUser = auth.currentUser;
      firebaseEnabled = true;

      if (badge) {
        badge.textContent = "Cloud Aktif";
        badge.className = "text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200";
      }

      attachFirestoreListeners();
    } else {
        // Jika tidak ada config, tetap render data lokal
        renderAll();
    }
  } catch (err) {
    console.warn("Firebase init fallback:", err);
    renderAll(); // Tampilkan data default jika firebase gagal
  }
}

function attachFirestoreListeners() {
  if (!firebaseEnabled || !currentUser || !db) return;

  const metaCol = collection(db, "artifacts", appId, "public", "data", "portfolio_meta");
  onSnapshot(metaCol, (snapshot) => {
    snapshot.forEach((docSnap) => {
      if (docSnap.id === "profile") state.profile = { ...DEFAULT_PROFILE, ...docSnap.data() };
      else if (docSnap.id === "leadership") state.leadership = { ...DEFAULT_LEADERSHIP, ...docSnap.data() };
    });
    renderAll();
  });

  const expCol = collection(db, "artifacts", appId, "public", "data", "portfolio_experiences");
  onSnapshot(expCol, (snapshot) => {
    if (!snapshot.empty) {
      const list = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (typeof data.highlights === "string") { try { data.highlights = JSON.parse(data.highlights); } catch (_) { data.highlights = []; } }
        list.push({ id: docSnap.id, ...data });
      });
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      state.experiences = list;
      renderExperiences();
    }
  });

  const projCol = collection(db, "artifacts", appId, "public", "data", "portfolio_projects");
  onSnapshot(projCol, (snapshot) => {
    if (!snapshot.empty) {
      const list = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (typeof data.media === "string") { try { data.media = JSON.parse(data.media); } catch (_) { data.media = []; } }
        list.push({ id: docSnap.id, ...data });
      });
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      state.projects = list;
      renderProjects();
    }
  });

  const mediaCol = collection(db, "artifacts", appId, "public", "data", "portfolio_media");
  onSnapshot(mediaCol, (snapshot) => {
    const list = [];
    snapshot.forEach((docSnap) => { list.push({ id: docSnap.id, ...docSnap.data() }); });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    state.mediaItems = list;
    renderAllGalleries();
  });
}

// ==================== SAVE FUNCTIONS ====================
async function saveProfileToCloud() {
  if (!firebaseEnabled || !currentUser || !db) return;
  try { await setDoc(doc(db, "artifacts", appId, "public", "data", "portfolio_meta", "profile"), { ...state.profile, updatedAt: Date.now() }); } 
  catch (err) { console.error(err); window.showToast("Gagal sinkronisasi foto. Coba gambar lebih ringan.", "error"); }
}

async function saveLeadershipToCloud() {
  if (!firebaseEnabled || !currentUser || !db) return;
  try { await setDoc(doc(db, "artifacts", appId, "public", "data", "portfolio_meta", "leadership"), { ...state.leadership, updatedAt: Date.now() }); } 
  catch (err) { console.error(err); }
}

async function saveExperienceToCloud(expObj) {
  if (!firebaseEnabled || !currentUser || !db) return;
  try { await setDoc(doc(db, "artifacts", appId, "public", "data", "portfolio_experiences", expObj.id), { ...expObj, highlights: JSON.stringify(expObj.highlights || []) }); } 
  catch (err) { console.error(err); }
}

async function saveProjectToCloud(projObj) {
  if (!firebaseEnabled || !currentUser || !db) return;
  try { await setDoc(doc(db, "artifacts", appId, "public", "data", "portfolio_projects", projObj.id), { ...projObj, media: JSON.stringify(projObj.media || []), updatedAt: Date.now() }); } 
  catch (err) { console.error(err); window.showToast("Media terlalu besar.", "error"); }
}

async function deleteProjectFromCloud(projId) {
  if (!firebaseEnabled || !currentUser || !db) return;
  try { await deleteDoc(doc(db, "artifacts", appId, "public", "data", "portfolio_projects", projId)); } 
  catch (err) { console.error(err); }
}

async function saveMediaItemToCloud(mediaObj) {
  if (!firebaseEnabled || !currentUser || !db) return;
  try { await setDoc(doc(db, "artifacts", appId, "public", "data", "portfolio_media", mediaObj.id), mediaObj); } 
  catch (err) { console.error(err); }
}

async function deleteMediaItemFromCloud(mediaId) {
  if (!firebaseEnabled || !currentUser || !db) return;
  try { await deleteDoc(doc(db, "artifacts", appId, "public", "data", "portfolio_media", mediaId)); } 
  catch (err) { console.error(err); }
}

// ==================== UTILS ====================
function processUploadedFile(file, maxDimension = 960, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

    if (validImageTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) { height = Math.round((height * maxDimension) / width); width = maxDimension; }
            else { width = Math.round((width * maxDimension) / height); height = maxDimension; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width; canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve({ type: "image", url: canvas.toDataURL("image/webp", quality), name: file.name.replace(/\.[^/.]+$/, "") });
        };
        img.onerror = () => reject(new Error("Gagal memproses gambar."));
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else if (validVideoTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        if (file.size <= 750 * 1024) resolve({ type: "video", url: dataUrl, name: file.name.replace(/\.[^/.]+$/, "") });
        else {
          const video = document.createElement("video");
          video.src = dataUrl; video.muted = true; video.playsInline = true;
          video.onloadeddata = () => { video.currentTime = Math.min(0.5, video.duration || 0); };
          video.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width = Math.min(video.videoWidth || 720, 800);
            canvas.height = Math.round(canvas.width * ((video.videoHeight || 1280) / (video.videoWidth || 720)));
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            window.showToast("Video panjang diubah jadi thumbnail.", "info");
            resolve({ type: "image", url: canvas.toDataURL("image/webp", 0.78), name: file.name.replace(/\.[^/.]+$/, "") });
          };
          video.onerror = () => reject(new Error("Format video tidak didukung."));
        }
      };
      reader.readAsDataURL(file);
    } else { reject(new Error("Format tidak didukung. Gunakan JPG/PNG/WEBP/MP4.")); }
  });
}

window.showToast = function (message, variant = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  const dotColor = { success: "bg-emerald-500", error: "bg-terracotta", info: "bg-cobalt" };
  toast.className = `pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-white border border-hairline shadow-xl transition-all duration-300 translate-x-6 opacity-0`;
  toast.innerHTML = `<span class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotColor[variant] || dotColor.info}"></span><p class="text-xs sm:text-sm font-medium text-ink leading-snug flex-1">${escapeHtml(message)}</p>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove("translate-x-6", "opacity-0"));
  setTimeout(() => { toast.classList.add("translate-x-6", "opacity-0"); setTimeout(() => toast.remove(), 300); }, 3400);
};

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").indow.closeStudioModal = function() {
  const modal = document.getElementById('studioModal');
  if (modal) modal.classList.remove('open');
};

// Set tahun berjalan di footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
