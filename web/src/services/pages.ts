import { AxiosResponse } from "axios"
import { API } from "../utils/Api"

interface IPages {
  id: number
  created_at: Date
  url: string
  page_features: any
}

export const fetchFeatures = async (): Promise<AxiosResponse<IPages[]>> => {
  return await API.get(`/admin/pages`)
}

export const createFeatures = async (values: any) => {
  return API.post(`/admin/pages/create`, values)
}

export const updateFeatures = async (values: any) => {
  return API.patch(`/admin/pages/update`, values)
}

