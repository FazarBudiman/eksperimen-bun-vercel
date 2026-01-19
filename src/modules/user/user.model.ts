import { Static, t } from 'elysia'

export const UserRole = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const

export const UserCreateModel = t.Object({
  username: t.String({
    minLength: 8,
    pattern: '^[^\\s]+$',
    error: 'Username minimal 8 karakter dan tidak boleh mengandung spasi',
  }),

  password: t.String({
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])\\S+$',
    error:
      'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol',
  }),

  fullName: t.String({
    minLength: 3,
    error: 'Nama minimal 3 karakter',
  }),

  userRole: t.Enum(UserRole, {
    error: 'Role User tidak valid',
  }),

  Profile: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m',
    error:
      'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
  }),
})

export type UserCreateProps = Static<typeof UserCreateModel>
