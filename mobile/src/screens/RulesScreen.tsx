import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Shield, Clock, Timer, Moon, BookOpen, Coffee, Globe, Search, Tag, AppWindow } from 'lucide-react-native'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

const RULE_TYPES = [
  { type: 'Quota quotidien', icon: Timer,   color: colors.blue[600],   bg: colors.blue[50],   desc: 'Limite de temps par jour' },
  { type: 'Plage horaire',   icon: Clock,  color: colors.emerald[600], bg: colors.emerald[50], desc: 'Heures autorisées' },
  { type: 'Heure de coucher', icon: Moon,  color: colors.purple[600],  bg: colors.purple[50],  desc: 'Coupure à heure fixe' },
  { type: 'Devoirs',         icon: BookOpen, color: colors.amber[600], bg: colors.amber[50],   desc: 'Blocage pendant les devoirs' },
  { type: 'Pause',           icon: Coffee,  color: colors.amber[600], bg: colors.amber[50], desc: 'Temps de pause obligatoire' },
]

const FILTER_TYPES = [
  { type: 'Domaine',    icon: Globe,     desc: 'Bloquer/Autoriser un domaine' },
  { type: 'Mot-clé',    icon: Search,    desc: 'Filtrer par mot-clé' },
  { type: 'Catégorie',  icon: Tag,       desc: 'Bloquer par catégorie de contenu' },
  { type: 'Application', icon: AppWindow, desc: 'Contrôler des apps spécifiques' },
]

export function RulesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
        {/* Header */}
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.gray[900] }}>
          Règles
        </Text>
        <Text style={{ fontSize: 14, color: colors.gray[500], marginTop: 4, marginBottom: spacing.xl }}>
          Configuration du temps d'écran et du filtrage
        </Text>

        {/* Screen time rules section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
          <Clock size={20} color={colors.brand[600]} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray[900] }}>
            Temps d'écran
          </Text>
        </View>

        <View style={{ marginBottom: spacing.xl }}>
          {RULE_TYPES.map((rule, i) => {
            const Icon = rule.icon
            return (
              <Card key={i} style={{ marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: rule.bg, justifyContent: 'center', alignItems: 'center' }}>
                  <Icon size={22} color={rule.color} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.gray[900] }}>{rule.type}</Text>
                  <Text style={{ fontSize: 13, color: colors.gray[500], marginTop: 2 }}>{rule.desc}</Text>
                </View>
                <Badge label="Bientôt" color="gray" />
              </Card>
            )
          })}
        </View>

        {/* Filter rules section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
          <Shield size={20} color={colors.brand[600]} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray[900] }}>
            Filtrage de contenu
          </Text>
        </View>

        <View style={{ marginBottom: spacing.xl }}>
          {FILTER_TYPES.map((rule, i) => {
            const Icon = rule.icon
            return (
              <Card key={i} style={{ marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.brand[50], justifyContent: 'center', alignItems: 'center' }}>
                  <Icon size={22} color={colors.brand[600]} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.gray[900] }}>{rule.type}</Text>
                  <Text style={{ fontSize: 13, color: colors.gray[500], marginTop: 2 }}>{rule.desc}</Text>
                </View>
                <Badge label="Bientôt" color="gray" />
              </Card>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
