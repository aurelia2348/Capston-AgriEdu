export default class DiagnosePresenter {
  constructor(view) {
    this.view = view;
    this.texts = [
      {
        title: "Diagnosa Cepat dan Akurat",
        desc: "Gunakan teknologi AI kami untuk mendiagnosis penyakit tanaman hanya dari sebuah foto. Proses cepat, hasil akurat, dan saran penanganan langsung tersedia.",
      },
      {
        title: "Komunitas Petani Digital",
        desc: "Bergabunglah dalam komunitas petani online kami! Bertukar pengalaman, berbagi solusi, dan dapatkan dukungan dari sesama petani di seluruh Indonesia.",
      },
      {
        title: "Belajar Bertani Lebih Cerdas",
        desc: "Akses modul interaktif dan artikel edukatif tentang pertanian modern, mulai dari hidroponik, irigasi tetes, hingga manajemen hama ramah lingkungan.",
      },
      {
        title: "Manfaat Pupuk Organik",
        desc: "Tahukah kamu? Penggunaan pupuk organik secara rutin bisa meningkatkan kesuburan tanah, memperbaiki struktur tanah, dan mendukung ekosistem mikroba alami.",
      },
      {
        title: "Merawat Tanaman dengan Konsisten",
        desc: "Tanaman yang tumbuh sehat berasal dari perawatan harian yang konsisten—penyiraman tepat waktu, pemupukan seimbang, dan pencahayaan yang cukup.",
      },
      {
        title: "Waspadai Cuaca dan Serangan Hama",
        desc: "Perubahan cuaca ekstrem bisa memperbesar risiko serangan hama dan penyakit. Pantau prakiraan cuaca dan ikuti tips pencegahan hama dari ahli kami.",
      },
    ];
  }

  getUserInitial() {
    const userName = localStorage.getItem("user_name") || "User";
    return userName.charAt(0).toUpperCase();
  }

  startCarousel() {
    this.view.setupCarousel(this.texts);
  }

  bindNavbarEvents(currentPath, userInitial) {
    this.view.bindNavigationEvents(currentPath, userInitial);
  }
}
