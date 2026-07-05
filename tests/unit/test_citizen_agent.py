"""Tests del agente conversacional con LLM mockeado: verifica que llama
herramientas, arma sources[] y respeta el límite de iteraciones."""

import json
import os
from types import SimpleNamespace

import pytest

from src.agents import citizen_agent
from src.common import load_env

load_env()
requiere_db = pytest.mark.skipif(
    not os.environ.get("DATABASE_URL"), reason="las tools consultan Supabase"
)


def _respuesta_llm(contenido=None, tool_calls=None):
    mensaje = SimpleNamespace(content=contenido, tool_calls=tool_calls)
    return SimpleNamespace(choices=[SimpleNamespace(message=mensaje)])


def _tool_call(id_, nombre, argumentos):
    return SimpleNamespace(
        id=id_, function=SimpleNamespace(name=nombre, arguments=json.dumps(argumentos))
    )


class ClienteFalso:
    """Simula OpenRouter: 1ª llamada pide una tool, 2ª responde con texto."""

    def __init__(self, guion):
        self._guion = list(guion)
        self.llamadas = []
        self.chat = SimpleNamespace(completions=SimpleNamespace(create=self._create))

    def _create(self, **kwargs):
        self.llamadas.append(kwargs)
        return self._guion.pop(0)


@requiere_db
def test_flujo_tool_calling_y_sources():
    cliente = ClienteFalso([
        _respuesta_llm(tool_calls=[_tool_call("t1", "riesgo_medicamento", {"principio_activo": "metotrexato"})]),
        _respuesta_llm(contenido="El metotrexato presenta riesgo según INVIMA."),
    ])
    resultado = citizen_agent.responder("¿qué riesgo tiene el metotrexato?", cliente=cliente, modelo="fake")

    assert resultado["respuesta"].startswith("El metotrexato")
    assert resultado["herramientas_usadas"] == ["riesgo_medicamento"]
    assert len(resultado["sources"]) == 1
    assert "Vitales" in resultado["sources"][0]["dataset"] or "riesgo" in resultado["sources"][0]["dataset"]

    # la 2ª llamada al LLM debe incluir el resultado de la tool (role=tool)
    roles = [m["role"] for m in cliente.llamadas[1]["messages"]]
    assert "tool" in roles


def test_sin_tools_responde_directo():
    cliente = ClienteFalso([_respuesta_llm(contenido="Hola, soy el asistente de MediWatch.")])
    resultado = citizen_agent.responder("hola", cliente=cliente, modelo="fake")
    assert resultado["sources"] == []
    assert "MediWatch" in resultado["respuesta"]


def test_limite_de_iteraciones():
    bucle = _respuesta_llm(tool_calls=[_tool_call("tx", "estadisticas_generales", {})])
    cliente = ClienteFalso([bucle] * citizen_agent.MAX_ITERACIONES)
    if not os.environ.get("DATABASE_URL"):
        pytest.skip("requiere DATABASE_URL")
    resultado = citizen_agent.responder("stats en bucle", cliente=cliente, modelo="fake")
    assert "No logré completar" in resultado["respuesta"]
    assert len(resultado["herramientas_usadas"]) == citizen_agent.MAX_ITERACIONES


def test_system_prompt_exige_trazabilidad():
    prompt = citizen_agent.PROMPTS["system_prompt"]
    assert "ÚNICAMENTE" in prompt
    assert "fuente" in prompt.lower()
    assert "consejo médico" in prompt.lower() or "consejo medico" in prompt.lower()
