import { Static, t } from 'elysia'

export const MentorCreateModel = t.Object({
  mentorName: t.String({
    minLength: 3,
    maxLength: 100,
    pattern: "^[a-zA-Z\\s.\\,']+$",
    error:
      'Nama mentor minimal 3 karakter dan tidak boleh mengandung karakter spesial/angka',
  }),
  jobTitle: t.String({
    minLength: 1,
    maxLength: 50,
    error: 'Job title harus diisi (2-50 karakter)',
  }),
  companyName: t.String({
    minLength: 2,
    maxLength: 50,
    error: 'Nama perusahaan harus diisi (2-50 karakter)',
  }),
  expertise: t
    .Transform(
      t.Union([
        t.String({ error: 'Isi minimal 1 keahlian' }), // Terima string (1 nilai)
        t.Array(t.String(), {
          minItems: 1,
          error: 'Isi minimal 1 keahlian',
        }),
      ])
    )
    .Decode((value) => {
      // Normalize: selalu jadikan array
      return Array.isArray(value) ? value : [value]
    })
    .Encode((value) => value), // Encode tetap array

  profile: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m',
    error:
      'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
  }),
})

export type MentorCreateProps = Static<typeof MentorCreateModel>

export const MentorUpdateModel = t.Object({
  mentorName: t.Optional(
    t.String({
      minLength: 3,
      maxLength: 100,
      pattern: "^[a-zA-Z\\s.\\,']+$",
      error:
        'Nama mentor minimal 3 karakter dan tidak boleh mengandung karakter spesial/angka',
    })
  ),
  jobTitle: t.Optional(
    t.String({
      minLength: 2,
      maxLength: 50,
      error: 'Job title harus diisi (2-50 karakter)',
    })
  ),
  companyName: t.Optional(
    t.String({
      minLength: 2,
      maxLength: 50,
      error: 'Nama perusahaan harus diisi (2-50 karakter)',
    })
  ),
  expertise: t.Optional(
    t
      .Transform(
        t.Union([
          t.String({ error: 'Isi minimal 1 keahlian' }), // Terima string (1 nilai)
          t.Array(t.String(), {
            minItems: 1,
            error: 'Isi minimal 1 keahlian',
          }),
        ])
      )
      .Decode((value) => {
        // Normalize: selalu jadikan array
        return Array.isArray(value) ? value : [value]
      })
      .Encode((value) => value) // Encode tetap array
  ),
  profile: t.Optional(
    t.File({
      type: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: '5m', // Batasi maksimal 2MB
      error:
        'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
    })
  ),
})

export type MentorUpdateProps = Static<typeof MentorUpdateModel>
