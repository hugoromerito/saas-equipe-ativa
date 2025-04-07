import { getCurrentDemand, getCurrentOrg, getCurrentUnit } from '@/auth/auth'
import { BadgeDemand } from '@/components/badge-demand'
import {
  translateCategory,
  translatePriority,
  translateStatus,
} from '@/constants/demand-translations'
import { getDemand } from '@/http/get-demand'
import Link from 'next/link'
import {
  MapPin,
  User,
  Users,
  Landmark,
  Building2,
  Mail,
  MessageCircle,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DrawerDemandStatus } from './drawer-demand-status'

export async function DemandDetails() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const currentDemand = await getCurrentDemand()

  const { demand } = await getDemand({
    organizationSlug: currentOrg!,
    unitSlug: currentUnit!,
    demandSlug: currentDemand!,
  })

  const address = `${demand.street}, ${demand.number}, ${demand.neighborhood}, ${demand.city}, ${demand.state}, ${demand.cep}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  // const message = `Olá ${demand.applicant.name}, me chamo ${demand} e estou entrando em contato referente ao pedido (${demand.title}) realizado.`
  const phone = demand.applicant.phone
  // const whatsappLink = `https://api.whatsapp.com/send/?phone=55${phone}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`
  const whatsappLink = `https://api.whatsapp.com/send/?phone=55${phone}&text&type=phone_number&app_absent=0`

  function strip(value: string): string {
    return value.replace(/\D/g, '') // remove tudo que não for dígito
  }

  function formatPhone(value: string) {
    const digits = strip(value).slice(0, 11) // garante que só há 8 dígitos (YYYYMMDD)
    const ddd = digits.slice(0, 2)
    const first = digits.slice(2, 7)
    const second = digits.slice(7, 11)
    return `(${ddd}) ${first}-${second}`
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold">Detalhes da Demanda</h2>

      <div className="space-y-4 rounded-2xl border p-4 shadow-sm">
        {/* Título e descrição */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{demand.title}</h3>
          <p className="text-primary">{demand.description}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <BadgeDemand priority={demand.priority}>
            {translatePriority(demand.priority)}
          </BadgeDemand>
          <BadgeDemand status={demand.status}>
            {translateStatus(demand.status)}
          </BadgeDemand>
          <BadgeDemand variant="secondary">
            {translateCategory(demand.category)}
          </BadgeDemand>
        </div>

        {/* Endereço */}
        {demand.cep ||
          demand.complement ||
          demand.street ||
          demand.number ||
          (demand.neighborhood && (
            <div className="text-muted-foreground grid grid-cols-2 gap-4 pt-4 text-sm sm:grid-cols-3">
              <div>
                <strong>CEP:</strong> {demand.cep}
              </div>
              <div>
                <strong>Cidade:</strong> {demand.city}
              </div>
              <div>
                <strong>Bairro:</strong> {demand.neighborhood}
              </div>
              <div>
                <strong>Rua:</strong> {demand.street}
              </div>
              <div>
                <strong>Número:</strong> {demand.number}
              </div>
              {demand.complement && (
                <div>
                  <strong>Complemento:</strong> {demand.complement}
                </div>
              )}
              <div>
                <strong>Estado:</strong> {demand.state}
              </div>
            </div>
          ))}

        {/* Link do mapa */}
        {demand.cep ||
          demand.complement ||
          demand.street ||
          demand.number ||
          (demand.neighborhood && (
            <div className="pt-4">
              <Link
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 hover:underline"
              >
                <MapPin className="h-4 w-4" />
                Ver no Google Maps
              </Link>
            </div>
          ))}

        {/* Solicitante */}
        <div className="space-y-2 border-t pt-4">
          <h4 className="flex items-center gap-2 font-semibold">
            <User className="h-4 w-4" /> Solicitante
          </h4>
          <div className="flex items-center gap-3">
            {demand.applicant.avatarUrl && (
              <Avatar className="size-10">
                {demand.applicant.avatarUrl && (
                  <AvatarImage src={demand.applicant.avatarUrl} />
                )}
                {demand.applicant.name && <AvatarFallback />}
              </Avatar>
            )}
            <div>
              <p>{demand.applicant.name}</p>
              <p className="text-muted-foreground text-xs">
                Nascimento:{' '}
                {new Date(demand.applicant.birthdate)
                  .toISOString()
                  .slice(0, 10)
                  .split('-')
                  .reverse()
                  .join('/')}
              </p>
              <p className="text-muted-foreground text-xs">
                Telefone: {formatPhone(demand.applicant.phone)}
              </p>
            </div>
          </div>

          {/* Link do mapa */}
          <div className="pt-4">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1 hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              Whatsapp
            </Link>
          </div>
        </div>

        {/* Responsável (Member) */}
        {demand.member && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="flex items-center gap-2 font-semibold">
              <Users className="h-4 w-4" /> Responsável pela Demanda
            </h4>
            <div className="flex items-center gap-3">
              {demand.member.user.avatarUrl && (
                <Avatar className="size-10">
                  {demand.member.user.avatarUrl && (
                    <AvatarImage src={demand.member.user.avatarUrl} />
                  )}
                  {demand.member.user.name && <AvatarFallback />}
                </Avatar>
              )}
              <div>
                <p>{demand.member.user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {demand.member.user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unidade e Organização */}
        <div className="space-y-2 border-t pt-4">
          <h4 className="flex items-center gap-2 font-semibold">
            <Landmark className="h-4 w-4" /> Unidade de Atendimento
          </h4>
          <p>{demand.unit.name}</p>

          <h4 className="mt-3 flex items-center gap-2 font-semibold">
            <Building2 className="h-4 w-4" /> Organização
          </h4>
          <div className="flex items-center gap-3">
            {demand.unit.organization.avatarUrl && (
              <Avatar className="size-10">
                {demand.unit.organization.avatarUrl && (
                  <AvatarImage src={demand.unit.organization.avatarUrl} />
                )}
                {demand.unit.organization.name && <AvatarFallback />}
              </Avatar>
            )}
            <p>{demand.unit.organization.name}</p>
          </div>
        </div>

        {/* Proprietário da Ficha */}
        {demand.owner && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="flex items-center gap-2 font-semibold">
              <Mail className="h-4 w-4" /> Registrado por
            </h4>
            <div className="flex items-center gap-3">
              {demand.owner.avatarUrl && (
                <Avatar className="size-10">
                  {demand.owner.avatarUrl && (
                    <AvatarImage src={demand.owner.avatarUrl} />
                  )}
                  {demand.owner.name && <AvatarFallback />}
                </Avatar>
              )}
              <div>
                <p>{demand.owner.name}</p>
                <p className="text-muted-foreground text-xs">
                  {demand.owner.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Datas de criação e atualização */}
        <div className="text-muted-foreground border-t pt-4 text-sm">
          <p>
            <strong>Criado em:</strong>{' '}
            {new Date(demand.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p>
            <strong>Atualizado em:</strong>{' '}
            {new Date(demand.updatedAt!).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      {/* {permissions?.can('update', 'Demand') && <DrawerDemandStatus />} */}
      {!['resolved', 'rejected'].includes(demand.status.toLowerCase()) && (
        <DrawerDemandStatus />
      )}
    </div>
  )
}
