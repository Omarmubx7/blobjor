
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { useToast } from '@/contexts/toast-context'

interface HomepageSection {
    sectionKey: string
    title: string
    subtitle: string | null
    imageUrl: string | null
}

export default function HomepageEditor() {
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [heroSection, setHeroSection] = useState<HomepageSection>({
        sectionKey: 'hero',
        title: '',
        subtitle: '',
        imageUrl: ''
    })

    useEffect(() => {
        fetch('/api/admin/homepage')
            .then(res => res.json())
            .then((data: HomepageSection[]) => {
                const hero = data.find(s => s.sectionKey === 'hero')
                if (hero) {
                    setHeroSection(hero)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/admin/homepage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(heroSection)
            })

            if (!res.ok) throw new Error('Failed to save')

            addToast({ message: 'تم حفظ التغييرات بنجاح', type: 'success' })
        } catch (error) {
            addToast({ message: 'حدث خطأ أثناء الحفظ', type: 'error' })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">تخصيص الصفحة الرئيسية</h1>
                <p className="text-muted-foreground">
                    تحكم في النصوص والصور التي تظهر في الصفحة الرئيسية للمتجر.
                </p>
            </div>

            {/* Hero Section */}
            <Card>
                <CardHeader>
                    <CardTitle>الواجهة الرئيسية (Hero)</CardTitle>
                    <CardDescription>
                        النص الكبير الذي يظهر في أعلى الصفحة.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="hero-title">العنوان الرئيسي</Label>
                        <Input
                            id="hero-title"
                            placeholder="Sports & Anime Hoodies"
                            value={heroSection.title || ''}
                            onChange={(e) => setHeroSection(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">يظهر بخط كبير جداً.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hero-subtitle">العنوان الفرعي</Label>
                        <Input
                            id="hero-subtitle"
                            placeholder="for fans, gamers, and athletes"
                            value={heroSection.subtitle || ''}
                            onChange={(e) => setHeroSection(prev => ({ ...prev, subtitle: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">يظهر تحت العنوان الرئيسي.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            حفظ التغييرات
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
