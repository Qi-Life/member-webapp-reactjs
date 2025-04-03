import apiClient from '~/configs/apiClient';

export const getMostPlaylist = async (search?: string, page?: number, perPage?: number) => {
  return await apiClient.get('/api/getmostplaylist', { params: { searchName: search, page, perPage } });
};
export const getPlaylistByUser = async (userid?: string, playlistId?: string) => {
  return await apiClient.get('/api/getplaylistofother', { params: { userid: userid, playlist_id: playlistId } });
};

export const getPlayList = async (userid?: string, search?: string, playlistId?: string) => {
  return await apiClient.get(`/api/getplaylist`, {
    params: { userid: userid, search: search, playlist_id: playlistId },
  });
};

export const savePlayList = async (params: any) => {
  return await apiClient.post(`/api/saveplaylist`, params);
};
export const AddMp3Playlist = async (params: any) => {
  return await apiClient.post(`get-mp3-playlis-add`, params);
};

export const deletePlayList = async (id: string) => {
  return await apiClient.post(`/api/delete_playlist/${id}`);
};

export const votePlayList = async (postData:any) => {
  console.log("🚀 ~ file: PlaylistServices.tsx:28 ~ votePlayList ~ postData:", postData)
  return await apiClient.post(`/api/voteplaylist`, postData);

}