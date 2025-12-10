# Firpo Portfolio

This is a static portfolio website for my dad. I made it as thanks for all the love and support he gave me through my life. Love you dad!

## Technical decisions

- I'm using Next. To avoid having to host a server, I'm using `output: export`
  - I could have chosen something like Astro, but I figured that it would be best to use a technology that I'm personally familiar with
- I opted to use Next's App Router. There are some reasons for it:
  - The App Router has better support for `output: export`
  - Zero Javascript by default
- I'm using Tailwind. This ensures that styling is colocated, and that I can scaffold styles quickly
- I'm using the file system itself as my content management system. This makes it very easy for designers to add new works, and to always have the history available

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

# Core Web Vitals

Currently, these are the core web vitals scores:

![image](https://github.com/Firpython4/firpo-portfolio/assets/60618576/646e37e6-50ea-4549-975d-d3f13fa6484a)

There are still some optimization opportunities, such as cropping thumbnails during the build, so that all images are properly sized, as well as using facades / lite versions of the embedded video players.
