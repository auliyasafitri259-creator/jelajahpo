import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"

export default function Wisata() {
    const [wisata, setWisata] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const getWisata = async () => {
        try {
            const res = await fetch("http://localhost:3001/wisata");
            const data = await res.json();
            setWisata(data);
        } catch (err) {
            console.error("Gagal fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWisata();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus wisata ini? ")) {
            try {
                const res = await fetch(`http://localhost:3001/wisata/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                if (res.ok) {
                    alert("Wisata berhasil dihapus")
                    getWisata(); //ambil ulang data terbaru
                } else {
                    alert("Gagal menghapus wisata")
                }
            } catch (err) {
                console.error("Error saat delete:", err)
                alert("Terjadi kesalahan saat menghapus data")
            }
        }
    }
    const handleEdit = (id) => {
        navigate(`/wisata/edit/${id}`)
    }

    if (loading) {
        return (
            <div className="container mt-4">
                Sedang memuat data...
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Daftar Wisata JelajahPo </h2>
                <Link to="/wisata/tambah" className="btn btn-primary">
                + Tambah Wisata
                </Link>
            </div>
            <table className="table table-bordered table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>ID</th>
                        <th>Foto</th>
                        <th>Nama Wisata</th>
                        <th>Deskripsi</th>
                        <th>Harga Tiket</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {wisata.length > 0 ? (
                        wisata.map((item) => (
                            <tr key={item.id_wisata}>
                                <td>{item.id_wisata}</td>
                                <td>
                                    {item.nama_file ? (
                                        <img 
                                        src={`http://localhost:3001/uploads/${item.nama_file}`}
                                        alt={item.nama_wisata}
                                        width="200"
                                        className="rounded"
                                        />
                                    ) : (
                                        <span className="text-muted">Tidak ada foto</span>
                                    )}
                                </td>
                                <td>{item.nama_wisata}</td>
                                <td>{item.deskripsi}</td>
                                <td>Rp. {item.harga_tiket}</td>
                                <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item.id_wisata)}>Edit</button>
                                </td>
                                <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id_wisata)}>Delete</button>
                            </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Belum ada wisata
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}