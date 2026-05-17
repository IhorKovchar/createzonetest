import Link from "next/link"

export default function ButtonToLogin() {
    return (
        <Link href={"/user/login"}><button>Login</button></Link>
    )
}