import api from "../../api/axiosInstance";

export async function viewAllApplications(data) {
    try {
        const response = await api.post('/admin/viewall-applications', data)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to fetch applications'
    }
}

export async function updateApplicationStatus(application_id, status) {
    try {
        const response = await api.post('/admin/update-applicationstatus', { application_id, status })
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Failed to update application status'
    }
}
