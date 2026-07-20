import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface LocationPoint {
  id: number
  latitude: number
  longitude: number
  accuracy: number | null
  recorded_at: string | null
}

interface DeviceMapProps {
  locations: LocationPoint[]
}

export function DeviceMap({ locations }: DeviceMapProps) {
  if (locations.length === 0) return null

  const points = locations.map((l) => ({
    id: l.id,
    lat: Number(l.latitude),
    lng: Number(l.longitude),
    accuracy: l.accuracy,
    recorded_at: l.recorded_at,
  }))

  const last = points[0]
  const center: [number, number] = [last.lat, last.lng]

  const polylinePositions: [number, number][] = [...points].reverse().map((p) => [p.lat, p.lng])

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%', borderRadius: '12px', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.length > 1 && (
        <Polyline positions={polylinePositions} pathOptions={{ color: '#4f46e5', weight: 2, dashArray: '5,8' }} />
      )}

      {points.map((p, i) => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup>
            <div style={{ fontSize: '13px' }}>
              <strong>{i === 0 ? 'Dernière position' : `Position ${points.length - i}`}</strong>
              <br />
              {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
              <br />
              {p.recorded_at && new Date(p.recorded_at).toLocaleString('fr-FR')}
              {p.accuracy && <><br />Précision: ±{Math.round(p.accuracy)}m</>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
