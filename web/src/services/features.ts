import { AxiosResponse } from "axios"
import { API } from "../utils/Api"

interface IFeatures {
  id: number
  created_at: Date
  feature_name: string
  user_id: number
  access: string
  active: Boolean
  enabled: Boolean
}

export const fetchFeatures = async (): Promise<AxiosResponse<IFeatures[]>> => {
  return await API.get(`/admin/feature`)
}

export const createFeatures = async (values: any) => {
  return API.post(`/admin/feature/create`, values)
}

export const updateFeatures = async (values: any) => {
  return API.patch(`/admin/feature/update`, values)
}

export const createUserFeatures = async (values: any) => {
  return API.post(`/admin/feature/user/create`, values)
}
