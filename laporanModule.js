// laporanModule.js

// 3. PENERAPAN MODULE
// Fungsi ini di-export untuk digunakan oleh server.js
export function getLaporanPenghasilan(key) {
    if (key === 'key-3285-6789-xyz') {
        const dataPenghasilan = {
            total: 15000000,
            periode: 'November 2025'
        };
        return `LAPORAN DITERIMA: Total penghasilan admin untuk periode ${dataPenghasilan.periode} adalah Rp ${dataPenghasilan.total.toLocaleString('id-ID')}.`;
    } else {
        return 'Error: Key tidak valid untuk mengakses laporan.';
    }
}