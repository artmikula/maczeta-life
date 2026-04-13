import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(projectRoot, "tools", "voice-lines.json");
const outputDir = path.join(projectRoot, "assets", "voice");

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;

if (!apiKey) {
  console.error("Missing ELEVENLABS_API_KEY.");
  process.exit(1);
}

if (!voiceId) {
  console.error("Missing ELEVENLABS_VOICE_ID.");
  process.exit(1);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
await mkdir(outputDir, { recursive: true });

for (const entry of manifest.lines) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text: entry.text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.78,
        style: 0.28,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs request failed for ${entry.file}: ${response.status} ${body}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(outputDir, entry.file);
  await writeFile(outputPath, audioBuffer);
  console.log(`Wrote ${path.relative(projectRoot, outputPath)}`);
}
