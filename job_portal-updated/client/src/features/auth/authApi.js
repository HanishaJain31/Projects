import api from '../../api/axiosInstance'

export async function login(credientials){
    try{
        const response = await api.post(`/auth/login`, credientials)
        console.log(response.data)
        return response.data
    }
    catch(error){
        console.error('Login failed:', error)
        throw error;
    }
}

export async function viewProfile(){
    const response = await api.get(`/auth/view-profile`)
    return response.data;
}


export async function signup(formData){
    const response = await api.post(`auth/signup`, formData)
    return response.data
}

export async function editProfile(profileData){
    const response = await api.post(`auth/edit-profile`, profileData)
    return response.data
}

export async function changePassword(passwordData){
    const response = await api.post(`auth/change-password`, passwordData)
    return response.data
}

export async function logout(){
    const response = await api.post(`auth/logout`)
    return response.data
}

