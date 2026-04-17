import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'SentinalHills';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#0A0A0F',
            backgroundImage: 'radial-gradient(circle at center, rgba(108,99,255,0.15) 0%, #0A0A0F 70%)',
            padding: '80px',
          }}
        >
          {/* Logo representation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#25D366',
                marginRight: '12px',
              }}
            />
            <span style={{ fontSize: '32px', color: '#F0F0FF', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
              SentinalHills
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.2,
              fontFamily: 'sans-serif',
              marginBottom: '24px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              color: '#9999BB',
              fontFamily: 'sans-serif',
            }}
          >
            AI Automation Agency · Nairobi, Kenya
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response('Failed to generate image', { status: 500 });
  }
}
