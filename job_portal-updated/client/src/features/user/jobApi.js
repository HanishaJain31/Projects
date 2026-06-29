import api from '../../api/axiosInstance'

export async function viewAllJobs(data){
    const response = await api.post(`/user/viewall-jobs`, data)
    return response.data;
}

export async function viewJobById(id){
    const response = await api.get(`/user/view-job/${id}`)
    return response.data;
}

export async function applyForJob(formData){
    const response = await api.post(`/user/apply-for-job`, formData)
    return response.data;
}
