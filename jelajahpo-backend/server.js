const express = require('express')
const cors = require('cors')
const app = express()
const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jelajahpo_db'
})

db.connect(err => {
    if (err) {
        console.error('Gagal konek ke database:', err)
    } else {
        console.log('Berhasil konek ke database JelajahPo')
    }
})

const PORT = 3001;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Selamat Datang di JelajahPo API')
})

//========== GET WISATA=======//
app.get('/wisata', (req, res) => {
    const sql = 'SELECT * FROM wisata';
    db.query(sql, (err,resutls) => {
        if (err)  return res.status(500).json({error: err})
            res.json(resutls)
    })
})
//==========SELESAI GET WISATA=====//

//========POST WISATA==========//
app.post('/wisata', (req, res) => {
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body;

    if (!deskripsi) {
        return res.status(400).json({ message: 'Deskripsi wajid diisi' })
    }

    const sql = 'INSERT INTO wisata (nama_wisata, deskripsi, harga_tiket, id_kategori, tgl_input) VALUES (?,?, ?, ?, NOW())';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori], (err,result)=> {
        if (err) return res.status(500).json({ error:err.sqlMessage })()
            res.json({
             message: 'Wisata berhasil ditambahkan!',
             id_wisata: result.insertId
        })
    })
})

//==========PUT WISATA========//
app.put('/wisata/:id_wisata', (req, res) => {
    const { id_wisata } = req.params;
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body;

    if (!nama_wisata || !harga_tiket) {
        return res.status(400).json({ message: 'Nama Wisata dan harga_tiket wajid diisi' })
    }

    const sql = 'UPDATE wisata SET nama_wisata=?, deskripsi=?, harga_tiket=?, id_kategori=? WHERE id_wisata=?';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori, id_wisata], (err, result ) => {
        if (err) return res.status(500).json({ error: err.sqlMessage })
            res.json({ message: 'Wisata berhasil diupdate!'})
    })
})
//==========GET KATEGORI=======//
app.get('/kategori', (req, res) => {
    const sql = 'SELECT * FROM kategori';
    db.query(sql, (err,resutls) => {
        if (err)  return res.status(500).json({error: err})
            res.json(resutls)
    })
})
app.listen(PORT, () => {
    console.log(`Server JelajahPo jalan di http://localhost:${PORT}`)
})