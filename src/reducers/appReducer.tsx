import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	header: {
		isOpenMenuMobile: false,
	},
	config: {
		language: '',
	},
	errCode: '',
	isAppLoading: false,
};
export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		//  open close menu mobile
		setOpenMenuMobile(state, action: PayloadAction<boolean>) {
			state.header.isOpenMenuMobile = action.payload;
		},
		setErrCode(state, action: PayloadAction<string>) {
			state.errCode = action.payload;
		},
		setAppLoading(state, action: PayloadAction<boolean>) {
			state.isAppLoading = action.payload;
		},
	},
});
export const appAction = appSlice.actions;
export default appSlice.reducer;
