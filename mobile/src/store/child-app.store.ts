import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
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
        name: `Appareil de ${child.first_name}`,
        type: 'mobile',
        os: 'android',
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
        // Device may not exist yet
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
