export interface SignUpData {
    email: string
    password: string
    first_name: string
    last_name: string
    user_name: string
}

export interface SignInData {
    email: string
    password: string
}

export interface VerificationData {
    email: string
    code: string
}