import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from 'airsquad-ui'

// Ta biblioteka nie ma jasnego motywu — --background/--foreground zakładają
// ciemne tło strony (patrz .design-sync/conventions.md). Podglądy bez
// własnej nieprzezroczystej powierzchni (Table, listy, tekst) muszą same
// ustawić to tło, inaczej jasny tekst ginie na białym płótnie podglądu.
const canvas = { background: 'var(--background)', color: 'var(--foreground)', padding: 24 }

const ORDERS = [
  { id: '#1042', product: 'Koszulka Air Squad, 140', city: 'Rzeszów', status: 'Opłacone', amount: '89 zł' },
  { id: '#1041', product: 'Bluza z kapturem, M', city: 'Dębica', status: 'Oczekuje', amount: '149 zł' },
  { id: '#1039', product: 'Worek treningowy', city: 'Jasło', status: 'Wysłane', amount: '45 zł' },
]

export function Default() {
  return (
    <div style={canvas}>
      <Table>
        <TableCaption>Ostatnie zamówienia ze sklepu Air Squad.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Zamówienie</TableHead>
            <TableHead>Produkt</TableHead>
            <TableHead>Miasto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Kwota</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ORDERS.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.product}</TableCell>
              <TableCell>{o.city}</TableCell>
              <TableCell>
                <Badge variant={o.status === 'Opłacone' ? 'default' : 'secondary'}>{o.status}</Badge>
              </TableCell>
              <TableCell style={{ textAlign: 'right' }}>{o.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Razem</TableCell>
            <TableCell style={{ textAlign: 'right' }}>283 zł</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export function Compact() {
  return (
    <div style={canvas}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grupa</TableHead>
            <TableHead>Dni</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Zapisanych</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>AcroRzeszów</TableCell>
            <TableCell>pn · śr</TableCell>
            <TableCell style={{ textAlign: 'right' }}>18</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>AcroTricking</TableCell>
            <TableCell>wt · czw</TableCell>
            <TableCell style={{ textAlign: 'right' }}>22</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
