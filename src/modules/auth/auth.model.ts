import { Static, t } from "elysia";

export const AuthCreateModels = t.Object({
    email: t.String(),
    password: t.String()
})

export type AuthCreateProps = Static<typeof AuthCreateModels>