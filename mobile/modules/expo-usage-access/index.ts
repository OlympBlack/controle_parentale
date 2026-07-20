export interface UsageStat {
  packageName: string
  appName: string
  totalTimeInForeground: number
  lastTimeUsed: number
}

export interface ExpoUsageAccessModuleType {
  checkUsageAccessPermission(): Promise<boolean>
  openUsageAccessSettings(): Promise<void>
  getUsageStats(startTime: number, endTime: number): Promise<UsageStat[]>
}

let nativeModule: ExpoUsageAccessModuleType | null = null
let loadAttempted = false

function getNativeModule(): ExpoUsageAccessModuleType | null {
  if (loadAttempted) return nativeModule
  loadAttempted = true
  try {
    const { requireNativeModule } = require('expo-modules-core')
    nativeModule = requireNativeModule('ExpoUsageAccess') as ExpoUsageAccessModuleType
  } catch (e) {
    console.warn('[expo-usage-access] Native module not available:', e)
    nativeModule = null
  }
  return nativeModule
}

export const UsageAccess = {
  isAvailable(): boolean {
    return getNativeModule() !== null
  },

  async checkUsageAccessPermission(): Promise<boolean> {
    const mod = getNativeModule()
    if (!mod) return false
    return mod.checkUsageAccessPermission()
  },

  async openUsageAccessSettings(): Promise<void> {
    const mod = getNativeModule()
    if (!mod) throw new Error('Usage Access module not available')
    return mod.openUsageAccessSettings()
  },

  async getUsageStats(startTime: number, endTime: number): Promise<UsageStat[]> {
    const mod = getNativeModule()
    if (!mod) return []
    return mod.getUsageStats(startTime, endTime)
  },
}

export default UsageAccess
