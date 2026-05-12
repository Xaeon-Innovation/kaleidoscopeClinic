import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ slots: [] });
    }
    const now = new Date().toISOString().split("T")[0]!;
    const snap = await db
      .collection("availableSlots")
      .where("date", ">=", now)
      .orderBy("date", "asc")
      .orderBy("startTime", "asc")
      .get();

    const slots = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("GET /api/slots error:", err);
    return NextResponse.json({ slots: [], error: "Failed to load slots" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      date: string;
      startTime: string;
      endTime: string;
      label?: string;
    };

    if (!body.date || !body.startTime || !body.endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
    }

    const ref = await db.collection("availableSlots").add({
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      label: body.label ?? "",
      booked: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error("POST /api/slots error:", err);
    return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json() as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "Missing slot id" }, { status: 400 });
    }
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
    }
    await db.collection("availableSlots").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/slots error:", err);
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
  }
}
