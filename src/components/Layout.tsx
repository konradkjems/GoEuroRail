import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen h-screen">
      {/* Main content */}
      <main className="flex-1 h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
} 