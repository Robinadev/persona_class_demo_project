"use server"

import { cookies } from "next/headers"

export async function logout() {
  cookies().set("admin_session", "", {
    expires: new Date(0),
    path: "/",
  })
}
