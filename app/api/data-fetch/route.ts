import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const variables = JSON.parse(body);
    const passedImage = variables.passedImage;


    if (!passedImage) {
      return new NextResponse("Request passedImage is empty", { status: 400 });
    }

    const response = await fetch(passedImage);

    // Check if the response status is OK
    if (!response.ok) {
      console.error(`Failed to fetch image. Status: ${response.status}`);
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    const data = await response.arrayBuffer(); // Use arrayBuffer directly

    // Convert arrayBuffer to base64
    const buffer = Buffer.from(data);
    const base64 = buffer.toString('base64');

    return new NextResponse(base64, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('server eror', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
