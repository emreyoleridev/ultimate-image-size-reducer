# Image Size Reducer

A beautiful, modern, single-page SaaS application built with Next.js and Tailwind CSS that allows users to compress multiple images on the client side and download them in a single ZIP file, preserving the original filenames.

## Features

- **100% Client-Side Private Processing**: Images are never uploaded to any server. Compression happens instantly in your browser.
- **Bulk Compression**: Drag & drop multiple images at once (JPG, PNG, WebP).
- **Live Statistics**: See exactly how much space you are saving per file before downloading.
- **Zero-Hassle ZIP Download**: Get all your compressed images conveniently packed into a single zip file with the original names intact.
- **Modern Responsive Design**: fully responsive layout with Dark/Light modes, elegant micro-animations, and glassmorphic UI.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Compression Logic:** `browser-image-compression`
- **Bundling:** `jszip`, `file-saver`
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

1. Clone or download the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
