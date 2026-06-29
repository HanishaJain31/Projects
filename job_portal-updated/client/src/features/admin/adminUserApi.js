import api from "../../api/axiosInstance";

export async function viewAllUsers(data) {
    try {
        const response = await api.post('/admin/viewall-users', data)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to fetch users'
    }
}

export async function viewUserById(user_id) {
    try {
        const response = await api.post(`/admin/viewall-users/${user_id}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to fetch user details'
    }
}

export async function updateUserStatus(user_id) {
    try {
        const response = await api.post('/admin/update-userstatus', { user_id })
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to update user status'
    }   
}
