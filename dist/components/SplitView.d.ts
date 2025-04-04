import React from 'react';
interface SplitViewProps {
    mapSection: React.ReactNode;
    contentSection: React.ReactNode;
    mapWidth?: string;
}
export default function SplitView({ mapSection, contentSection, mapWidth }: SplitViewProps): React.JSX.Element;
export {};
