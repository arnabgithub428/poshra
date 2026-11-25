import { useState } from 'react'

export type Role = 'shopkeeper' | 'dealer'

export interface Profile {
    role: Role
    shopName: string
    category?: string
}

const KEY = 'profile'

export function loadProfile(): Profile {
    try {
        const raw = localStorage.getItem(KEY)
        if (raw) return JSON.parse(raw) as Profile
    } catch {
        /* ignore */
    }
    return { role: 'shopkeeper', shopName: '' }
}

export function saveProfile(p: Profile) {
    try {
        localStorage.setItem(KEY, JSON.stringify(p))
    } catch {
        /* ignore */
    }
}

export function useProfile() {
    const [profile] = useState<Profile>(loadProfile)
    return profile
}