import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditWisata() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nama_wisata: "",
        deskripsi: "",
        harga_tiket: "",
        id_kategori: "",
        nama_file: "",
    });

    const [kategori, setKategori] = useState([]);
    const [fileBaru, setFileBaru] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWisata = async () => {
            try {
                const res = await fetch(
                    `http://localhost:3001/wisata/${id}`
                );

                const data = await res.json();

                if (res.ok && data.length > 0) {
                    setFormData(data[0]);
                } else {
                    alert("Data wisata tidak ditemukan");
                    navigate("/wisata");
                }
            } catch (err) {
                console.error(err);
                alert("Gagal mengambil data wisata");
            } finally {
                setLoading(false);
            }
        };

        getWisata();
    }, [id, navigate]);

    useEffect(() => {
        const getKategori = async () => {
            try {
                const res = await fetch(
                    "http://localhost:3001/kategori"
                );

                const data = await res.json();
                setKategori(data);
            } catch (err) {
                console.error("Gagal mengambil kategori:", err);
            }
        };

        getKategori();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const yakin = window.confirm(
            "Yakin mau menyimpan perubahan ini?"
        );

        if (!yakin) {
            return;
        }

        try {
            const data = new FormData();

            data.append("nama_wisata", formData.nama_wisata);
            data.append("deskripsi", formData.deskripsi);
            data.append("harga_tiket", formData.harga_tiket);
            data.append("id_kategori", formData.id_kategori);

            if (fileBaru) {
                data.append("nama_file", fileBaru);
            }

            const res = await fetch(
                `http://localhost:3001/wisata/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: data,
                }
            );

            const result = await res.json();

            if (res.ok) {
                alert("Wisata berhasil diperbarui!");
                navigate("/wisata");
            } else {
                alert(result.message || "Gagal memperbarui wisata!");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat memperbarui wisata!");
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                Loading...
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Edit Wisata</h2>

            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Foto Saat Ini</label>
                    <div>
                        {formData.nama_file ? (
                            <img
                                src={`http://localhost:3001/uploads/${formData.nama_file}`}
                                alt="Foto lama"
                                style={{
                                    width: "120px",
                                    borderRadius: "8px",
                                }}
                            />
                        ) : (
                            <p>Tidak ada foto</p>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Ganti Foto (opsional)
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) =>
                            setFileBaru(e.target.files[0])
                        }
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Nama Wisata
                    </label>

                    <input
                        type="text"
                        name="nama_wisata"
                        value={formData.nama_wisata}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Deskripsi
                    </label>

                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        className="form-control"
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Harga Tiket
                    </label>

                    <input
                        type="number"
                        name="harga_tiket"
                        value={formData.harga_tiket}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Kategori
                    </label>

                    <select
                        name="id_kategori"
                        value={formData.id_kategori}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">
                            -- Pilih Kategori --
                        </option>

                        {kategori.map((item) => (
                            <option
                                key={item.id_kategori}
                                value={item.id_kategori}
                            >
                                {item.kategori}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn btn-success me-2"
                >
                    Simpan Perubahan
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/wisata")}
                >
                    Batal
                </button>
            </form>
        </div>
    );
}