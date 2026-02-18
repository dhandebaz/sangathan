export interface MaintenanceStatus {
  enabled: boolean
  message: string
}

export async function checkMaintenanceMode(): Promise<MaintenanceStatus> {
  return { enabled: false, message: '' }
}
