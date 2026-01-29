
import { compare } from 'bcryptjs'

async function main() {
    const hash = '$2b$12$QypVXz1dA2HF/1CqHmayKeyBmrLu7ZRAB.f4d7wCFBBq9PRm/5Wiy'
    const candidate = '123456'

    console.log(`Testing '${candidate}' against hash...`)
    const isMatch = await compare(candidate, hash)

    console.log(`Match: ${isMatch}`)
}

main()
