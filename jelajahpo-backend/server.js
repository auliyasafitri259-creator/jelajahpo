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
        if (err) { return res.status(500).json({ error: err.sqlMessage })
        }
    if (result.affectedRows === 0) { return res.status(404).json({message: 'Wisata tidak ditemukan'})
    }
            res.json({ message: 'Wisata berhasil diupdate!'})
    })
})

//==========DELETE WISATA======//
app.delete('/wisata/:id_wisata', (req, res) => {
    const {id_wisata } = req.params;
    const sql = 'DELETE FROM wisata WHERE id_wisata = ?';
    db.query(sql, [id_wisata], (err, result) => {
        if (err) { return res.status(500).json({ error: err.sqlMessage})
        }
         if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Wisata tidak ditemukan'})
         }
        res.json({ message: 'Wisata berhasil dihapus!' })
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

const bcrypt = require('bcrypt')
const saltRounds = 10;

app.post('/pengguna', async (req, res) => {
    const { nama, email, password, no_hp } = req.body;
    if (!nama || !email || !password) {
        return res.status(400).json({ message: 'Nama, email, dan password wajib diisi'})
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const sql = 'INSERT INTO pengguna (nama, email,password, no_hp) VALUES (?,?,?,?)'
        db.query(sql, [nama, email, hashedPassword, no_hp], (err, result) => {
             if (err) {
                if(err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json ({
                        message: 'Email sudah terdaftar gunakan email lain!'
                    })
                }
            } 
            if (err) return res.status(500).json({error: err.sqlMessage })
                res.json({
                  message: 'Akun berhasil dibuat!',
                  id_pengguna: result.insertId
            })
        }) 
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengenkripsi password'})
    }
})
app.listen(PORT, () => {
    console.log(`Server JelajahPo jalan di http://localhost:${PORT}`)
})