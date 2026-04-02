import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return new NextResponse("Latitude e Longitude são obrigatórios", {
        status: 400,
      });
    }

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar temperatura");
    }

    const data = await res.json();

    return NextResponse.json({
      temperatura: data.current_weather?.temperature ?? null,
      vento: data.current_weather?.windspeed ?? null,
      timestamp: data.current_weather?.time ?? null,
    });
  } catch (error) {
    console.error("Erro na API de temperatura:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
