import React from 'react'
import clsx from 'clsx'

type HeadingLevel = 1 | 2 | 3

interface HeadingProps {
    level: HeadingLevel
    children?: React.ReactNode
    className?: string
    overrideDefaultStyle?: boolean
}

const defaultStyles: Record<HeadingLevel, string> = {
    1: 'text-4xl font-semibold text-[#2A4C4F]',
    2: 'text-2xl font-medium text-[#2A4C4F]',
    3: 'text-base font-medium text-[#2A4C4F]',
}

const Heading = ({
    level = 1,
    children,
    className = '',
    overrideDefaultStyle = false,
}: HeadingProps) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    const combinedClass = clsx(
        !overrideDefaultStyle && defaultStyles[level],
        className
    )

    return <Tag className={combinedClass}>{children}</Tag>
}

export default Heading
