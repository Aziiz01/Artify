
import { NextResponse } from "next/server";

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

    const data = await response.arrayBuffer();
    const buffer = Buffer.from(data);
    const imageBuffer = buffer.toString('base64');

    // Return the base64-encoded image data with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Server error', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
