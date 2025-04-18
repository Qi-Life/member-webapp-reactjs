export const clearUserData = () => {
    localStorage.removeItem('category_ids')
    localStorage.removeItem('userToken')
    localStorage.removeItem('subcategory_ids')
    localStorage.removeItem('album_ids')
    localStorage.removeItem('useEmail')
    localStorage.removeItem('album_free')
    localStorage.removeItem('useInfo')
    localStorage.removeItem('is_verified')
    localStorage.removeItem('id_user')
    localStorage.removeItem('is_unlocked_scalar')
    localStorage.removeItem('isShowAdvancedMode')
    localStorage.removeItem('isPlayWithSuff')
    localStorage.setItem('chat_messages', JSON.stringify([]));
    localStorage.removeItem('silentScalars')
    localStorage.removeItem('audioPlayList')
    localStorage.removeItem('chatbot_thread')
    localStorage.removeItem('scalarList')
    localStorage.removeItem('playlistTitle')
    localStorage.removeItem('playlistId')
}