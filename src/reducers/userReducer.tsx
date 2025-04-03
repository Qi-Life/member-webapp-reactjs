import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type store = {
	// id: number;
	uuid: string;
	name: string;
	// email: string;
	// created_at: string;
	// updated_at: string;
};
type userType = {
	accessToken: string;
	employeeId: string | null;
	employeeName: string | null;
	expiredTime: number;
	isAdmin: boolean;
	refreshExpiredTime: number;
	refreshToken: string;
	tokenType: string;
	userGroupId: string;
	userId: string;
	userName: string;
};
type initType = {
	info: userType;
	isLogged: boolean;
	rememberMe: boolean;
};
const initialState = {};
export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// setUserWhenLogged(state, action: PayloadAction<userType>) {
		// 	state.info = action.payload;
		// 	state.isLogged = true;
		// },
		setUserWhenLogout(state) {
			state = initialState;
		},
		// setRememberMe(state) {
		// 	state.rememberMe = true;
		// },
		setUserLogin(state, action: PayloadAction<userType>) {
			return {
				...state,
				...action.payload,
			};
		},
	},
});
export const userAction = userSlice.actions;
export default userSlice.reducer;
