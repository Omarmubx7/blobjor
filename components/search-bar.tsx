"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

export function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams?.get("search") || "")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`)
        } else {
            router.push("/products")
        }
    }

    return (
        <form onSubmit={handleSearch} className="relative group">
            <div className="relative">
                <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-40 sm:w-60 rounded-full border border-border bg-background/50 px-4 py-2 text-sm pl-10 transition-all focus:w-48 sm:focus:w-72 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                    type="submit"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                    <Search size={16} />
                </button>
            </div>
        </form>
    )
}
