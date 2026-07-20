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
    const deviceId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
    if (!deviceId) {
      console.warn('[SafeKid] syncUsageNow: no device ID')
      return { success: false, count: 0 }
    }

    let sessions: { package_name: string; nom_application: string; duree_secondes: number; date_utilisation: string }[] = []

    if (Platform.OS === 'android' && UsageAccess.isAvailable()) {
      const hasPermission = await UsageAccess.checkUsageAccessPermission()
      if (!hasPermission) {
        console.warn('[SafeKid] syncUsageNow: usage access not granted')
        return { success: false, count: 0 }
      }

      const now = Date.now()
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      const stats = await UsageAccess.getUsageStats(startOfDay.getTime(), now)
      sessions = stats.map((stat: UsageStat) => ({
        package_name: stat.packageName,
        nom_application: stat.appName,
        duree_secondes: Math.floor(stat.totalTimeInForeground / 1000),
        date_utilisation: new Date().toISOString().split('T')[0],
      }))
    } else {
      // ─── Demo mode (Expo Go / no native module) ───────────────────────────
      console.log('[SafeKid] syncUsageNow: using demo data (native module unavailable)')
      const demoApps = [
        { package_name: 'com.whatsapp',         nom_application: 'WhatsApp',  duree: 1200 },
        { package_name: 'com.youtube.app',      nom_application: 'YouTube',   duree: 3600 },
        { package_name: 'com.android.chrome',   nom_application: 'Chrome',    duree: 900 },
        { package_name: 'com.instagram.android', nom_application: 'Instagram', duree: 1800 },
        { package_name: 'com.spotify.music',    nom_application: 'Spotify',   duree: 600 },
      ]
      const today = new Date().toISOString().split('T')[0]
      sessions = demoApps.map((app) => ({
        package_name: app.package_name,
        nom_application: app.nom_application,
        duree_secondes: app.duree + Math.floor(Math.random() * 300),
        date_utilisation: today,
      }))
    }

    if (sessions.length === 0) return { success: true, count: 0 }

    try {
      await deviceService.sendUsage(Number(deviceId), sessions)
      console.log('[SafeKid] syncUsageNow: success,', sessions.length, 'sessions sent')
      return { success: true, count: sessions.length }
    } catch (e: any) {
      if (e?.response?.status === 404) {
        console.warn('[SafeKid] syncUsageNow: device not found (404), clearing stored IDs')
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.CHILD_ID)
      }
      throw e
    }
  } catch (e) {
    console.error('[SafeKid] syncUsageNow error:', e)
    return { success: false, count: 0 }
  }
}

export async function syncInstalledApps(): Promise<{ success: boolean; count: number }> {
  try {
    const deviceId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
    if (!deviceId) {
      console.warn('[SafeKid] syncInstalledApps: no device ID')
      return { success: false, count: 0 }
    }

    let apps: { package_name: string; name: string; version: string; is_system_app: boolean }[] = []

    if (Platform.OS === 'android' && UsageAccess.isAvailable()) {
      const installed = await UsageAccess.getInstalledApps()
      apps = installed.map((app) => ({
        package_name: app.packageName,
        name: app.name,
        version: app.version,
        is_system_app: app.isSystemApp,
      }))
    } else {
      // ─── Demo mode (Expo Go / no native module) ───────────────────────────
      console.log('[SafeKid] syncInstalledApps: using demo data (native module unavailable)')
      apps = [
        { package_name: 'com.whatsapp',         name: 'WhatsApp',  version: '1.0.0', is_system_app: false },
        { package_name: 'com.youtube.app',      name: 'YouTube',   version: '2.0.0', is_system_app: false },
        { package_name: 'com.android.chrome',   name: 'Chrome',    version: '3.0.0', is_system_app: false },
        { package_name: 'com.instagram.android', name: 'Instagram', version: '4.0.0', is_system_app: false },
        { package_name: 'com.spotify.music',    name: 'Spotify',   version: '5.0.0', is_system_app: false },
      ]
    }

    if (apps.length === 0) return { success: true, count: 0 }

    await deviceService.sendInstalledApps(Number(deviceId), apps)
    console.log('[SafeKid] syncInstalledApps: success,', apps.length, 'apps sent')
    return { success: true, count: apps.length }
  } catch (e: any) {
    console.error('[SafeKid] syncInstalledApps error:', e?.response?.status, e?.response?.data ?? e?.message)
    if (e?.response?.status === 404) {
      console.warn('[SafeKid] syncInstalledApps: device not found (404), clearing stored IDs')
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.CHILD_ID)
    }
    return { success: false, count: 0 }
  }
}
