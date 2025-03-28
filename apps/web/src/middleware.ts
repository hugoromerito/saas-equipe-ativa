import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()

  if (pathname.startsWith('/org')) {
    const [, , orgSlug] = pathname.split('/')

    response.cookies.set('org', orgSlug)
  } else {
    response.cookies.delete('org')
  }

  if (pathname.startsWith('/org')) {
    const [, , , , unitSlug] = pathname.split('/')

    response.cookies.set('unit', unitSlug)
  } else {
    response.cookies.delete('unit')
  }

  if (pathname.startsWith('/org')) {
    const [, , , , , , applicantSlug] = pathname.split('/')

    response.cookies.set('applicant', applicantSlug)
  } else {
    response.cookies.delete('applicant')
  }

  if (pathname.startsWith('/invites')) {
    const [, , inviteIdSlug] = pathname.split('/')

    response.cookies.set('inviteId', inviteIdSlug)
  } else {
    response.cookies.delete('inviteId')
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
