import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { deviceService } from './device.service'
import { SECURE_STORE_KEYS } from '@/constants/config'
import UsageAccess from '../../modules/expo-usage-access'

const LOCATION_TASK_NAME = 'safekid-background-location'

// ─── Background location task ───────────────────────────────────────────────

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('[SafeKid] Location task error:', error)
    return
  }
  if (data instanceof Object && 'locations' in data) {
    const locations = (data as { locations: Location.LocationObject[] }).locations
    const last = locations[locations.length - 1]
    if (!last) return

    const deviceId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
    if (!deviceId) return

    try {
      await deviceService.sendLocation(Number(deviceId), {
        latitude: last.coords.latitude,
        longitude: last.coords.longitude,
        precision_metres: last.coords.accuracy ?? undefined,
        captured_at: new Date(last.timestamp).toISOString(),
      })
    } catch (e) {
      console.error('[SafeKid] Failed to send location:', e)
    }
  }
})

// ─── Location helpers ───────────────────────────────────────────────────────

export async function requestLocationPermissions(): Promise<boolean> {
  const { status: foreground } = await Location.requestForegroundPermissionsAsync()
  if (foreground !== 'granted') return false

  const { status: background } = await Location.requestBackgroundPermissionsAsync()
  return background === 'granted'
}

export async function startBackgroundLocation(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
  if (isRegistered) return

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 15 * 60 * 1000, // 15 minutes
    distanceInterval: 100, // 100 meters
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'SafeKid — Surveillance active',
      notificationBody: 'Suivi de position en cours',
      notificationColor: '#3b5bf9',
    },
  })
}

export async function stopBackgroundLocation(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
  }
}

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync()
    if (status !== 'granted') return null
    return await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
  } catch {
    return null
  }
}

// ─── Usage collection ───────────────────────────────────────────────────────

export interface UsageStat {
  packageName: string
  appName: string
  totalTimeInForeground: number
  lastTimeUsed: number
}

export async function checkUsageAccessPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false
  try {
    return await UsageAccess.checkUsageAccessPermission()
  } catch {
    return false
  }
}

export async function openUsageAccessSettings(): Promise<void> {
  await UsageAccess.openUsageAccessSettings()
}

export async function syncUsageNow(): Promise<{ success: boolean; count: number }> {
  try {
    if (Platform.OS !== 'android') return { success: false, count: 0 }
    const hasPermission = await UsageAccess.checkUsageAccessPermission()
    if (!hasPermission) return { success: false, count: 0 }

    const now = Date.now()
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const stats = await UsageAccess.getUsageStats(startOfDay.getTime(), now)
    if (stats.length === 0) return { success: true, count: 0 }

    const deviceId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
    if (!deviceId) return { success: false, count: 0 }

    const sessions = stats.map((stat: UsageStat) => ({
      package_name: stat.packageName,
      nom_application: stat.appName,
      duree_secondes: Math.floor(stat.totalTimeInForeground / 1000),
      date_utilisation: new Date().toISOString().split('T')[0],
    }))

    await deviceService.sendUsage(Number(deviceId), sessions)
    return { success: true, count: sessions.length }
  } catch (e) {
    console.error('[SafeKid] syncUsageNow error:', e)
    return { success: false, count: 0 }
  }
}
