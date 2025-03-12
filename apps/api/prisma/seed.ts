import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  // Limpeza dos dados existentes
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 1)

  // Criação de usuários
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      avatarUrl: 'https://github.com/diego3g.png',
      passwordHash,
    },
  })

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const anotherUser2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  // Criação da organização Acme Inc (Admin)
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      units: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser.id,
              role: 'MANAGER',
            },
            {
              userId: anotherUser2.id,
              role: 'CLERK',
            },
          ],
        },
      },
    },
  })

  // Criação da organização Acme Inc (Billing)
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      units: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'BILLING',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser2.id,
              role: 'MANAGER',
            },
          ],
        },
      },
    },
  })

  // Criação da organização Acme Inc (Member)
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      units: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              domain: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              location: 'Rua 22 de março',
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'MANAGER',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser2.id,
              role: 'CLERK',
            },
          ],
        },
      },
    },
  })

  // Criação dos Apliccant e das demandas para cada unidade
  const units = await prisma.unit.findMany()
  for (const unit of units) {
    // Cria um Apliccant para a unidade
    const apliccant = await prisma.apliccant.create({
      data: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        birthdate: faker.date.birthdate().toISOString(),
        cpf: faker.string.numeric(11),
        mother: faker.person.fullName(),
        father: faker.person.fullName(),
        attachment: faker.internet.url(),
        ticket: faker.string.numeric(12),
        zone: faker.location.city(),
        section: faker.location.street(),
        ticketOrigin: faker.lorem.word(),
        ticketSituation: faker.lorem.word(),
        ticketEmission: faker.date.past().toISOString(),
        observation: faker.lorem.sentence(),
        avatarUrl: faker.image.avatar(),
        travelStatus: faker.lorem.word(),
      },
    })

    const memberForDemand = await prisma.member.create({
      data: {
        role: faker.helpers.arrayElement([
          'ADMIN',
          'MANAGER',
          'CLERK',
          'ANALYST',
          'BILLING',
        ]),
        organization: { connect: { id: unit.organizationId } },
        user: {
          connect: {
            id: faker.helpers.arrayElement([
              user.id,
              anotherUser.id,
              anotherUser2.id,
            ]),
          },
        },
        unit: { connect: { id: unit.id } },
      },
    })

    // Cria uma demanda para a unidade
    await prisma.demand.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        status: 'PENDING',
        priority: 'MEDIUM',
        category: 'HEALTH',
        location: faker.location.streetAddress(),
        unit: { connect: { id: unit.id } },
        members: { connect: { id: memberForDemand.id } },
        Apliccant: { connect: { id: apliccant.id } },
        owner: { connect: { id: user.id } },
      },
    })
  }
}

seed().then(() => {
  console.log('Database seeded!')
})
