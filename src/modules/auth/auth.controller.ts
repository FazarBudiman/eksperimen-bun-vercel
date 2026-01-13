import { AuthCreateProps } from "./auth.model";
import { AuthService } from "./auth.service";

export class AuthController {
    static addUserController = async (payload: AuthCreateProps) => {
        const user = await AuthService.signUp(payload)
        return {
            status: 'success',
            data: user
        }
    }

    static signInController = async(payload: AuthCreateProps) => {
        const user = await AuthService.SignIn(payload)
        return {
            status: 'success',
            data: user
        }
    }
}