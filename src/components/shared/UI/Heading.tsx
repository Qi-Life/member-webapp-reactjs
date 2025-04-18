import React from 'react'

type HeadingLevel = 1 | 2 | 3
interface HeadingProps {
    level: HeadingLevel;
    children?: React.ReactNode;
    className?: string;
    textColor?: string;
}

const styles: Record<HeadingLevel, string> = {
    1: 'text-4xl font-semibold',
    2: 'text-3xl font-medium',
    3: 'text-2xl font-normal',
}

const Heading = ({ level = 1, children, className = '', textColor = "text-[#2A4C4F]" }: HeadingProps) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag className={`${styles[level]} ${className} ${textColor}`}>{children}</Tag>
}

export default Heading