import CryptoJS from 'crypto-js';

const SALT = 'gpa-manager-2025';

export function encryptData(data, passphrase) {
  try {
    const key = CryptoJS.PBKDF2(passphrase, SALT, { keySize: 256 / 32, iterations: 1000 });
    const encrypted = CryptoJS.AES.encrypt(data, key.toString());
    return encrypted.toString();
  } catch (e) {
    console.error('Encryption error:', e);
    return null;
  }
}

export function decryptData(encryptedData, passphrase) {
  try {
    const key = CryptoJS.PBKDF2(passphrase, SALT, { keySize: 256 / 32, iterations: 1000 });
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key.toString());
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error('Decryption error:', e);
    return null;
  }
}
