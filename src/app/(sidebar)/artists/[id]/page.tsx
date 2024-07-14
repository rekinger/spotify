"use client"

import { useParams } from "next/navigation"
export default function Artist() {
    const params = useParams<{ id: string }>()

    console.log(params)
    return (
        <div>
            {
                params.id
            }
        </div>
    )
}