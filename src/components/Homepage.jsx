"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const Homepage = () => {
    const router = useRouter();
    useEffect(() => {
        router.push('/dashboard/coding-activity')
    }, [])
    return (
        <div>Redirecting...</div>
    )
}

export default Homepage