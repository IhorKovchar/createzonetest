"use client"

import { Session } from "next-auth";
import { useState } from "react";
import styles from "./burgerButton.module.scss"
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import HeaderList from "../headerList";
import ButtonToRegister from "../buttonToRegister";
import ButtonToLogin from "../buttonToLogin";
import ButtonExit from "../buttonExit";

export default function ButtonBurger({session}: {session: Session | null}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>

            <button className={styles.burger} onClick={() => setIsOpen(!isOpen)}>
                { isOpen ?  <RxCross2 size={24} /> : <RxHamburgerMenu size={24}/> }
            </button>

            <section className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''} `}>
                <HeaderList session={session}/>

                <div className={styles.mobileButtons}>
                    {!session?.user ? (
                        <>
                            <ButtonToRegister/>
                            <ButtonToLogin/>
                        </>
                    ) : (
                        <div className={styles.mobileUserBox}>
                            <ButtonExit/>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}