import { useEffect, useState, useCallback } from 'react'
import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { ShieldCheck, RefreshCw, LogOut, Smartphone, BatteryFull, BatteryMedium, BatteryLow, Wifi, WifiOff, Unlink } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { useChildAppStore } from '@/store/child-app.store'
import { useAuthStore } from '@/store/auth.store'
import { syncUsageNow, syncInstalledApps } from '@/services/collect.service'

export function ChildStatusScreen() {
  const { device, permissions, syncing, syncResult, lastSync, setSyncing, setSyncResult, setLastSync, unpair } = useChildAppStore()
  const { logout } = useAuthStore()
  const [refreshing, setRefreshing] = useState(false)

  const handleSync = useCallback(async () => {
    if (!device) return
    setSyncing(true)
    const usageResult = await syncUsageNow()
    const appsResult = await syncInstalledApps()
    setSyncResult({
      success: usageResult.success && appsResult.success,
      count: usageResult.count + appsResult.count,
    })
    setLastSync(new Date().toLocaleTimeString('fr-FR'))
    setSyncing(false)
  }, [device, setSyncing, setSyncResult, setLastSync])

  const onRefresh = async () => {
    setRefreshing(true)
    await handleSync()
    setRefreshing(false)
  }

  useEffect(() => {
    handleSync()
  }, [handleSync])

  const BatteryIcon = ({ level }: { level: number | null }) => {
    if (level === null) return null
    if (level <= 20) return <BatteryLow size={16} color={colors.red[600]} />
    if (level <= 60) return <BatteryMedium size={16} color={colors.amber[600]} />
    return <BatteryFull size={16} color={colors.emerald[600]} />
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={{ padding: spacing.xl }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ alignItems: 'center', marginBottom: spacing['2xl'] }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: colors.emerald[100],
          justifyContent: 'center', alignItems: 'center',
          marginBottom: spacing.lg,
        }}>
          <ShieldCheck size={40} color={colors.emerald[600]} />
        </View>

        <Text style={{
          fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold',
          color: colors.gray[900], marginBottom: spacing.sm,
        }}>
          Cet appareil est surveillé
        </Text>

        <Text style={{
          fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
          color: colors.gray[500], textAlign: 'center',
        }}>
          {device?.child?.full_name ?? 'Enfant'} — SafeKid est actif
        </Text>
      </View>

      {device && (
        <View style={{
          backgroundColor: colors.gray[50],
          borderRadius: 16,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.gray[200],
        }}>
          <Text style={{
            fontSize: 14, fontFamily: 'SpaceGrotesk_600SemiBold',
            color: colors.gray[900], marginBottom: spacing.md,
          }}>
            Informations de l'appareil
          </Text>

          <InfoRow icon={<Smartphone size={16} color={colors.gray[500]} />} label="Nom" value={device.name} />
          {device.brand ? <InfoRow label="Marque" value={device.brand} /> : null}
          {device.model ? <InfoRow label="Modèle" value={device.model} /> : null}
          {device.os ? <InfoRow label="OS" value={`${device.os}${device.os_version ? ` ${device.os_version}` : ''}`} /> : null}
          {device.app_version ? <InfoRow label="App" value={`v${device.app_version}`} /> : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {device.is_online
                ? <Wifi size={16} color={colors.emerald[600]} />
                : <WifiOff size={16} color={colors.gray[400]} />}
              <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular', color: colors.gray[700] }}>
                Statut
              </Text>
            </View>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 3,
              borderRadius: 8,
              backgroundColor: device.is_online ? colors.emerald[100] : colors.gray[100],
            }}>
              <Text style={{
                fontSize: 12, fontFamily: 'SpaceGrotesk_500Medium',
                color: device.is_online ? colors.emerald[700] : colors.gray[500],
              }}>
                {device.is_online ? 'En ligne' : 'Hors ligne'}
              </Text>
            </View>
          </View>

          {device.battery_level !== null && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <BatteryIcon level={device.battery_level} />
                <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular', color: colors.gray[700] }}>
                  Batterie
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium', color: colors.gray[900] }}>
                {device.battery_level}%
              </Text>
            </View>
          )}

          {device.derniere_synchronisation && (
            <InfoRow
              icon={<RefreshCw size={16} color={colors.gray[500]} />}
              label="Dernière sync"
              value={new Date(device.derniere_synchronisation).toLocaleString('fr-FR')}
            />
          )}
        </View>
      )}

      <View style={{
        backgroundColor: colors.gray[50],
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.gray[200],
      }}>
        <Text style={{
          fontSize: 14, fontFamily: 'SpaceGrotesk_600SemiBold',
          color: colors.gray[900], marginBottom: spacing.md,
        }}>
          Permissions
        </Text>

        <PermissionRow label="Accès aux données d'usage" granted={permissions.usage_access} />
        <PermissionRow label="Localisation en arrière-plan" granted={permissions.location} />
        <PermissionRow label="Notifications" granted={permissions.notifications} />
      </View>

      <View style={{
        backgroundColor: colors.gray[50],
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.gray[200],
      }}>
        <Text style={{
          fontSize: 14, fontFamily: 'SpaceGrotesk_600SemiBold',
          color: colors.gray[900], marginBottom: spacing.md,
        }}>
          Synchronisation
        </Text>

        {lastSync && (
          <Text style={{
            fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
            color: colors.gray[500], marginBottom: spacing.sm,
          }}>
            Dernière sync: {lastSync}
          </Text>
        )}

        {syncResult && (
          <Text style={{
            fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
            color: syncResult.success ? colors.emerald[600] : colors.red[600],
            marginBottom: spacing.sm,
          }}>
            {syncResult.success
              ? `${syncResult.count} session(s) envoyée(s)`
              : 'Échec de la synchronisation'}
          </Text>
        )}

        <Pressable
          onPress={handleSync}
          disabled={syncing}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center',
            paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
            backgroundColor: colors.brand[600],
            borderRadius: 10,
            opacity: pressed ? 0.9 : 1,
            alignSelf: 'flex-start',
          })}
        >
          <RefreshCw size={16} color={colors.white} style={{ marginRight: spacing.sm }} />
          <Text style={{
            fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
            color: colors.white,
          }}>
            {syncing ? 'Synchronisation...' : 'Synchroniser maintenant'}
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: spacing.md }}>
        {device && (
          <Pressable
            onPress={() => unpair()}
            style={({ pressed }) => ({
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              paddingVertical: spacing.md,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Unlink size={18} color={colors.gray[600]} style={{ marginRight: spacing.sm }} />
            <Text style={{
              fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
              color: colors.gray[600],
            }}>
              Désappairer cet appareil
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => logout()}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            paddingVertical: spacing.md,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <LogOut size={18} color={colors.red[600]} style={{ marginRight: spacing.sm }} />
          <Text style={{
            fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
            color: colors.red[600],
          }}>
            Déconnecter
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon}
        <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular', color: colors.gray[700] }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium', color: colors.gray[900] }}>
        {value}
      </Text>
    </View>
  )
}

function PermissionRow({ label, granted }: { label: string; granted: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
      <Text style={{
        fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.gray[700],
      }}>
        {label}
      </Text>
      <View style={{
        paddingHorizontal: 10, paddingVertical: 3,
        borderRadius: 8,
        backgroundColor: granted ? colors.emerald[100] : colors.amber[100],
      }}>
        <Text style={{
          fontSize: 12, fontFamily: 'SpaceGrotesk_500Medium',
          color: granted ? colors.emerald[700] : colors.amber[700],
        }}>
          {granted ? 'Accordé' : 'En attente'}
        </Text>
      </View>
    </View>
  )
}
