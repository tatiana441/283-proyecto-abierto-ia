"""Asistente conversacional con trazabilidad (citizen_agent vía OpenRouter)."""

import json

from fastapi import APIRouter, HTTPException
from openai import OpenAIError
from pydantic import BaseModel, Field

from src.agents import citizen_agent
from src.api.db import get_conn

router = APIRouter(prefix="/api/chat", tags=["chat"])


class MensajeHistorial(BaseModel):
    role: str
    content: str


class PreguntaChat(BaseModel):
    pregunta: str = Field(..., min_length=3, max_length=1000)
    historial: list[MensajeHistorial] = []
    user_id: str | None = None


@router.post("")
def chat(body: PreguntaChat):
    try:
        resultado = citizen_agent.responder(
            body.pregunta,
            historial=[m.model_dump() for m in body.historial],
        )
    except RuntimeError as e:
        raise HTTPException(503, f"Asistente no disponible: {e}") from e
    except OpenAIError as e:
        # Falla del proveedor LLM (credenciales, red, cuota): el chat degrada con
        # mensaje claro; el resto de la plataforma no depende del LLM.
        print(f"[chat] proveedor LLM no disponible: {type(e).__name__}: {e}")
        raise HTTPException(
            503,
            "El asistente no está disponible en este momento. Los datos de la "
            "plataforma siguen funcionando; intenta de nuevo más tarde.",
        ) from e

    try:
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO chat_logs (user_id, pregunta, respuesta, sources) VALUES (%s, %s, %s, %s)",
                (body.user_id, body.pregunta, resultado["respuesta"],
                 json.dumps(resultado["sources"], ensure_ascii=False)),
            )
            conn.commit()
    except Exception as e:  # noqa: BLE001 — el log no debe tumbar la respuesta al usuario
        print(f"[chat] no se pudo guardar el log: {e}")

    return resultado
