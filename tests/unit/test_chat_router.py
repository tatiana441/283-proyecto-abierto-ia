"""El endpoint de chat degrada con 503 y mensaje claro cuando el LLM falla,
en lugar de un 500 crudo — el resto de la plataforma no depende del LLM."""

import pytest
from fastapi import HTTPException
from openai import OpenAIError

from src.api.routers import chat as chat_router


def _body(pregunta="¿qué riesgo tiene el metotrexato?"):
    return chat_router.PreguntaChat(pregunta=pregunta)


def test_error_del_proveedor_llm_degrada_a_503(monkeypatch):
    def revienta(*_args, **_kwargs):
        raise OpenAIError("credenciales inválidas")

    monkeypatch.setattr(chat_router.citizen_agent, "responder", revienta)
    with pytest.raises(HTTPException) as exc:
        chat_router.chat(_body())
    assert exc.value.status_code == 503
    assert "no está disponible" in exc.value.detail


def test_key_ausente_degrada_a_503(monkeypatch):
    def sin_key(*_args, **_kwargs):
        raise RuntimeError("OPENROUTER_API_KEY no está definida")

    monkeypatch.setattr(chat_router.citizen_agent, "responder", sin_key)
    with pytest.raises(HTTPException) as exc:
        chat_router.chat(_body())
    assert exc.value.status_code == 503
