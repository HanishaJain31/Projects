//Auth slice fetching api from authApi.js

import { editProfile, login, signup, viewProfile, changePassword, logout } from './authApi'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    token: null,
    role: null,
    profile: null,
    registeredUser: null,
    isLoading: false,
    error: null
}

function getAuthData(payload) {
    const data = payload?.data || payload || {}
    const userDetail = data.userDetail || null
    const token = data.token || userDetail?.auth_token || null
    const role = userDetail?.role || null

    return { userDetail, token, role }
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await login(credentials)
            if (response.code !== '1') {
                return rejectWithValue(response.message || "Login failed")
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Login failed")
        }
    }
)

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await viewProfile();
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch profile")
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await signup(formData);
            if (response.code !== '1') {
                return rejectWithValue(response.message || "Signup failed")
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Signup failed")
        }
    }
)

export const editUserProfile = createAsyncThunk(
    'auth/editUserProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await editProfile(profileData);
            if (response.code !== '1') {
                return rejectWithValue(response.message || "Profile update failed")
            }
            return response;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || "Profile update failed")
        }
    }
)

export const editPassword = createAsyncThunk(
    'auth/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await changePassword(passwordData);
            if (response.code !== '1') {
                return rejectWithValue(response.message || "Password change failed")
            }
            return response;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || "Password change failed")
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await logout();
            if (response.code !== '1') {
                return rejectWithValue(response.message || "Logout failed")
            }
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            return response;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || "Logout failed")
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action.payload)
                const { userDetail, token, role } = getAuthData(action.payload)
                
                state.isLoading = false
                state.user = userDetail
                state.token = token
                state.role = role

                if (userDetail) localStorage.setItem('user', JSON.stringify(userDetail))
                if (token) localStorage.setItem('token', token)
                if (role) localStorage.setItem('role', role)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.profile = action.payload.data?.[0] || null
                state.error = null
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log('Signup payload:', action.payload)
                const { userDetail, token, role } = getAuthData(action.payload)

                state.isLoading = false
                state.registeredUser = userDetail
                state.user = userDetail
                state.token = token
                state.role = role
                state.profile = userDetail

                if (userDetail) localStorage.setItem('user', JSON.stringify(userDetail))
                if (token) localStorage.setItem('token', token)
                if (role) localStorage.setItem('role', role)

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(editUserProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(editUserProfile.fulfilled, (state, action) => {
                console.log('Edit profile payload:', action.payload)
                const { userDetail } = getAuthData(action.payload)
                
                state.isLoading = false
                state.profile = userDetail || state.profile
                state.user = userDetail || state.user
                
                if (userDetail) {
                    localStorage.setItem('user', JSON.stringify(userDetail))
                }
            })
            .addCase(editUserProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(editPassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(editPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.message || "Password changed successfully"
            })
            .addCase(editPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false
                state.user = null
                state.token = null
                state.role = null
                state.profile = null
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export default authSlice.reducer
