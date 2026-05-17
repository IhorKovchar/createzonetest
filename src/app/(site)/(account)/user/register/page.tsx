import RegisterComponent from "@/components/authUI/registerComponent";
import styles from "./register.module.scss"
 
export default function Register() {
    return (
        <section className={styles.register}>
            <h1>Register</h1>
            <RegisterComponent/>
        </section>
    )
}