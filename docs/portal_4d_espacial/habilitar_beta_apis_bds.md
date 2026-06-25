# Portal 4D Espacial — Como habilitar Beta APIs no Bedrock Dedicated Server

## Por que isso é necessário?

O Portal 4D `0.1.7` depende de `@minecraft/server` `2.0.0-beta` para usar explicitamente a Custom Dimension API Microsoft. No deploy validado em `2026-06-25`, o Bedrock carregou o pack, mas bloqueou o script porque o mundo ativo `Bedrock level` não estava com o experimento **Beta APIs** habilitado.

Erro observado no `bedrock.log`:

```text
[Scripting] Plugin [BP Portal 4D Espacial - 0.1.7] - requesting dependency on beta APIs [@minecraft/server - 2.0.0-beta], but the Beta APIs experiment is not enabled.
```

A causa raiz é configuração do mundo, não erro de deploy do pack.

## Caminho recomendado e mais seguro

> Importante: faça backup antes de alterar experimentos do mundo.

1. **Parar o Bedrock Dedicated Server.**
2. **Fazer backup do mundo atual:**
   - origem no servidor: `/root/MinecraftServer/worlds/Bedrock level`.
3. **Copiar o mundo para uma instalação local do Minecraft Bedrock** compatível com a versão do servidor.
4. **Abrir as configurações do mundo no cliente Bedrock:**
   - selecionar o mundo;
   - clicar no ícone de edição/configurações;
   - abrir a seção **Experiments / Experimentos**.
5. **Ativar `Beta APIs`.**
   - Se o Minecraft criar uma cópia experimental do mundo, use essa cópia como o novo mundo do servidor.
6. **Fechar o mundo local e copiar a pasta do mundo com Beta APIs habilitado de volta para o servidor**, substituindo ou publicando como o novo `Bedrock level`.
7. **Garantir que `server.properties` aponta para o nome correto do mundo**, se o nome da pasta ou `level-name` mudar.
8. **Reiniciar o Bedrock Dedicated Server.**
9. **Validar o log:**

```bash
tail -n 260 /root/MinecraftServer/logging/bedrock.log
```

Critérios de sucesso para o Portal 4D:

```text
Pack Stack - [..] BP Portal 4D Espacial ... version: 0.1.7
[Scripting] [Portal4D] Trigger de interacao com bloco registrado para o portal 4D.
[Scripting] [Portal4D] Dimensao customizada registrada no startup: portal4d:espaco_4d.
[Scripting] [Portal4D] Plataforma segura criada para dimensao customizada 4D em portal4d:espaco_4d @ 0 80 0.
```

## O que não resolve

- Alterar apenas `server.properties` não habilita Beta APIs no mundo existente.
- Reiniciar o servidor sem ligar o experimento no mundo continuará gerando o erro de dependência beta.
- Reverter `@minecraft/server` para versão estável removeria o bloqueio, mas também abandonaria a intenção de usar explicitamente a Custom Dimension API Microsoft beta.

## Alternativa operacional

Se houver uma ferramenta de edição NBT/LevelDB confiável no pipeline do servidor, ela pode ser usada para alterar a flag experimental diretamente no mundo, mas esse caminho é menos seguro e deve ser validado com backup, porque a Microsoft documenta Beta APIs como experimento do mundo. O caminho recomendado continua sendo ativar pelo cliente Bedrock/Editor e republicar o mundo.

## Passo a passo no Linux do host

> Use este caminho quando você quer habilitar Beta APIs diretamente no host Linux do BDS, sem abrir o mundo no cliente. Ele edita `level.dat`, então **backup é obrigatório**.

### 1) Entrar no host e parar o servidor

```bash
ssh root@186.202.209.206
cd /root/MinecraftServer
systemctl stop bedrock.service
```

Se o serviço tiver outro nome, confirme com:

```bash
systemctl list-units --type=service | grep -i bedrock
```

### 2) Fazer backup completo do mundo e do `level.dat`

```bash
cd /root/MinecraftServer
TS="$(date +%Y%m%d-%H%M%S)"
cp -a "worlds/Bedrock level" "worlds/Bedrock level.backup-beta-apis-$TS"
cp -a "worlds/Bedrock level/level.dat" "worlds/Bedrock level/level.dat.backup-beta-apis-$TS"
[ -f "worlds/Bedrock level/level.dat_old" ] && cp -a "worlds/Bedrock level/level.dat_old" "worlds/Bedrock level/level.dat_old.backup-beta-apis-$TS"
```

### 3) Instalar uma ferramenta Python para editar NBT little-endian

`level.dat` do Bedrock tem cabeçalho de 8 bytes e NBT little-endian. O exemplo abaixo usa `nbtlib`, que suporta NBT little-endian.

```bash
python3 -m venv /tmp/bedrock-nbt
/tmp/bedrock-nbt/bin/pip install --upgrade pip nbtlib
```

### 4) Criar o patch de Beta APIs

```bash
cat > /tmp/enable_bedrock_beta_apis.py <<'PY'
from __future__ import annotations

import io
import shutil
import struct
import sys
from pathlib import Path

import nbtlib
from nbtlib import Byte, Compound

if len(sys.argv) != 2:
    raise SystemExit("Uso: enable_bedrock_beta_apis.py /caminho/para/level.dat")

level_dat = Path(sys.argv[1])
if not level_dat.exists():
    raise SystemExit(f"level.dat não encontrado: {level_dat}")

raw = level_dat.read_bytes()
if len(raw) < 9:
    raise SystemExit("level.dat muito pequeno ou inválido")

version, declared_size = struct.unpack("<II", raw[:8])
body = raw[8:]
if declared_size != len(body):
    print(f"Aviso: tamanho declarado={declared_size}, tamanho real={len(body)}; regravando com tamanho real corrigido.")

nbt_file = nbtlib.File.parse(io.BytesIO(body), byteorder="little")
experiments = nbt_file.get("experiments")
if experiments is None:
    experiments = Compound()
    nbt_file["experiments"] = experiments

# In-game toggle: Beta APIs. Em Bedrock NBT, a flag historicamente aparece como "gametest".
experiments["gametest"] = Byte(1)

# Marcadores usados pelo Bedrock quando um mundo já teve experimentos ativados.
nbt_file["experiments_ever_used"] = Byte(1)
nbt_file["saved_with_toggled_experiments"] = Byte(1)

out = io.BytesIO()
nbt_file.write(out, byteorder="little")
new_body = out.getvalue()
new_raw = struct.pack("<II", version, len(new_body)) + new_body

backup = level_dat.with_suffix(level_dat.suffix + ".pre-beta-apis")
if not backup.exists():
    shutil.copy2(level_dat, backup)

level_dat.write_bytes(new_raw)
print(f"Beta APIs habilitado em {level_dat}")
print(f"Backup adicional: {backup}")
print("Tags ajustadas: experiments.gametest=1, experiments_ever_used=1, saved_with_toggled_experiments=1")
PY
```

### 5) Aplicar no mundo ativo

```bash
/tmp/bedrock-nbt/bin/python /tmp/enable_bedrock_beta_apis.py "/root/MinecraftServer/worlds/Bedrock level/level.dat"
```

Se existir `level.dat_old`, mantenha uma cópia de segurança e depois sincronize com o `level.dat` editado para reduzir risco de rollback pelo servidor:

```bash
cp -a "/root/MinecraftServer/worlds/Bedrock level/level.dat" "/root/MinecraftServer/worlds/Bedrock level/level.dat_old"
```

### 6) Reiniciar o servidor

```bash
systemctl start bedrock.service
```

### 7) Validar no log

```bash
tail -n 260 /root/MinecraftServer/logging/bedrock.log | egrep 'Portal4D|Beta APIs|0\.1\.7|TypeError|SyntaxError|Pack Stack'
```

O erro abaixo **não deve mais aparecer**:

```text
requesting dependency on beta APIs [@minecraft/server - 2.0.0-beta], but the Beta APIs experiment is not enabled
```

E estes registros devem aparecer:

```text
[Scripting] [Portal4D] Trigger de interacao com bloco registrado para o portal 4D.
[Scripting] [Portal4D] Dimensao customizada registrada no startup: portal4d:espaco_4d.
```

### 8) Se algo der errado, rollback

```bash
systemctl stop bedrock.service
rm -rf "/root/MinecraftServer/worlds/Bedrock level"
cp -a "/root/MinecraftServer/worlds/Bedrock level.backup-beta-apis-$TS" "/root/MinecraftServer/worlds/Bedrock level"
systemctl start bedrock.service
```

> Atenção: o comando de rollback usa a variável `TS` da sessão em que o backup foi criado. Se estiver em outra sessão, substitua pelo sufixo real do backup listado em `ls -1 /root/MinecraftServer/worlds/`.

## Troubleshooting: `ensurepip is not available`

Se `python3 -m venv /tmp/bedrock-nbt` falhar com `ensurepip is not available`, instale o pacote de venv do Python do sistema e recrie o ambiente:

```bash
apt update
apt install -y python3.12-venv || apt install -y python3-venv
rm -rf /tmp/bedrock-nbt
python3 -m venv /tmp/bedrock-nbt
/tmp/bedrock-nbt/bin/pip install --upgrade pip nbtlib
```

Se o host não tiver acesso a repositórios APT, use uma das alternativas:

```bash
apt install -y python3-pip
python3 -m pip install --break-system-packages nbtlib
python3 /tmp/enable_bedrock_beta_apis.py "/root/MinecraftServer/worlds/Bedrock level/level.dat"
```

ou faça a edição pelo fluxo recomendado com cliente Bedrock e republicação do mundo. Como o `bedrock.service` está parado durante este procedimento, evite deixar o servidor muito tempo offline: se a instalação de dependências demorar, considere reiniciar o serviço e retomar em uma janela de manutenção.

## Troubleshooting: heredoc/script copiado incompleto

Se ao terminar o `cat > /tmp/enable_bedrock_beta_apis.py <<'PY'` aparecer algo como `PYint(...)`, ou se a parte final com `level_dat.write_bytes(new_raw)` não existir, **não execute o script**. Sobrescreva o arquivo completo e valide sintaxe antes de aplicar:

```bash
/tmp/bedrock-nbt/bin/python -m py_compile /tmp/enable_bedrock_beta_apis.py
```

Se o comando acima falhar, recrie o arquivo com o heredoc completo. Antes de aplicar no mundo, confira se a parte final existe:

```bash
tail -n 20 /tmp/enable_bedrock_beta_apis.py
```

O final correto precisa conter `level_dat.write_bytes(new_raw)` e as mensagens `Beta APIs habilitado...`.

## Troubleshooting: `py_compile` passou, mas script ainda está incompleto

`python -m py_compile` valida sintaxe, mas não garante que o script contém a etapa final de gravação. Se o arquivo termina em `nbt_file["experiments_ever_used"] = Byte(1)`, anexe o bloco final abaixo em vez de aplicar no mundo:

```bash
cat >> /tmp/enable_bedrock_beta_apis.py <<'PY'
nbt_file["saved_with_toggled_experiments"] = Byte(1)

out = io.BytesIO()
nbt_file.write(out, byteorder="little")
new_body = out.getvalue()
new_raw = struct.pack("<II", version, len(new_body)) + new_body

backup = level_dat.with_suffix(level_dat.suffix + ".pre-beta-apis")
if not backup.exists():
    shutil.copy2(level_dat, backup)

level_dat.write_bytes(new_raw)
print(f"Beta APIs habilitado em {level_dat}")
print(f"Backup adicional: {backup}")
print("Tags ajustadas: experiments.gametest=1, experiments_ever_used=1, saved_with_toggled_experiments=1")
PY
```

Depois valide sintaxe **e completude**:

```bash
/tmp/bedrock-nbt/bin/python -m py_compile /tmp/enable_bedrock_beta_apis.py
grep -n 'saved_with_toggled_experiments\|level_dat.write_bytes\|Beta APIs habilitado' /tmp/enable_bedrock_beta_apis.py
tail -n 20 /tmp/enable_bedrock_beta_apis.py
```

Só aplique no `level.dat` se `grep` mostrar as três partes esperadas.

## Método mais seguro: recriar o script via base64

Se o terminal continuar misturando prompts/linhas Python no Bash, recrie o script por base64. Esse método reduz risco de heredoc quebrado:

```bash
cat > /tmp/enable_bedrock_beta_apis.py.b64 <<'B64'
ZnJvbSBfX2Z1dHVyZV9fIGltcG9ydCBhbm5vdGF0aW9ucwoKaW1wb3J0IGlvCmltcG9ydCBzaHV0
aWwKaW1wb3J0IHN0cnVjdAppbXBvcnQgc3lzCmZyb20gcGF0aGxpYiBpbXBvcnQgUGF0aAoKaW1w
b3J0IG5idGxpYgpmcm9tIG5idGxpYiBpbXBvcnQgQnl0ZSwgQ29tcG91bmQKCmlmIGxlbihzeXMu
YXJndikgIT0gMjoKICAgIHJhaXNlIFN5c3RlbUV4aXQoIlVzbzogZW5hYmxlX2JlZHJvY2tfYmV0
YV9hcGlzLnB5IC9jYW1pbmhvL3BhcmEvbGV2ZWwuZGF0IikKCmxldmVsX2RhdCA9IFBhdGgoc3lz
LmFyZ3ZbMV0pCmlmIG5vdCBsZXZlbF9kYXQuZXhpc3RzKCk6CiAgICByYWlzZSBTeXN0ZW1FeGl0
KGYibGV2ZWwuZGF0IG7Do28gZW5jb250cmFkbzoge2xldmVsX2RhdH0iKQoKcmF3ID0gbGV2ZWxf
ZGF0LnJlYWRfYnl0ZXMoKQppZiBsZW4ocmF3KSA8IDk6CiAgICByYWlzZSBTeXN0ZW1FeGl0KCJs
ZXZlbC5kYXQgbXVpdG8gcGVxdWVubyBvdSBpbnbDoWxpZG8iKQoKdmVyc2lvbiwgZGVjbGFyZWRf
c2l6ZSA9IHN0cnVjdC51bnBhY2soIjxJSSIsIHJhd1s6OF0pCmJvZHkgPSByYXdbODpdCmlmIGRl
Y2xhcmVkX3NpemUgIT0gbGVuKGJvZHkpOgogICAgcHJpbnQoZiJBdmlzbzogdGFtYW5obyBkZWNs
YXJhZG89e2RlY2xhcmVkX3NpemV9LCB0YW1hbmhvIHJlYWw9e2xlbihib2R5KX07IHJlZ3JhdmFu
ZG8gY29tIHRhbWFuaG8gcmVhbCBjb3JyaWdpZG8uIikKCm5idF9maWxlID0gbmJ0bGliLkZpbGUu
cGFyc2UoaW8uQnl0ZXNJTyhib2R5KSwgYnl0ZW9yZGVyPSJsaXR0bGUiKQpleHBlcmltZW50cyA9
IG5idF9maWxlLmdldCgiZXhwZXJpbWVudHMiKQppZiBleHBlcmltZW50cyBpcyBOb25lOgogICAg
ZXhwZXJpbWVudHMgPSBDb21wb3VuZCgpCiAgICBuYnRfZmlsZVsiZXhwZXJpbWVudHMiXSA9IGV4
cGVyaW1lbnRzCgpleHBlcmltZW50c1siZ2FtZXRlc3QiXSA9IEJ5dGUoMSkKbmJ0X2ZpbGVbImV4
cGVyaW1lbnRzX2V2ZXJfdXNlZCJdID0gQnl0ZSgxKQpuYnRfZmlsZVsic2F2ZWRfd2l0aF90b2dn
bGVkX2V4cGVyaW1lbnRzIl0gPSBCeXRlKDEpCgpvdXQgPSBpby5CeXRlc0lPKCkKbmJ0X2ZpbGUu
d3JpdGUob3V0LCBieXRlb3JkZXI9ImxpdHRsZSIpCm5ld19ib2R5ID0gb3V0LmdldHZhbHVlKCkK
bmV3X3JhdyA9IHN0cnVjdC5wYWNrKCI8SUkiLCB2ZXJzaW9uLCBsZW4obmV3X2JvZHkpKSArIG5l
d19ib2R5CgpiYWNrdXAgPSBsZXZlbF9kYXQud2l0aF9zdWZmaXgobGV2ZWxfZGF0LnN1ZmZpeCAr
ICIucHJlLWJldGEtYXBpcyIpCmlmIG5vdCBiYWNrdXAuZXhpc3RzKCk6CiAgICBzaHV0aWwuY29w
eTIobGV2ZWxfZGF0LCBiYWNrdXApCgpsZXZlbF9kYXQud3JpdGVfYnl0ZXMobmV3X3JhdykKcHJp
bnQoZiJCZXRhIEFQSXMgaGFiaWxpdGFkbyBlbSB7bGV2ZWxfZGF0fSIpCnByaW50KGYiQmFja3Vw
IGFkaWNpb25hbDoge2JhY2t1cH0iKQpwcmludCgiVGFncyBhanVzdGFkYXM6IGV4cGVyaW1lbnRz
LmdhbWV0ZXN0PTEsIGV4cGVyaW1lbnRzX2V2ZXJfdXNlZD0xLCBzYXZlZF93aXRoX3RvZ2dsZWRf
ZXhwZXJpbWVudHM9MSIpCg==
B64
base64 -d /tmp/enable_bedrock_beta_apis.py.b64 > /tmp/enable_bedrock_beta_apis.py
/tmp/bedrock-nbt/bin/python -m py_compile /tmp/enable_bedrock_beta_apis.py
grep -n 'saved_with_toggled_experiments\|level_dat.write_bytes\|Beta APIs habilitado' /tmp/enable_bedrock_beta_apis.py
```

Se o `grep` mostrar as três partes, aplique no mundo:

```bash
/tmp/bedrock-nbt/bin/python /tmp/enable_bedrock_beta_apis.py "/root/MinecraftServer/worlds/Bedrock level/level.dat"
cp -a "/root/MinecraftServer/worlds/Bedrock level/level.dat" "/root/MinecraftServer/worlds/Bedrock level/level.dat_old"
systemctl start bedrock.service
```
