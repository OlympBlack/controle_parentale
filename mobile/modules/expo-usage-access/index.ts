import { NativeModulesProxy, requireNativeModule } from 'expo-modules-core'

export interface UsageStat {
  packageName: string
  appName: string
  totalTimeInForeground: number
  lastTimeUsed: number
}

declare class ExpoUsageAccessModule {
  checkUsageAccessPermission(): Promise<boolean>
  openUsageAccessSettings(): Promise<void>
  getUsageStats(startTime: number, endTime: number): Promise<UsageStat[]>
}

const module = requireNativeModule<ExpoUsageAccessModule>('ExpoUsageAccess')

export const UsageAccess = {
  checkUsageAccessPermission: () => module.checkUsageAccessPermission(),
  openUsageAccessSettings: () => module.openUsageAccessSettings(),
  getUsageStats: (startTime: number, endTime: number) =>
    module.getUsageStats(startTime, endTime),
}

export default UsageAccess
