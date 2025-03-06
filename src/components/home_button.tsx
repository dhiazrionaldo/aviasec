"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import useUser from "@/app/hook/useUser";

export default function HomeButton() {
    const [loading, setLoading] = useState(false);
    const { data } = useUser();
    const [isAuth, setAuth] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (data) {
            setAuth(true);
            setAdmin(data?.master_role?.role_name === "admin" || data?.master_role?.role_name === "superadmin");
        }
    }, [data]);

    if (!data) return <p>Loading user data...</p>; // ✅ Prevent rendering before data is available

    return (
        <div>
            {loading ? (
                <Button disabled>
                    Proceed to App <Loader2 className="animate-spin" />
                </Button>
            ) : isAuth && isAdmin ? (
                <Link href="/admin/home">
                    <Button onClick={() => setLoading(true)}>
                        Proceed to App <ArrowRight />
                    </Button>
                </Link>
            ) : isAuth && !isAdmin ? (
                <p>Please ask your administrator to assign your account</p>
            ) : null}
        </div>
    );
}
