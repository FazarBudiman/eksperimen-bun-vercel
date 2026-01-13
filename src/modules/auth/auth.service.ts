import { supabase } from "../../supabase/supabase";
import { AuthCreateProps } from "./auth.model";

export class AuthService {
    static signUp = async (payload: AuthCreateProps) => {
        const  { data, error } = await supabase.auth.signUp(payload)

        if (error) {
            return error
        }
        return data
    }

    static SignIn = async (payload: AuthCreateProps) => {
        const { data, error } = await supabase.auth.signInWithPassword(payload)
        if (error) {
            return error
        }
        return data
    }
}