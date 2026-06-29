import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { updateUserStatus, viewAllUsers, viewUserById } from "./adminUserApi"

const initialState = {
    users: [],
    user: null,
    isLoading: false,
    error: null,
    total: 0
}

export const fetchAllUsers = createAsyncThunk(
    'admin/fetchAllUsers',
    async (data, { rejectWithValue }) => {
        try {
            return await viewAllUsers(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to fetch users')
        }   
    }
)

export const fetchUserById = createAsyncThunk(
    'admin/fetchUserById',
    async (user_id, { rejectWithValue }) => {
        try {
            return await viewUserById(user_id)
        } catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to fetch user details')
        }
    }
)

export const updateUserStatusById = createAsyncThunk(
    'admin/updateUserStatusById',
    async(user_id, { rejectWithValue }) => {
        try {
            return await updateUserStatus(user_id)
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error || 'Failed to update user status')
        }   
        }
)

const adminUserSlice = createSlice({
    name: 'adminUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })  
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.users = action.payload.data?.users || []
                state.total = action.payload.data?.total || action.payload.data?.users?.length || 0
                state.error = null
            }
            )
            .addCase(fetchUserById.pending, (state) => {
                state.isLoading = true  
                state.error = null
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.data || null
                state.error = null
            })
            .addCase(updateUserStatusById.pending, (state) => {
                state.isLoading = true      
                state.error = null
            })  
            .addCase(updateUserStatusById.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload?.code !== '1') {
                    state.error = action.payload
                    return
                }
                const updatedUserId = action.meta.arg
                state.users = state.users.map((user) =>
                    user.id === updatedUserId ? { ...user, is_active: user.is_active ? 0 : 1 } : user
                )
                if (state.user && state.user.id === updatedUserId) {
                    state.user = { ...state.user, is_active: state.user.is_active ? 0 : 1 }
                }   
                state.error = null
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(updateUserStatusById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export default adminUserSlice.reducer
