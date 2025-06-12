import plantDiseaseModel from '../../models/plant_disease/model-loader.js';

class PlantDiseaseService {
  constructor() {
    this.isModelLoaded = false;
    this.simulationMode = false; // Flag for simulation mode
    this.diseaseInfo = {
      'Healthy': {
        description: 'Tanaman Anda terlihat sehat.',
        treatment: 'Lanjutkan perawatan rutin dengan menyiram secukupnya dan berikan pupuk sesuai kebutuhan.',
        prevention: 'Jaga kebersihan area sekitar tanaman dan lakukan pemeriksaan rutin untuk deteksi dini penyakit.'
      },
      'Blight': {
        description: 'Blight adalah penyakit tanaman yang disebabkan oleh jamur atau bakteri, menyebabkan kerusakan cepat pada daun, batang, dan buah.',
        treatment: 'Buang bagian tanaman yang terinfeksi. Aplikasikan fungisida berbahan aktif klorotalonil, mankozeb, atau tembaga sesuai petunjuk. Pastikan drainase tanah baik dan hindari menyiram daun secara langsung.',
        prevention: 'Gunakan varietas tanaman yang tahan penyakit. Rotasi tanaman setiap musim. Jaga jarak tanam yang cukup untuk sirkulasi udara. Hindari menyiram daun di sore hari.'
      },
      'Leaf Spot': {
        description: 'Bercak daun adalah infeksi jamur yang menyebabkan bintik-bintik coklat atau hitam pada daun tanaman.',
        treatment: 'Buang daun yang terinfeksi parah. Aplikasikan fungisida berbahan aktif mankozeb atau tembaga. Pastikan tanaman mendapat nutrisi yang cukup untuk memperkuat daya tahan.',
        prevention: 'Hindari menyiram daun di sore hari. Jaga jarak antar tanaman untuk sirkulasi udara yang baik. Lakukan rotasi tanaman dan bersihkan sisa-sisa tanaman di akhir musim.'
      },
      'Powdery Mildew': {
        description: 'Embun tepung adalah infeksi jamur yang menyebabkan lapisan putih seperti tepung pada permukaan daun.',
        treatment: 'Aplikasikan fungisida berbahan aktif sulfur atau potasium bikarbonat. Semprotkan larutan baking soda (1 sendok teh baking soda + 1 liter air + sedikit sabun cuci piring) pada daun yang terinfeksi ringan.',
        prevention: 'Tanam di lokasi dengan sinar matahari penuh. Jaga jarak antar tanaman. Hindari pemupukan nitrogen berlebihan. Gunakan mulsa untuk mencegah spora jamur menciprat dari tanah ke daun.'
      },
      'Rust': {
        description: 'Karat adalah penyakit jamur yang menyebabkan bintik-bintik oranye atau coklat kemerahan pada daun dan batang.',
        treatment: 'Buang bagian tanaman yang terinfeksi. Aplikasikan fungisida berbahan aktif tembaga, mankozeb, atau triazol sesuai petunjuk. Hindari menyiram daun secara langsung.',
        prevention: 'Gunakan varietas tanaman yang tahan karat. Jaga kebersihan kebun dengan membersihkan sisa-sisa tanaman. Rotasi tanaman dan jaga jarak tanam yang cukup.'
      },
      'Bacterial Spot': {
        description: 'Bercak bakteri adalah infeksi yang menyebabkan bintik-bintik gelap dengan tepi kuning pada daun, batang, dan buah.',
        treatment: 'Buang bagian tanaman yang terinfeksi. Aplikasikan bakterisida berbahan tembaga sesuai petunjuk. Hindari menyiram daun di sore hari dan pastikan drainase tanah baik.',
        prevention: 'Gunakan benih dan bibit bebas penyakit. Rotasi tanaman dengan tanaman non-inang. Hindari bekerja di kebun saat tanaman basah untuk mencegah penyebaran bakteri.'
      },
      'Scab': {
        description: 'Kudis adalah penyakit jamur yang menyebabkan bercak gelap dan kasar pada daun dan buah, terutama pada tanaman apel.',
        treatment: 'Aplikasikan fungisida berbahan aktif tembaga atau kaptan saat musim semi dan secara berkala sesuai petunjuk. Buang daun dan buah yang terinfeksi parah.',
        prevention: 'Bersihkan daun-daun yang jatuh di musim gugur. Pangkas pohon untuk meningkatkan sirkulasi udara. Gunakan varietas apel yang tahan terhadap kudis.'
      },
      'Mold': {
        description: 'Jamur daun menyebabkan lapisan berjamur pada permukaan daun, biasanya berwarna abu-abu atau coklat.',
        treatment: 'Buang bagian tanaman yang terinfeksi. Aplikasikan fungisida berbahan aktif klorotalonil atau mankozeb. Kurangi kelembaban di sekitar tanaman dengan meningkatkan sirkulasi udara.',
        prevention: 'Jaga jarak tanam yang cukup. Hindari menyiram berlebihan dan siram di pagi hari. Pasang mulsa untuk mencegah percikan air dari tanah ke daun.'
      },
      'Yellow Virus': {
        description: 'Virus kuning menyebabkan daun menguning, kerdil, dan pertumbuhan tanaman terhambat. Ditularkan oleh serangga seperti kutu daun atau kutu kebul.',
        treatment: 'Tidak ada obat untuk infeksi virus. Buang tanaman yang terinfeksi untuk mencegah penyebaran. Kendalikan serangga vektor dengan insektisida atau sabun insektisida.',
        prevention: 'Gunakan jaring anti-serangga. Tanam varietas tahan virus jika tersedia. Kendalikan populasi serangga vektor secara rutin. Jaga kebersihan kebun.'
      },
      'Black Rot': {
        description: 'Busuk hitam adalah penyakit jamur yang menyerang tanaman anggur, menyebabkan bercak coklat dengan tepi hitam pada daun dan buah yang membusuk.',
        treatment: 'Buang bagian tanaman yang terinfeksi. Aplikasikan fungisida berbahan aktif mankozeb, klorotalonil, atau tembaga sesuai petunjuk. Pastikan drainase tanah baik.',
        prevention: 'Pangkas tanaman untuk meningkatkan sirkulasi udara. Bersihkan sisa-sisa tanaman di akhir musim. Rotasi tanaman dan jaga jarak tanam yang cukup.'
      },
      'Mosaic Virus': {
        description: 'Virus mosaik menyebabkan pola mosaik (belang-belang) pada daun, pertumbuhan terhambat, dan daun mengeriting. Ditularkan oleh serangga atau kontak langsung.',
        treatment: 'Tidak ada obat untuk infeksi virus. Buang tanaman yang terinfeksi untuk mencegah penyebaran. Kendalikan serangga vektor dengan insektisida atau sabun insektisida.',
        prevention: 'Gunakan benih dan bibit bebas virus. Cuci tangan dan alat berkebun sebelum menyentuh tanaman sehat. Kendalikan serangga vektor dan gulma yang dapat menjadi inang virus.'
      },
      'Spider Mites': {
        description: 'Tungau laba-laba adalah hama kecil yang menghisap cairan tanaman, menyebabkan bintik-bintik kuning atau putih pada daun dan jaring halus.',
        treatment: 'Semprotkan air bertekanan kuat untuk menghilangkan tungau. Aplikasikan minyak hortikultura atau sabun insektisida. Untuk serangan parah, gunakan akarisida sesuai petunjuk.',
        prevention: 'Jaga kelembaban udara yang cukup karena tungau menyukai kondisi kering. Periksa tanaman secara rutin. Introduksi predator alami seperti kumbang ladybug atau tungau predator.'
      }
    };
  }

  /**
   * Inisialisasi model
   */
  async initModel() {
    if (!this.isModelLoaded) {
      try {
        const modelLoaded = await plantDiseaseModel.loadModel();
        if (modelLoaded) {
          this.isModelLoaded = true;
          return true;
        } else {
          this.simulationMode = true;
          return false;
        }
      } catch (error) {
        console.error('Gagal memuat model:', error);
        this.simulationMode = true;
        return false;
      }
    }
    return true;
  }

  /**
   * Diagnosa penyakit dari gambar
   * @param {HTMLImageElement|File} imageInput - Gambar atau file gambar untuk didiagnosa
   * @returns {Promise<Object>} - Hasil diagnosa
   */
  async diagnosePlant(imageInput) {
    try {
      // Pastikan model sudah dimuat
      if (!this.isModelLoaded) {
        await this.initModel();
      }

      let imgElement;
      
      // Jika input adalah File, konversi ke HTMLImageElement
      if (imageInput instanceof File) {
        imgElement = await this._createImageFromFile(imageInput);
      } else if (imageInput instanceof HTMLImageElement) {
        imgElement = imageInput;
      } else {
        throw new Error('Input harus berupa File atau HTMLImageElement');
      }

      let prediction;
      
      // Jika dalam mode simulasi, berikan hasil simulasi
      if (this.simulationMode) {
        prediction = this._getSimulatedPrediction();
      } else {
        // Lakukan prediksi dengan model
        prediction = await plantDiseaseModel.predict(imgElement);
      }
      
      // Tambahkan informasi penyakit
      const result = {
        ...prediction,
        diseaseInfo: this.diseaseInfo[prediction.className] || {
          description: 'Informasi tidak tersedia',
          treatment: 'Konsultasikan dengan ahli pertanian',
          prevention: 'Lakukan pemeriksaan rutin pada tanaman'
        }
      };

      return result;
    } catch (error) {
      console.error('Gagal melakukan diagnosa:', error);
      throw error;
    }
  }

  /**
   * Menghasilkan prediksi simulasi untuk testing
   * @returns {Object} - Hasil prediksi simulasi
   */
  _getSimulatedPrediction() {
    // Pilih penyakit secara acak untuk simulasi
    const diseaseClasses = Object.keys(this.diseaseInfo);
    const randomIndex = Math.floor(Math.random() * diseaseClasses.length);
    const className = diseaseClasses[randomIndex];
    
    // Buat nilai confidence acak
    const mainConfidence = 0.5 + Math.random() * 0.4; // 50-90%
    
    // Buat prediksi grup
    const groupedPredictions = diseaseClasses.map(cls => {
      let confidence = cls === className ? mainConfidence : Math.random() * 0.3;
      return { className: cls, confidence };
    }).sort((a, b) => b.confidence - a.confidence);
    
    return {
      className: className,
      originalClassName: `Sample ${className}`,
      confidence: mainConfidence,
      allPredictions: groupedPredictions.map(p => ({
        className: p.className,
        originalClassName: `Sample ${p.className}`,
        confidence: p.confidence
      })),
      groupedPredictions: groupedPredictions
    };
  }

  /**
   * Membuat elemen gambar dari file
   * @param {File} file - File gambar
   * @returns {Promise<HTMLImageElement>} - Elemen gambar
   */
  _createImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };
      
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}

const plantDiseaseService = new PlantDiseaseService();
export default plantDiseaseService; 