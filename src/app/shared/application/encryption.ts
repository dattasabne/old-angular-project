import * as CryptoJs from "crypto-js";
export class EncryptionDecryption{
    public static encrypt(text:string,key:string):string{
        let encrypt = CryptoJs.AES.encrypt(text,key).toString();
        return encrypt;
    }
    public static decrypt(encryptText:string,key:string):string{
        let bytes = CryptoJs.AES.decrypt(encryptText.toString(),key);
        let decryptText = bytes.toString(CryptoJs.enc.Utf8);
        return decryptText;
    }
}