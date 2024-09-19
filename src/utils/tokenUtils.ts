// import EncryptedStorage from 'react-native-encrypted-storage';
import RNSecureStorage, { ACCESSIBLE } from "killuhwhal3-rn-secure-storage";

const JWT_ACCESS_TOKEN_KEY = "__jwttoken_access";
const JWT_REFRESH_TOKEN_KEY = "__jwttoken_refresh";

export const clearToken = async () => {
  try {
    await RNSecureStorage.remove(JWT_ACCESS_TOKEN_KEY);
    await RNSecureStorage.remove(JWT_REFRESH_TOKEN_KEY);
    return true;
  } catch (e) {
    // saving error
    console.log("Error clearing from storage: ", e);
    return false;
  }
};
export const storeToken = async (value: any, access = true) => {
  try {
    if (access) {
      await RNSecureStorage.set(JWT_ACCESS_TOKEN_KEY, value, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
    } else {
      await RNSecureStorage.set(JWT_REFRESH_TOKEN_KEY, value, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
    }
    return true;
  } catch (e) {
    // saving error
    console.log("Errorsaving to storage: ", e);
    return false;
  }
};

export const getToken = async (access = true) => {
  try {
    if (access) {
      return await RNSecureStorage.get(JWT_ACCESS_TOKEN_KEY);
    } else {
      return await RNSecureStorage.get(JWT_REFRESH_TOKEN_KEY);
    }
  } catch (e) {
    // error reading value
    console.log("Error getting from storage: ", e);
    return null;
  }
};
