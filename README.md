# Firpo Portfolio

This is a static portfolio website for my dad. I made it as thanks for all the love and support he gave me through my life. Love you dad!

## Technical decisions

- I'm using Next. To avoid having to host a server, I'm using ```output: export```
  - I could have chosen something like Astro, but I figured that it would be best to use a proven technology, as well as gain some Next experience
- I opted to use Next's App Router. There are some reasons for it:
  - The App Router has better support for ```output: export```
  - Zero Javascript by default. Since most of the site is static, this ensures that no unnecessary Javascript is shipped to the client.
- I'm using Tailwind. This ensures that styling is colocated, and that I can scaffold styles and even animations quickly
- I'm using the file system itself as my content management system. This makes it very easy for designers to add new works, and to always have the history available
- I'm using Typescript. Coming from type-safe languages such as C#, Java, and C++, I believe very strongly that type-safety is essential for software maintainability.

## Roadmap
Next steps are basically:
- Add a contact form to the home page
- Replace embedded video players with their lite counterparts to reduce bundle size.

## T3 Stack

This project is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## Technologies

These are the main technologies used in this project.

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Remark.js](https://github.com/remarkjs)
- [Gray Matter](https://github.com/jonschlinkert/gray-matter)

