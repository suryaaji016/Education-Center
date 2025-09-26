- npm init -y
- npm i pg express ejs sequelize
- npm i -D sequelize-cli
- touch .gitignore => node_modules
- npx sequelize init
- edit configurasi di config/config.json "postgres" dan nama db
- Buat database = npx sequelize db:create
=== BUAT MODEL & TABEL
- Buat model & query createTable = npx sequelize model:create --name Student --attributes name:string,gender:string,dateOfBirth:date,phase:integer

- set FK dulu https://sequelize.org/api/v6/class/src/dialects/abstract/query-interface.js~queryinterface#instance-method-createTable
X - Menjalankan file migrasi = npx sequelize db:migrate
- Tidak jadi menjalankan file migrasi = npx sequelize db:migrate:undo:all

=== CUSTOM MIGRATION
- Buat file migrasi / custom migration / skeleton migration = npx sequelize migration:create --name add-column-to-Students
npx sequelize migration:create --name add-column-to-StartUps
- Edit file migrasi sesuai kebutuhan (lihat dokumentasi)
- Jalankan file migrasi menggunakan langkah X
- Ubah model, bila addColumn maka tambahkan property baru di Model, bila mengubah nama property maka ubah juga yang di Model.

=== SEEDING
- Buat file seeder-nya = npx sequelize seed:create --name seed-Students,npx sequelize seed:create --name seed-Incubators-StartUps
- Edit file seedernya
- Jalankan semua file seeder = npx sequelize db:seed:all
- Menjalankan 1 file seeder = npx sequelize db:seed --seed namaFileSeeder
===
edit modelnya yang associate

buat folder controller dan views
buat app.js dan controller.js


CEK COMMAND = npx sequelize --help