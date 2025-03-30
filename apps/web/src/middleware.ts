import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  const parts = pathname.split('/')

  const params = {
    org: parts[2], // /org/:org
    unit: parts[4], // /org/:org/units/:unit
    inviteId: parts[2], // /invites/:inviteId
    // O valor será definido com base no prefixo anterior
    applicant: parts[5] === 'applicants' ? parts[6] : undefined,
    demand: parts[5] === 'demands' ? parts[6] : undefined,
  }

  // Define se a URL atual corresponde à estrutura de cada rota
  if (pathname.startsWith('/org')) {
    if (params.org) response.cookies.set('org', params.org)
    else response.cookies.delete('org')

    if (params.unit) response.cookies.set('unit', params.unit)
    else response.cookies.delete('unit')

    if (params.demand) response.cookies.set('demand', params.demand)
    else response.cookies.delete('demand')

    if (params.applicant) response.cookies.set('applicant', params.applicant)
    else response.cookies.delete('applicant')
  } else {
    response.cookies.delete('org')
    response.cookies.delete('unit')
    response.cookies.delete('applicant')
  }

  if (pathname.startsWith('/invites') && params.inviteId) {
    response.cookies.set('inviteId', params.inviteId)
  } else {
    response.cookies.delete('inviteId')
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
