import { uid } from "uid";
import CryptoES from "crypto-es";

// Générer un unique ID en base64
export const generateUID = (length: number = 64): string => {
  return uid(64);
};

// Générer un hash (résultat de l'encryptage du password+salt)
export const generateHash = (password: string, salt: string): string => {
  return CryptoES.SHA512(password + salt).toString();
};
