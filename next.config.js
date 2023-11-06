/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "googleusercontent.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "cdn.openai.com",
      "firebasestorage.googleapis.com",
      "tympanus.net"
    ]
  },
}

module.exports = nextConfig
