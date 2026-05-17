import LoginComponent from "@/components/authUI/loginComponent";
import styles from "./login.module.scss"

export default function Login() {
    return (
        <section className={styles.login}>
            <h1>Login</h1>
            <LoginComponent/>
        </section>
    )
}