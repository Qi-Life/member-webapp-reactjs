export const removeNullParams = (obj: any) => {
    let newObj: any = {}
    Object.keys(obj).forEach(key => {
        if (obj[key]) {
            newObj[key] = obj[key];
        }
    });
    return newObj
};

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};