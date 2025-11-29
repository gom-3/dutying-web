<img width="1510" alt="image" src="https://github.com/gom-3/dutying-web/assets/73516336/609319d4-8560-411e-a65e-206912bc09e7">

## Introduce

This service provides an easy and convenient work schedule creation environment for head nurses who felt inconvenience due to the existing difficult work schedule creation process, and by synchronizing the created work schedules, it eliminates the hassle of registering and checking cumbersome shift work.

## Platform

We provide a web service for head nurses and a mobile app for general nurses, solving their respective issues. By linking these two platforms into a single service, we eliminate inefficient tasks that previously occurred offline.

### Web (this repo)

Our web service provides head nurses with guidance based on scheduling constraints and a work schedule auto-completion feature, reducing the time and difficulty involved in creating work schedules.

- URL : <a href="https://dutying.net">https://dutying.net</a>

### Mobile

General nurses can directly check the synchronized work schedules through the mobile app and even apply for leave. They can easily find out who they will be working with and who the shift handover will be from, without having to search through the entire Excel sheet. They can selectively sync with all calendars stored on the device, allowing them to manage all schedules through a single app.

- IOS : <a href="https://apps.apple.com/kr/app/%EB%93%80%ED%8C%85-%EA%B0%84%ED%98%B8%EC%82%AC-%EA%B7%BC%EB%AC%B4%ED%91%9C/id6466558189">App Store Link</a>
- Android : <a href="https://play.google.com/store/apps/details?id=com.gom3.dutying&hl=ko-KR">Google Play Link</a>
- Github : <a href="https://github.com/gom-3/dutying-mobile">Github Repo Link</a>

## Tech Stack

- Core : React, TypesScript, Vite
- State Management : Tanstack-Query, Zustand
- Styling : Tailwind CSS
- Package Manager : PNPM
- Test : Vitest, Jest, Cypress
- CI/CD : GitHub Actions, Vercel
- Analytics : Google Ananytics

### Vite

Despite the powerful framework that Next.js is, we chose Vite for our project because we needed to develop quickly within a set timeframe. The fast Hot Module Replacement (HMR) provided by Vite accelerated our development process. Additionally, our project primarily required developing interactive user experiences on the client-side, making Vite a more suitable choice for our needs.

## Running Tests

### Unit Tests

```bash
$ pnpm run test
```

### End-to-End Tests

Cypress is used for end-to-end testing

```bash
$ pnpm run e2e
```

### Continuous Integration

**Automatic Testing**

Upon every push and pull request to the develop branch, our GitHub Actions workflow automatically initiates a series of tests.

- <a href="https://github.com/gom-3/dutying-web/blob/develop/.github/workflows/cypress.yml">vitest.yml</a>
- <a href="https://github.com/gom-3/dutying-web/blob/develop/.github/workflows/vitest.yml">cypress.yml</a>

**Automatic Deployment**

After passing all automated tests, the changes are automatically deployed to Vercel, ensuring that our application is always up-to-date with the latest verified builds. This step not only streamlines our deployment process but also guarantees that only thoroughly tested builds are deployed to production.

![image](https://github.com/gom-3/dutying-web/assets/73516336/0e04ebcb-bc1a-45e2-b63d-723d231575b2)

## Documentaion

- <a href="https://gom3.notion.site/ce18d806df034effaf8e488f02f49cf4">Tutorial</a>
- <a href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903">Terms of Use</a>

## Lisence

Apache License 2.0

<p align='center'>
  <img src='https://img.shields.io/github/package-json/v/gom-3/dutying-web'>
  <a href="https://github.com/gom-3/dutying-web/issues"><img src='https://img.shields.io/github/issues/gom-3/dutying-web'></a>
  <a href="https://github.com/gom-3/dutying-web/pulls"><img src='https://img.shields.io/github/issues-pr/gom-3/dutying-web'></a>
  <a href="https://github.com/gom-3/dutying-web/graphs/contributors"><img src='https://img.shields.io/github/contributors/gom-3/dutying-web'></a>
  <a href='https://github.com/gom-3/dutying-web/blob/main/LICENSE'><img src='https://img.shields.io/github/license/gom-3/dutying-web'></a>
</p>
