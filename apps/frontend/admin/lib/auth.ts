import { NextAuthOptions, User } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Credenciais inválidas');
        }

        if (user.status !== 'ACTIVE') {
          throw new Error('Conta inativa. Contate o administrador.');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas');
        }

        // Atualizar último login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Retornar dados do usuário para o JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          roles: user.userRoles.map(ur => ur.role),
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Para OAuth providers, verificar se usuário existe
      if (account?.type === 'oauth') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Criar usuário automaticamente com role básica
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || '',
              image: user.image,
              status: 'PENDING', // Admin deve ativar
              userRoles: {
                create: {
                  role: {
                    connect: { name: 'Viewer' }, // Role padrão
                  },
                },
              },
            },
          });
          user.id = newUser.id;
        } else {
          user.id = existingUser.id;
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }: { 
      token: JWT; 
      user?: User; 
      trigger?: string; 
      session?: any; 
    }) {
      if (user) {
        token.sub = user.id;
        token.roles = (user as any).roles || [];
      }

      // Refresh user data on session update
      if (trigger === 'update' || !token.roles) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (dbUser) {
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          token.roles = dbUser.userRoles.map(ur => ur.role);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        (session.user as any).roles = token.roles || [];
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      // Log de auditoria
      if (message.user.id) {
        await prisma.auditLog.create({
          data: {
            userId: message.user.id,
            action: 'user.signin',
            entity: 'user',
            entityId: message.user.id,
            metadata: {
              provider: message.account?.provider,
              ip: message.isNewUser ? 'new_user' : 'existing_user',
            },
          },
        });
      }
    },
    async signOut(message) {
      // Log de auditoria
      if (message.token?.sub) {
        await prisma.auditLog.create({
          data: {
            userId: message.token.sub,
            action: 'user.signout',
            entity: 'user',
            entityId: message.token.sub,
          },
        });
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};