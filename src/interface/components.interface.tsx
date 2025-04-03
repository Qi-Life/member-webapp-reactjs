export interface FavoritesType {
  id: 'string';
  user_id: 'string';
  is_favorite: 'string';
  title: 'string';
  frequencies: 'string';
  categoryId: 'string';
  subCategoryId: 'string';
  qilifestore_url: 'string';
  cDate: 'string';
  mDate: 'string';
  type: 'string';
  image?: 'string';
}

export interface FreaturedType {
  id: 'string';
  categoryId: 'string';
  subCategoryId: 'string';
  title: 'string';
  description: 'string';
  image: 'string';
  audio_folder: 'string';
  likes: any;
  frequencies: 'string';
  type: 'string';
  subtype: 'string';
  is_free: 'string';
  is_active: 'string';
  is_featured: 'string';
  qilifestore_url: 'string';
  order_by: 'string';
  CDate: 'string';
  mDate: 'string';
  lock: boolean;
}

export interface FreeType {
  id: 'string';
  categoryId: 'string';
  subCategoryId: 'string';
  title: 'string';
  description: 'string';
  image: 'string';
  audio_folder: any;
  likes: any;
  frequencies: 'string';
  type: 'string';
  subtype: 'string';
  is_free: 'string';
  is_active: 'string';
  is_featured: 'string';
  qilifestore_url: 'string';
  order_by: 'string';
  CDate: 'string';
  mDate: 'string';
  albumId: 'string';
}

export interface FreeFrequenciesType {
  id: 'string';
  title: 'string';
  description: 'string';
  image: 'string';
  likes: any;
  frequencies: 'string';
  categoryId: 'string';
  subCategoryId: 'string';
  order_by: 'string';
  audio_folder: any;
  is_free: 'string';
  qilifestore_url: 'string';
  lock: boolean;
}
