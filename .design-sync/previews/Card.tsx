import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from 'airsquad-ui'

// Marka nie ma jasnego motywu — patrz .design-sync/conventions.md.
const canvas = { background: 'var(--background)', padding: 24 }

export function Default() {
  return (
    <div style={canvas}>
      <Card style={{ maxWidth: 360 }}>
        <CardHeader>
          <CardTitle>Zapisy — sezon 2025/26</CardTitle>
          <CardDescription>Rzeszów, sala AIR SPACE</CardDescription>
        </CardHeader>
        <CardContent>
          <p style={{ margin: 0, fontSize: 14 }}>
            38 dzieci zapisanych na grupę AcroKids. 4 wolne miejsca do końca miesiąca.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Zobacz grupę</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function WithAction() {
  return (
    <div style={canvas}>
      <Card style={{ maxWidth: 360 }}>
        <CardHeader>
          <CardTitle>Zamówienie #1042</CardTitle>
          <CardDescription>Koszulka Air Squad, rozmiar 140</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm">
              Edytuj
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p style={{ margin: 0, fontSize: 14 }}>Status: opłacone · Odbiór na treningu</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function Simple() {
  return (
    <div style={canvas}>
      <Card style={{ maxWidth: 320 }}>
        <CardContent>
          <p style={{ margin: 0, fontSize: 14 }}>
            Trening odwołany 12.03 — sala niedostępna. Zajęcia odrobimy 19.03.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
