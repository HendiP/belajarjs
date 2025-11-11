// server.js

import express from 'express';
import path from 'path';
import { getLaporanPenghasilan } from './laporanModule.js '; // 3. Import Module

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Untuk mem-parsing body JSON dari request
app.use(express.static('public')); // Untuk menyajikan file HTML, CSS, JS

/**
 * 1. FUNGSI DENGAN POLA CALLBACK
 * (Logika ini ada di server)
 */
function verifikasiLogin(username, password, callback) {
    // Simulasi jeda waktu request ke database
    setTimeout(() => {
        if (username === 'admin' && password === '123') {
            const user = { id: 1, nama: 'admin' };
            callback(null, user); // (error, data)
        } else {
            const error = new Error('Username atau password salah.');
            callback(error, null); // (error, data)
        }
    }, 1000); // Jeda 1 detik
}

/**
 * 2. FUNGSI YANG MENGEMBALIKAN PROMISE
 * (Logika ini ada di server)
 */
function generateKey(user) {
    return new Promise((resolve, reject) => {
        // Simulasi jeda waktu proses enkripsi
        setTimeout(() => {
            if (user.nama === 'admin') {
                const key = 'key-sukses-admin-123';
                resolve(key);
            } else {
                reject(new Error('Generate key gagal: User tidak diotorisasi.'));
            }
        }, 1000); // Jeda 1 detik
    });
}


// --- ENDPOINT API LOGIN ---
// Di sinilah semua alur digabungkan
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Array untuk mengumpulkan log alur
    const logAlur = [];

    try {
        logAlur.push(`[SERVER] Mencoba login dengan username: "${username}"`);
        logAlur.push('[SERVER] 1. Memanggil verifikasiLogin (Callback)...');

        // 1. PENERAPAN CALLBACK
        // Kita "promisify" fungsi callback agar bisa dipakai dengan async/await
        const user = await new Promise((resolve, reject) => {
            verifikasiLogin(username, password, (error, user) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        });

        logAlur.push(`[SERVER] CALLBACK SUKSES: Login berhasil untuk user: ${user.nama}`);
        logAlur.push('[SERVER] 2. Memanggil generateKey (Promise)...');

        // 2. PENERAPAN PROMISE
        const key = await generateKey(user);

        logAlur.push(`[SERVER] PROMISE SUKSES: Key berhasil dibuat: ${key}`);
        logAlur.push('[SERVER] 3. Memanggil getLaporanPenghasilan (Module)...');

        // 3. PENERAPAN MODULE
        const laporan = getLaporanPenghasilan(key);

        logAlur.push(`[SERVER] MODULE SUKSES: ${laporan}`);
        logAlur.push('[SERVER] Selesai. Mengirim log kembali ke client.');

        // Kirim semua log sebagai respons sukses
        res.json({ success: true, log: logAlur });

    } catch (error) {
        // Jika ada error di mana pun (Callback atau Promise)
        logAlur.push(`[SERVER] GAGAL: ${error.message}`);
        res.status(401).json({ success: false, log: logAlur });
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});