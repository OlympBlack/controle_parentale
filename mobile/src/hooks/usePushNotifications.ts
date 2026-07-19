import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

export function usePushNotifications() {
  useEffect(() => {
    if (!Device.isDevice) return

    async function register() {
      const { status: existing } = await Notifications.getPermissionsAsync()
      let finalStatus = existing

      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') return

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'safekid-mobile',
      })

      // TODO: Send token to backend for push notification registration
      console.log('Push token:', token.data)
    }

    void register()

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'SafeKid Alerts',
        importance: Notifications.AndroidImportance.HIGH,
      })
    }
  }, [])
}
