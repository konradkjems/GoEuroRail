import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
} 