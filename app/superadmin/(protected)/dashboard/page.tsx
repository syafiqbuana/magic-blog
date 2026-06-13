"use client"

import {signOutAction} from '@/app/action/auth'

export default function Page() {
        return <>
            <h1>Superadmin Page</h1>

            <button onClick={signOutAction}>Logout</button>
        </>
}