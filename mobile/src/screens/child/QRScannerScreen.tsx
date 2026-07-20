import { useState, useRef } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { X, ScanLine } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

interface QRScannerScreenProps {
  onScanned: (code: string) => void
  onClose: () => void
}

export function QRScannerScreen({ onScanned, onClose }: QRScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const cameraRef = useRef<CameraView>(null)

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return
    setScanned(true)
    onScanned(data)
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Demande de permission caméra...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
          <ScanLine size={48} color={colors.gray[400]} style={{ marginBottom: spacing.lg }} />
          <Text style={[styles.message, { marginBottom: spacing.lg, textAlign: 'center' }]}>
            La caméra est nécessaire pour scanner le code QR d'appairage.
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => ({
              backgroundColor: colors.brand[600],
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
              borderRadius: 10,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ color: colors.white, fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium' }}>
              Autoriser la caméra
            </Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            style={{ marginTop: spacing.lg }}
          >
            <Text style={{ color: colors.gray[500], fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular' }}>
              Retour
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center', alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <X size={22} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Scanner le code QR</Text>
        <View style={{ width: 40 }} />
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.scanHint}>
          Placez le code QR d'appairage dans le cadre
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  message: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk_400Regular',
    color: colors.gray[400],
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    color: colors.white,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  scanHint: {
    marginTop: spacing.lg,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk_400Regular',
    color: colors.white,
    textAlign: 'center',
  },
})
