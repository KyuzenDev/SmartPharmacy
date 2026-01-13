"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nama: string;
  role: "Pasien" | "Apoteker" | "Admin";
}

export default function DashboardPage() {

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const storedData = localStorage.getItem("user");

    if (!storedData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedData) as User;
      setUser(parsedUser);
    } catch (error) {
      console.error("Format data user salah", error);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="animate-pulse font-medium text-gray-500">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SmartPharmacy</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {user.role}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline font-medium cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-black">Halo, {user.nama}!</h2>
          <p className="text-gray-600">
            Selamat datang di panel kontrol SmartPharmacy.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.role === "Pasien" && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
                <h3 className="font-bold text-lg mb-2 text-blue-600">
                  Riwayat Resep
                </h3>
                <p className="text-sm text-gray-500">
                  Lihat daftar obat yang pernah Anda beli.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
                <h3 className="font-bold text-lg mb-2 text-blue-600">
                  Pesan Obat
                </h3>
                <p className="text-sm text-gray-500">
                  Cari dan pesan obat dari apotek kami.
                </p>
              </div>
            </>
          )}

          {user.role === "Apoteker" && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
                <h3 className="font-bold text-lg mb-2 text-green-600">
                  Kelola Stok
                </h3>
                <p className="text-sm text-gray-500">
                  Update jumlah dan harga obat-obatan.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
                <h3 className="font-bold text-lg mb-2 text-green-600">
                  Pesanan Masuk
                </h3>
                <p className="text-sm text-gray-500">
                  Verifikasi resep dan pesanan pasien.
                </p>
              </div>
            </>
          )}

          {user.role === "Admin" && (
            <div className="bg-white p-6 rounded-xl shadow-sm cursor-pointer border border-red-200 hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2 text-red-600">
                Panel Admin
              </h3>
              <p className="text-sm text-gray-500">
                Kelola semua user, apoteker, dan laporan sistem.
              </p>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
            <h3 className="font-bold text-lg mb-2 text-gray-700">
              Profil Saya
            </h3>
            <p className="text-sm text-gray-500">
              Ubah data diri dan ganti password.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}