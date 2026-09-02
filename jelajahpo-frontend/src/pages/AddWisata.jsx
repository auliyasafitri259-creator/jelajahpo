import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddWisata(){
    const [formData, setFormData] = useState({
        nama_wisata: "",
        deskripsi: "",
        harga_tiket: "",
        id_kategori: "",
    })
    const [kategori, setKategori] = useState([]);
    const navigate = useNavigate();

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const res = await fetch("http://localhost:3001/wisata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                alert("Wisata berhasil ditambahkan!")
                navigate("/wisata")
            } else {
                const data = await res.json()
                alert(data.message || "Gagal menambah wisata")
            }
        } catch (err) {
            console.error("Error:", err)
            alert("Terjadi kesalahan saat menambah wisata")
        }
    }
    useEffect(() => {
        const getKategori =  async () => {
            try {
                const res = await fetch("http://localhost:3001/kategori");
                const data = await res.json()
                setKategori(data)
            }catch (err){
                console.error("GAGAL MENGAMBIL KATEGORI:", err)
            }
        }
        getKategori()
    }, [])
    return (
        <div className="container mt-4">
            <h2 className="mb-3">Tambah Wisata </h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                <label className="form-label">Nama Wisata</label>
                <input 
                type="text"
                name="nama_wisata"
                value={formData.nama_wisata}
                onChange={handleChange}
                className="form-control"
                placeholder="Masukkan nama wisata"
                required
                />
                </div>
                 <div className="mb-3">
                <label className="form-label">Deskripsi</label>
                <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="form-control"
                placeholder="Masukkan deskripsi wisata"
                ></textarea>
                </div>
                 <div className="mb-3">
                <label className="form-label">Harga Tiket</label>
                <input 
                type="number"
                name="harga_tiket"
                value={formData.harga_tiket}
                onChange={handleChange}
                className="form-control"
                placeholder="Masukkan harga tiket"
                required
                />
                </div>
               <div className="mb-3">
                    <label className="form-label">Kategori</label>
                    <select 
                    name="id_kategori" 
                    value={formData.id_kategori} 
                    onChange={handleChange} 
                    className="form-select"
                    required
                    >
                    <option value="">--Pilih Kategori--</option>
                    {kategori.map((item) => (
                        <option 
                        key={item.id_kategori}
                        value={item.id_kategori}>
                            {item.kategori}
                        </option>
                    ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-success">Simpan</button>
            </form>
        </div>
    )
}