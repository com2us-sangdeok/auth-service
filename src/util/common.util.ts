import * as argon2 from 'argon2';
import crypto = require('crypto');
import { AES, Rabbit, enc } from 'crypto-js';

export const customUuid = () => {
  let date = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (date + Math.random() * 16) % 16 | 0;
      date = Math.floor(date / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
};

export const generateSecretKey = () => {
  let date = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (date + Math.random() * 16) % 16 | 0;
      date = Math.floor(date / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return btoa(uuid);
};

export const compareObject = (obj1, obj2) => {
  const obj1Length = Object.keys(obj1).length;
  const obj2Length = Object.keys(obj2).length;

  if (obj1Length === obj2Length) {
    return Object.keys(obj1).every(
      (key) => obj2.hasOwnProperty(key) && obj2[key] === obj1[key],
    );
  }
  return false;
};

export const isValidAddress = (address) => {
  return /(xpla1[a-z0-9]{38})/g.test(address);
};

export const randomString = (size: number, encode: BufferEncoding) => {
  return crypto.randomBytes(size).toString(encode);
};

export const hashData = (data: string) => {
  return argon2.hash(data);
};

export const argonVerify = async (hash: string, plain: string | Buffer) => {
  return await argon2.verify(hash, plain);
};

export const encrypt = (text, key) => {
  // return Rabbit.encrypt(text, key).toString();
  return AES.encrypt(text, key).toString();
};

export const decrypt = (encryptedText: string, key: string) => {
  // const decrypted_bytes = Rabbit.decrypt(encryptedText, key);
  // return decrypted_bytes.toString(enc.Utf8);
  const decrypted_bytes = AES.decrypt(encryptedText, key);
  return decrypted_bytes.toString(enc.Utf8);
};
