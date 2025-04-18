export interface AlbumItem {
    id: number | string;
    title: string;
    description?: string;
    albumImage?: string | null;
}

export interface CategoryItem {
    categoryId: number,
    title: string
}

export interface SubItem {
    subCategoryId: number,
    subCategoryTitle: string,
    albums: AlbumItem[]
}