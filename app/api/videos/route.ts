import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/nextAuthOption";
import Video, { IVideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || (await videos).length === 0) {
      return NextResponse.json([], { status: 400 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch videos" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body:IVideo= await req.json()
    // Validate required fields
        if (
        !body.title ||
        !body.description ||
        !body.videoUrl ||
        !body.thumbnailUrl
        ) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
        }
     // Create new video with default values
    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);

  } 
  catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
