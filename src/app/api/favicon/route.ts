import { NextResponse } from 'next/server';

// Route handler for favicon
export async function GET() {
  // Redirect to an existing image
  return NextResponse.redirect(new URL('/photos/rail-maps/High_Speed_Railroad_Map_of_Europe.svg.png', 'http://localhost:3000'));
} 