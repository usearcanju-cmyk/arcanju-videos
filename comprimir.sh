#!/usr/bin/env bash
# Comprime os vídeos para o site.
# Uso:  ./comprimir.sh originais/ videos/
# Para cada vídeo gera 3 arquivos:
#   nome.mp4         vídeo completo do player (720x1280, com som)
#   nome-previa.mp4  prévia leve das bolinhas e do carrossel (360x640, 6 s, sem som)
#   nome.jpg         pôster (primeiro quadro)
set -e
ENT="${1:-originais}"; SAI="${2:-videos}"
mkdir -p "$SAI"
for f in "$ENT"/*.{mp4,mov,MP4,MOV,m4v,webm}; do
  [ -f "$f" ] || continue
  n=$(basename "${f%.*}" | iconv -f utf8 -t ascii//TRANSLIT | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9-')
  echo "→ $n"
  VF="scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30"
  ffmpeg -loglevel error -y -i "$f" -vf "$VF" -c:v libx264 -profile:v high -preset slow -crf 27 -maxrate 1800k -bufsize 3600k -pix_fmt yuv420p -c:a aac -b:a 96k -ac 2 -movflags +faststart "$SAI/$n.mp4"
  ffmpeg -loglevel error -y -i "$f" -t 6 -vf "scale=360:640:force_original_aspect_ratio=increase,crop=360:640,fps=24" -an -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart "$SAI/$n-previa.mp4"
  ffmpeg -loglevel error -y -ss 0.3 -i "$f" -frames:v 1 -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" -q:v 4 "$SAI/$n.jpg"
  ls -lh "$SAI/$n.mp4" "$SAI/$n-previa.mp4" "$SAI/$n.jpg" | awk '{print "   ",$5,$9}'
done
