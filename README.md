# Open Music API V3

Proyek ini adalah submission akhir(ketiga) pada learning path **Back-End Developer** pada course **Belajar Fundamental Aplikasi Back-End** di [Dicoding](dicoding.com).

Proyek consumer untuk proyek ini dapat ditemukan di [Open Music API V3 - Consumer](https://github.com/The-Aldi-Tri/open-music-api-v3-consumer)

## How to run

**Make sure project [Open Music API V3 - Consumer](https://github.com/The-Aldi-Tri/open-music-api-v3-consumer) are running in another Terminal/VS Code window.**

Create an **.env** file in the root directory of project and fill it with variables based on the examples in the **.env.example** file

### - Locally

- Prerequisites

  - Node.js installed on your local machine. You can download it from [nodejs.org](https://nodejs.org/).
  - Postgresql database installed on your local machine. You can download it from [postgresql.org](https://www.postgresql.org/download/).
  - **Redis** for caching installed on your local machine. You can download it from [redis.io](https://redis.io/downloads/).
  - **RabbitMQ** for message broker installed on your local machine. You can download it from [rabbitmq.com](https://www.rabbitmq.com/docs/download).

- Installation

  Clone the repository and install dependencies.

  ```bash
  git clone <repository-url>
  cd <project-directory>
  npm install
  ```

- Running

  Make sure you have started your database server and then run this

  ```bash
  npm run migrate up
  npm start
  ```

### - DevContainer (Docker)

- Prerequisites

  Make sure you have the following installed:

  - **Visual Studio Code** ([VS Code](https://code.visualstudio.com/download))
  - **Docker** (Docker Engine with Compose plugin or [Docker Desktop](https://www.docker.com/products/docker-desktop/))
  - **Remote Development** extension pack for VS Code (Install from the VS Code Extensions marketplace)
  - **Docker Images** you can search in [Docker Hub](https://hub.docker.com/search)
    - Nodejs
    - Postgres
    - Redis
    - RabbitMQ

  Make sure you have Docker network named **my-network**. You can create this after installing docker with this command:
  ```bash
  docker network create -d bridge my-network
  ```


- Installation

  1. Clone the repository:

     ```bash
     git clone <repository-url>
     cd <project-directory>
     ```

  2. Open the project in VS Code

     Make sure docker is running.

  3. Reopen in Container:

     Once you have the Remote - Containers extension installed, you'll see a green Remote indicator in the bottom-left corner of the VS Code window.
     Click on the green indicator, or use Ctrl/Cmd + Shift + P to open the Command Palette and search for Remote-Containers: Reopen in Container.
     Select your desired development container configuration (e.g., Node.js), and VS Code will reopen the project inside the container.

  4. Open Terminal and run this

     ```bash
     npm install
     ```

- Running

  ```bash
  npm run migrate up
  npm start
  ```

## Studi Kasus

Semenjak dirilisnya OpenMusic versi 2, pengguna OpenMusic semakin membludak. Mereka sangat antusias akan kehadiran platform pemutar musik gratis. Kehadiran fitur playlist membuat mereka nyaman menggunakan OpenMusic. Bahkan, mereka tidak segan untuk membagikan dan merekomendasikan OpenMusic hingga akhirnya melejit!

Karena pengguna OpenMusic semakin banyak, server kita seringkali mengalami down. Terutama pada server database yang selalu bekerja keras dalam menangani permintaan kueri playlist dari ribuan pengguna. Hingga akhirnya tim TSC memutuskan untuk menerapkan server-side caching pada OpenMusic API untuk mengurangi pekerjaan database.

Pengembangan OpenMusic versi 3 segera tiba dan ini adalah kontribusi terakhir Anda pada platform OpenMusic. Tim TSC kembali melakukan survey fitur apa yang hendak dibawa pada versi ke-3 ini. Hasilnya menunjukkan pengguna menginginkan fitur ekspor daftar lagu yang berada di playlist. Selain itu, mereka juga menginginkan hadirnya fitur upload gambar untuk sampul album.

Tugas terakhir Anda adalah mengembangkan OpenMusic API versi 3 dengan menerapkan server-side caching, fitur ekspor serta upload gambar sesuai spesifikasi yang dijelaskan di materi selanjutnya.

## Kriteria Penilaian

### **Kriteria 1 : Ekspor Lagu Pada Playlist**

API yang Anda buat harus tersedia fitur ekspor lagu pada playlist melalui route:

- Method : **POST**
- URL : **/export/playlists/{playlistId}**
- Body Request:

  ```json
  {
  "targetEmail": string
  }
  ```

Ketentuan:

- Wajib menggunakan message broker dengan menggunakan RabbitMQ.
  - Nilai host server RabbitMQ wajib menggunakan environment variable RABBITMQ_SERVER
- Hanya pemilik Playlist yang boleh mengekspor lagu.
- Wajib mengirimkan program consumer.
- Hasil ekspor berupa data json.
- Dikirimkan melalui email menggunakan [nodemailer](https://nodemailer.com/).
  - Kredensial user dan password email pengirim wajib menggunakan environment variable **SMTP_USER** dan **SMTP_PASSWORD**.
  - Serta, nilai host dan port dari server SMTP juga wajib menggunakan environment variable **SMTP_HOST** dan **SMTP_PORT**.

Response yang harus dikembalikan:

- Status Code: 201
- Response Body:
  ```json
  {
    "status": "success",
    "message": "Permintaan Anda sedang kami proses"
  }
  ```

Struktur data JSON yang diekspor adalah seperti ini:

```json
{
  "playlist": {
    "id": "playlist-Mk8AnmCp210PwT6B",
    "name": "My Favorite Coldplay Song",
    "songs": [
      {
        "id": "song-Qbax5Oy7L8WKf74l",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      },
      {
        "id": "song-poax5Oy7L8WKllqw",
        "title": "Centimeteries of London",
        "performer": "Coldplay"
      },
      {
        "id": "song-Qalokam7L8WKf74l",
        "title": "Lost!",
        "performer": "Coldplay"
      }
    ]
  }
}
```

### **Kriteria 2 : Mengunggah Sampul Album**

API yang Anda buat harus dapat mengunggah sampul album melalui route:

- Method : **POST**
- URL : **/albums/{id}/covers**
- Body Request (Form data):

  ```json
  {
      "cover": file
  }
  ```

Ketentuan:

- Tipe konten yang diunggah harus merupakan [MIME types dari images](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types).
- Ukuran file cover maksimal 512000 Bytes.
- Anda bisa menggunakan File System (lokal) atau S3 Bucket dalam menampung object.
  - Bila menggunakan S3 Bucket, nama bucket wajib menggunakan variable environment **AWS_BUCKET_NAME**.

Response yang harus dikembalikan:

- Status Code: 201
- Response Body:
  ```json
  {
    "status": "success",
    "message": "Sampul berhasil diunggah"
  }
  ```

Respons dari endpoint **GET /albums/{id}** harus menampilkan properti **coverUrl**. Itu berarti, alamat atau nama sampul album harus disimpan di dalam database. Berikut respons yang harus dikembalikan oleh endpoint **GET /albums/{id}:**

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Mk8AnmCp210PwT6B",
      "name": "Viva la Vida",
      "coverUrl": "http://...."
    }
  }
}
```

Ketentuan:

- URL gambar harus dapat diakses dengan baik.
- Bila album belum memiliki sampul, maka **coverUrl** bernilai null.
- Bila menambahkan sampul pada album yang sudah memiliki sampul, maka sampul lama akan tergantikan.

### **Kriteria 3 : Menyukai Album**

API harus memiliki fitur menyukai, batal menyukai, serta melihat jumlah yang menyukai album. Berikut spesifikasinya:

![Kriteria 3](https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:85cd9ff509db80e1c76b46fe018d9d1320230328110909.png)

\*_any merupakan nilai string apa pun selama nilainya tidak kosong_

Keterangan:

- Menyukai atau batal menyukai album merupakan resource strict sehingga dibutuhkan autentikasi untuk mengaksesnya. Hal ini bertujuan untuk mengetahui apakah pengguna sudah menyukai album.
- Pastikan pengguna hanya bisa menyukai album yang sama sebanyak 1 kali. Kembalikan dengan response code 400 jika pengguna mencoba menyukai album yang sama.

### **Kriteria 4 : Menerapkan Server-Side Cache**

- Menerapkan server-side cache pada jumlah yang menyukai sebuah album (GET /albums/{id}/likes).
- Cache harus bertahan selama 30 menit.
- Respons yang dihasilkan dari cache harus memiliki custom header properti X-Data-Source bernilai “cache”.
- Cache harus dihapus setiap kali ada perubahan jumlah like pada album dengan id tertentu.
- Memory caching engine wajib menggunakan Redis atau Memurai (Windows).
  - Nilai host server Redis wajib menggunakan environment variable **REDIS_SERVER**

### **Kriteria 5 : Pertahankan Fitur OpenMusic API versi 2 dan 1**

Pastikan fitur dan kriteria OpenMusic API versi 2 dan 1 tetap dipertahankan seperti:

- Pengelolaan Data Album
- Pengelolaan Data Song
- Fitur Registrasi dan Autentikasi Pengguna
- Pengelolaan Data Playlist
- Menerapkan Foreign Key
- Menerapkan Data Validation
- Penanganan Eror (Error Handling)

## Pengujian

Tes dengan berkas Postman Collection dan Environment yang telah disediakan.

Konfigurasi:

- Tambahkan pada Postman environment variabel **exportEmail** dengan email aktif pribadi untuk testing.
- Edit Postman Collection pada request di folder Uploads -> **Add Cover Album with Valid File** dengan file berikut: [picture-small.jpg](https://github.com/dicodingacademy/a271-backend-menengah-labs/raw/099-shared-files/03-submission-content/03-open-music-api-v3/picture-small.jpg)
- Edit Postman Collection pada request di folder Uploads -> **Add Cover Album with Big Image File** dengan file berikut: [picture-large.jpg](https://github.com/dicodingacademy/a271-backend-menengah-labs/raw/099-shared-files/03-submission-content/03-open-music-api-v3/picture-large.jpg)
- Edit Postman Collection pada request di folder Uploads -> **Add Cover Album with Non Image File** dengan file berikut: [text-small.txt](https://raw.githubusercontent.com/dicodingacademy/a271-backend-menengah-labs/099-shared-files/03-submission-content/03-open-music-api-v3/text-small.txt?token=AGEIPCMVW4LW6RCA6WZFEHTAXPECY)
- Atur working directory (folder) POstman ke tempat menyimpan file-file tersebut.

## Submission akan Ditolak bila

- Kriteria wajib OpenMusic API versi 3 tidak terpenuhi.
- Ketentuan berkas submission tidak terpenuhi.
- Menggunakan bahasa pemrograman dan teknologi lain, selain JavaScript dan Node.js.
- Menggunakan Framework Node.js selain Hapi Framework.
- Mengirimkan berkas Zip di dalam Zip.
- Melakukan kecurangan seperti tindakan plagiasi.
