// import { typeUserInfo } from '../interface/user/user.interface';

import { PaymentConfig } from "~/components/shared/SubscriptionForm/PaymentConfig";

export const getToken = (key: string): string | null => localStorage.getItem(key);
export const setToken = (key: string, value: any) => localStorage.setItem(key, value);
export const getAccessToken = () => {
  return localStorage.getItem('userToken');
};
export const setAccessToken = (accessToken: string) => {
  // setToken(configApp.tokenKey, accessToken);
  localStorage.setItem('userToken', accessToken);
};
export const deleteAccessToken = () => {
  localStorage.removeItem('userToken');
};

export const getInfoUser = () => {
  return localStorage.getItem('useInfo');
};

export const getEmailUser = () => {
  return localStorage.getItem('useEmail');
};

// get user password for remember me
const userInfoKey = 'useInfo';
const id_user = 'id_user';
const userInfoEmail = 'useEmail';
const useDataCategory = 'useDataCategory';
const useDataSubCategory = 'useDataSubCategory';
const is_subscribe = 'is_subscribe';
const category_ids = 'category_ids';
const subcategory_ids = 'subcategory_ids';
const album_ids = 'album_ids';
const is_verified = 'is_verified';
const is_unlocked_scalar = 'is_unlocked_scalar'
export const getUserAndPassword = () => {
  try {
    const localInfo = localStorage.getItem(userInfoKey);
    const result = JSON.parse(localInfo!);
    return {
      email: result.email,
      password: result.password,
    };
  } catch (error) {
    return {
      email: '',
      password: '',
    };
  }
};

export const setDataCategory = (data: any) => {
  localStorage.setItem(useDataCategory, JSON.stringify(data));
};

export const setDataSubCategory = (data: any) => {
  localStorage.setItem(useDataSubCategory, JSON.stringify(data));
};

export const getDataCategory = () => {
  if (localStorage.getItem(useDataCategory)) {
    return JSON.parse(localStorage.getItem(useDataCategory))
  }
  return [];
};

export const getDataSubCategory = () => {
  if (localStorage.getItem(useDataSubCategory)) {
    return JSON.parse(localStorage.getItem(useDataSubCategory))
  }
  return [];
};

export const setUserAndPasswordLocal = (userInfo: any) => {
  localStorage.setItem(id_user, userInfo.id);
  localStorage.setItem(userInfoKey, userInfo.name);
  localStorage.setItem(userInfoEmail, userInfo.email);
  localStorage.setItem(is_subscribe, userInfo.is_subscribe);
  localStorage.setItem(category_ids, userInfo.category_ids);
  localStorage.setItem(subcategory_ids, userInfo.subcategory_ids);
  localStorage.setItem(album_ids, userInfo.album_ids);
  localStorage.setItem(is_verified, userInfo.is_verified);
  localStorage.setItem(is_unlocked_scalar, userInfo.is_unlocked_scalar);
};

export const deleteUserAndPasswordLocal = () => {
  localStorage.removeItem(userInfoKey);
  localStorage.removeItem(userInfoEmail);

  localStorage.removeItem(is_subscribe);
  localStorage.removeItem(category_ids);
  localStorage.removeItem(subcategory_ids);
  localStorage.removeItem(album_ids);
  localStorage.removeItem(is_verified);
};

const keyRememberMe = 'rememberMe';

export const setRememberMe = (value: string) => {
  localStorage.setItem(keyRememberMe, value);
};

export const getRememberMe = (): string | null => localStorage.getItem(keyRememberMe);

export const deleteRememberMe = () => {
  localStorage.removeItem(keyRememberMe);
};

export const checkLockByCategory = (categoryId: any) => {
  let categoryCheckId = categoryId
  const userCategoryId = localStorage.getItem('category_ids')
  const userCategoryArr = !!userCategoryId ? userCategoryId.split(',') : []

  if (categoryCheckId == 7) {
    return false
  }

  if (categoryCheckId == 11) {
    return !userCategoryArr.find(item => item == '2' || item == categoryCheckId)
  }
  return !userCategoryArr.find(item => item == categoryCheckId)
}

export const checkLockAlbum = (album: any) => {
  let userAlbumId = localStorage.getItem('album_ids') || ''
  const userAlbumIdArr = !!userAlbumId ? userAlbumId?.split(',') : []
  const album_free = localStorage.getItem('album_free')?.split(',') || []
  if (+album.is_free == 1) {
    return false
  }

  if (!album.categoryId) {
    return checkLockByCategory(1)
  }

  if (userAlbumIdArr.find(item => item == album.id)) {
    return false
  }

  if (album.categoryId == 7 || album_free.find((_a: any) => _a == album.id)) {
    return false
  }

  return checkLockByCategory(album.categoryId)
}

export const isLogined = () => {
  return !!getAccessToken()
}

export const getUnlockedCategory = () => {
  if (localStorage.getItem('category_ids')) {
    return localStorage.getItem('category_ids').split('')
  }
  return []
}

export const getUnlockUrl = (playInforItem: { categoryId: string | number, qilifestore_url: string }): {
  url: string,
  text: string,
  out?: boolean
} => {
  const { categoryId } = playInforItem;

  if (!categoryId || categoryId == 1) {
    return PaymentConfig.rifePlan
  } else if (categoryId == 2 || categoryId == 11) {
    return PaymentConfig.quantumPlan
  } else if (categoryId == 3) {
    return PaymentConfig.higherQuantumPlan
  } else if (categoryId == 4) {
    return PaymentConfig.innerCirclePlan
  }
  else if (categoryId == 10) {
    return PaymentConfig.advancedQuantumPlan
  }
  else {
    if (playInforItem.qilifestore_url) {
      return {
        url: playInforItem.qilifestore_url,
        text: 'UNLOCK WITH QILIFESTORE',
        out: true
      }
    } else {
      return null
    }
  }
}
