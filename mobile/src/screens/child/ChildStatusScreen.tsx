import { useEffect, useState, useCallback } from 'react'
import { View, Text, Pressable, RefreshControl, ScrollView } from 'react-native'
import { ShieldCheck, RefreshCw, LogOut } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { useChildAppStore } from '@/store/child-app.store'
import { useAuthStore } from '@/store/auth.store'
import { syncUsageNow } from '@/services/collect.service'

export function ChildStatusScreen() {
  const { selectedChild, permissions, syncing, syncResult, lastSync, setSyncing, setSyncResult, setLastSync } = useChildAppStore()
  const { logout } = useAuthStore()
  const [refreshing, setRefreshing] = useState(false)

  const handleSync = useCallback(async () => {
    setSyncing(true)
    const result = await syncUsageNow()
    setSyncResult(result)
    setLastSync(new Date().toLocaleTimeString('fr-FR'))
    setSyncing(false)
  }, [setSyncing, setSyncResult, setLastSync])

  const onRefresh = async () => {
    setRefreshing(true)
    await handleSync()
    setRefreshing(false)
  }

  useEffect(() => {
    handleSync()
  }, [handleSync])

  const allGranted = permissions.usage_access && permissions.location

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
          {selectedChild?.full_name ?? 'Enfant'} — SafeKid est actif
        </Text>
      </View>

      {/* Permissions status */}
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

        <PermissionRow
          label="Accès aux données d'usage"
          granted={permissions.usage_access}
        />
        <PermissionRow
          label="Localisation en arrière-plan"
          granted={permissions.location}
        />
        <PermissionRow
          label="Notifications"
          granted={permissions.notifications}
        />
      </View>

      {/* Sync status */}
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

      {/* Logout */}
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
          Déconnecter cet appareil
        </Text>
      </Pressable>
    </ScrollView>
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
