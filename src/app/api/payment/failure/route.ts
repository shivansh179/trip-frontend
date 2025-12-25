import { NextRequest, NextResponse } from 'next/server';

// Disable body parsing to handle form-urlencoded data properly
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Easebuzz sends form-urlencoded data via POST
    const contentType = request.headers.get('content-type') || '';
    
    let txnid: string | null = null;
    let errorDesc: string = 'Payment failed';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Parse form-urlencoded data
      const formData = await request.formData();
      txnid = formData.get('txnid')?.toString() || formData.get('udf1')?.toString() || null;
      errorDesc = formData.get('error_desc')?.toString() || formData.get('error')?.toString() || 'Payment failed';
      
      console.log('Easebuzz POST failure received (form-urlencoded):', {
        txnid,
        errorDesc,
        allFields: Object.fromEntries(formData.entries())
      });
    } else {
      // Try to parse as JSON (fallback)
      try {
        const body = await request.json();
        txnid = body.txnid || body.udf1 || null;
        errorDesc = body.error_desc || body.error || 'Payment failed';
        
        console.log('Easebuzz POST failure received (JSON):', { txnid, errorDesc });
      } catch (e) {
        // If JSON parsing fails, try to get from URL search params
        const url = new URL(request.url);
        txnid = url.searchParams.get('txnid') || url.searchParams.get('udf1');
        errorDesc = url.searchParams.get('error') || 'Payment failed';
        
        console.log('Easebuzz POST failure received (URL params):', { txnid, errorDesc });
      }
    }
    
    // Redirect to frontend failure page with GET parameters
    const baseUrl = request.nextUrl.origin;
    const failureUrl = new URL('/payment/failure', baseUrl);
    if (txnid) {
      failureUrl.searchParams.set('txnid', txnid);
    }
    failureUrl.searchParams.set('error', encodeURIComponent(errorDesc));
    
    console.log('Redirecting to failure page:', failureUrl.toString());
    
    return NextResponse.redirect(failureUrl);
  } catch (error) {
    console.error('Error processing payment failure POST:', error);
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(
      new URL('/payment/failure?error=Failed to process payment response', baseUrl)
    );
  }
}

// Also handle GET requests (fallback)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const txnid = searchParams.get('txnid');
  const error = searchParams.get('error') || 'Payment failed';
  
  // Redirect to frontend failure page
  const failureUrl = new URL('/payment/failure', request.url);
  if (txnid) {
    failureUrl.searchParams.set('txnid', txnid);
  }
  failureUrl.searchParams.set('error', error);
  
  return NextResponse.redirect(failureUrl);
}

