import Link from "next/link"

export default function ButtonToRegister() {
    return (
        <Link href={"/user/register"}><button>Register</button></Link>
    )
}