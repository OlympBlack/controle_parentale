import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Smartphone, Shield, Clock, BarChart3, AlertCircle } from 'lucide-react-native'
import { useRoute, type RouteProp } from '@react-navigation/native'
import type { AppStackParamList } from '@/navigation/AppNavigator'
import { childService } from '@/services/child.service'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import type { Child } from '@/types'

export function ChildDetailScreen() {
  const route = useRoute<RouteProp<AppStackParamList, 'ChildDetail'>>()
  const { childId } = route.params

  const [child, setChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await childService.get(childId)
      setChild(data)
    } catch {
      setError('Impossible de charger les détails.')
    } finally {
      setLoading(false)
    }
  }, [childId])

  useEffect(() => { void load() }, [load])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray[50] }}>
        <ActivityIndicator size="large" color={colors.brand[600]} />
      </View>
    )
  }

  if (error || !child) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray[50], padding: spacing.xl }}>
        <AlertCircle size={40} color={colors.red[500]} />
        <Text style={{ fontSize: 15, color: colors.gray[500], marginTop: spacing.md, textAlign: 'center' }}>
          {error || 'Enfant introuvable.'}
        </Text>
      </View>
    )
  }

  const scoreColor = (score: number | null) => {
    if (score === null) return colors.gray[300]
    if (score >= 70) return colors.emerald[600]
    if (score >= 40) return colors.amber[600]
    return colors.red[600]
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <SafeAreaView edges={['bottom']} style={{ padding: spacing.xl }}>
        {/* Profile header */}
        <Card variant="gradient" style={{ alignItems: 'center', marginBottom: spacing.lg }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: colors.brand[600],
            justifyContent: 'center', alignItems: 'center',
          }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.white }}>
              {(child.full_name || child.first_name).split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.gray[900], marginTop: spacing.md }}>
            {child.full_name || child.first_name}
          </Text>
          {child.birth_date && (
            <Text style={{ fontSize: 13, color: colors.gray[500], marginTop: 2 }}>
              Né(e) le {new Date(child.birth_date).toLocaleDateString('fr-FR')}
            </Text>
          )}
          <View style={{ marginTop: spacing.sm }}>
            <Badge
              label={child.status === 'active' ? 'Actif' : child.status === 'paused' ? 'En pause' : 'Archivé'}
              color={child.status === 'active' ? 'green' : child.status === 'paused' ? 'amber' : 'gray'}
            />
          </View>
        </Card>

        {/* Digital health score */}
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.purple[50], justifyContent: 'center', alignItems: 'center' }}>
                <BarChart3 size={20} color={colors.purple[600]} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.gray[700] }}>Santé digitale</Text>
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: scoreColor(child.digital_health_score) }}>
              {child.digital_health_score ?? '—'}
              {child.digital_health_score !== null && <Text style={{ fontSize: 14, color: colors.gray[400] }}>/100</Text>}
            </Text>
          </View>
        </Card>

        {/* Quick stats grid */}
        <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
          <Card style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.blue[50], justifyContent: 'center', alignItems: 'center' }}>
              <Smartphone size={18} color={colors.blue[600]} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.gray[900], marginTop: spacing.sm }}>
              {child.devices_count ?? 0}
            </Text>
            <Text style={{ fontSize: 12, color: colors.gray[500] }}>Appareils</Text>
          </Card>

          <Card style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.brand[50], justifyContent: 'center', alignItems: 'center' }}>
              <Shield size={18} color={colors.brand[600]} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.gray[900], marginTop: spacing.sm }}>—</Text>
            <Text style={{ fontSize: 12, color: colors.gray[500] }}>Règles</Text>
          </Card>

          <Card style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.amber[50], justifyContent: 'center', alignItems: 'center' }}>
              <Clock size={18} color={colors.amber[600]} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.gray[900], marginTop: spacing.sm }}>—</Text>
            <Text style={{ fontSize: 12, color: colors.gray[500] }}>Temps écran</Text>
          </Card>
        </View>

        {/* Maturity level */}
        {child.maturity_level && (
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={{ fontSize: 13, color: colors.gray[500] }}>Niveau de maturité</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.gray[900], marginTop: 4 }}>
              {child.maturity_level === 'enfant' ? 'Enfant' : child.maturity_level === 'preado' ? 'Pré-ado' : 'Adolescent'}
            </Text>
          </Card>
        )}
      </SafeAreaView>
    </ScrollView>
  )
}
