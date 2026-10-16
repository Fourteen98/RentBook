import { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Money } from '@/components/ui/Money'
import { StatusBadge } from '@/components/ui/StatusBadge'

type Swatch = { name: string; className: string }

type StyleguideProps = {
  sample_rent_pesewas: number
}

const swatches: Swatch[] = [
  { name: 'brand-600', className: 'bg-brand-600' },
  { name: 'brand-50', className: 'bg-brand-50' },
  { name: 'accent-500', className: 'bg-accent-500' },
  { name: 'accent-100', className: 'bg-accent-100' },
  { name: 'canvas', className: 'bg-canvas' },
  { name: 'ink', className: 'bg-ink' },
  { name: 'danger', className: 'bg-danger' },
]

/** Development-only page for seeing every UI component at phone width. */
export default function Styleguide({ sample_rent_pesewas }: StyleguideProps) {
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const phoneError = phone && !/^0\d{9}$/.test(phone) ? 'Enter a 10-digit number starting with 0' : undefined

  return (
    <>
      <Head title="Styleguide" />
      <main className="mx-auto max-w-md space-y-6 px-4 py-6">
        <header>
          <h1 className="text-xl font-semibold">RentBook styleguide</h1>
          <p className="text-sm text-ink-muted">Palette A, forest and soft gold. Development only.</p>
        </header>

        <Card title="Colours">
          <div className="grid grid-cols-4 gap-2">
            {swatches.map((s) => (
              <div key={s.name} className="text-center">
                <div className={`h-10 rounded-md border border-line ${s.className}`} />
                <p className="mt-1 text-xs text-ink-muted">{s.name}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Weija Mile 11 · Room 7" subtitle="Chamber and hall" action={<StatusBadge tone="brand">Occupied</StatusBadge>}>
          <p className="text-2xl font-semibold">
            <Money pesewas={sample_rent_pesewas} />
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            <Money pesewas={80000} /> × 24 months
          </p>
          <div className="mt-2">
            <StatusBadge tone="gold">Expires in 60 days</StatusBadge>
          </div>
          <div className="mt-4 space-y-2">
            <Button variant="primary" block loading={saving} onClick={() => setSaving((v) => !v)}>
              Record payment
            </Button>
            <Button block>Share to WhatsApp</Button>
          </div>
        </Card>

        <Card title="Buttons">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button>Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Void agreement</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
          </div>
        </Card>

        <Card title="Badges">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="brand">Occupied</StatusBadge>
            <StatusBadge>Vacant</StatusBadge>
            <StatusBadge tone="gold">Reserved</StatusBadge>
            <StatusBadge tone="danger">Under repair</StatusBadge>
          </div>
        </Card>

        <Card title="Form field">
          <div className="space-y-4">
            <Field label="Tenant phone" hint="Ghana number, for example 0244123456" error={phoneError}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0244123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              )}
            </Field>
            <Field label="Tenant name" error={['Name can’t be blank']}>
              {({ id, describedBy, invalid }) => <Input id={id} aria-describedby={describedBy} invalid={invalid} />}
            </Field>
          </div>
        </Card>

        <Card title="Money">
          <ul className="space-y-1 text-sm">
            <li><Money pesewas={1950000} /></li>
            <li><Money pesewas={5} /></li>
            <li><Money pesewas={0} /></li>
            <li><Money pesewas={-120000} className="text-danger" /></li>
          </ul>
        </Card>
      </main>
    </>
  )
}
