# Sprint 6 - recuperacao operacional do Portal 4D Espacial.
# Usa scriptevent para levar o executor ao destino unico portal4d:espaco_4d pela Script API.

title @s title §bPortal 4D — Recuperação
title @s subtitle §fTeleportando para portal4d:espaco_4d
execute as @s at @s run scriptevent portal4d:recuperar destino_custom
say [Portal4D] Recuperacao solicitada via scriptevent; confira o bedrock.log por [Portal4D].
