# Panduan Deploy Model Klasifikasi Penyakit Tanaman

Dokumen ini berisi panduan untuk mengintegrasikan dan men-deploy model klasifikasi penyakit tanaman yang telah dilatih dalam format TensorFlow.js (TFJS).

## Persiapan Model

1. **Simpan Model TFJS**:
   - Pastikan model TFJS Anda terdiri dari file `model.json` dan file shard (biasanya bernama `group1-shard1of1.bin` atau serupa)
   - Letakkan file-file tersebut di folder `src/models/plant_disease/model/`

2. **Sesuaikan Kelas Label**:
   - Buka file `src/models/plant_disease/model-loader.js`
   - Update array `CLASS_NAMES` dengan nama kelas yang sesuai dengan model Anda
   - Pastikan urutan kelas sesuai dengan output model

3. **Sesuaikan Informasi Penyakit**:
   - Buka file `src/scripts/data/plant-disease-service.js`
   - Update objek `diseaseInfo` dengan informasi yang sesuai untuk setiap penyakit dalam model Anda

## Integrasi dengan Frontend

Model sudah terintegrasi dengan halaman diagnosa. Alur kerja:
1. Pengguna mengunggah gambar atau mengambil foto dengan kamera
2. Model TFJS dimuat dan melakukan prediksi
3. Hasil prediksi ditampilkan dengan informasi penyakit dan saran penanganan

## Deploy ke Production

### Opsi 1: Deploy Statis

1. Install dependensi:
   ```bash
   npm install
   ```

2. Build aplikasi:
   ```bash
   npm run build
   ```

3. Folder `dist` akan berisi aplikasi yang siap di-deploy
   - Upload folder `dist` ke layanan hosting statis seperti Netlify, Vercel, atau GitHub Pages
   - Atau gunakan server HTTP statis seperti NGINX

### Opsi 2: Deploy dengan Docker

1. Buat file `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Build dan jalankan Docker image:
   ```bash
   docker build -t agriedu-app .
   docker run -p 8080:80 agriedu-app
   ```

3. Aplikasi akan tersedia di `http://localhost:8080`

### Opsi 3: Deploy ke Cloud Provider

1. **Google Cloud Run**:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/agriedu-app
   gcloud run deploy --image gcr.io/[PROJECT_ID]/agriedu-app --platform managed
   ```

2. **AWS Amplify**:
   - Hubungkan repositori Git Anda dengan AWS Amplify
   - Amplify akan otomatis build dan deploy aplikasi Anda

## Optimasi Model

Untuk meningkatkan performa, pertimbangkan:

1. **Kuantisasi Model**: Gunakan TensorFlow.js Converter untuk mengkuantisasi model dan mengurangi ukurannya
   ```bash
   tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model --quantize_uint8 /path/to/model /path/to/output
   ```

2. **Caching Model**: Gunakan IndexedDB untuk menyimpan model di browser pengguna setelah dimuat pertama kali

3. **Progressive Loading**: Muat model secara bertahap untuk pengalaman pengguna yang lebih baik

## Troubleshooting

- **Model Tidak Dimuat**: Periksa path model dan pastikan CORS diaktifkan jika model disimpan di domain yang berbeda
- **Prediksi Tidak Akurat**: Pastikan preprocessing gambar sesuai dengan yang digunakan saat melatih model
- **Performa Lambat**: Pertimbangkan untuk menggunakan model yang lebih kecil atau kuantisasi model

## Sumber Daya Tambahan

- [TensorFlow.js Documentation](https://www.tensorflow.org/js/guide)
- [Deploying TensorFlow.js Models](https://www.tensorflow.org/js/guide/save_load)
- [Model Optimization](https://www.tensorflow.org/js/guide/platform_environment) 