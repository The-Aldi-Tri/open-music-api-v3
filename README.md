# open-music-api-v3

# Open Music API V2

Proyek ini adalah submission kedua pada learning path **Back-End Developer** pada course **Belajar Fundamental Aplikasi Back-End** di [Dicoding](dicoding.com).

## How to run

### - Locally

- Prerequisites

  - Node.js installed on your local machine. You can download it from [nodejs.org](https://nodejs.org/).
  - Postgresql database installed on your local machine. You can download it from [postgresql.org](https://www.postgresql.org/download/).

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

Aplikasi OpenMusic sudah rilis, ribuan lagu dengan lisensi gratis telah membanjiri aplikasi kita. Wajar, siapa yang tidak suka dengan layanan gratis?

Dengan banyaknya lagu yang tersedia di platform kita, daftar lagu menjadi sulit dikelola. Semua genre musik baik rock, pop, dangdut, dan RnB bercampur menjadi satu. Karena masalah ini, pengguna lari dari platform kita, mereka tidak mau mendengarkan musik yang bukan seleranya.

Untuk mengatasi masalah di atas, tim TSC melakukan survey kepada pengguna. Hasilnya survey mengatakan banyak pengguna yang menginginkan fitur playlist untuk segera hadir. Dengan begitu, kita memutuskan untuk segera membuat fitur playlist agar daftar lagu dapat terkelola dengan baik.

Pengguna menginginkan playlist bersifat “private”, alias hanya yang membuatnya yang dapat melihat dan mengelola playlist tersebut. Tentu Anda harus menerapkan autentikasi dan otorisasi pada API Anda untuk mencapai ini.

Selain bersifat privat, pengguna juga berharap playlist dapat dikolaborasikan ke pengguna lain. Namun itu menjadi keputusan Anda, apakah Anda ingin membuat fitur kolaborasi juga? Jika Anda membuatnya, tentu pengguna akan senang.

Pengembangan OpenMusic versi 2 tiba dengan membawa fitur playlist. Nah, tugas Anda adalah membuat OpenMusic API versi 2 dengan kriteria yang akan dijelaskan pada meteri selanjutnya.

## Kriteria Penilaian

### Kriteria 1 : Registrasi dan Autentikasi Pengguna

API yang Anda buat harus memiliki fitur registrasi dan autentikasi pengguna dengan spesifikasi berikut:

![Kriteria 1](https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:c9101131322a610d87e40f8af959da2120211215141916.png) \*_any: merupakan nilai string apa pun selama tidak kosong._

Ketentuan:

- Username harus unik.
- Authentication menggunakan JWT token.
- JWT token harus mengandung payload berisi userId yang merupakan id dari user autentik.
- Nilai secret key token JWT baik access token ataupun refresh token wajib menggunakan environment variable ACCESS_TOKEN_KEY dan REFRESH_TOKEN_KEY.
  -Refresh token memiliki signature yang benar serta terdaftar di database.

### Kriteria 2 : Pengelolaan Data Playlist

API harus menyediakan endpoint untuk pengelolaan song (lagu) dengan spesifikasi berikut:

![Kriteria 2](https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:bbf73f53c681045227cd811024a4b2de20220304110657.png)
\*\*any: merupakan nilai string apa pun selama nilainya tidak kosong.\*

Ketentuan:

- Playlist merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token.
- Playlist yang muncul pada GET /playlists hanya yang ia miliki saja.
- Hanya owner playlist (atau kolabolator) yang dapat menambahkan, melihat, dan menghapus lagu ke/dari playlist.
- songId dimasukkan/dihapus ke/dari playlist wajib bernilai id lagu yang valid.

Untuk lebih jelasnya, berikut adalah struktur response body yang harus ditampilkan pada endpoint:

- GET /playlists

  ```json
  {
    "status": "success",
    "data": {
      "playlists": [
        {
          "id": "playlist-Qbax5Oy7L8WKf74l",
          "name": "Lagu Indie Hits Indonesia",
          "username": "dicoding"
        },
        {
          "id": "playlist-lmA4PkM3LseKlkmn",
          "name": "Lagu Untuk Membaca",
          "username": "dicoding"
        }
      ]
    }
  }
  ```

- GET /playlists/{id}/songs

  ```json
  {
    "status": "success",
    "data": {
      "playlist": {
        "id": "playlist-Mk8AnmCp210PwT6B",
        "name": "My Favorite Coldplay",
        "username": "dicoding",
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
  }
  ```

Objek playlists yang disimpan pada server harus memiliki struktur seperti contoh di bawah ini:

```json
{
  "id": "playlist-Qbax5Oy7L8WKf74l",
  "name": "Lagu Indie Hits Indonesia",
  "owner": "user-Qbax5Oy7L8WKf74l"
}
```

Keterangan:

- Properti owner merupakan user id dari pembuat playlist. Anda bisa mendapatkan nilainya melalui artifacts payload JWT.

### Kriteria 3 : Menerapkan Foreign Key

Database wajib menerapkan Foreign Key. Contohnya relasi:

- Tabel songs terhadap albums;
- Tabel playlists terhadap users;
- Dan relasi tabel lainnya.

### Kriteria 4 : Menerapkan Data Validation

Wajib menerapkan proses Data Validation pada Request Payload sesuai spesifikasi berikut:

- POST /users:
  - username : string, required.
  - password : string, required.
  - fullname : string, required.
- POST /authentications:
  - username : string, required.
  - password : string, required.
- PUT /authentications:
  - refreshToken : string, required.
- DELETE /authentications:
  - refreshToken : string, required.
- POST /playlists:
  - name : string, required.
- POST /playlists/{playlistId}/songs
  - songId : string, required.

### Kriteria 5 : Penanganan Eror (Error Handling)

- Ketika proses validasi data pada request payload tidak sesuai (gagal), server harus mengembalikan response:
  - status code: 400 (Bad Request)
  - response body:
    - status: fail
    - message: <apa pun selama tidak kosong>
- Ketika pengguna mengakses resource yang tidak ditemukan, server harus mengembalikan response:
  - status code: 404 (Not Found)
  - response body:
    - status: fail
    - message: \<apa pun selama tidak kosong>
- Ketika pengguna mengakses resource yang dibatasi tanpa access token, server harus mengembalikan response:
  - status code: 401 (Unauthorized)
  - response body:
    - status: fail
    - message: \<apa pun selama tidak kosong>
- Ketika pengguna memperbarui access token menggunakan refresh token yang tidak valid, server harus mengembalikan response:
  - status code: 400 (Bad Request)
  - response body:
    - status: fail
    - message: \<apa pun selama tidak kosong>
- Ketika pengguna mengakses resource yang bukan haknya, server harus mengembalikan response:
  - status code: 403 (Forbidden)
  - response body:
    - status: fail
    - message: \<apa pun selama tidak kosong>
- Ketika terjadi server eror, server harus mengembalikan response:
  - status code: 500 (Internal Server Error)
  - Response body:
    - status: error
    - message: \<apa pun selama tidak kosong>

### Kriteria 6 : Pertahankan Fitur OpenMusic API versi 1

Pastikan fitur dan kriteria OpenMusic API versi 1 tetap dipertahankan seperti:

- Pengelolaan data album.
- Pengelolaan data song.
- Menerapkan data validations resource album dan song.

### Kriteria Opsional

Selain kriteria utama, terdapat kriteria opsional yang yang dapat Anda penuhi agar mendapat nilai yang baik.

#### Kriteria Opsional 1: Memiliki fitur kolaborator playlist

API yang Anda buat harus memiliki fitur kolaborasi dengan spesifikasi berikut:

![Kriteria Opsional 1](https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:b2208d9238e801b66ed140c996925bae20211215143414.png) \*_any: merupakan nilai string apa pun selama tidak kosong._

Hak akses kolaborator

Ketika user ditambahkan sebagai kolaborator playlist oleh pemilik playlist. Maka hak akses user tersebut terhadap playlist adalah:

- Playlist tampil pada permintaan GET /playlists.
- Dapat menambahkan lagu ke dalam playlist.
- Dapat menghapus lagu dari playlist.
- Dapat melihat daftar lagu yang ada di playlist.
- Dapat melihat aktifitas playlist (jika menerapkan kriteria opsional ke-2).

#### Kriteria Opsional 2: Memiliki Fitur Playlist Activities

API yang dibuat harus memiliki fitur aktivitas playlist. Fitur ini digunakan untuk mencatat riwayat menambah atau menghapus lagu dari playlist oleh pengguna atau kolaborator.

Riwayat aktivitas playlist dapat diakses melalui endpoint:

- Method: GET
- URL: /playlists/{id}/activities

Server harus mengembalikan respons dengan:

- Status Code : 200
- Response Body:
  ```json
  {
    "status": "success",
    "data": {
      "playlistId": "playlist-Mk8AnmCp210PwT6B",
      "activities": [
        {
          "username": "dicoding",
          "title": "Life in Technicolor",
          "action": "add",
          "time": "2021-09-13T08:06:20.600Z"
        },
        {
          "username": "dicoding",
          "title": "Centimeteries of London",
          "action": "add",
          "time": "2021-09-13T08:06:39.852Z"
        },
        {
          "username": "dimasmds",
          "title": "Life in Technicolor",
          "action": "delete",
          "time": "2021-09-13T08:07:01.483Z"
        }
      ]
    }
  }
  ```

#### Kriteria Opsional 3 : Mempertahankan Kriteria Opsional OpenMusic V1

API mampu menerapkan atau mempertahankan kriteria opsional pada proyek OpenMusic V1. Berikut detailnya:

- Mendapatkan daftar lagu di dalam album detail.
- Query Parameter untuk Pencarian Lagu.

## Pengujian

Tes dengan berkas Postman Collection dan Environment yang telah disediakan.

## Submission akan Ditolak bila

- Kriteria wajib OpenMusic API versi 2 tidak terpenuhi.
- Ketentuan berkas submission tidak terpenuhi.
- Menggunakan bahasa pemrograman dan teknologi lain, selain JavaScript dan Node.js.
- Menggunakan Framework Node.js selain Hapi Framework.
- Melakukan kecurangan seperti tindakan plagiasi.
