export const setAudioPlayStorelist = (items: any) => {
    localStorage.setItem('audioPlayList', JSON.stringify(items))
}

export const getAudioPlayStorelist = () => {
    let audioPlayList = localStorage.getItem('audioPlayList')
    if (audioPlayList) {
        return JSON.parse(audioPlayList)
    }
    return []
}


export const setScalarStoreList = (items: any) => {
    localStorage.setItem('scalarList', JSON.stringify(items))
}

export const getScalarStoreList = () => {
    let scalarList = localStorage.getItem('scalarList')
    if (scalarList) {
        return JSON.parse(scalarList)
    }
    return []
}


export const getPlaylistName = () => {
    let playlistTitle = localStorage.getItem('playlistTitle')
    if (playlistTitle) {
        return JSON.parse(playlistTitle)
    }
    return ''
}


export const storePlaylistName = (playlistTitle: any) => {
    localStorage.setItem('playlistTitle', JSON.stringify(playlistTitle))
}
