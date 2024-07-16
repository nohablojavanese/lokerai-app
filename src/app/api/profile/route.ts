import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  const { linkedin_url } = body;

  if (!linkedin_url) {
    return NextResponse.json(
      { error: "LinkedIn URL is required" },
      { status: 400 }
    );
  }

  const options = {
    method: "GET",
    url: process.env.PROFILE_URL,
    params: {
      linkedin_url,
      include_skills: "false",
      include_certifications: "false",
      include_publications: "false",
      include_honors: "false",
      include_volunteers: "false",
      include_projects: "false",
      include_patents: "false",
      include_courses: "false",
      include_organizations: "false",
    },
    headers: {
      [process.env.HEADER_KEY as string]: process.env.PROFILE_KEY as string,
      [process.env.HEADER_HOST as string]: process.env.PROFILE_ENDPOINT as string,
    },
  };

  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.response?.status || 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
