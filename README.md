# ReasonsWhy

A meaningful platform dedicated to sharing and discovering reasons to stay alive. This project creates a supportive space where people can anonymously share their personal reasons for living, find hope in others' stories, and contribute to a collective wall of inspiration. Built with empathy, security, and accessibility in mind.

## 💭 About

ReasonsWhy was created with a simple yet powerful purpose: to remind us of the countless reasons to keep going. Whether it's the small joys of daily life, future dreams, or the impact we have on others, every reason matters. Users can:

- Share their personal reasons anonymously
- Discover others' reasons for hope and inspiration
- Add location context to show how reasons connect globally
- Use tags to find relatable content
- Flag inappropriate content to maintain a safe space

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) with App Router
- **Database & Backend:** [Convex](https://www.convex.dev/) for real-time data synchronization
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) for secure user authentication
- **Security:** [Arcjet](https://arcjet.com/) for rate limiting and bot protection
- **Styling:** 
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
  - [Shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- **Fonts & Icons:**
  - Space Grotesk font for modern typography
  - [Lucide Icons](https://lucide.dev/) for beautiful icons
- **Development Tools:**
  - TypeScript for type safety
  - ESLint for code quality
  - Prettier for code formatting

## ✨ Features

- 🤝 Anonymous sharing in a safe, supportive environment
- 🌍 Global wall of reasons showing hope knows no borders
- 🔐 Secure authentication for moderators
- 🚦 Rate limiting and bot protection for platform integrity
- 🎨 Thoughtful, accessible UI with dark mode support
- ⚡️ Real-time updates as new reasons are shared
- 🏷️ Tag-based discovery to find relatable content
- 📍 Optional location sharing to see global impact
- 🛡️ Community protection through content moderation
- 📱 Mobile-first design for sharing on the go
- 🎭 Complete anonymity for reason sharing
- 💝 Focus on positive, life-affirming content

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/reasons-wall.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your:
- Convex deployment URL
- NextAuth configuration
- Arcjet API key

5. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 🌐 Deployment

The application is optimized for deployment on [Vercel](https://vercel.com). 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/reasons-wall)

## 📝 Environment Variables

The following environment variables are required:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=

# NextAuth.js
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Arcjet
ARCJET_KEY=
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Convex](https://www.convex.dev/) for the powerful backend solution
- [Vercel](https://vercel.com) for hosting and deployment
- [Shadcn](https://ui.shadcn.com/) for the beautiful UI components
