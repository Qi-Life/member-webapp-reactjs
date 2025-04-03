export const removeNullParams = (obj: any) => {
    let newObj:any = {} 
    Object.keys(obj).forEach(key => {
        if (obj[key] ) {
            newObj[key] = obj[key];
        } 
    });
    return newObj
};