"""Agente conversacional ciudadano — patrón tool-calling con trazabilidad.

El LLM (vía OpenRouter) solo puede responder con datos que recupera a través de
las herramientas de src/agents/tools.py; cada ejecución de herramienta queda
registrada en sources[] para pintar la trazabilidad en la interfaz (patrón del
demo del curso: recuperar → responder solo con contexto → citar fuentes).
"""

import json
import os
from pathlib import Path

from src.agents import tools
from src.common import REPO_ROOT, load_env

PROMPTS = json.loads(
    (REPO_ROOT / "models" / "llm_rag" / "prompt_templates.json").read_text(encoding="utf-8")
)
MAX_ITERACIONES = 5
MAX_TOKENS = 700


def _cliente_openrouter():
    from openai import OpenAI

    load_env()
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY no está definida")
    return OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)


def responder(pregunta: str, historial: list[dict] | None = None, cliente=None, modelo: str | None = None) -> dict:
    """Responde una pregunta ciudadana. Devuelve {respuesta, sources, herramientas_usadas}.

    `cliente` es inyectable para tests (interfaz OpenAI chat.completions).
    """
    cliente = cliente or _cliente_openrouter()
    modelo = modelo or os.environ.get("OPENROUTER_MODEL", PROMPTS["modelo_defecto"])

    mensajes = [{"role": "system", "content": PROMPTS["system_prompt"]}]
    for m in (historial or [])[-6:]:  # memoria corta de la conversación
        if m.get("role") in ("user", "assistant") and m.get("content"):
            mensajes.append({"role": m["role"], "content": str(m["content"])[:2000]})
    mensajes.append({"role": "user", "content": pregunta[:2000]})

    sources: list[dict] = []
    herramientas_usadas: list[str] = []

    for _ in range(MAX_ITERACIONES):
        respuesta = cliente.chat.completions.create(
            model=modelo,
            messages=mensajes,
            tools=tools.ESQUEMAS,
            max_tokens=MAX_TOKENS,
            temperature=0.2,
        )
        eleccion = respuesta.choices[0].message

        if not eleccion.tool_calls:
            return {
                "respuesta": eleccion.content or "No pude generar una respuesta.",
                "sources": sources,
                "herramientas_usadas": herramientas_usadas,
            }

        mensajes.append({
            "role": "assistant",
            "content": eleccion.content,
            "tool_calls": [
                {"id": tc.id, "type": "function",
                 "function": {"name": tc.function.name, "arguments": tc.function.arguments}}
                for tc in eleccion.tool_calls
            ],
        })
        for tc in eleccion.tool_calls:
            try:
                argumentos = json.loads(tc.function.arguments or "{}")
            except json.JSONDecodeError:
                argumentos = {}
            contenido, source = tools.ejecutar(tc.function.name, argumentos)
            herramientas_usadas.append(tc.function.name)
            if source:
                sources.append({**source, "argumentos": argumentos})
            mensajes.append({
                "role": "tool", "tool_call_id": tc.id, "content": contenido[:8000],
            })

    return {
        "respuesta": "No logré completar la consulta con los datos disponibles. Intenta reformular la pregunta.",
        "sources": sources,
        "herramientas_usadas": herramientas_usadas,
    }
