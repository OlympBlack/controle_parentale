import { View, Text, Pressable, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User, Mail, LogOut, ChevronRight, Smartphone } from 'lucide-react-native'
import { useAuthStore } from '@/store/auth.store'
import { useChildAppStore } from '@/store/child-app.store'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

interface ProfileScreenProps {
  onLogout?: () => void
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const { user, logout } = useAuthStore()
  const { unpair, device } = useChildAppStore()

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            await unpair()
            await logout()
            onLogout?.()
          },
        },
      ]
    )
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
        {/* Profile header */}
        <View style={{ alignItems: 'center', marginBottom: spacing['2xl'] }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: colors.brand[600],
            justifyContent: 'center', alignItems: 'center',
            marginBottom: spacing.md,
          }}>
            <Text style={{
              fontSize: 28, fontFamily: 'SpaceGrotesk_700Bold',
              color: colors.white,
            }}>
              {initials}
            </Text>
          </View>

          <Text style={{
            fontSize: 20, fontFamily: 'SpaceGrotesk_600SemiBold',
            color: colors.gray[900],
          }}>
            {user?.name ?? 'Utilisateur'}
          </Text>

          <Text style={{
            fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
            color: colors.gray[500], marginTop: 2,
          }}>
            {user?.email}
          </Text>

          {user?.role && (
            <View style={{
              marginTop: spacing.sm,
              paddingHorizontal: 12, paddingVertical: 4,
              backgroundColor: colors.brand[100],
              borderRadius: 8,
            }}>
              <Text style={{
                fontSize: 12, fontFamily: 'SpaceGrotesk_500Medium',
                color: colors.brand[700],
                textTransform: 'capitalize',
              }}>
                {user.role}
              </Text>
            </View>
          )}
        </View>

        {/* Account info */}
        <View style={{
          backgroundColor: colors.white,
          borderRadius: 16,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.gray[200],
          overflow: 'hidden',
        }}>
          <Text style={{
            fontSize: 13, fontFamily: 'SpaceGrotesk_600SemiBold',
            color: colors.gray[400],
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
            textTransform: 'uppercase',
          }}>
            Compte
          </Text>

          <InfoRow icon={<User size={18} color={colors.gray[500]} />} label="Nom" value={user?.name ?? '-'} />
          <InfoRow icon={<Mail size={18} color={colors.gray[500]} />} label="Email" value={user?.email ?? '-'} />
          {user?.phone && (
            <InfoRow icon={<Mail size={18} color={colors.gray[500]} />} label="Téléphone" value={user.phone} />
          )}
        </View>

        {/* Device info (child mode) */}
        {device && (
          <View style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.gray[200],
            overflow: 'hidden',
          }}>
            <Text style={{
              fontSize: 13, fontFamily: 'SpaceGrotesk_600SemiBold',
              color: colors.gray[400],
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: spacing.sm,
              textTransform: 'uppercase',
            }}>
              Appareil appairé
            </Text>

            <InfoRow icon={<Smartphone size={18} color={colors.gray[500]} />} label="Nom" value={device.name} />
            {device.brand && <InfoRow label="Marque" value={device.brand} />}
            {device.model && <InfoRow label="Modèle" value={device.model} />}
            {device.os && <InfoRow label="OS" value={`${device.os}${device.os_version ? ` ${device.os_version}` : ''}`} />}
            {device.status && <InfoRow label="Statut" value={device.status} />}
          </View>
        )}

        {/* Actions */}
        <View style={{
          backgroundColor: colors.white,
          borderRadius: 16,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.gray[200],
          overflow: 'hidden',
        }}>
          <ActionRow
            icon={<LogOut size={18} color={colors.red[600]} />}
            label="Déconnexion"
            labelColor={colors.red[600]}
            onPress={handleLogout}
          />
        </View>

        <Text style={{
          fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
          color: colors.gray[400], textAlign: 'center',
          marginTop: spacing.lg,
        }}>
          SafeKid v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {icon}
        <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular', color: colors.gray[600] }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium', color: colors.gray[900] }}>
        {value}
      </Text>
    </View>
  )
}

function ActionRow({
  icon, label, labelColor, onPress,
}: {
  icon: React.ReactNode
  label: string
  labelColor?: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {icon}
      <Text style={{
        flex: 1, marginLeft: 10,
        fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
        color: labelColor ?? colors.gray[900],
      }}>
        {label}
      </Text>
      <ChevronRight size={18} color={colors.gray[300]} />
    </Pressable>
  )
}
