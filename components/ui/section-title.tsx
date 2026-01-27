"use client"

interface SectionTitleProps {
  badge?: string
  badgeIcon?: React.ReactNode
  titleAr: string
  titleEn?: string
  subtitleAr?: string
  subtitleEn?: string
  align?: "center" | "right" | "left"
  variant?: "default" | "light" | "dark"
}

export function SectionTitle({
  badge,
  badgeIcon,
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
  align = "center",
  variant = "default",
}: SectionTitleProps) {
  const alignmentClasses = {
    center: "text-center mx-auto",
    right: "text-right",
    left: "text-left",
  }

  const colorClasses = {
    default: {
      badge: "badge badge-primary",
      title: "text-foreground",
      subtitle: "text-muted-foreground",
    },
    light: {
      badge: "badge bg-primary-foreground/20 text-primary-foreground",
      title: "text-primary-foreground",
      subtitle: "text-primary-foreground/70",
    },
    dark: {
      badge: "badge badge-accent",
      title: "text-foreground",
      subtitle: "text-muted-foreground",
    },
  }

  return (
    <div className={`mb-10 lg:mb-14 ${alignmentClasses[align]}`}>
      {badge && (
        <span className={`${colorClasses[variant].badge} mb-4 inline-flex`}>
          {badgeIcon}
          {badge}
        </span>
      )}
      
      <h2 className={`font-sans text-3xl font-black tracking-tight lg:text-5xl ${colorClasses[variant].title}`}>
        {titleAr}
      </h2>
      
      {titleEn && (
        <p className={`mt-1 font-body text-sm font-medium uppercase tracking-wider ${colorClasses[variant].subtitle}`}>
          {titleEn}
        </p>
      )}
      
      {subtitleAr && (
        <p className={`mt-4 max-w-xl font-body text-base lg:text-lg ${align === "center" ? "mx-auto" : ""} ${colorClasses[variant].subtitle}`}>
          {subtitleAr}
          {subtitleEn && (
            <span className="block mt-1 text-sm opacity-80">{subtitleEn}</span>
          )}
        </p>
      )}
    </div>
  )
}
