import api from "../../api/axiosInstance"

export async function dashboardStats() {
    try {
        const response = await api.get('/admin/dashboard-stats')
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to fetch dashboard stats'
    }
}