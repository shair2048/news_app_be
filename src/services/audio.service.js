// services/audioService.js
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
dotenv.config();

const ttsClient = new TextToSpeechClient();

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export const generateAndUploadAudio = async (text, articleId) => {
  try {
    const request = {
      input: { text: text },
      voice: { languageCode: "vi-VN", name: "vi-VN-Neural2-A" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioBuffer = response.audioContent;

    // B. Upload lên Cloudflare R2
    const fileName = `articles/${articleId}-${Date.now()}.mp3`;

    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: fileName,
        Body: audioBuffer,
        ContentType: "audio/mpeg",
        // ACL: "public-read",
      },
    });

    await upload.done();

    const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_DOMAIN}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error("TTS Service Error:", error);
    throw error;
  }
};
