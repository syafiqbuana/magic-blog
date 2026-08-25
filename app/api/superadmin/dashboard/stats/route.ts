//app/api/superadmin/dashboard/stats

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {getCurrentUser} from "@/lib/session";

//Get user where isSuperadmin === false

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if(!user.isSuperadmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const users = await prisma.user.count(
            {
                where: {
                    isSuperadmin: false
                }
            }
        )

        return NextResponse.json(users);

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 } 
            );
        }
}