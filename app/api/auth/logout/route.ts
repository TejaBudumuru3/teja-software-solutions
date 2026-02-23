import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
    const response = NextResponse.json(
        {message: "Logged out successfully"},
        { status: 200 }
    )

    response.cookies.delete("token")

    return response
}