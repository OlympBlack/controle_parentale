import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import * as DeviceInfo from 'expo-device'
import * as Battery from 'expo-battery'
import { Platform } from 'react-native'
import { SECURE_STORE_KEYS } from '@/constants/config'
import { deviceService } from '@/services/device.service'
import type { Child, Device } from '@/types'

interface ChildAppState {
  selectedChild: Child | null
  deviceId: number | null
  device: Device | null
  permissions: {
    usage_access: boolean
    location: boolean
    notifications: boolean
  }
  syncing: boolean
  lastSync: string | null
  syncResult: { success: boolean; count: number } | null

  setChild: (child: Child) => void
  registerDevice: (child: Child) => Promise<boolean>
  pairDevice: (token: string) => Promise<boolean>
  unpair: () => Promise<void>
  updatePermission: (key: string, value: boolean) => void
  syncPermissionsToBackend: () => Promise<void>
  setSyncing: (v: boolean) => void
  setSyncResult: (r: { success: boolean; count: number } | null) => void
  setLastSync: (date: string) => void
  loadStoredDevice: () => Promise<void>
  reset: () => Promise<void>
}

export const useChildAppStore = create<ChildAppState>((set, get) => ({
  selectedChild: null,
  deviceId: null,
  device: null,
  permissions: {
    usage_access: false,
    location: false,
    notifications: false,
  },
  syncing: false,
  lastSync: null,
  syncResult: null,

  setChild: (child) => set({ selectedChild: child }),

  registerDevice: async (child) => {
    try {
      const deviceToken = `${child.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const device = await deviceService.create({
        child_id: child.id,
        name: DeviceInfo.deviceName || `Appareil de ${child.first_name}`,
        type: Platform.OS === 'ios' ? 'mobile' : (DeviceInfo.deviceType === 2 ? 'tablette' : 'mobile'),
        brand: DeviceInfo.brand || undefined,
        model: DeviceInfo.modelName || undefined,
        os: Platform.OS,
        os_version: DeviceInfo.osVersion || undefined,
        app_version: '1.0.0',
        device_token: deviceToken,
      })

      await SecureStore.setItemAsync(SECURE_STORE_KEYS.DEVICE_ID, String(device.id))
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.CHILD_ID, String(child.id))
      set({ deviceId: device.id, device, selectedChild: child })
      return true
    } catch (e) {
      console.error('[ChildApp] registerDevice error:', e)
      return false
    }
  },

  updatePermission: (key, value) =>
    set((state) => ({
      permissions: { ...state.permissions, [key]: value },
    })),

  pairDevice: async (token) => {
    try {
      const batteryLevel = await Battery.getBatteryLevelAsync()

      const device = await deviceService.pair({
        pairing_code: token.trim().toUpperCase(),
        name: DeviceInfo.deviceName || undefined,
        brand: DeviceInfo.brand || undefined,
        model: DeviceInfo.modelName || undefined,
        os: Platform.OS,
        os_version: DeviceInfo.osVersion || undefined,
        app_version: '1.0.0',
        battery_level: batteryLevel >= 0 ? Math.round(batteryLevel * 100) : null,
      })

      await SecureStore.setItemAsync(SECURE_STORE_KEYS.DEVICE_ID, String(device.id))
      if (device.child_id) {
        await SecureStore.setItemAsync(SECURE_STORE_KEYS.CHILD_ID, String(device.child_id))
      }
      const perms = device.permissions_accordees ?? {
        usage_access: false,
        location: false,
        notifications: false,
      }
      set({
        deviceId: device.id,
        device,
        permissions: {
          usage_access: perms.usage_access ?? false,
          location: perms.location ?? false,
          notifications: perms.notifications ?? false,
        },
      })
      return true
    } catch (e) {
      console.error('[ChildApp] pairDevice error:', e)
      return false
    }
  },

  unpair: async () => {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.CHILD_ID)
    set({
      selectedChild: null,
      deviceId: null,
      device: null,
      permissions: { usage_access: false, location: false, notifications: false },
      syncing: false,
      lastSync: null,
      syncResult: null,
    })
  },

  syncPermissionsToBackend: async () => {
    const { deviceId, permissions } = get()
    if (!deviceId) return
    try {
      const updated = await deviceService.updatePermissions(deviceId, permissions)
      set({ device: updated })
    } catch (e) {
      console.error('[ChildApp] syncPermissions error:', e)
    }
  },

  setSyncing: (v) => set({ syncing: v }),
  setSyncResult: (r) => set({ syncResult: r }),
  setLastSync: (date) => set({ lastSync: date }),

  loadStoredDevice: async () => {
    const storedDeviceId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
    const storedChildId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.CHILD_ID)
    if (storedDeviceId && storedChildId) {
      try {
        const device = await deviceService.get(Number(storedDeviceId))
        const perms = device.permissions_accordees ?? {
          usage_access: false,
          location: false,
          notifications: false,
        }
        set({
          deviceId: Number(storedDeviceId),
          device,
          permissions: {
            usage_access: perms.usage_access ?? false,
            location: perms.location ?? false,
            notifications: perms.notifications ?? false,
          },
        })
      } catch {
        // Device no longer exists in backend — clear stale IDs
        console.warn('[ChildApp] loadStoredDevice: device not found, clearing IDs')
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.CHILD_ID)
      }
    }
  },

  reset: async () => {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.DEVICE_ID)
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.CHILD_ID)
    set({
      selectedChild: null,
      deviceId: null,
      device: null,
      permissions: { usage_access: false, location: false, notifications: false },
      syncing: false,
      lastSync: null,
      syncResult: null,
    })
  },
}))
